"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { assessContentRisk } from "@/lib/moderation";
import { adminReviewUrl, sendNewPostNotification } from "@/lib/notifications";
import { createSupabaseClient, hasSupabaseServiceRole } from "@/lib/supabase";
import { excerpt } from "@/lib/utils";

const HONEYPOT_FIELD = "website";
const POST_TITLE_MIN_LENGTH = 4;
const POST_TITLE_MAX_LENGTH = 80;
const POST_CONTENT_MIN_LENGTH = 10;
const POST_CONTENT_MAX_LENGTH = 4000;
const COMMENT_MIN_LENGTH = 2;
const COMMENT_MAX_LENGTH = 800;
const POST_IMAGE_BUCKET = "post-images";
const MAX_POST_IMAGES = 4;
const MAX_POST_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_POST_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

function stringValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function nullableValue(formData: FormData, key: string) {
  const value = stringValue(formData, key);
  return value.length > 0 ? value : null;
}

function imageUrlsFromForm(formData: FormData) {
  const raw = stringValue(formData, "image_urls");
  if (!raw) return null;

  return raw
    .split(/\r?\n|,/)
    .map((url) => url.trim())
    .filter(Boolean);
}

function imageFilesFromForm(formData: FormData) {
  return formData.getAll("images").filter((value): value is File => value instanceof File && value.size > 0);
}

function extensionForImageType(type: string) {
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  return "jpg";
}

function validateImageFiles(files: File[]) {
  if (files.length > MAX_POST_IMAGES) return false;

  return files.every((file) => file.size <= MAX_POST_IMAGE_SIZE && ALLOWED_POST_IMAGE_TYPES.includes(file.type));
}

function isMissingModerationColumn(error: unknown) {
  if (!error || typeof error !== "object" || !("message" in error)) return false;
  const message = String(error.message);
  return /risk_level|moderation_note|report_count/.test(message);
}

function shouldAutoApprovePost(riskLevel: "low" | "medium" | "high") {
  return riskLevel === "low";
}

async function uploadPostImages(postId: string, files: File[]) {
  if (!files.length) return null;
  if (!validateImageFiles(files)) redirect("/submit?error=image");

  const supabase = createSupabaseClient(true);
  if (!supabase) redirect("/submit?error=image");

  const uploadedUrls: string[] = [];

  for (const file of files) {
    const extension = extensionForImageType(file.type);
    const path = `posts/${postId}/${Date.now()}-${crypto.randomUUID()}.${extension}`;
    const { error } = await supabase.storage.from(POST_IMAGE_BUCKET).upload(path, file, {
      contentType: file.type,
      upsert: false
    });

    if (error) {
      console.error("Failed to upload post image", error);
      redirect("/submit?error=image");
    }

    const { data } = supabase.storage.from(POST_IMAGE_BUCKET).getPublicUrl(path);
    if (data.publicUrl) uploadedUrls.push(data.publicUrl);
  }

  return uploadedUrls.length ? uploadedUrls : null;
}

export async function submitPost(formData: FormData) {
  if (stringValue(formData, HONEYPOT_FIELD)) {
    redirect("/submit?submitted=1");
  }

  const title = stringValue(formData, "title");
  const content = stringValue(formData, "content");

  if (
    title.length < POST_TITLE_MIN_LENGTH ||
    title.length > POST_TITLE_MAX_LENGTH ||
    content.length < POST_CONTENT_MIN_LENGTH ||
    content.length > POST_CONTENT_MAX_LENGTH
  ) {
    redirect("/submit?error=missing");
  }

  if (hasSupabaseServiceRole()) {
    const supabase = createSupabaseClient(true);
    const risk = assessContentRisk(title, content);
    const postId = crypto.randomUUID();
    const uploadedImageUrls = await uploadPostImages(postId, imageFilesFromForm(formData));
    const categoryId = nullableValue(formData, "category_id");
    const schoolId = nullableValue(formData, "school_id");
    const cityId = nullableValue(formData, "city_id");
    const authorName = nullableValue(formData, "author_name");
    const contactInfo = nullableValue(formData, "contact_info");
    const imageUrls = uploadedImageUrls ?? imageUrlsFromForm(formData);
    const basePayload = {
      id: postId,
      title,
      content,
      category_id: categoryId,
      school_id: schoolId,
      city_id: cityId,
      author_name: authorName,
      contact_info: contactInfo,
      is_anonymous: formData.get("is_anonymous") === "on",
      status: "pending" as const,
      image_urls: imageUrls
    };

    const [categoryResult, schoolResult, cityResult] = await Promise.all([
      categoryId ? supabase?.from("categories").select("name, slug").eq("id", categoryId).single() : Promise.resolve(null),
      schoolId ? supabase?.from("schools").select("name").eq("id", schoolId).single() : Promise.resolve(null),
      cityId ? supabase?.from("cities").select("name").eq("id", cityId).single() : Promise.resolve(null)
    ]);
    const autoApprove = shouldAutoApprovePost(risk.level);
    const postPayload = {
      ...basePayload,
      status: autoApprove ? ("approved" as const) : ("pending" as const)
    };

    let { error } =
      (await supabase?.from("posts").insert({
        ...postPayload,
        risk_level: risk.level,
        moderation_note: autoApprove ? "低风险内容，已自动展示；如被多次举报会自动隐藏复审。" : risk.note,
        report_count: 0
      })) ?? {};

    if (error && isMissingModerationColumn(error)) {
      ({ error } = (await supabase?.from("posts").insert(postPayload)) ?? {});
    }

    if (error) {
      console.error("Failed to submit post", error);
      redirect("/submit?error=server");
    }

    await sendNewPostNotification({
      title,
      category: categoryResult?.data?.name ?? "未选择",
      school: schoolResult?.data?.name ?? "不限学校",
      city: cityResult?.data?.name ?? "不限城市",
      authorName: authorName ?? "未填写",
      contactInfo: contactInfo ?? "未填写",
      excerpt: excerpt(content, 180),
      adminUrl: adminReviewUrl()
    });
  }

  revalidatePath("/");
  revalidatePath("/discover");
  revalidatePath("/discuss");
  redirect("/submit?submitted=1");
}

