export type CategoryGroupKey = "practical" | "academic" | "life" | "growth";

export type CategoryMeta = {
  name: string;
  shortName: string;
  slug: string;
  description: string;
  group: CategoryGroupKey;
};

export const categoryGroupLabels: Record<CategoryGroupKey, string> = {
  practical: "实用信息",
  academic: "学业校园",
  life: "出行生活",
  growth: "发展讨论"
};

export const categoryCatalog: CategoryMeta[] = [
  { name: "租房找室友", shortName: "租房", slug: "rent-roommate", description: "租房、转租、找室友", group: "practical" },
  { name: "二手交易", shortName: "二手", slug: "second-hand", description: "教材、家具、数码闲置", group: "practical" },
  { name: "生活避坑", shortName: "避坑", slug: "life-tips", description: "生活经验和提醒", group: "practical" },
  { name: "宽带网络", shortName: "宽带", slug: "internet", description: "网络、套餐、安装", group: "practical" },
  { name: "失物招领", shortName: "失物", slug: "lost-found", description: "丢失与捡到物品", group: "practical" },

  { name: "课程组队", shortName: "课程", slug: "course-team", description: "作业、小组、section", group: "academic" },
  { name: "选课经验", shortName: "选课", slug: "course-review", description: "课程体验和建议", group: "academic" },
  { name: "新生求助", shortName: "新生", slug: "freshman-help", description: "报到、住宿、入学问题", group: "academic" },
  { name: "签证与学校事务", shortName: "签证", slug: "visa-school-affairs", description: "EMGS、签证、学校流程", group: "academic" },

  { name: "每日拼车", shortName: "拼车", slug: "daily-carpool", description: "今日出行和 AA 拼车", group: "life" },
  { name: "旅行约伴", shortName: "旅行", slug: "travel-buddy", description: "周末、假期、结伴出行", group: "life" },
  { name: "吃喝玩乐", shortName: "玩乐", slug: "food-and-places", description: "餐厅、探店、周边去处", group: "life" },

  { name: "实习经验", shortName: "经验", slug: "internship-experience", description: "面试、简历、职场体验", group: "growth" },
  { name: "实习内推", shortName: "实习", slug: "internship-referral", description: "实习机会和内推信息", group: "growth" },
  { name: "校园讨论", shortName: "讨论", slug: "campus-discussion", description: "校园生活和课程讨论", group: "growth" },
  { name: "匿名树洞", shortName: "树洞", slug: "anonymous-treehole", description: "匿名求助和留学压力", group: "growth" }
];

const legacySlugMap: Record<string, string> = {
  "campus-talk": "campus-discussion",
  "jobs-internship": "internship-referral",
  events: "travel-buddy"
};

const canonicalSlugMap = Object.entries(legacySlugMap).reduce<Record<string, string[]>>((acc, [legacy, canonical]) => {
  acc[canonical] = [...(acc[canonical] ?? []), legacy];
  return acc;
}, {});

export function normalizeCategorySlug(slug: string) {
  return legacySlugMap[slug] ?? slug;
}

export function getEquivalentCategorySlugs(slug: string) {
  const normalizedSlug = normalizeCategorySlug(slug);
  return Array.from(new Set([slug, normalizedSlug, ...(canonicalSlugMap[normalizedSlug] ?? [])]));
}

export function getCategoryMeta(slug?: string | null) {
  if (!slug) return null;
  const normalizedSlug = normalizeCategorySlug(slug);
  return categoryCatalog.find((category) => category.slug === normalizedSlug) ?? null;
}

export function getCategoryDisplayName(slug: string, name: string, variant: "short" | "full" = "short") {
  const meta = getCategoryMeta(slug);
  if (!meta) return name;
  return variant === "short" ? meta.shortName : meta.name;
}

export function groupedCategoryCatalog() {
  return (Object.keys(categoryGroupLabels) as CategoryGroupKey[]).map((group) => ({
    group,
    label: categoryGroupLabels[group],
    categories: categoryCatalog.filter((category) => category.group === group)
  }));
}
