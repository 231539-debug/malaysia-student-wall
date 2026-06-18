import { notFound } from "next/navigation";
import { PageHero } from "@/components/page-hero";
import { PostFeed } from "@/components/post-feed";
import { getCityBySlug, getComments, getPosts } from "@/lib/data";

type CityWallPageProps = {
  params: {
    slug: string;
  };
};

export default async function CityWallPage({ params }: CityWallPageProps) {
  const [city, comments] = await Promise.all([getCityBySlug(params.slug), getComments()]);
  if (!city) notFound();

  const posts = await getPosts({ citySlug: city.slug });

  return (
    <div className="space-y-5">
      <PageHero
        eyebrow="City Wall"
        title={city.name}
        description={`${city.name} 的留学生信息墙，聚合本地学校、租房、二手、活动和生活互助内容。`}
        actionHref="/submit"
        actionLabel="向城市墙投稿"
      />
      <section className="container-page">
        <PostFeed posts={posts} comments={comments} emptyText="这个城市暂时还没有通过审核的帖子。" />
      </section>
    </div>
  );
}

export async function generateMetadata({ params }: CityWallPageProps) {
  const city = await getCityBySlug(params.slug);
  return {
    title: city ? `${city.name} | 马来西亚留学生墙` : "城市信息墙"
  };
}
