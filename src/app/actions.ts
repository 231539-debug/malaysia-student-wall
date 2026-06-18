"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseClient, hasSupabaseServiceRole } from "@/lib/supabase";

const HONEYPOT_FIELD = "website";
const POST_TITLE_MIN_LENGTH = 4;
const POST_TITLE_MAX_LENGTH = 80;
const POST_CONTENT_MIN_LENGTH = 10;
const POST_CONTENT_MAX_LENGTH = 4000;
const COMMENT_MIN_LENGTH = 2;
const COMMENT_MAX_LENGTH = 800;

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

    const { error } =
      (await supabase?.from("posts").insert({
        title,
        content,
        category_id: nullableValue(formData, "category_id"),
        school_id: nullableValue(formData, "school_id"),
        city_id: nullableValue(formData, "city_id"),
        author_name: nullableValue(formData, "author_name"),
        contact_info: nullableValue(formData, "contact_info"),
        is_anonymous: formData.get("is_anonymous") === "on",
        status: "pending",
        image_urls: imageUrlsFromForm(formData)
      })) ?? {};

    if (error) {
      console.error("Failed to submit post", error);
      redirect("/submit?error=server");
    }
  }

  revalidatePath("/");
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
    const { error } =
      (await supabase?.from("comments").insert({
        post_id: postId,
        author_name: nullableValue(formData, "author_name"),
        content,
        status: "pending"
      })) ?? {};

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
    }
  }

  redirect(`/post/${postId}?reported=1`);
}
