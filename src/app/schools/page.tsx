import { DirectoryGrid } from "@/components/directory-grid";
import { PageHero } from "@/components/page-hero";
import { getSchools } from "@/lib/data";

export default async function SchoolsPage() {
  const schools = await getSchools();

  return (
    <div className="space-y-5">
      <PageHero
        eyebrow="Schools"
        title="学校列表"
        description="从学校进入对应信息墙，更快找到同校租房、课程、二手和生活互助信息。"
        actionHref="/submit"
        actionLabel="发布学校信息"
      />
      <section className="container-page">
        <DirectoryGrid
          basePath="/school"
          items={schools.map((school) => ({
            id: school.id,
            name: school.name,
            slug: school.slug,
            description: school.description,
            meta: school.city
          }))}
        />
      </section>
    </div>
  );
}
