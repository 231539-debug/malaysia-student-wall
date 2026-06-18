import Link from "next/link";
import { PenLine, Search } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-paper/85 backdrop-blur-xl">
      <div className="container-page flex h-16 items-center gap-3">
        <Link href="/" className="min-w-0 flex-1">
          <p className="truncate text-base font-black tracking-normal text-ink sm:text-lg">马来西亚留学生墙</p>
          <p className="hidden text-xs font-medium text-muted sm:block">Malaysia Student Wall</p>
        </Link>

        <form action="/" className="hidden min-w-72 items-center gap-2 rounded-2xl border border-black/10 bg-white px-3 py-2 md:flex">
          <Search className="h-4 w-4 text-muted" aria-hidden="true" />
          <input
            name="q"
            aria-label="搜索帖子"
            placeholder="搜索租房、课程、学校..."
            className="w-full bg-transparent text-sm outline-none"
          />
        </form>

        <nav className="hidden items-center gap-2 md:flex">
          <Link href="/schools" className="button-soft py-2">
            学校
          </Link>
          <Link href="/cities" className="button-soft py-2">
            城市
          </Link>
          <Link href="/submit" className="button-primary py-2">
            <PenLine className="h-4 w-4" aria-hidden="true" />
            投稿
          </Link>
        </nav>

        <Link href="/submit" className="button-primary shrink-0 px-3 py-2 md:hidden" aria-label="投稿">
          <PenLine className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </header>
  );
}
