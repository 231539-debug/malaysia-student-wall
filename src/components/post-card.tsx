import Link from "next/link";
import { MessageCircle, Pin } from "lucide-react";
import { getCategoryDisplayName } from "@/lib/category-metadata";
import { getSchoolCatalogItem } from "@/lib/school-metadata";
import { excerpt, formatDate } from "@/lib/utils";
import type { Post } from "@/types/wall";

type PostCardProps = {
  post: Post;
  commentsCount?: number;
};

export function PostCard({ post, commentsCount = 0 }: PostCardProps) {
  const image = post.image_urls?.[0];
  const categoryName = post.category ? getCategoryDisplayName(post.category.slug, post.category.name) : null;
  const schoolShortName = post.school ? getSchoolCatalogItem(post.school.slug)?.shortName ?? post.school.name : null;

  return (
    <article className="surface overflow-hidden rounded-3xl">
      {image ? (
        <Link href={`/post/${post.id}`} className="block aspect-[16/10] bg-slate-100">
          <img src={image} alt="" className="h-full w-full object-cover" />
        </Link>
      ) : null}
      <div className="p-3.5 sm:p-4">
        <div className="mb-2 flex flex-wrap gap-1.5">
          {post.is_pinned ? (
            <span className="chip border-mango/30 bg-mango/10 text-ink">
              <Pin className="mr-1 h-3 w-3" aria-hidden="true" />
              置顶
            </span>
          ) : null}
          {post.category ? (
            <Link href={`/category/${post.category.slug}`} className="chip">
              {categoryName}
            </Link>
          ) : null}
          {post.school ? (
            <Link href={`/school/${post.school.slug}`} className="chip" title={post.school.name}>
              {schoolShortName}
            </Link>
          ) : null}
          {post.city ? (
            <Link href={`/city/${post.city.slug}`} className="chip">
              {post.city.name}
            </Link>
          ) : null}
        </div>

        <Link href={`/post/${post.id}`}>
          <h2 className="line-clamp-2 text-base font-black tracking-normal text-ink">{post.title}</h2>
          <p className="mt-1.5 line-clamp-2 text-xs font-semibold leading-5 text-muted">{excerpt(post.content)}</p>
        </Link>

        <div className="mt-3 flex items-center justify-between gap-3 text-[11px] font-semibold text-muted">
          <span>{formatDate(post.created_at)}</span>
          <span className="inline-flex items-center gap-1">
            <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
            {commentsCount}
          </span>
        </div>
      </div>
    </article>
  );
}
