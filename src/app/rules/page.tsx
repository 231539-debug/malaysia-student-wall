import { AlertTriangle, Flag, LockKeyhole, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/page-hero";

const bannedItems = [
  "诈骗、赌博、色情、违法内容",
  "代写、代考、买卖答案",
  "人身攻击、挂人、人肉搜索",
  "他人隐私、证件、银行卡、聊天记录等敏感信息",
  "未经确认的造谣和恶意指控",
  "明显虚假房源图、盗图、AI 假图冒充真实照片"
];

const sections = [
  {
    title: "平台定位",
    icon: ShieldCheck,
    body: "Malaysia Student Wall 是一个面向马来西亚留学生的信息互助平台，不是任何学校的官方平台。"
  },
  {
    title: "投稿审核",
    icon: LockKeyhole,
    body: "所有投稿默认进入审核，审核通过后才会公开展示。评论同样需要审核后显示。"
  },
  {
    title: "联系方式说明",
    icon: AlertTriangle,
    body: "投稿中填写的联系方式会公开展示。匿名只隐藏昵称，不隐藏联系方式。请谨慎填写。"
  },
  {
    title: "风险提醒",
    icon: AlertTriangle,
    body: "租房、二手交易、兼职、宽带办理等信息请自行核实，平台不参与交易，也不替任何交易做担保。"
  },
  {
    title: "举报机制",
    icon: Flag,
    body: "如果发现可疑内容，可以通过帖子详情页举报。被多次举报的内容可能会被自动隐藏并重新审核。"
  }
];

export default function RulesPage() {
  return (
    <div className="space-y-5">
      <PageHero
        eyebrow="Rules"
        title="平台规则"
        description="这里是试运行中的留学生信息墙，规则的目标是让信息更干净、更安全、更容易长期查找。"
        actionHref="/submit"
        actionLabel="遵守规则并投稿"
      />

      <section className="container-page space-y-4">
        <div className="surface rounded-3xl p-5 sm:p-6">
          <h2 className="text-xl font-black tracking-normal text-ink">禁止内容</h2>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {bannedItems.map((item) => (
              <div key={item} className="rounded-2xl bg-coral/10 px-4 py-3 text-sm font-semibold leading-6 text-coral">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <div key={section.title} className="surface rounded-3xl p-5">
                <div className="mb-3 flex items-center gap-3">
                  <span className="rounded-2xl bg-mint/10 p-2 text-mint">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h2 className="text-lg font-black tracking-normal text-ink">{section.title}</h2>
                </div>
                <p className="text-sm font-semibold leading-7 text-muted">{section.body}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