export async function submitComment(postId: string, formData: FormData) {
  if (stringValue(formData, HONEYPOT_FIELD)) {
    redirect(`/post/${postId}?comment=received`);
  }

  const content = stringValue(formData, "content");

  if (content.length < COMMENT_MIN_LENGTH || content.length > COMMENT_MAX_LENGTH) {
    redirect(`/post/${postId}?comment=invalid`);
  }

  if (hasSupabaseServiceRole()) {
    const supabase = createSupabaseClient(true);
    const risk = assessContentRisk("", content);
    const commentPayload = {
      post_id: postId,
      author_name: nullableValue(formData, "author_name"),
      content,
      status: "pending" as const
    };
    let { error } =
      (await supabase?.from("comments").insert({
        ...commentPayload,
        risk_level: risk.level,
        moderation_note: risk.note
      })) ?? {};

    if (error && isMissingModerationColumn(error)) {
      ({ error } =
        (await supabase?.from("comments").insert({
          post_id: postId,
          author_name: nullableValue(formData, "author_name"),
          content,
          status: "pending"
        })) ?? {});
    }

    if (error) {
      console.error("Failed to submit comment", error);
    }
  }

  revalidatePath(`/post/${postId}`);
  redirect(`/post/${postId}?comment=received`);
}

export async function reportPost(postId: string, formData: FormData) {
  const reason = stringValue(formData, "reason");

  if (reason && hasSupabaseServiceRole()) {
    const supabase = createSupabaseClient(true);
    const { error } =
      (await supabase?.from("reports").insert({
        post_id: postId,
        reason
      })) ?? {};

    if (error) {
      console.error("Failed to submit report", error);
    } else {
      const { data: post } =
        (await supabase
          ?.from("posts")
          .select("status, report_count, moderation_note, risk_level")
          .eq("id", postId)
          .single()) ?? {};

      if (post) {
        const nextReportCount = (post.report_count ?? 0) + 1;
        const repeatedReportNote = "该帖子被多次举报，已自动隐藏等待复审。";
        const highReportNote = "该帖子被 5 次以上举报，请重点复核。";
        const moderationNotes = [post.moderation_note];
        if (nextReportCount >= 3 && !post.moderation_note?.includes(repeatedReportNote)) {
          moderationNotes.push(repeatedReportNote);
        }
        if (nextReportCount >= 5 && !post.moderation_note?.includes(highReportNote)) {
          moderationNotes.push(highReportNote);
        }
        const moderationNote = moderationNotes.filter(Boolean).join("\n") || null;

        const { error: updateError } =
          (await supabase
            ?.from("posts")
            .update({
              report_count: nextReportCount,
              status: nextReportCount >= 3 ? "pending" : post.status,
              risk_level: nextReportCount >= 5 ? "high" : post.risk_level,
              moderation_note: moderationNote
            })
            .eq("id", postId)) ?? {};

        if (updateError) {
          console.error("Failed to update report count", updateError);
        } else {
          revalidatePath("/admin");
          revalidatePath("/");
          revalidatePath("/discover");
          revalidatePath("/discuss");
          revalidatePath(`/post/${postId}`);
        }
      }
    }
  }

  redirect(`/post/${postId}?reported=1`);
}
