import Link from "next/link";
import type { ReactNode } from "react";
import { PenLine } from "lucide-react";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
  meta?: ReactNode;
};

export function PageHero({ eyebrow, title, description, actionHref, actionLabel, meta }: PageHeroProps) {
  return (
    <section className="container-page">
      <div className="grid gap-4 rounded-3xl border border-black/5 bg-white/75 p-4 shadow-soft backdrop-blur sm:p-6 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          {eyebrow ? <p className="mb-2 text-[11px] font-black uppercase tracking-[0.16em] text-coral">{eyebrow}</p> : null}
          <h1 className="text-2xl font-black tracking-normal text-ink sm:text-3xl">{title}</h1>
          <p className="mt-2 max-w-2xl text-xs font-semibold leading-5 text-muted sm:text-sm sm:leading-6">{description}</p>
          {meta ? <div className="mt-3 flex flex-wrap gap-2">{meta}</div> : null}
        </div>
        {actionHref && actionLabel ? (
          <Link href={actionHref} className="button-primary w-full py-2.5 text-xs md:w-auto">
            <PenLine className="h-4 w-4" aria-hidden="true" />
            {actionLabel}
          </Link>
        ) : null}
      </div>
    </section>
  );
}
