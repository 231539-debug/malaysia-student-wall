import Link from "next/link";
import { Search } from "lucide-react";
import { PostFeed } from "@/components/post-feed";
import { getComments, getPosts, getSchools } from "@/lib/data";
import { getSchoolCatalogItem, popularSchoolSlugs } from "@/lib/school-metadata";

const sections = [
  { title: "今日拼车", slug: "daily-carpool", empty: "暂无今日拼车，发布一条试试。" },
  { title: "最新二手", slug: "second-hand", empty: "暂无二手信息。" },
  { title: "最新实习", slug: "internship-referral", empty: "暂无实习内推。" },
  { title: "留学茶水间", slug: "campus-discussion", empty: "暂无讨论，发起一个话题吧。" }
];

type DiscoverPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export default async function DiscoverPage({ searchParams }: DiscoverPageProps) {
  const resolvedSearchParams = await searchParams;
  const keyword = resolvedSearchParams.q?.trim();
  const [comments, latestPosts, schools, ...sectionPosts] = await Promise.all([
    getComments(),
    getPosts({ search: keyword }),
    getSchools(),
    ...sections.map((section) => getPosts({ categorySlug: section.slug }))
  ]);

  const popularSchools = popularSchoolSlugs
    .map((slug) => schools.find((school) => school.slug === slug))
    .filter(Boolean)
    .slice(0, 8);

  return (
    <div className="space-y-4">
      <section className="container-page">
        <div className="rounded-3xl border border-black/5 bg-white/80 p-4 shadow-soft backdrop-blur sm:p-5">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-coral">Discover</p>
          <h1 className="mt-1 text-2xl font-black tracking-normal text-ink sm:text-3xl">发现</h1>
          <p className="mt-2 text-sm font-semibold leading-6 text-muted">刷最新信息、拼车、二手、实习和校园讨论。</p>
          <form action="/discover" className="mt-4 flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-3 py-2">
            <Search className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
            <input
              name="q"
              defaultValue={keyword}
              placeholder="搜索标题、内容、学校、城市、分类..."
              className="min-h-9 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-muted/70"
            />
            <button className="rounded-xl bg-ink px-3 py-2 text-xs font-black text-white" type="submit">
              搜索
            </button>
          </form>
        </div>
      </section>

      <section className="container-page">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-lg font-black tracking-normal text-ink">{keyword ? "搜索结果" : "最新信息"}</h2>
          <Link href="/submit" className="text-xs font-black text-coral">
            发布
          </Link>
        </div>
        <PostFeed posts={latestPosts.slice(0, 9)} comments={comments} />
      </section>

      {sections.map((section, index) => (
        <section key={section.slug} className="container-page">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-lg font-black tracking-normal text-ink">{section.title}</h2>
            <Link href={section.slug === "campus-discussion" ? "/discuss" : `/category/${section.slug}`} className="text-xs font-black text-coral">
              查看更多
            </Link>
          </div>
          <PostFeed posts={sectionPosts[index].slice(0, 3)} comments={comments} emptyText={section.empty} />
        </section>
      ))}

      <section className="container-page">
        <div className="surface rounded-3xl p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-base font-black tracking-normal text-ink">热门学校</h2>
            <Link href="/schools" className="text-xs font-black text-coral">
              全部学校
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
    </div>
  );
}
