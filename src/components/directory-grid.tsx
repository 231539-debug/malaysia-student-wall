import Link from "next/link";
import { ArrowRight } from "lucide-react";

type DirectoryGridProps = {
  items: Array<{
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    meta?: string | null;
  }>;
  basePath: string;
};

export function DirectoryGrid({ items, basePath }: DirectoryGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <Link key={item.id} href={`${basePath}/${item.slug}`} className="surface group rounded-3xl p-5 transition hover:-translate-y-0.5 hover:border-coral/25">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h2 className="text-lg font-black tracking-normal text-ink">{item.name}</h2>
              {item.meta ? <p className="mt-1 text-xs font-semibold text-coral">{item.meta}</p> : null}
            </div>
            <span className="rounded-2xl bg-sky/10 p-2 text-sky transition group-hover:bg-sky group-hover:text-white">
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </span>
          </div>
          {item.description ? <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted">{item.description}</p> : null}
        </Link>
      ))}
    </div>
  );
}
