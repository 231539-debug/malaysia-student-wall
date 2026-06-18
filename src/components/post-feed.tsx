import type { Comment, Post } from "@/types/wall";
import { PostCard } from "@/components/post-card";

type PostFeedProps = {
  posts: Post[];
  comments?: Comment[];
  emptyText?: string;
};

export function PostFeed({ posts, comments = [], emptyText = "暂时还没有帖子，欢迎成为第一个投稿的人。" }: PostFeedProps) {
  if (posts.length === 0) {
    return (
      <div className="surface rounded-3xl p-8 text-center">
        <p className="font-semibold text-muted">{emptyText}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          commentsCount={comments.filter((comment) => comment.post_id === post.id).length}
        />
      ))}
    </div>
  );
}
