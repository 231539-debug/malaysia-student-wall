import Link from "next/link";
import { MessageCircle, PenLine, Search } from "lucide-react";
import { PostFeed } from "@/components/post-feed";
import { discussionCategorySlugs, getCategoryMeta } from "@/lib/category-metadata";
import { getComments, getPosts } from "@/lib/data";
import type { Post } from "@/types/wall";

type DiscussPageProps = {
  searchParams: Promise<{
    q?: string;
    category?: string;
  }>;
};

function sortByLatest(posts: Post[]) {
  return [...posts].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export default async function DiscussPage({ searchParams }: DiscussPageProps) {
  const resolvedSearchParams = await searchParams;
  const keyword = resolvedSearchParams.q?.trim();
  const selectedCategory = resolvedSearchParams.category;
  const categorySlugs =
    selectedCategory && discussionCategorySlugs.includes(selectedCategory as (typeof discussionCategorySlugs)[number])
      ? [selectedCategory]
      : [...discussionCategorySlugs];

  const [comments, ...postGroups] = await Promise.all([
    getComments(),
    ...categorySlugs.map((slug) => getPosts({ categorySlug: slug, search: keyword }))
  ]);
  const posts = sortByLatest(postGroups.flat()).slice(0, 24);

  return (
    <div className="space-y-4">
      <section className="container-page">
        <div className="rounded-3xl border border-black/5 bg-white/80 p-4 shadow-soft backdrop-blur sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-coral">Tea Room</p>
              <h1 className="mt-1 text-2xl font-black tracking-normal text-ink sm:text-3xl">留学茶水间</h1>
              <p className="mt-2 text-sm font-semibold leading-6 text-muted">聊校园、吐槽生活、匿名求助，也可以分享课程和留学体验。</p>
            </div>
            <Link href="/submit?category=campus-discussion" className="button-primary shrink-0 px-3 py-2 text-xs">
              <PenLine className="h-4 w-4" aria-hidden="true" />
              发帖
            </Link>
          </div>

          <div className="mt-4 rounded-2xl bg-coral/10 px-3 py-2 text-xs font-semibold leading-5 text-coral">
            可以吐槽事情，不可以挂具体的人。请勿曝光姓名、照片、联系方式、聊天记录或进行人身攻击。违规内容被举报多次会自动隐藏。
          </div>

          <form action="/discuss" className="mt-4 flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-3 py-2">
            <Search className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
            <input
              name="q"
              defaultValue={keyword}
              placeholder="搜索茶水间内容..."
              className="min-h-9 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-muted/70"
            />
            <button className="rounded-xl bg-ink px-3 py-2 text-xs font-black text-white" type="submit">
              搜索
            </button>
          </form>
        </div>
      </section>

      <section className="container-page">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {discussionCategorySlugs.map((slug) => {
            const meta = getCategoryMeta(slug);
            const href = selectedCategory === slug ? "/discuss" : `/discuss?category=${slug}`;
            const active = selectedCategory === slug;

            return (
              <Link
                key={slug}
                href={href}
                className={`rounded-2xl border px-3 py-3 transition ${
                  active ? "border-coral/30 bg-coral/10 text-coral" : "border-black/5 bg-white text-ink hover:border-coral/30"
                }`}
              >
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                  <p className="text-sm font-black">{meta?.name ?? slug}</p>
                </div>
                <p className="mt-1 line-clamp-1 text-xs font-semibold text-muted">{meta?.description}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="container-page">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-muted">Latest</p>
            <h2 className="text-lg font-black tracking-normal text-ink">最新讨论</h2>
          </div>
          <Link href="/submit?category=campus-discussion" className="text-xs font-black text-coral">
            发一条
          </Link>
        </div>
        <PostFeed posts={posts} comments={comments} emptyText="茶水间暂时还没有新内容，发起一个话题吧。" />
      </section>
    </div>
  );
}
