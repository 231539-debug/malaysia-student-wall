import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getCategories } from "@/lib/data";
import { groupedCategoryCatalog } from "@/lib/category-metadata";

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-4">
      <section className="container-page">
        <div className="rounded-3xl border border-black/5 bg-white/80 p-4 shadow-soft backdrop-blur sm:p-5">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-coral">Categories</p>
          <h1 className="mt-1 text-2xl font-black tracking-normal text-ink sm:text-3xl">全部分类</h1>
          <p className="mt-2 text-sm font-semibold leading-6 text-muted">按需求快速进入信息墙。所有投稿仍会先进入审核。</p>
        </div>
      </section>

      <section className="container-page space-y-3">
        {groupedCategoryCatalog().map((group) => (
          <div key={group.group} className="surface rounded-3xl p-4">
            <h2 className="text-base font-black tracking-normal text-ink">{group.label}</h2>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {group.categories.map((item) => {
                const category = categories.find((category) => category.slug === item.slug);
                const href = category ? `/category/${category.slug}` : `/category/${item.slug}`;

                return (
                  <Link
                    key={item.slug}
                    href={href}
                    className="group rounded-2xl border border-black/5 bg-white px-3 py-3 transition hover:border-coral/30 hover:bg-coral/5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-black text-ink">{item.name}</p>
                      <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted transition group-hover:text-coral" aria-hidden="true" />
                    </div>
                    <p className="mt-1 line-clamp-1 text-xs font-semibold text-muted">{item.description}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
