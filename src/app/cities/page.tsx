import { DirectoryGrid } from "@/components/directory-grid";
import { PageHero } from "@/components/page-hero";
import { getCities } from "@/lib/data";

export default async function CitiesPage() {
  const cities = await getCities();

  return (
    <div className="space-y-5">
      <PageHero
        eyebrow="Cities"
        title="城市列表"
        description="按城市查看生活信息、租房动态、活动约伴和本地避坑经验。"
        actionHref="/submit"
        actionLabel="发布城市信息"
      />
      <section className="container-page">
        <DirectoryGrid
          basePath="/city"
          items={cities.map((city) => ({
            id: city.id,
            name: city.name,
            slug: city.slug,
            description: `${city.name} 留学生信息墙，适合发布本地生活、租房、交通和活动信息。`,
            meta: "城市墙"
          }))}
        />
      </section>
    </div>
  );
}
