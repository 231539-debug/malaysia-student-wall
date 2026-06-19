import { Search, SlidersHorizontal } from "lucide-react";
import { getSchoolDisplayName } from "@/lib/school-metadata";
import type { Category, City, School } from "@/types/wall";

type FilterBarProps = {
  categories: Category[];
  schools: School[];
  cities: City[];
  selected?: {
    q?: string;
    category?: string;
    school?: string;
    city?: string;
  };
};

export function FilterBar({ categories, schools, cities, selected }: FilterBarProps) {
  const sortedSchools = [...schools].sort((a, b) => {
    const aLabel = getSchoolDisplayName(a.slug, a.name);
    const bLabel = getSchoolDisplayName(b.slug, b.name);
    return aLabel.localeCompare(bLabel, "en");
  });

  return (
    <section className="container-page">
      <form action="/" className="surface grid gap-3 rounded-3xl p-4 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr_auto]">
        <label className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input name="q" defaultValue={selected?.q} placeholder="搜索关键词" className="field pl-10" />
        </label>

        <select name="category" defaultValue={selected?.category ?? ""} className="field" aria-label="分类筛选">
          <option value="">全部分类</option>
          {categories.map((category) => (
            <option key={category.id} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>

        <select name="school" defaultValue={selected?.school ?? ""} className="field" aria-label="学校筛选">
          <option value="">全部学校</option>
          {sortedSchools.map((school) => (
            <option key={school.id} value={school.slug}>
              {getSchoolDisplayName(school.slug, school.name)}
            </option>
          ))}
        </select>

        <select name="city" defaultValue={selected?.city ?? ""} className="field" aria-label="城市筛选">
          <option value="">全部城市</option>
          {cities.map((city) => (
            <option key={city.id} value={city.slug}>
              {city.name}
            </option>
          ))}
        </select>

        <button className="button-primary" type="submit">
          <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
          筛选
        </button>
      </form>
    </section>
  );
}
