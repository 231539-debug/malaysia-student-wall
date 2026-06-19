import Link from "next/link";

export default function OfflinePage() {
  return (
    <section className="container-page">
      <div className="surface mx-auto mt-10 max-w-lg rounded-3xl p-6 text-center sm:p-8">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-muted">Offline</p>
        <h1 className="mt-2 text-2xl font-black tracking-normal text-ink">当前网络不可用</h1>
        <p className="mt-3 text-sm font-semibold leading-6 text-muted">
          请稍后重试。已经添加到主屏幕的同学，也需要联网后才能查看最新帖子和提交内容。
        </p>
        <Link href="/" className="button-primary mt-5">
          返回首页
        </Link>
      </div>
    </section>
  );
}
