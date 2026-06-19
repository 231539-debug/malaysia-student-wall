import { schoolCatalog } from "@/lib/school-metadata";
import type { Announcement, Category, City, Comment, Post, School } from "@/types/wall";

const now = new Date();

function daysAgo(days: number) {
  const date = new Date(now);
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

export const mockCities: City[] = [
  { id: "city-kl", name: "Kuala Lumpur", slug: "kuala-lumpur", created_at: daysAgo(30) },
  { id: "city-selangor", name: "Selangor", slug: "selangor", created_at: daysAgo(30) },
  { id: "city-penang", name: "Penang", slug: "penang", created_at: daysAgo(30) },
  { id: "city-johor", name: "Johor Bahru", slug: "johor-bahru", created_at: daysAgo(30) },
  { id: "city-melaka", name: "Melaka", slug: "melaka", created_at: daysAgo(30) },
  { id: "city-ipoh", name: "Ipoh", slug: "ipoh", created_at: daysAgo(30) },
  { id: "city-sabah", name: "Sabah", slug: "sabah", created_at: daysAgo(30) },
  { id: "city-sarawak", name: "Sarawak", slug: "sarawak", created_at: daysAgo(30) }
];

export const mockCategories: Category[] = [
  { id: "cat-rent", name: "租房找室友", slug: "rent-roommate", created_at: daysAgo(30) },
  { id: "cat-trade", name: "二手交易", slug: "second-hand", created_at: daysAgo(30) },
  { id: "cat-course", name: "课程组队", slug: "course-team", created_at: daysAgo(30) },
  { id: "cat-freshman", name: "新生求助", slug: "freshman-help", created_at: daysAgo(30) },
  { id: "cat-tips", name: "生活避坑", slug: "life-tips", created_at: daysAgo(30) },
  { id: "cat-event", name: "活动约伴", slug: "events", created_at: daysAgo(30) },
  { id: "cat-chat", name: "校园吐槽", slug: "campus-talk", created_at: daysAgo(30) },
  { id: "cat-network", name: "宽带网络", slug: "internet", created_at: daysAgo(30) },
  { id: "cat-job", name: "兼职实习", slug: "jobs-internship", created_at: daysAgo(30) },
  { id: "cat-lost", name: "失物招领", slug: "lost-found", created_at: daysAgo(30) }
];

export const mockSchools: School[] = schoolCatalog.map((school) => ({
  id: `school-${school.slug}`,
  name: school.name,
  slug: school.slug,
  city: school.city,
  logo_url: null,
  description: school.description,
  created_at: daysAgo(30)
}));

function schoolBySlug(slug: string) {
  const school = mockSchools.find((item) => item.slug === slug);
  if (!school) throw new Error(`Missing mock school: ${slug}`);
  return school;
}

export const mockAnnouncements: Announcement[] = [
  {
    id: "ann-1",
    title: "试运行公告",
    content: "Malaysia Student Wall 正在 MVP 试运行。投稿会先进入审核队列，通过后展示在信息流中。",
    is_active: true,
    created_at: daysAgo(1)
  }
];

export const mockPosts: Post[] = [
  {
    id: "post-1",
    title: "Sunway 附近找女生室友，7 月可入住",
    content:
      "房子在 BRT 附近，步行到学校大约 12 分钟。主卧已有一位女生，想找作息稳定、爱干净的室友一起续租。水电网平摊，可以看房。",
    category_id: "cat-rent",
    school_id: "school-sunway-university",
    city_id: "city-selangor",
    author_name: "Lina",
    contact_info: "WeChat: example",
    is_anonymous: false,
    status: "approved",
    is_pinned: true,
    view_count: 268,
    image_urls: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80"
    ],
    created_at: daysAgo(0),
    updated_at: daysAgo(0),
    category: mockCategories[0],
    school: schoolBySlug("sunway-university"),
    city: mockCities[1]
  },
  {
    id: "post-2",
    title: "APU 数据库课程组队，找两位认真队友",
    content:
      "我们已经有两个人，想找熟悉 SQL 或愿意一起推进项目的同学。目标是每周固定开一次会，提前把 milestone 做完。",
    category_id: "cat-course",
    school_id: "school-asia-pacific-university",
    city_id: "city-kl",
    author_name: null,
    contact_info: null,
    is_anonymous: true,
    status: "approved",
    is_pinned: false,
    view_count: 143,
    image_urls: null,
    created_at: daysAgo(1),
    updated_at: daysAgo(1),
    category: mockCategories[2],
    school: schoolBySlug("asia-pacific-university"),
    city: mockCities[0]
  },
  {
    id: "post-3",
    title: "USM 新生开银行卡和电话卡经验",
    content:
      "刚到 USM 的同学可以先准备护照、offer letter、住址证明。电话卡建议对比校园附近几个套餐，别急着买长期合约。",
    category_id: "cat-freshman",
    school_id: "school-universiti-sains-malaysia",
    city_id: "city-penang",
    author_name: "阿远",
    contact_info: null,
    is_anonymous: false,
    status: "approved",
    is_pinned: false,
    view_count: 91,
    image_urls: null,
    created_at: daysAgo(2),
    updated_at: daysAgo(2),
    category: mockCategories[3],
    school: schoolBySlug("universiti-sains-malaysia"),
    city: mockCities[2]
  },
  {
    id: "post-4",
    title: "二手显示器出，KL 可自取",
    content:
      "24 寸 1080p 显示器，适合宿舍外接电脑用。使用一年多，屏幕没有坏点，盒子还在。可在 KL Sentral 或学校附近面交。",
    category_id: "cat-trade",
    school_id: "school-university-of-malaya",
    city_id: "city-kl",
    author_name: "M",
    contact_info: "Telegram: example",
    is_anonymous: false,
    status: "approved",
    is_pinned: false,
    view_count: 205,
    image_urls: [
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=80"
    ],
    created_at: daysAgo(3),
    updated_at: daysAgo(3),
    category: mockCategories[1],
    school: schoolBySlug("university-of-malaya"),
    city: mockCities[0]
  },
  {
    id: "post-5",
    title: "UTM 周末拼车去新山吃饭",
    content:
      "UTM 附近出发，周六下午想去 Johor Bahru 市区逛一下。已有两人，想找同校同学一起 AA 车费。",
    category_id: "cat-event",
    school_id: "school-universiti-teknologi-malaysia",
    city_id: "city-johor",
    author_name: "匿名同学",
    contact_info: null,
    is_anonymous: true,
    status: "approved",
    is_pinned: false,
    view_count: 74,
    image_urls: null,
    created_at: daysAgo(4),
    updated_at: daysAgo(4),
    category: mockCategories[5],
    school: schoolBySlug("universiti-teknologi-malaysia"),
    city: mockCities[3]
  }
];

export const mockComments: Comment[] = [
  {
    id: "comment-1",
    post_id: "post-1",
    author_name: "小陈",
    content: "请问房间有独立卫浴吗？",
    status: "approved",
    created_at: daysAgo(0)
  },
  {
    id: "comment-2",
    post_id: "post-3",
    author_name: "Freshman",
    content: "这个很有用，感谢分享。",
    status: "approved",
    created_at: daysAgo(1)
  },
  {
    id: "comment-3",
    post_id: "post-2",
    author_name: "Admin test",
    content: "这条是待审核评论示例。",
    status: "pending",
    created_at: daysAgo(0)
  }
];
