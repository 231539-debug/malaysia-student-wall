import { createSupabaseClient, hasSupabaseConfig, hasSupabaseServiceRole } from "@/lib/supabase";
import {
  mockAnnouncements,
  mockCategories,
  mockCities,
  mockComments,
  mockPosts,
  mockSchools
} from "@/lib/mock-data";
import type { Announcement, Category, City, Comment, Post, PostFilters, School } from "@/types/wall";

const postSelect = "*, category:categories(*), school:schools(*), city:cities(*)";

function sortPosts(posts: Post[]) {
  return [...posts].sort((a, b) => {
    if (a.is_pinned !== b.is_pinned) {
      return a.is_pinned ? -1 : 1;
    }

    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
}

function filterMockPosts(filters: PostFilters = {}) {
  const keyword = filters.search?.trim().toLowerCase();

  return sortPosts(
    mockPosts.filter((post) => {
      if (filters.status && post.status !== filters.status) return false;
      if (!filters.status && post.status !== "approved") return false;
      if (filters.categorySlug && post.category?.slug !== filters.categorySlug) return false;
      if (filters.schoolSlug && post.school?.slug !== filters.schoolSlug) return false;
      if (filters.citySlug && post.city?.slug !== filters.citySlug) return false;
      if (keyword && !`${post.title} ${post.content}`.toLowerCase().includes(keyword)) return false;
      return true;
    })
  );
}

export async function getPosts(filters: PostFilters = {}) {
  if (!hasSupabaseConfig()) {
    return filterMockPosts(filters);
  }

  const supabase = createSupabaseClient();
  if (!supabase) return filterMockPosts(filters);

  let query = supabase.from("posts").select(postSelect);

  query = query.eq("status", filters.status ?? "approved");

  if (filters.search) {
    query = query.or(`title.ilike.%${filters.search}%,content.ilike.%${filters.search}%`);
  }

  const { data, error } = await query.order("is_pinned", { ascending: false }).order("created_at", {
    ascending: false
  });

  if (error || !data) {
    console.error("Failed to fetch posts", error);
    return filterMockPosts(filters);
  }

  return (data as unknown as Post[]).filter((post) => {
    if (filters.categorySlug && post.category?.slug !== filters.categorySlug) return false;
    if (filters.schoolSlug && post.school?.slug !== filters.schoolSlug) return false;
    if (filters.citySlug && post.city?.slug !== filters.citySlug) return false;
    return true;
  });
}

export async function getAllAdminPosts() {
  if (!hasSupabaseServiceRole()) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is required to read admin posts.");
  }

  const supabase = createSupabaseClient(true);
  if (!supabase) {
    throw new Error("Unable to create Supabase service role client for admin posts.");
  }

  const { data, error } = await supabase
    .from("posts")
    .select(postSelect)
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("Failed to fetch admin posts", error);
    throw new Error("Failed to fetch admin posts.");
  }

  return data as unknown as Post[];
}

export async function getPostById(id: string) {
  if (!hasSupabaseConfig()) {
    return mockPosts.find((post) => post.id === id) ?? null;
  }

  const supabase = createSupabaseClient();
  if (!supabase) return mockPosts.find((post) => post.id === id) ?? null;

  const { data, error } = await supabase.from("posts").select(postSelect).eq("id", id).single();

  if (error || !data) {
    return mockPosts.find((post) => post.id === id) ?? null;
  }

  return data as unknown as Post;
}

export async function getComments(postId?: string, status: "pending" | "approved" | "rejected" = "approved") {
  if (!hasSupabaseConfig()) {
    return mockComments.filter((comment) => {
      if (postId && comment.post_id !== postId) return false;
      return comment.status === status;
    });
  }

  const needsServiceRole = status !== "approved";
  if (needsServiceRole && !hasSupabaseServiceRole()) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is required to read non-approved comments.");
  }

  const supabase = createSupabaseClient(needsServiceRole);
  if (!supabase) return mockComments.filter((comment) => comment.status === status);

  let query = supabase.from("comments").select("*").eq("status", status);
  if (postId) {
    query = query.eq("post_id", postId);
  }

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error || !data) {
    console.error("Failed to fetch comments", error);
    return mockComments.filter((comment) => comment.status === status);
  }

  return data as Comment[];
}

export async function getAllAdminComments() {
  if (!hasSupabaseServiceRole()) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is required to read admin comments.");
  }

  const supabase = createSupabaseClient(true);
  if (!supabase) {
    throw new Error("Unable to create Supabase service role client for admin comments.");
  }

  const { data, error } = await supabase.from("comments").select("*").order("created_at", { ascending: false });

  if (error || !data) {
    console.error("Failed to fetch admin comments", error);
    throw new Error("Failed to fetch admin comments.");
  }

  return data as Comment[];
}

export async function getSchools() {
  if (!hasSupabaseConfig()) return mockSchools;

  const supabase = createSupabaseClient();
  if (!supabase) return mockSchools;

  const { data, error } = await supabase.from("schools").select("*").order("name", { ascending: true });
  if (error || !data) return mockSchools;

  return data as School[];
}

export async function getSchoolBySlug(slug: string) {
  const schools = await getSchools();
  return schools.find((school) => school.slug === slug) ?? null;
}

export async function getCities() {
  if (!hasSupabaseConfig()) return mockCities;

  const supabase = createSupabaseClient();
  if (!supabase) return mockCities;

  const { data, error } = await supabase.from("cities").select("*").order("name", { ascending: true });
  if (error || !data) return mockCities;

  return data as City[];
}

export async function getCityBySlug(slug: string) {
  const cities = await getCities();
  return cities.find((city) => city.slug === slug) ?? null;
}

export async function getCategories() {
  if (!hasSupabaseConfig()) return mockCategories;

  const supabase = createSupabaseClient();
  if (!supabase) return mockCategories;

  const { data, error } = await supabase.from("categories").select("*").order("name", { ascending: true });
  if (error || !data) return mockCategories;

  return data as Category[];
}

export async function getCategoryBySlug(slug: string) {
  const categories = await getCategories();
  return categories.find((category) => category.slug === slug) ?? null;
}

export async function getAnnouncements(activeOnly = true) {
  if (!hasSupabaseConfig()) {
    return mockAnnouncements.filter((announcement) => (activeOnly ? announcement.is_active : true));
  }

  if (!activeOnly && !hasSupabaseServiceRole()) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is required to read inactive announcements.");
  }

  const supabase = createSupabaseClient(!activeOnly);
  if (!supabase) return mockAnnouncements;

  let query = supabase.from("announcements").select("*");
  if (activeOnly) {
    query = query.eq("is_active", true);
  }

  const { data, error } = await query.order("created_at", { ascending: false });
  if (error || !data) return mockAnnouncements;

  return data as Announcement[];
}
