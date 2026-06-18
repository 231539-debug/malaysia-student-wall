import Link from "next/link";
import { Eye, MessageCircle, Pin } from "lucide-react";
import type { Post } from "@/types/wall";
import { excerpt, formatDate } from "@/lib/utils";

type PostCardProps = {
  post: Post;
  commentsCount?: number;
};

export function PostCard({ post, commentsCount = 0 }: PostCardProps) {
  const image = post.image_urls?.[0];

  return (
    <article className="surface overflow-hidden rounded-3xl">
      {image ? (
        <Link href={`/post/${post.id}`} className="block aspect-[16/10] bg-slate-100">
          <img src={image} alt="" className="h-full w-full object-cover" />
        </Link>
      ) : null}
      <div className="p-4 sm:p-5">
        <div className="mb-3 flex flex-wrap gap-2">
          {post.is_pinned ? (
            <span className="chip border-mango/30 bg-mango/10 text-ink">
              <Pin className="mr-1 h-3 w-3" aria-hidden="true" />
              置顶
            </span>
          ) : null}
          {post.category ? <Link href={`/category/${post.category.slug}`} className="chip">{post.category.name}</Link> : null}
          {post.school ? <Link href={`/school/${post.school.slug}`} className="chip">{post.school.name}</Link> : null}
          {post.city ? <Link href={`/city/${post.city.slug}`} className="chip">{post.city.name}</Link> : null}
        </div>

        <Link href={`/post/${post.id}`}>
          <h2 className="line-clamp-2 text-lg font-black tracking-normal text-ink">{post.title}</h2>
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted">{excerpt(post.content)}</p>
        </Link>

        <div className="mt-4 flex items-center justify-between gap-3 text-xs font-semibold text-muted">
          <span>{formatDate(post.created_at)}</span>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              {commentsCount}
            </span>
            <span className="inline-flex items-center gap-1">
              <Eye className="h-4 w-4" aria-hidden="true" />
              {post.view_count}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
