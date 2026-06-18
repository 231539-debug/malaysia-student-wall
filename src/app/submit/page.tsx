import { Send } from "lucide-react";
import { submitPost } from "@/app/actions";
import { PageHero } from "@/components/page-hero";
import { getCategories, getCities, getSchools } from "@/lib/data";

type SubmitPageProps = {
  searchParams: Promise<{
    submitted?: string;
    error?: string;
  }>;
};

export default async function SubmitPage({ searchParams }: SubmitPageProps) {
  const resolvedSearchParams = await searchParams;
  const [categories, schools, cities] = await Promise.all([getCategories(), getSchools(), getCities()]);

  return (
    <div className="space-y-5">
      <PageHero
        eyebrow="Submit"
        title="提交投稿"
        description="游客可直接投稿。内容默认进入 pending 状态，管理员审核通过后才会出现在信息墙。"
      />
      <section className="container-page">
        <div className="surface mx-auto max-w-3xl rounded-3xl p-5 sm:p-8">
          {resolvedSearchParams.submitted === "1" ? (
            <div className="mb-5 rounded-3xl bg-mint/10 p-4 text-sm font-semibold leading-6 text-mint">
              投稿已提交，审核通过后会展示。
            </div>
          ) : null}
          {resolvedSearchParams.error ? (
            <div className="mb-5 rounded-3xl bg-coral/10 p-4 text-sm font-semibold leading-6 text-coral">
              提交失败，请检查标题和内容长度后重试。
            </div>
          ) : null}

          <form action={submitPost} className="grid gap-4">
            <div className="grid gap-2">
              <label className="label" htmlFor="title">
                标题
              </label>
              <input
                id="title"
                name="title"
                required
                minLength={4}
                maxLength={80}
                placeholder="例如：Monash 附近找室友"
                className="field"
              />
            </div>

            <div className="grid gap-2">
              <label className="label" htmlFor="content">
                内容
              </label>
              <textarea
                id="content"
                name="content"
                required
                minLength={10}
                maxLength={4000}
                rows={8}
                placeholder="请写清楚时间、地点、预算、联系方式等关键信息"
                className="field resize-none"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="grid gap-2">
                <label className="label" htmlFor="category_id">
                  分类
                </label>
                <select id="category_id" name="category_id" className="field" required>
                  <option value="">选择分类</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <label className="label" htmlFor="school_id">
                  学校
                </label>
                <select id="school_id" name="school_id" className="field">
                  <option value="">不限学校</option>
                  {schools.map((school) => (
                    <option key={school.id} value={school.id}>
                      {school.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <label className="label" htmlFor="city_id">
                  城市
                </label>
                <select id="city_id" name="city_id" className="field">
                  <option value="">不限城市</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <label className="label" htmlFor="author_name">
                  昵称
                </label>
                <input id="author_name" name="author_name" maxLength={40} placeholder="可不填" className="field" />
              </div>
              <div className="grid gap-2">
                <label className="label" htmlFor="contact_info">
                  联系方式
                </label>
                <input
                  id="contact_info"
                  name="contact_info"
                  maxLength={160}
                  placeholder="微信、Telegram、邮箱等"
                  className="field"
                />
                <p className="text-xs font-semibold leading-5 text-coral">
                  填写后会公开展示。匿名只隐藏昵称，不隐藏联系方式。
                </p>
              </div>
            </div>

            <div className="grid gap-2">
              <label className="label" htmlFor="image_urls">
                图片链接
              </label>
              <textarea
                id="image_urls"
                name="image_urls"
                rows={3}
                placeholder="可选。一行一个图片 URL，后续可扩展 Supabase Storage 上传。"
                className="field resize-none"
              />
            </div>

            <div className="hidden" aria-hidden="true">
              <label htmlFor="website">Website</label>
              <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
            </div>

            <label className="flex items-center gap-3 rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-muted">
              <input name="is_anonymous" type="checkbox" className="h-5 w-5 accent-ink" />
              匿名展示昵称
            </label>

            <button type="submit" className="button-primary">
              <Send className="h-4 w-4" aria-hidden="true" />
              提交审核
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
