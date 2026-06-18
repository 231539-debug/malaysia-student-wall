"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { clearAdminCookie, isAdminAuthenticated, setAdminCookie } from "@/lib/admin-auth";
import { createSupabaseClient, hasSupabaseServiceRole } from "@/lib/supabase";
import { slugify } from "@/lib/utils";
import type { ModerationStatus } from "@/types/wall";

async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin");
  }
}

function stringValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function loginAdmin(formData: FormData) {
  const password = stringValue(formData, "password");

  if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD || !(await setAdminCookie())) {
    redirect("/admin?error=bad-password");
  }

  redirect("/admin");
}

export async function logoutAdmin() {
  await clearAdminCookie();
  redirect("/admin");
}

export async function updatePostStatus(postId: string, status: ModerationStatus) {
  await requireAdmin();

  if (hasSupabaseServiceRole()) {
    const supabase = createSupabaseClient(true);
    const { error } = (await supabase?.from("posts").update({ status }).eq("id", postId)) ?? {};
    if (error) console.error("Failed to update post status", error);
  }

  revalidatePath("/admin");
  revalidatePath("/");
}

export async function togglePinned(postId: string, pinned: boolean) {
  await requireAdmin();

  if (hasSupabaseServiceRole()) {
    const supabase = createSupabaseClient(true);
    const { error } = (await supabase?.from("posts").update({ is_pinned: pinned }).eq("id", postId)) ?? {};
    if (error) console.error("Failed to pin post", error);
  }

  revalidatePath("/admin");
  revalidatePath("/");
}

export async function deletePost(postId: string) {
  await requireAdmin();

  if (hasSupabaseServiceRole()) {
    const supabase = createSupabaseClient(true);
    const { error } = (await supabase?.from("posts").delete().eq("id", postId)) ?? {};
    if (error) console.error("Failed to delete post", error);
  }

  revalidatePath("/admin");
  revalidatePath("/");
}

export async function updateCommentStatus(commentId: string, status: ModerationStatus) {
  await requireAdmin();

  if (hasSupabaseServiceRole()) {
    const supabase = createSupabaseClient(true);
    const { error } = (await supabase?.from("comments").update({ status }).eq("id", commentId)) ?? {};
    if (error) console.error("Failed to update comment status", error);
  }

  revalidatePath("/admin");
}

export async function deleteComment(commentId: string) {
  await requireAdmin();

  if (hasSupabaseServiceRole()) {
    const supabase = createSupabaseClient(true);
    const { error } = (await supabase?.from("comments").delete().eq("id", commentId)) ?? {};
    if (error) console.error("Failed to delete comment", error);
  }

  revalidatePath("/admin");
}

export async function createAnnouncement(formData: FormData) {
  await requireAdmin();

  const title = stringValue(formData, "title");
  const content = stringValue(formData, "content");
  if (!title || !content) return;

  if (hasSupabaseServiceRole()) {
    const supabase = createSupabaseClient(true);
    const { error } =
      (await supabase?.from("announcements").insert({
        title,
        content,
        is_active: formData.get("is_active") === "on"
      })) ?? {};
    if (error) console.error("Failed to create announcement", error);
  }

  revalidatePath("/admin");
  revalidatePath("/");
}

export async function addSchool(formData: FormData) {
  await requireAdmin();

  const name = stringValue(formData, "name");
  if (!name) return;

  if (hasSupabaseServiceRole()) {
    const supabase = createSupabaseClient(true);
    const { error } =
      (await supabase?.from("schools").insert({
        name,
        slug: stringValue(formData, "slug") || slugify(name),
        city: stringValue(formData, "city") || null,
        logo_url: stringValue(formData, "logo_url") || null,
        description: stringValue(formData, "description") || null
      })) ?? {};
    if (error) console.error("Failed to add school", error);
  }

  revalidatePath("/admin");
  revalidatePath("/schools");
}

export async function addCity(formData: FormData) {
  await requireAdmin();

  const name = stringValue(formData, "name");
  if (!name) return;

  if (hasSupabaseServiceRole()) {
    const supabase = createSupabaseClient(true);
    const { error } =
      (await supabase?.from("cities").insert({
        name,
        slug: stringValue(formData, "slug") || slugify(name)
      })) ?? {};
    if (error) console.error("Failed to add city", error);
  }

  revalidatePath("/admin");
  revalidatePath("/cities");
}

export async function addCategory(formData: FormData) {
  await requireAdmin();

  const name = stringValue(formData, "name");
  if (!name) return;

  if (hasSupabaseServiceRole()) {
    const supabase = createSupabaseClient(true);
    const { error } =
      (await supabase?.from("categories").insert({
        name,
        slug: stringValue(formData, "slug") || slugify(name)
      })) ?? {};
    if (error) console.error("Failed to add category", error);
  }

  revalidatePath("/admin");
  revalidatePath("/");
}
