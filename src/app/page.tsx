import Link from "next/link";
import { ArrowRight, BookOpen, Home, Router, ShieldCheck, ShoppingBag, Users } from "lucide-react";
import { AnnouncementStrip } from "@/components/announcement-strip";
import { FilterBar } from "@/components/filter-bar";
import { PageHero } from "@/components/page-hero";
import { PostFeed } from "@/components/post-feed";
import { getAnnouncements, getCategories, getCities, getComments, getPosts, getSchools } from "@/lib/data";
import { getSchoolCatalogItem, popularSchoolSlugs } from "@/lib/school-metadata";

type HomePageProps = {
  searchParams: Promise<{
    q?: string;
    category?: string;
    school?: string;
    city?: string;
  }>;
};

const quickEntries = [
  {
    label: "租房找室友",
    slug: "rent-roommate",
    description: "找房、转租、合租、室友招募",
    icon: Home
  },
  {
    label: "二手交易",
    slug: "second-hand",
    description: "教材、家具、电器、闲置好物",
    icon: ShoppingBag
  },
  {
    label: "课程组队",
    slug: "course-team",
    description: "Assignment 小组、section 互助",
    icon: BookOpen
  },
  {
    label: "新生求助",
    slug: "freshman-help",
    description: "报到、住宿、银行卡、电话卡",
    icon: Users
  },
  {
    label: "生活避坑",
    slug: "life-tips",
    description: "本地生活经验和实用提醒",
    icon: ShieldCheck
  },
  {
    label: "宽带网络",
    slug: "internet",
    description: "宿舍网络、套餐、安装经验",
    icon: Router
  }
];

export default async function HomePage({ searchParams }: HomePageProps) {
  const resolvedSearchParams = await searchParams;
  const [categories, schools, cities, announcements, comments, posts] = await Promise.all([
    getCategories(),
    getSchools(),
    getCities(),
    getAnnouncements(),
    getComments(),
    getPosts({
      search: resolvedSearchParams.q,
      categorySlug: resolvedSearchParams.category,
      schoolSlug: resolvedSearchParams.school,
      citySlug: resolvedSearchParams.city
    })
  ]);

  const popularSchools = popularSchoolSlugs
    .map((slug) => schools.find((school) => school.slug === slug))
    .filter(Boolean)
    .slice(0, 12);

  return (
    <div className="space-y-4 sm:space-y-5">
      <section className="container-page">
        <div className="flex flex-col gap-2 rounded-2xl border border-black/5 bg-white/70 px-3 py-2.5 text-sm font-semibold leading-5 text-muted shadow-soft backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:px-4 sm:py-3">
          <p>📌 精选投稿后续会同步到小红书｜欢迎关注站长账号，获取更多马来西亚留学生活信息</p>
          <Link
            href="https://www.xiaohongshu.com/user/profile/670a38f1000000001d021bb5"
            target="_blank"
            rel="noreferrer"
            className="inline-flex shrink-0 items-center justify-center rounded-full bg-coral/10 px-3 py-1.5 text-xs font-black text-coral"
          >
            关注小红书
          </Link>
        </div>
      </section>

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

      <section className="container-page">
        <div className="surface rounded-3xl p-4 sm:p-5">
          <div className="mb-3">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-muted">Quick Access</p>
            <h2 className="text-xl font-black tracking-normal text-ink">常用入口</h2>
            <p className="mt-1 text-xs font-semibold leading-5 text-muted">按需求快速查看信息</p>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {quickEntries.map((entry) => {
              const Icon = entry.icon;
              return (
                <Link
                  key={entry.slug}
                  href={`/category/${entry.slug}`}
                  className="group flex min-h-20 flex-col items-center justify-center gap-2 rounded-2xl border border-black/5 bg-white px-2 py-3 text-center transition hover:border-coral/25 hover:bg-coral/5"
                >
                  <span className="rounded-2xl bg-coral/10 p-2 text-coral transition group-hover:bg-coral group-hover:text-white">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="text-xs font-black leading-4 text-ink">{entry.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="container-page">
        <div className="surface rounded-3xl p-4 sm:p-5">
          <div className="mb-3 flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-muted">Popular Schools</p>
              <h2 className="text-xl font-black tracking-normal text-ink">热门学校入口</h2>
              <p className="mt-1 text-xs font-semibold leading-5 text-muted">
                按留学生常见度、学校活跃度和信息需求排序，非官方排名。
              </p>
            </div>
            <Link href="/schools" className="hidden rounded-full bg-coral/10 px-3 py-1.5 text-xs font-black text-coral sm:inline-flex">
              全部学校
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {popularSchools.map((school, index) => {
              if (!school) return null;
              const catalogItem = getSchoolCatalogItem(school.slug);

              return (
                <Link
                  key={school.id}
                  href={`/school/${school.slug}`}
                  className={`rounded-2xl border border-black/5 bg-white p-3 transition hover:border-sky/30 hover:bg-sky/5 ${
                    index >= 8 ? "hidden lg:block" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="mb-2 flex flex-wrap gap-1.5">
                        {catalogItem?.shortName ? (
                          <span className="rounded-full bg-sky/10 px-2 py-1 text-[11px] font-black leading-none text-sky">
                            {catalogItem.shortName}
                          </span>
                        ) : null}
                        {school.city ? (
                          <span className="rounded-full bg-stone-100 px-2 py-1 text-[11px] font-bold leading-none text-muted">
                            {school.city}
                          </span>
                        ) : null}
                      </div>
                      <h3 className="line-clamp-2 text-xs font-black leading-4 text-ink sm:text-sm sm:leading-5">
                        {catalogItem?.name ?? school.name}
                      </h3>
                    </div>
                    <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted" aria-hidden="true" />
                  </div>
                </Link>
              );
            })}
          </div>
          <Link href="/schools" className="button-soft mt-3 w-full py-2 text-sm sm:hidden">
            查看全部学校
          </Link>
        </div>
      </section>

      <section className="container-page">
        <div className="surface rounded-3xl p-4 sm:p-6">
          <div className="mb-3 sm:mb-4">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-muted">About</p>
            <h2 className="text-xl font-black tracking-normal text-ink">平台说明</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {["全马留学生信息互助", "投稿需审核后展示", "非官方校园社区", "适合发布租房、二手、课程、新生求助和生活信息"].map((item) => (
              <div key={item} className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold leading-6 text-muted">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <FilterBar categories={categories} schools={schools} cities={cities} selected={resolvedSearchParams} />
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
