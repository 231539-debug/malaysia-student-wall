import { Megaphone } from "lucide-react";
import type { Announcement } from "@/types/wall";

export function AnnouncementStrip({ announcements }: { announcements: Announcement[] }) {
  if (announcements.length === 0) return null;

  return (
    <section className="container-page">
      <div className="surface rounded-3xl p-4">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 rounded-2xl bg-mint/15 p-2 text-mint">
            <Megaphone className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-black text-ink">{announcements[0].title}</p>
            <p className="mt-1 text-sm leading-6 text-muted">{announcements[0].content}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
