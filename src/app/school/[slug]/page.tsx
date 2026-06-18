import { notFound } from "next/navigation";
import { PageHero } from "@/components/page-hero";
import { PostFeed } from "@/components/post-feed";
import { getComments, getPosts, getSchoolBySlug } from "@/lib/data";

type SchoolWallPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function SchoolWallPage({ params }: SchoolWallPageProps) {
  const resolvedParams = await params;
  const [school, comments] = await Promise.all([getSchoolBySlug(resolvedParams.slug), getComments()]);
  if (!school) notFound();

  const posts = await getPosts({ schoolSlug: school.slug });

  return (
    <div className="space-y-5">
      <PageHero
        eyebrow="School Wall"
        title={school.name}
        description={school.description ?? `${school.name} 的校园信息墙，展示同校同学的投稿与互助信息。`}
        actionHref="/submit"
        actionLabel="向本校投稿"
        meta={school.city ? <span className="chip bg-sky/10 text-sky">{school.city}</span> : null}
      />
      <section className="container-page">
        <PostFeed posts={posts} comments={comments} emptyText="这个学校暂时还没有通过审核的帖子。" />
      </section>
    </div>
  );
}

export async function generateMetadata({ params }: SchoolWallPageProps) {
  const resolvedParams = await params;
  const school = await getSchoolBySlug(resolvedParams.slug);
  return {
    title: school ? `${school.name} | 马来西亚留学生墙` : "学校信息墙"
  };
}
