import Link from "next/link";
import { notFound } from "next/navigation";
import { PostFeed } from "@/components/post-feed";
import { getCategoryMeta } from "@/lib/category-metadata";
import { getCategoryBySlug, getComments, getPosts } from "@/lib/data";

type CategoryPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = await params;
  const [category, comments] = await Promise.all([getCategoryBySlug(resolvedParams.slug), getComments()]);
  if (!category) notFound();

  const meta = getCategoryMeta(category.slug);
  const posts = await getPosts({ categorySlug: category.slug });

  return (
    <div className="space-y-4">
      <section className="container-page">
        <div className="rounded-3xl border border-black/5 bg-white/80 p-4 shadow-soft backdrop-blur sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-coral">Category</p>
              <h1 className="mt-1 text-2xl font-black tracking-normal text-ink sm:text-3xl">{meta?.name ?? category.name}</h1>
              <p className="mt-2 text-sm font-semibold leading-6 text-muted">{meta?.description ?? "查看相关的全马留学生投稿，所有内容审核后展示。"}</p>
            </div>
            <Link href="/submit" className="button-primary shrink-0 px-3 py-2 text-xs">
              发布
            </Link>
          </div>
        </div>
      </section>

      <section className="container-page">
        <PostFeed posts={posts} comments={comments} emptyText="这个分类暂时还没有通过审核的帖子。" />
      </section>
    </div>
  );
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const resolvedParams = await params;
  const category = await getCategoryBySlug(resolvedParams.slug);
  const meta = category ? getCategoryMeta(category.slug) : null;
  return {
    title: category ? `${meta?.name ?? category.name} | 马来西亚留学生墙` : "分类信息墙"
  };
}
