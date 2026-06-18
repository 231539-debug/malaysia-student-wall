import { ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/page-hero";

const rules = [
  "禁止人身攻击、歧视、骚扰或恶意引战。",
  "禁止泄露他人隐私，包括姓名、电话、住址、证件、聊天记录等。",
  "禁止造谣、未经证实的指控和误导性信息。",
  "禁止诈骗信息、虚假交易、钓鱼链接和诱导转账。",
  "禁止代写、代考、买卖答案及其他违法违规内容。",
  "所有投稿和评论需要审核，通过后才会展示。"
];

export default function RulesPage() {
  return (
    <div className="space-y-5">
      <PageHero
        eyebrow="Rules"
        title="社区规则"
        description="信息墙希望保持友善、实用、干净。投稿前请先阅读以下规则。"
        actionHref="/submit"
        actionLabel="遵守规则并投稿"
      />
      <section className="container-page">
        <div className="grid gap-3 sm:grid-cols-2">
          {rules.map((rule) => (
            <div key={rule} className="surface flex items-start gap-3 rounded-3xl p-5">
              <span className="rounded-2xl bg-mint/10 p-2 text-mint">
                <ShieldCheck className="h-5 w-5" aria-hidden="true" />
              </span>
              <p className="text-sm font-semibold leading-6 text-ink">{rule}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
