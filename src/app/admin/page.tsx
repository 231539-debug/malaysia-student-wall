import Link from "next/link";
import { ExternalLink, Lock, LogOut, Plus, Search, ShieldCheck, Trash2 } from "lucide-react";
import {
  addCategory,
  addCity,
  addSchool,
  createAnnouncement,
  deleteComment,
  deletePost,
  loginAdmin,
  logoutAdmin,
  togglePinned,
  updateCommentStatus,
  updatePostStatus
} from "@/app/admin/actions";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getAllAdminComments, getAllAdminPosts, getAnnouncements, getCategories, getCities, getSchools } from "@/lib/data";
import { hasSupabaseServiceRole } from "@/lib/supabase";
import { excerpt, formatDate } from "@/lib/utils";
import type { Comment, ModerationStatus, Post } from "@/types/wall";

type AdminPostStatus = ModerationStatus | "all";

type AdminPageProps = {
  searchParams: Promise<{
    error?: string;
    status?: string;
    q?: string;
  }>;
};

const statusOptions: Array<{ label: string; value: AdminPostStatus }> = [
  { label: "待审核", value: "pending" },
  { label: "已通过", value: "approved" },
  { label: "已拒绝", value: "rejected" },
  { label: "全部", value: "all" }
];

function normalizeStatus(status?: string): AdminPostStatus {
  if (status === "approved" || status === "rejected" || status === "all") {
    return status;
  }

  return "pending";
}

function statusLabel(status: ModerationStatus) {
  const labels: Record<ModerationStatus, string> = {
    pending: "待审核",
    approved: "已通过",
    rejected: "已拒绝"
  };

  return labels[status];
}

function adminListHref(status: AdminPostStatus, q?: string) {
  const params = new URLSearchParams();
  params.set("status", status);
  if (q) params.set("q", q);
  return `/admin?${params.toString()}`;
}

function AdminLogin({ error }: { error?: string }) {
  return (
    <section className="container-page">
      <div className="surface mx-auto mt-10 max-w-md rounded-3xl p-6 sm:p-8">
        <div className="mb-5 flex items-center gap-3">
          <span className="rounded-2xl bg-ink p-3 text-white">
            <Lock className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h1 className="text-2xl font-black tracking-normal text-ink">管理后台</h1>
            <p className="text-sm text-muted">输入 ADMIN_PASSWORD 进入审核台。</p>
          </div>
        </div>
        {error ? (
          <p className="mb-4 rounded-2xl bg-coral/10 px-4 py-3 text-sm font-semibold text-coral">
            密码错误或未设置 ADMIN_PASSWORD。
          </p>
        ) : null}
        <form action={loginAdmin} className="space-y-3">
          <input name="password" type="password" required placeholder="后台密码" className="field" />
          <button className="button-primary w-full" type="submit">
            进入后台
          </button>
        </form>
      </div>
    </section>
  );
}

function AdminServiceRoleError() {
  return (
    <section className="container-page">
      <div className="surface mx-auto mt-10 max-w-2xl rounded-3xl p-6 sm:p-8">
        <div className="mb-4 flex items-center gap-3">
          <span className="rounded-2xl bg-coral/10 p-3 text-coral">
            <Lock className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h1 className="text-2xl font-black tracking-normal text-ink">后台配置缺失</h1>
            <p className="mt-1 text-sm leading-6 text-muted">
              /admin 需要配置 <code className="font-semibold text-ink">SUPABASE_SERVICE_ROLE_KEY</code> 才能读取和审核 pending 帖子/评论。
            </p>
          </div>
        </div>
        <p className="rounded-2xl bg-coral/10 px-4 py-3 text-sm font-semibold leading-6 text-coral">
          请在本地 .env.local 或 Vercel Environment Variables 中补齐 SUPABASE_SERVICE_ROLE_KEY 后重新部署。
        </p>
      </div>
    </section>
  );
}

