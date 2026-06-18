import { AnnouncementStrip } from "@/components/announcement-strip";
import { FilterBar } from "@/components/filter-bar";
import { PageHero } from "@/components/page-hero";
import { PostFeed } from "@/components/post-feed";
import { getAnnouncements, getCategories, getCities, getComments, getPosts, getSchools } from "@/lib/data";

type HomePageProps = {
  searchParams: {
    q?: string;
    category?: string;
    school?: string;
    city?: string;
  };
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const [categories, schools, cities, announcements, comments, posts] = await Promise.all([
    getCategories(),
    getSchools(),
    getCities(),
    getAnnouncements(),
    getComments(),
    getPosts({
      search: searchParams.q,
      categorySlug: searchParams.category,
      schoolSlug: searchParams.school,
      citySlug: searchParams.city
    })
  ]);

  return (
    <div className="space-y-5">
      <PageHero
        eyebrow="全马留学生互助社区"
        title="Malaysia Student Wall"
        description="按学校、城市和分类发现租房、二手、课程组队、新生求助与生活经验。第一版采用游客投稿，审核通过后展示。"
        actionHref="/submit"
        actionLabel="我要投稿"
        meta={
          <>
            <span className="chip bg-coral/10 text-coral">全马信息流</span>
            <span className="chip bg-mint/10 text-mint">审核后展示</span>
            <span className="chip bg-sky/10 text-sky">手机端优先</span>
          </>
        }
      />
      <FilterBar categories={categories} schools={schools} cities={cities} selected={searchParams} />
      <AnnouncementStrip announcements={announcements} />
      <section className="container-page">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-muted">Latest</p>
            <h2 className="text-2xl font-black tracking-normal text-ink">最新信息流</h2>
          </div>
          <p className="text-sm font-semibold text-muted">{posts.length} 条</p>
        </div>
        <PostFeed posts={posts} comments={comments} />
      </section>
    </div>
  );
}
