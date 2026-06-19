import { AlertTriangle, CheckCircle2, Send } from "lucide-react";
import { submitPost } from "@/app/actions";
import { PageHero } from "@/components/page-hero";
import { getCategories, getCities, getSchools } from "@/lib/data";

type SubmitPageProps = {
  searchParams: Promise<{
    submitted?: string;
    error?: string;
  }>;
};

const beforeSubmitRules = ["不发布隐私曝光", "不发布人身攻击", "不发布诈骗、代写、违法内容", "联系方式填写后会公开展示"];

const categoryTips = [
  {
    title: "租房找室友",
    text: "建议写清地区、预算、入住时间、房型、押金和是否可看房。"
  },
  {
    title: "二手交易",
    text: "建议写清价格、物品状态、取货方式、是否可议价和实物照片链接。"
  },
  {
    title: "课程组队",
    text: "建议写清课程名、section、小组要求、ddl 和希望的沟通方式。"
  },
  {
    title: "新生求助",
    text: "建议写清学校、入学时间、目前卡住的问题，以及已经尝试过的方法。"
  }
];

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
        <div className="mx-auto grid max-w-5xl gap-5 lg:grid-cols-[0.85fr_1.15fr]">
          <aside className="space-y-4">
            <div className="surface rounded-3xl p-5">
              <div className="mb-4 flex items-center gap-3">
                <span className="rounded-2xl bg-coral/10 p-3 text-coral">
                  <AlertTriangle className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-muted">Before Submit</p>
                  <h2 className="text-xl font-black tracking-normal text-ink">投稿前请确认</h2>
                </div>
              </div>
              <div className="grid gap-2">
                {beforeSubmitRules.map((rule) => (
                  <div key={rule} className="flex items-start gap-2 rounded-2xl bg-white px-3 py-3 text-sm font-semibold leading-5 text-muted">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-mint" aria-hidden="true" />
                    <span>{rule}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="surface rounded-3xl p-5">
              <h2 className="text-lg font-black tracking-normal text-ink">分类填写提示</h2>
              <div className="mt-3 grid gap-3">
                {categoryTips.map((tip) => (
                  <div key={tip.title} className="rounded-2xl border border-black/5 bg-white p-3">
                    <p className="text-sm font-black text-ink">{tip.title}</p>
                    <p className="mt-1 text-xs font-semibold leading-5 text-muted">{tip.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <div className="surface rounded-3xl p-5 sm:p-8">
            {resolvedSearchParams.submitted === "1" ? (
              <div className="mb-5 rounded-3xl bg-mint/10 p-4 text-sm font-semibold leading-6 text-mint">
                投稿已提交，通常会在 12–24 小时内审核。请不要重复提交同一内容。
              </div>
            ) : null}
            {resolvedSearchParams.error ? (
              <div className="mb-5 rounded-3xl bg-coral/10 p-4 text-sm font-semibold leading-6 text-coral">
                {resolvedSearchParams.error === "image"
                  ? "图片上传失败，请确认最多 4 张、每张不超过 5MB，且格式为 JPG、PNG 或 WebP。"
                  : "提交失败，请检查标题和内容长度后重试。"}
              </div>
            ) : null}

            <form action={submitPost} encType="multipart/form-data" className="grid gap-4">
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
                  placeholder="例如：Monash 附近找室友，7 月可入住"
                  className="field"
                />
                <p className="text-xs font-semibold text-muted">4-80 个字，建议把学校、地区或需求写进标题。</p>
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
                  placeholder="请写清楚时间、地点、预算、联系方式、交易方式或具体问题。内容越具体，审核和匹配越顺。"
                  className="field resize-none"
                />
                <p className="text-xs font-semibold text-muted">10-4000 个字。请避免泄露他人隐私或发布未经确认的信息。</p>
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
                  <input id="author_name" name="author_name" maxLength={40} placeholder="可不填，例如 Nina / 匿名同学" className="field" />
                </div>
                <div className="grid gap-2">
                  <label className="label" htmlFor="contact_info">
                    联系方式
                  </label>
                  <input
                    id="contact_info"
                    name="contact_info"
                    maxLength={160}
                    placeholder="微信、Telegram、邮箱等，填写后会公开展示"
                    className="field"
                  />
                  <p className="text-xs font-semibold leading-5 text-coral">
                    填写后会公开展示。匿名只隐藏昵称，不隐藏联系方式。
                  </p>
                </div>
              </div>

              <div className="grid gap-2">
                <label className="label" htmlFor="images">
                  上传图片
                </label>
                <input
                  id="images"
                  name="images"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  className="field cursor-pointer bg-white file:mr-4 file:rounded-full file:border-0 file:bg-ink file:px-4 file:py-2 file:text-sm file:font-black file:text-white"
                />
                <p className="text-xs font-semibold leading-5 text-muted">
                  可选，最多 4 张，每张不超过 5MB。建议上传真实照片，不要上传 AI 假图、盗图、他人隐私照片、证件或银行卡照片。
                </p>
                <p className="text-xs font-semibold leading-5 text-coral">
                  请勿上传他人隐私、证件、银行卡、聊天记录敏感信息或明显 AI 生成图片。
                </p>
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
        </div>
      </section>
    </div>
  );
}
