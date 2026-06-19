import Link from "next/link";
import { BriefcaseBusiness, Car, GraduationCap, HelpCircle, Home, MessageCircle, Search, ShoppingBag, Sparkles } from "lucide-react";
import { PwaInstallTip } from "@/components/pwa-install-tip";
import { PostFeed } from "@/components/post-feed";
import { categoryCatalog } from "@/lib/category-metadata";
import { getAnnouncements, getComments, getPosts, getSchools } from "@/lib/data";
import { getSchoolCatalogItem, popularSchoolSlugs } from "@/lib/school-metadata";
import type { School } from "@/types/wall";

type HomePageProps = {
  searchParams: Promise<{
    q?: string;
    category?: string;
    school?: string;
    city?: string;
  }>;
};

const shortcuts = [
  { label: "租房", href: "/category/rent-roommate", icon: Home },
  { label: "二手", href: "/category/second-hand", icon: ShoppingBag },
  { label: "拼车", href: "/category/daily-carpool", icon: Car },
  { label: "课程", href: "/category/course-team", icon: GraduationCap },
  { label: "新生", href: "/category/freshman-help", icon: HelpCircle },
  { label: "实习", href: "/category/internship-referral", icon: BriefcaseBusiness },
  { label: "讨论", href: "/category/campus-discussion", icon: MessageCircle },
  { label: "更多", href: "/categories", icon: Sparkles }
];

const hotSearches = [
  { label: "今日拼车", href: "/?q=今日拼车" },
  { label: "UPM 租房", href: "/?q=UPM%20租房" },
  { label: "APU 实习", href: "/?q=APU%20实习" },
  { label: "EMGS", href: "/?q=EMGS" },
  { label: "二手显示器", href: "/?q=二手显示器" },
  { label: "新生报到", href: "/?q=新生报到" },
  { label: "选课经验", href: "/category/course-review" }
];

function categoryName(slug: string) {
  return categoryCatalog.find((category) => category.slug === slug)?.name ?? slug;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const resolvedSearchParams = await searchParams;
  const [schools, announcements, comments, posts, carpoolPosts] = await Promise.all([
    getSchools(),
    getAnnouncements(),
    getComments(),
    getPosts({
      search: resolvedSearchParams.q,
      categorySlug: resolvedSearchParams.category,
      schoolSlug: resolvedSearchParams.school,
      citySlug: resolvedSearchParams.city
    }),
    getPosts({ categorySlug: "daily-carpool" })
  ]);

  const popularSchools = popularSchoolSlugs
    .map((slug) => schools.find((school) => school.slug === slug))
    .filter((school): school is School => Boolean(school))
    .slice(0, 8);
  const hasSearch = Boolean(resolvedSearchParams.q || resolvedSearchParams.category || resolvedSearchParams.school || resolvedSearchParams.city);

  return (
    <div className="space-y-4 sm:space-y-5">
      <section className="container-page">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-black/5 bg-white/80 px-4 py-6 text-center shadow-soft backdrop-blur sm:px-6 sm:py-8">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-coral">Malaysia Student Wall</p>
          <h1 className="mt-2 text-2xl font-black tracking-normal text-ink sm:text-3xl">全马留学生搜索入口</h1>
          <p className="mt-2 text-xs font-semibold leading-5 text-muted sm:text-sm">搜租房、拼车、二手、课程、实习和新生问题</p>

          <form action="/" className="mt-5 flex items-center gap-2 rounded-3xl border border-black/10 bg-white px-3 py-2 shadow-soft">
            <Search className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
            <input
              name="q"
              defaultValue={resolvedSearchParams.q}
              placeholder="搜索 UPM 租房、今日拼车、EMGS、二手显示器..."
              className="min-h-10 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-muted/70"
            />
            <button className="rounded-2xl bg-ink px-4 py-2 text-xs font-black text-white" type="submit">
              搜索
            </button>
          </form>

          <div className="mt-3 flex flex-wrap justify-center gap-1.5">
            {hotSearches.map((item) => (
              <Link key={item.label} href={item.href} className="rounded-full border border-black/5 bg-stone-50 px-2.5 py-1 text-[11px] font-bold text-muted">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <PwaInstallTip />

      <section className="container-page">
        <div className="mx-auto max-w-3xl">
          <div className="mb-2 flex items-center justify-between px-1">
            <h2 className="text-sm font-black tracking-normal text-ink">常用入口</h2>
            <Link href="/categories" className="text-[11px] font-black text-coral">
              全部分类
            </Link>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {shortcuts.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex min-h-20 flex-col items-center justify-center gap-1.5 rounded-3xl border border-black/5 bg-white/85 px-2 py-3 text-center shadow-soft transition hover:border-coral/30 hover:bg-coral/5"
                >
                  <span className="rounded-2xl bg-coral/10 p-2 text-coral">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="text-xs font-black text-ink">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="container-page">
        <div className="mx-auto max-w-3xl rounded-2xl border border-mint/15 bg-mint/10 px-3 py-2 text-xs font-semibold leading-5 text-muted">
          试运行中：所有投稿审核后展示。请勿发布隐私、诈骗、代写代考或人身攻击内容。
        </div>
      </section>

      {hasSearch ? (
        <section className="container-page">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-muted">Search</p>
              <h2 className="text-lg font-black tracking-normal text-ink">搜索结果</h2>
            </div>
            <Link href="/discover" className="text-xs font-black text-coral">
              去发现页
            </Link>
          </div>
          <PostFeed posts={posts.slice(0, 8)} comments={comments} emptyText="暂时没有匹配内容，换个关键词试试。" />
        </section>
      ) : null}

      <section className="container-page">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-muted">Carpool</p>
            <h2 className="text-lg font-black tracking-normal text-ink">{categoryName("daily-carpool")}</h2>
          </div>
          <Link href="/category/daily-carpool" className="text-xs font-black text-coral">
            查看更多
          </Link>
        </div>
        <PostFeed posts={carpoolPosts.slice(0, 3)} comments={comments} emptyText="暂无拼车信息，发布一条试试。" />
      </section>

      <section className="container-page">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-muted">Latest</p>
            <h2 className="text-lg font-black tracking-normal text-ink">最新信息</h2>
          </div>
          <Link href="/discover" className="text-xs font-black text-coral">
            发现更多
          </Link>
        </div>
        <PostFeed posts={posts.slice(0, 5)} comments={comments} />
      </section>

      <section className="container-page">
        <div className="surface rounded-3xl p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-base font-black tracking-normal text-ink">热门学校</h2>
            <Link href="/schools" className="text-xs font-black text-coral">
              全部
            </Link>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {popularSchools.map((school) => {
              if (!school) return null;
              const catalogItem = getSchoolCatalogItem(school.slug);
              return (
                <Link key={school.id} href={`/school/${school.slug}`} className="rounded-2xl bg-white px-2 py-3 text-center text-xs font-black text-ink">
                  <span title={school.name}>{catalogItem?.shortName ?? school.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {announcements[0] ? (
        <section className="container-page">
          <div className="rounded-2xl border border-black/5 bg-white/70 px-3 py-2 text-xs font-semibold leading-5 text-muted">
            {announcements[0].title}：{announcements[0].content}
          </div>
        </section>
      ) : null}
    </div>
  );
}
