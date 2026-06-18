create extension if not exists "pgcrypto";

create type moderation_status as enum ('pending', 'approved', 'rejected');

create table schools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  city text,
  logo_url text,
  description text,
  created_at timestamptz not null default now()
);

create table cities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  category_id uuid references categories(id) on delete set null,
  school_id uuid references schools(id) on delete set null,
  city_id uuid references cities(id) on delete set null,
  author_name text,
  contact_info text,
  is_anonymous boolean not null default false,
  status moderation_status not null default 'pending',
  is_pinned boolean not null default false,
  view_count integer not null default 0,
  image_urls text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id) on delete cascade,
  author_name text,
  content text not null,
  status moderation_status not null default 'pending',
  created_at timestamptz not null default now()
);

create table announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table reports (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id) on delete cascade,
  reason text not null,
  created_at timestamptz not null default now()
);

create index posts_status_created_at_idx on posts(status, created_at desc);
create index posts_category_id_idx on posts(category_id);
create index posts_school_id_idx on posts(school_id);
create index posts_city_id_idx on posts(city_id);
create index comments_post_id_status_idx on comments(post_id, status);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger posts_set_updated_at
before update on posts
for each row
execute function set_updated_at();

alter table schools enable row level security;
alter table cities enable row level security;
alter table categories enable row level security;
alter table posts enable row level security;
alter table comments enable row level security;
alter table announcements enable row level security;
alter table reports enable row level security;

create policy "Public can read schools" on schools for select using (true);
create policy "Public can read cities" on cities for select using (true);
create policy "Public can read categories" on categories for select using (true);
create policy "Public can read approved posts" on posts for select using (status = 'approved');
create policy "Public can read approved comments" on comments for select using (status = 'approved');
create policy "Public can read active announcements" on announcements for select using (is_active = true);

insert into cities (name, slug) values
  ('Kuala Lumpur', 'kuala-lumpur'),
  ('Selangor', 'selangor'),
  ('Penang', 'penang'),
  ('Johor Bahru', 'johor-bahru'),
  ('Melaka', 'melaka'),
  ('Ipoh', 'ipoh'),
  ('Sabah', 'sabah'),
  ('Sarawak', 'sarawak');

insert into categories (name, slug) values
  ('租房找室友', 'rent-roommate'),
  ('二手交易', 'second-hand'),
  ('课程组队', 'course-team'),
  ('新生求助', 'freshman-help'),
  ('生活避坑', 'life-tips'),
  ('活动约伴', 'events'),
  ('校园吐槽', 'campus-talk'),
  ('宽带网络', 'internet'),
  ('兼职实习', 'jobs-internship'),
  ('失物招领', 'lost-found');

insert into schools (name, slug, city, description) values
  ('University of Malaya', 'university-of-malaya', 'Kuala Lumpur', '马来西亚历史悠久的综合型大学，校园生活与城市资源都很丰富。'),
  ('Asia Pacific University', 'asia-pacific-university', 'Kuala Lumpur', '以科技、商科和国际学生社群闻名，位于吉隆坡科技园一带。'),
  ('Sunway University', 'sunway-university', 'Selangor', '靠近 Sunway City，生活便利，留学生社区活跃。'),
  ('Monash University Malaysia', 'monash-university-malaysia', 'Selangor', '澳洲名校马来西亚校区，课程节奏紧凑，国际学生比例高。'),
  ('Taylor''s University', 'taylors-university', 'Selangor', '湖畔校园氛围鲜明，商科、酒店管理和传媒相关信息需求较多。'),
  ('University of Nottingham Malaysia', 'university-of-nottingham-malaysia', 'Selangor', '英式校园环境，适合集中展示租房、交通和课程互助信息。'),
  ('Universiti Sains Malaysia', 'universiti-sains-malaysia', 'Penang', '位于槟城的重要公立大学，适合沉淀本地生活经验。'),
  ('Universiti Teknologi Malaysia', 'universiti-teknologi-malaysia', 'Johor Bahru', '工程与技术方向突出，柔佛生活、交通和课程信息很实用。');

insert into announcements (title, content, is_active) values
  ('试运行公告', 'Malaysia Student Wall 正在 MVP 试运行。投稿会先进入审核队列，通过后展示在信息流中。', true);
