import { notFound } from "next/navigation";
import { PageHero } from "@/components/page-hero";
import { PostFeed } from "@/components/post-feed";
import { getCategoryBySlug, getComments, getPosts } from "@/lib/data";

type CategoryPageProps = {
  params: {
    slug: string;
  };
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const [category, comments] = await Promise.all([getCategoryBySlug(params.slug), getComments()]);
  if (!category) notFound();

  const posts = await getPosts({ categorySlug: category.slug });

  return (
    <div className="space-y-5">
      <PageHero
        eyebrow="Category"
        title={category.name}
        description={`查看「${category.name}」相关的全马留学生投稿。所有内容审核后展示，信息更干净。`}
        actionHref="/submit"
        actionLabel="发布该类信息"
      />
      <section className="container-page">
        <PostFeed posts={posts} comments={comments} emptyText="这个分类暂时还没有通过审核的帖子。" />
      </section>
    </div>
  );
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const category = await getCategoryBySlug(params.slug);
  return {
    title: category ? `${category.name} | 马来西亚留学生墙` : "分类信息墙"
  };
}
