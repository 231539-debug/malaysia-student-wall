import { PageHero } from "@/components/page-hero";

export default function AboutPage() {
  return (
    <div className="space-y-5">
      <PageHero
        eyebrow="About"
        title="关于马来西亚留学生墙"
        description="这是一个非官方留学生互助社区，用于信息交流、生活互助和经验分享。"
      />
      <section className="container-page">
        <div className="surface mx-auto max-w-3xl rounded-3xl p-6 text-sm leading-8 text-muted sm:p-8">
          <p>
            Malaysia Student Wall / 马来西亚留学生墙 面向全马来西亚留学生开放，不隶属于任何大学、学院、机构或官方组织。
          </p>
          <p className="mt-4">
            平台的目标是让同学们更方便地分享租房、二手、课程组队、新生求助、生活经验、活动约伴等信息。第一版采用投稿审核机制，尽量减少广告、诈骗和不友善内容。
          </p>
          <p className="mt-4">
            请在使用平台时自行核实交易和联系方式，不要公开他人隐私，也不要发布违法违规内容。
          </p>
        </div>
      </section>
    </div>
  );
}
