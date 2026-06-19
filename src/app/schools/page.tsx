import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { getSchools } from "@/lib/data";
import { schoolCatalog, schoolGroupLabels, type SchoolGroup } from "@/lib/school-metadata";

const groupOrder: SchoolGroup[] = ["public", "private", "international"];

export default async function SchoolsPage() {
  const schools = await getSchools();

  return (
    <div className="space-y-5">
      <PageHero
        eyebrow="Schools"
        title="学校列表"
        description="按学校类型浏览马来西亚常见留学院校，进入对应信息墙后可以查看租房、二手、课程、新生求助和生活互助信息。"
        actionHref="/submit"
        actionLabel="发布学校信息"
      />
      <section className="container-page space-y-5">
        {groupOrder.map((group) => {
          const catalogItems = schoolCatalog.filter((school) => school.group === group);

          return (
            <div key={group} className="surface rounded-3xl p-5 sm:p-6">
              <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-muted">{group}</p>
                  <h2 className="text-2xl font-black tracking-normal text-ink">{schoolGroupLabels[group]}</h2>
                </div>
                <span className="chip">{catalogItems.length} 所</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {catalogItems.map((catalogItem) => {
                  const school = schools.find((item) => item.slug === catalogItem.slug);
                  const href = school ? `/school/${school.slug}` : `/school/${catalogItem.slug}`;

                  return (
                    <Link
                      key={catalogItem.slug}
                      href={href}
                      className="group rounded-3xl border border-black/5 bg-white p-5 transition hover:-translate-y-0.5 hover:border-coral/25"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="mb-2 flex flex-wrap gap-2">
                            <span className="chip bg-sky/10 text-sky">{catalogItem.shortName}</span>
                            <span className="chip">{school?.city ?? catalogItem.city}</span>
                          </div>
                          <h3 className="text-lg font-black tracking-normal text-ink">{school?.name ?? catalogItem.name}</h3>
                        </div>
                        <span className="rounded-2xl bg-sky/10 p-2 text-sky transition group-hover:bg-sky group-hover:text-white">
                          <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </span>
                      </div>
                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted">{school?.description ?? catalogItem.description}</p>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
