import { notFound } from "next/navigation";
import { Flag, MessageCircle, Send } from "lucide-react";
import { reportPost, submitComment } from "@/app/actions";
import { CopyLinkButton } from "@/components/copy-link-button";
import { PageHero } from "@/components/page-hero";
import { getComments, getPostById } from "@/lib/data";
import { absoluteUrl } from "@/lib/site-url";
import { formatDate } from "@/lib/utils";

type PostDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    comment?: string;
    reported?: string;
  }>;
};

export default async function PostDetailPage({ params, searchParams }: PostDetailPageProps) {
  const [resolvedParams, resolvedSearchParams] = await Promise.all([params, searchParams]);
  const post = await getPostById(resolvedParams.id);
  if (!post || post.status !== "approved") notFound();

  const comments = await getComments(post.id);
  const commentAction = submitComment.bind(null, post.id);
  const reportAction = reportPost.bind(null, post.id);
  const postUrl = absoluteUrl(`/post/${post.id}`);

  return (
    <div className="space-y-5">
      <PageHero
        eyebrow={post.category?.name ?? "Post"}
        title={post.title}
        description={`${post.school?.name ?? "全马"} · ${post.city?.name ?? "未知城市"} · ${formatDate(post.created_at)}`}
        actionHref="/submit"
        actionLabel="我也要投稿"
      />

      <section className="container-page grid gap-5 lg:grid-cols-[1fr_360px]">
        <article className="surface overflow-hidden rounded-3xl">
          {post.image_urls?.length ? (
            <div className="grid gap-2 bg-white p-3 sm:grid-cols-2">
              {post.image_urls.map((url) => (
                <img key={url} src={url} alt="" className="h-full max-h-[420px] w-full rounded-2xl object-cover" />
              ))}
            </div>
          ) : null}

          <div className="p-5 sm:p-8">
            <div className="mb-5 flex flex-wrap gap-2">
              {post.category ? <span className="chip bg-coral/10 text-coral">{post.category.name}</span> : null}
              {post.school ? <span className="chip">{post.school.name}</span> : null}
              {post.city ? <span className="chip">{post.city.name}</span> : null}
            </div>

            <div className="whitespace-pre-wrap text-base leading-8 text-ink">{post.content}</div>

            <div className="mt-8 rounded-3xl bg-slate-50 p-4">
              <p className="text-sm font-black text-ink">发布者</p>
              <p className="mt-1 text-sm leading-6 text-muted">
                {post.is_anonymous ? "匿名同学" : post.author_name || "未填写昵称"}
                {post.contact_info ? ` · 联系方式：${post.contact_info}` : ""}
              </p>
            </div>

            <div className="mt-4 rounded-3xl bg-mint/10 p-4">
              <p className="text-sm font-black text-ink">分享这条信息</p>
              <p className="mt-1 text-sm leading-6 text-muted">觉得这条信息有用？可以复制链接发给同学或群聊。</p>
              <div className="mt-3 max-w-xs">
                <CopyLinkButton label="复制帖子链接" url={postUrl} />
              </div>
            </div>
          </div>
        </article>

        <aside className="space-y-5">
          <section className="surface rounded-3xl p-5">
            <div className="mb-4 flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-sky" aria-hidden="true" />
              <h2 className="text-lg font-black tracking-normal">评论</h2>
            </div>
            {resolvedSearchParams.comment === "received" ? (
              <p className="mb-4 rounded-2xl bg-mint/10 px-4 py-3 text-sm font-semibold text-mint">
                评论已提交，审核通过后会展示。
              </p>
            ) : null}
            {resolvedSearchParams.comment === "invalid" ? (
              <p className="mb-4 rounded-2xl bg-coral/10 px-4 py-3 text-sm font-semibold text-coral">
                评论长度不符合要求，请控制在 2-800 字之间。
              </p>
            ) : null}
            <div className="space-y-3">
              {comments.length ? (
                comments.map((comment) => (
                  <div key={comment.id} className="rounded-2xl border border-black/5 bg-white p-4">
                    <p className="text-sm font-black text-ink">{comment.author_name || "匿名同学"}</p>
                    <p className="mt-1 text-sm leading-6 text-muted">{comment.content}</p>
                    <p className="mt-2 text-xs font-semibold text-muted">{formatDate(comment.created_at)}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm leading-6 text-muted">暂无已通过审核的评论。</p>
              )}
            </div>
            <form action={commentAction} className="mt-4 space-y-3">
              <input name="author_name" maxLength={40} placeholder="昵称，可匿名" className="field" />
              <textarea
                name="content"
                required
                minLength={2}
                maxLength={800}
                rows={4}
                placeholder="写下你的补充或提问，评论审核后展示"
                className="field resize-none"
              />
              <div className="hidden" aria-hidden="true">
                <label htmlFor="comment-website">Website</label>
                <input id="comment-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
              </div>
              <button className="button-primary w-full" type="submit">
                <Send className="h-4 w-4" aria-hidden="true" />
                提交评论
              </button>
            </form>
          </section>

          <section className="surface rounded-3xl p-5">
            <div className="mb-3 flex items-center gap-2">
              <Flag className="h-5 w-5 text-coral" aria-hidden="true" />
              <h2 className="text-lg font-black tracking-normal">举报</h2>
            </div>
            {resolvedSearchParams.reported === "1" ? (
              <p className="mb-4 rounded-2xl bg-coral/10 px-4 py-3 text-sm font-semibold text-coral">
                举报已收到，管理员会处理。
              </p>
            ) : null}
            <form action={reportAction} className="space-y-3">
              <textarea name="reason" required rows={3} placeholder="请说明举报原因" className="field resize-none" />
              <button className="button-soft w-full" type="submit">
                提交举报
              </button>
            </form>
          </section>
        </aside>
      </section>
    </div>
  );
}
