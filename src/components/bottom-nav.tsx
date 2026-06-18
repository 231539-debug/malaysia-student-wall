import Link from "next/link";
import { Building2, Home, MapPin, PenLine, ShieldCheck } from "lucide-react";

const items = [
  { href: "/", label: "首页", icon: Home },
  { href: "/schools", label: "学校", icon: Building2 },
  { href: "/submit", label: "投稿", icon: PenLine },
  { href: "/cities", label: "城市", icon: MapPin },
  { href: "/rules", label: "规则", icon: ShieldCheck }
];

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-black/5 bg-white/90 px-2 py-2 backdrop-blur-xl md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-5">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1 rounded-2xl px-2 py-1.5 text-[11px] font-semibold text-muted">
              <Icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
