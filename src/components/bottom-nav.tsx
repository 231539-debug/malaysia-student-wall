import Link from "next/link";
import { Car, Compass, Home, MessageCircle, PenLine } from "lucide-react";

const items = [
  { href: "/", label: "首页", icon: Home },
  { href: "/discover", label: "发现", icon: Compass },
  { href: "/submit", label: "发布", icon: PenLine, primary: true },
  { href: "/category/daily-carpool", label: "拼车", icon: Car },
  { href: "/discuss", label: "茶水间", icon: MessageCircle }
];

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-black/5 bg-white/90 px-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-5 items-end">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-h-12 flex-col items-center justify-center gap-1 rounded-2xl px-1.5 text-[10px] font-black ${
                item.primary ? "-mt-4 bg-ink py-2 text-white shadow-soft" : "py-1.5 text-muted"
              }`}
            >
              <Icon className={item.primary ? "h-5 w-5" : "h-4 w-4"} aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
