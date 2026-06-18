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
      <div className="grid gap-4 rounded-[2rem] border border-black/5 bg-white/75 p-5 shadow-soft backdrop-blur sm:p-8 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          {eyebrow ? <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-coral">{eyebrow}</p> : null}
          <h1 className="text-3xl font-black tracking-normal text-ink sm:text-5xl">{title}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted sm:text-base">{description}</p>
          {meta ? <div className="mt-4 flex flex-wrap gap-2">{meta}</div> : null}
        </div>
        {actionHref && actionLabel ? (
          <Link href={actionHref} className="button-primary w-full md:w-auto">
            <PenLine className="h-4 w-4" aria-hidden="true" />
            {actionLabel}
          </Link>
        ) : null}
      </div>
    </section>
  );
}
