export type ModerationStatus = "pending" | "approved" | "rejected";

export type School = {
  id: string;
  name: string;
  slug: string;
  city: string | null;
  logo_url: string | null;
  description?: string | null;
  created_at: string;
};

export type City = {
  id: string;
  name: string;
  slug: string;
  created_at: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  created_at: string;
};

export type Post = {
  id: string;
  title: string;
  content: string;
  category_id: string | null;
  school_id: string | null;
  city_id: string | null;
  author_name: string | null;
  contact_info: string | null;
  is_anonymous: boolean;
  status: ModerationStatus;
  is_pinned: boolean;
  view_count: number;
  image_urls: string[] | null;
  created_at: string;
  updated_at: string;
  category?: Category | null;
  school?: School | null;
  city?: City | null;
};

export type Comment = {
  id: string;
  post_id: string;
  author_name: string | null;
  content: string;
  status: ModerationStatus;
  created_at: string;
};

export type Announcement = {
  id: string;
  title: string;
  content: string;
  is_active: boolean;
  created_at: string;
};

export type Report = {
  id: string;
  post_id: string;
  reason: string;
  created_at: string;
};

export type PostFilters = {
  search?: string;
  categorySlug?: string;
  schoolSlug?: string;
  citySlug?: string;
  status?: ModerationStatus;
};
