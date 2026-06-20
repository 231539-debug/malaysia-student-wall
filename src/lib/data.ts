import { createSupabaseClient, hasSupabaseConfig, hasSupabaseServiceRole } from "@/lib/supabase";
import {
  mockAnnouncements,
  mockCategories,
  mockCities,
  mockComments,
  mockPosts,
  mockSchools
} from "@/lib/mock-data";
import { getCategoryMeta, getEquivalentCategorySlugs } from "@/lib/category-metadata";
import type { Announcement, Category, City, Comment, Post, PostFilters, School } from "@/types/wall";

const postSelect = "*, category:categories(*), school:schools(*), city:cities(*)";

export type SiteAnalyticsSummary = {
  isAvailable: boolean;
  onlineCount: number;
  todayViews: number;
  todaySessions: number;
  popularPages: Array<{ path: string; views: number }>;
};

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
      const categorySlugs = filters.categorySlug ? getEquivalentCategorySlugs(filters.categorySlug) : [];
      if (filters.status && post.status !== filters.status) return false;
      if (!filters.status && post.status !== "approved") return false;
      if (filters.categorySlug && !categorySlugs.includes(post.category?.slug ?? "")) return false;
      if (filters.schoolSlug && post.school?.slug !== filters.schoolSlug) return false;
      if (filters.citySlug && post.city?.slug !== filters.citySlug) return false;
      if (
        keyword &&
        !`${post.title} ${post.content} ${post.school?.name ?? ""} ${post.city?.name ?? ""} ${post.category?.name ?? ""}`
          .toLowerCase()
          .includes(keyword)
      ) {
        return false;
      }
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

  const { data, error } = await query.order("is_pinned", { ascending: false }).order("created_at", {
    ascending: false
  });

  if (error || !data) {
    console.error("Failed to fetch posts", error);
    return filterMockPosts(filters);
  }

  return (data as unknown as Post[]).filter((post) => {
    const categorySlugs = filters.categorySlug ? getEquivalentCategorySlugs(filters.categorySlug) : [];
    const keyword = filters.search?.trim().toLowerCase();
    if (
      keyword &&
      !`${post.title} ${post.content} ${post.school?.name ?? ""} ${post.city?.name ?? ""} ${post.category?.name ?? ""}`
        .toLowerCase()
        .includes(keyword)
    ) {
      return false;
    }
    if (filters.categorySlug && !categorySlugs.includes(post.category?.slug ?? "")) return false;
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
  const category = categories.find((category) => category.slug === slug);
  if (category) return category;

  const meta = getCategoryMeta(slug);
  if (!meta) return null;

  return {
    id: `catalog-${meta.slug}`,
    name: meta.name,
    slug: meta.slug,
    created_at: new Date().toISOString()
  } satisfies Category;
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

function malaysiaDayStart() {
  const now = new Date();
  const malaysiaNow = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kuala_Lumpur" }));
  malaysiaNow.setHours(0, 0, 0, 0);
  const offsetMs = 8 * 60 * 60 * 1000;
  return new Date(malaysiaNow.getTime() - offsetMs).toISOString();
}

function emptyAnalytics(isAvailable = false): SiteAnalyticsSummary {
  return {
    isAvailable,
    onlineCount: 0,
    todayViews: 0,
    todaySessions: 0,
    popularPages: []
  };
}

export async function getSiteAnalyticsSummary(): Promise<SiteAnalyticsSummary> {
  if (!hasSupabaseServiceRole()) return emptyAnalytics(false);

  const supabase = createSupabaseClient(true);
  if (!supabase) return emptyAnalytics(false);

  const todayStart = malaysiaDayStart();
  const onlineCutoff = new Date(Date.now() - 2 * 60 * 1000).toISOString();

  const [onlineResult, viewsCountResult, todayRowsResult] = await Promise.all([
    supabase.from("online_sessions").select("session_id", { count: "exact", head: true }).gte("last_seen", onlineCutoff),
    supabase.from("page_views").select("id", { count: "exact", head: true }).gte("created_at", todayStart),
    supabase.from("page_views").select("path, session_id").gte("created_at", todayStart).limit(5000)
  ]);

  if (onlineResult.error || viewsCountResult.error || todayRowsResult.error || !todayRowsResult.data) {
    console.warn("Site analytics tables are not ready", onlineResult.error ?? viewsCountResult.error ?? todayRowsResult.error);
    return emptyAnalytics(false);
  }

  const sessions = new Set<string>();
  const pageCounts = new Map<string, number>();

  for (const row of todayRowsResult.data) {
    if (row.session_id) sessions.add(row.session_id);
    pageCounts.set(row.path, (pageCounts.get(row.path) ?? 0) + 1);
  }

  const popularPages = Array.from(pageCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([path, views]) => ({ path, views }));

  return {
    isAvailable: true,
    onlineCount: onlineResult.count ?? 0,
    todayViews: viewsCountResult.count ?? 0,
    todaySessions: sessions.size,
    popularPages
  };
}