function PostModerationCard({ post }: { post: Post }) {
  return (
    <article className="rounded-3xl border border-black/5 bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="chip">{statusLabel(post.status)}</span>
            {post.is_pinned ? <span className="chip bg-mango/10 text-ink">已置顶</span> : null}
          </div>
          <h3 className="mt-3 text-base font-black tracking-normal text-ink">{post.title}</h3>
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted">{excerpt(post.content, 140)}</p>
        </div>
        <span className="chip">{formatDate(post.created_at)}</span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-muted">
        {post.category ? <span className="chip">{post.category.name}</span> : null}
        {post.school ? <span className="chip">{post.school.name}</span> : null}
        {post.city ? <span className="chip">{post.city.name}</span> : null}
      </div>

      <dl className="mt-4 grid gap-2 rounded-2xl bg-stone-50 p-3 text-xs leading-5 sm:grid-cols-2">
        <div>
          <dt className="font-black text-ink">联系方式</dt>
          <dd className="mt-1 font-semibold text-muted">{post.contact_info || "未填写"}</dd>
        </div>
        <div>
          <dt className="font-black text-ink">作者</dt>
          <dd className="mt-1 font-semibold text-muted">{post.is_anonymous ? "匿名展示" : post.author_name || "未填写"}</dd>
        </div>
      </dl>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
        <form action={updatePostStatus.bind(null, post.id, "approved")}>
          <button className="button-primary w-full py-2" type="submit">
            批准
          </button>
        </form>
        <form action={updatePostStatus.bind(null, post.id, "rejected")}>
          <button className="button-soft w-full py-2" type="submit">
            拒绝
          </button>
        </form>
        <form action={togglePinned.bind(null, post.id, !post.is_pinned)}>
          <button className="button-soft w-full py-2" type="submit">
            {post.is_pinned ? "取消置顶" : "置顶"}
          </button>
        </form>
        {post.status === "approved" ? (
          <Link href={`/post/${post.id}`} className="button-soft w-full py-2 sm:w-auto">
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
            查看前台页面
          </Link>
        ) : null}
        <form action={deletePost.bind(null, post.id)}>
          <button className="button-soft w-full py-2 text-coral" type="submit">
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            删除
          </button>
        </form>
      </div>
    </article>
  );
}

