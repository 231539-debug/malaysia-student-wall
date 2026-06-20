export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      announcements: {
        Row: {
          id: string;
          title: string;
          content: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          content: string;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          content?: string;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      cities: {
        Row: {
          id: string;
          name: string;
          slug: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      comments: {
        Row: {
          id: string;
          post_id: string;
          author_name: string | null;
          content: string;
          status: "pending" | "approved" | "rejected";
          risk_level: "low" | "medium" | "high";
          moderation_note: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          author_name?: string | null;
          content: string;
          status?: "pending" | "approved" | "rejected";
          risk_level?: "low" | "medium" | "high";
          moderation_note?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          post_id?: string;
          author_name?: string | null;
          content?: string;
          status?: "pending" | "approved" | "rejected";
          risk_level?: "low" | "medium" | "high";
          moderation_note?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "comments_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "posts";
            referencedColumns: ["id"];
          }
        ];
      };
      online_sessions: {
        Row: {
          session_id: string;
          path: string | null;
          last_seen: string;
          created_at: string;
        };
        Insert: {
          session_id: string;
          path?: string | null;
          last_seen?: string;
          created_at?: string;
        };
        Update: {
          session_id?: string;
          path?: string | null;
          last_seen?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      page_views: {
        Row: {
          id: string;
          path: string;
          referrer: string | null;
          user_agent: string | null;
          session_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          path: string;
          referrer?: string | null;
          user_agent?: string | null;
          session_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          path?: string;
          referrer?: string | null;
          user_agent?: string | null;
          session_id?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      posts: {
        Row: {
          id: string;
          title: string;
          content: string;
          category_id: string | null;
          school_id: string | null;
          city_id: string | null;
          author_name: string | null;
          contact_info: string | null;
          is_anonymous: boolean;
          status: "pending" | "approved" | "rejected";
          risk_level: "low" | "medium" | "high";
          moderation_note: string | null;
          report_count: number;
          is_pinned: boolean;
          view_count: number;
          image_urls: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          content: string;
          category_id?: string | null;
          school_id?: string | null;
          city_id?: string | null;
          author_name?: string | null;
          contact_info?: string | null;
          is_anonymous?: boolean;
          status?: "pending" | "approved" | "rejected";
          risk_level?: "low" | "medium" | "high";
          moderation_note?: string | null;
          report_count?: number;
          is_pinned?: boolean;
          view_count?: number;
          image_urls?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          content?: string;
          category_id?: string | null;
          school_id?: string | null;
          city_id?: string | null;
          author_name?: string | null;
          contact_info?: string | null;
          is_anonymous?: boolean;
          status?: "pending" | "approved" | "rejected";
          risk_level?: "low" | "medium" | "high";
          moderation_note?: string | null;
          report_count?: number;
          is_pinned?: boolean;
          view_count?: number;
          image_urls?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "posts_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "posts_city_id_fkey";
            columns: ["city_id"];
            isOneToOne: false;
            referencedRelation: "cities";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "posts_school_id_fkey";
            columns: ["school_id"];
            isOneToOne: false;
            referencedRelation: "schools";
            referencedColumns: ["id"];
          }
        ];
      };
      reports: {
        Row: {
          id: string;
          post_id: string;
          reason: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          reason: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          post_id?: string;
          reason?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "reports_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "posts";
            referencedColumns: ["id"];
          }
        ];
      };
      schools: {
        Row: {
          id: string;
          name: string;
          slug: string;
          city: string | null;
          logo_url: string | null;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          city?: string | null;
          logo_url?: string | null;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          city?: string | null;
          logo_url?: string | null;
          description?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
