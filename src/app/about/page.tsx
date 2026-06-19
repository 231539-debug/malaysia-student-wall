import { PageHero } from "@/components/page-hero";

export default function AboutPage() {
  return (
    <div className="space-y-5">
      <PageHero
        eyebrow="About"
        title="关于马来西亚留学生墙"
        description="这是一个试运行中的非官方留学生信息墙，希望把群聊里容易沉底的实用信息慢慢沉淀下来。"
      />
      <section className="container-page">
        <div className="surface mx-auto max-w-3xl rounded-3xl p-6 text-sm leading-8 text-muted sm:p-8">
          <p>
            Malaysia Student Wall / 马来西亚留学生墙 面向全马来西亚留学生开放，不隶属于任何大学、学院、机构或官方组织。
          </p>
          <p className="mt-4">
            这个项目还在试运行阶段，目标是把分散在群聊里的租房、二手、课程组队、新生求助和生活避坑信息沉淀下来，让后来搜索的人也能看到。
          </p>
          <p className="mt-4">
            第一版采用游客投稿和人工审核机制，所有内容审核后展示。平台会尽量减少广告、诈骗和不友善内容，但同学们仍需要自行核实交易、房源和联系方式。
          </p>
          <p className="mt-4">
            欢迎大家用真实、具体、对后来者有帮助的方式共建这个信息墙。请不要公开他人隐私，也不要发布违法违规内容。
          </p>
        </div>
      </section>
    </div>
  );
}