function CommentModerationCard({ comment }: { comment: Comment }) {
  return (
    <article className="rounded-3xl border border-black/5 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-black text-ink">{comment.author_name || "匿名同学"}</p>
          <p className="mt-1 text-sm leading-6 text-muted">{comment.content}</p>
        </div>
        <span className="chip">{statusLabel(comment.status)}</span>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        <form action={updateCommentStatus.bind(null, comment.id, "approved")}>
          <button className="button-primary w-full py-2" type="submit">
            通过
          </button>
        </form>
        <form action={updateCommentStatus.bind(null, comment.id, "rejected")}>
          <button className="button-soft w-full py-2" type="submit">
            拒绝
          </button>
        </form>
        <form action={deleteComment.bind(null, comment.id)}>
          <button className="button-soft w-full py-2 text-coral" type="submit">
            删除
          </button>
        </form>
      </div>
    </article>
  );
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const resolvedSearchParams = await searchParams;
  if (!(await isAdminAuthenticated())) {
    return <AdminLogin error={resolvedSearchParams.error} />;
  }

  if (!hasSupabaseServiceRole()) {
    return <AdminServiceRoleError />;
  }

  const selectedStatus = normalizeStatus(resolvedSearchParams.status);
  const keyword = resolvedSearchParams.q?.trim() ?? "";

  const [posts, comments, announcements, schools, cities, categories] = await Promise.all([
    getAllAdminPosts(),
    getAllAdminComments(),
    getAnnouncements(false),
    getSchools(),
    getCities(),
    getCategories()
  ]);

  const pendingComments = comments.filter((comment) => comment.status === "pending");
  const statusCounts: Record<AdminPostStatus, number> = {
    pending: posts.filter((post) => post.status === "pending").length,
    approved: posts.filter((post) => post.status === "approved").length,
    rejected: posts.filter((post) => post.status === "rejected").length,
    all: posts.length
  };

  const filteredPosts = posts.filter((post) => {
    if (selectedStatus !== "all" && post.status !== selectedStatus) return false;
    if (!keyword) return true;

    const haystack = `${post.title} ${post.content}`.toLowerCase();
    return haystack.includes(keyword.toLowerCase());
  });

  return (
    <div className="container-page space-y-5">
      <div className="surface rounded-3xl p-5 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-coral">Admin</p>
            <h1 className="text-3xl font-black tracking-normal text-ink">审核后台</h1>
            <p className="mt-2 text-sm leading-6 text-muted">已连接 Supabase Service Role，审核操作会写入数据库。</p>
          </div>
          <form action={logoutAdmin}>
            <button className="button-soft" type="submit">
              <LogOut className="h-4 w-4" aria-hidden="true" />
              退出
            </button>
          </form>
        </div>
      </div>

      <section className="surface rounded-3xl p-5">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-black tracking-normal text-ink">帖子管理</h2>
            <p className="mt-1 text-sm font-semibold text-muted">按状态筛选，或搜索标题和内容。</p>
          </div>
          <span className="chip">{filteredPosts.length} 条</span>
        </div>

        <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
          {statusOptions.map((option) => (
            <Link
              key={option.value}
              href={adminListHref(option.value, keyword)}
              className={
                selectedStatus === option.value
                  ? "chip shrink-0 bg-ink text-white"
                  : "chip shrink-0 bg-white text-muted hover:text-ink"
              }
            >
              {option.label} {statusCounts[option.value]}
            </Link>
          ))}
        </div>

        <form action="/admin" className="mb-4 grid gap-3 sm:grid-cols-[1fr_auto]">
          <input type="hidden" name="status" value={selectedStatus} />
          <label className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
            <input name="q" defaultValue={keyword} placeholder="搜索标题或内容" className="field pl-10" />
          </label>
          <button className="button-primary" type="submit">
            搜索
          </button>
        </form>

        <div className="grid gap-3 lg:grid-cols-2">
          {filteredPosts.length ? (
            filteredPosts.map((post) => <PostModerationCard key={post.id} post={post} />)
          ) : (
            <p className="rounded-2xl bg-white p-4 text-sm font-semibold text-muted">没有符合条件的帖子。</p>
          )}
        </div>
      </section>

      <section className="surface rounded-3xl p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-xl font-black tracking-normal text-ink">待审核评论</h2>
          <span className="chip">{pendingComments.length} 条</span>
        </div>
        <div className="space-y-3">
          {pendingComments.length ? (
            pendingComments.map((comment) => <CommentModerationCard key={comment.id} comment={comment} />)
          ) : (
            <p className="text-sm text-muted">暂无待审核评论。</p>
          )}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        <div className="surface rounded-3xl p-5">
          <h2 className="text-xl font-black tracking-normal text-ink">站长公告</h2>
          <form action={createAnnouncement} className="mt-4 space-y-3">
            <input name="title" required placeholder="公告标题" className="field" />
            <textarea name="content" required rows={4} placeholder="公告内容" className="field resize-none" />
            <label className="flex items-center gap-2 text-sm font-semibold text-muted">
              <input name="is_active" type="checkbox" defaultChecked className="h-5 w-5 accent-ink" />
              立即启用
            </label>
            <button className="button-primary w-full" type="submit">
              <Plus className="h-4 w-4" aria-hidden="true" />
              发布公告
            </button>
          </form>
          <div className="mt-4 space-y-2">
            {announcements.slice(0, 3).map((announcement) => (
              <div key={announcement.id} className="rounded-2xl bg-white p-3 text-sm">
                <p className="font-black text-ink">{announcement.title}</p>
                <p className="mt-1 line-clamp-2 text-muted">{announcement.content}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="surface rounded-3xl p-5">
          <h2 className="text-xl font-black tracking-normal text-ink">学校</h2>
          <form action={addSchool} className="mt-4 space-y-3">
            <input name="name" required placeholder="学校名称" className="field" />
            <input name="slug" placeholder="slug，可自动生成" className="field" />
            <input name="city" placeholder="城市" className="field" />
            <textarea name="description" rows={3} placeholder="简介" className="field resize-none" />
            <button className="button-primary w-full" type="submit">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              添加学校
            </button>
          </form>
          <p className="mt-3 text-sm font-semibold text-muted">当前 {schools.length} 所学校</p>
        </div>

        <div className="surface rounded-3xl p-5">
          <h2 className="text-xl font-black tracking-normal text-ink">城市与分类</h2>
          <form action={addCity} className="mt-4 grid gap-3">
            <input name="name" required placeholder="城市名称" className="field" />
            <input name="slug" placeholder="slug，可自动生成" className="field" />
            <button className="button-primary w-full" type="submit">
              添加城市
            </button>
          </form>
          <form action={addCategory} className="mt-5 grid gap-3">
            <input name="name" required placeholder="分类名称" className="field" />
            <input name="slug" placeholder="slug，可自动生成" className="field" />
            <button className="button-soft w-full" type="submit">
              添加分类
            </button>
          </form>
          <p className="mt-3 text-sm font-semibold text-muted">
            当前 {cities.length} 个城市，{categories.length} 个分类
          </p>
        </div>
      </section>
    </div>
  );
}
