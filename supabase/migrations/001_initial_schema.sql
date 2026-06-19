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
  ('University of Malaya', 'university-of-malaya', 'Kuala Lumpur', '简称 UM。马来西亚历史悠久的综合型大学，校园生活与城市资源都很丰富。'),
  ('Universiti Sains Malaysia', 'universiti-sains-malaysia', 'Penang', '简称 USM。位于槟城的重要公立大学，适合沉淀本地生活经验。'),
  ('Universiti Kebangsaan Malaysia', 'universiti-kebangsaan-malaysia', 'Selangor', '简称 UKM。位于 Bangi 的国立大学，适合分享学术、交通和本地生活互助信息。'),
  ('Universiti Putra Malaysia', 'universiti-putra-malaysia', 'Selangor', '简称 UPM。位于 Serdang 的公立研究型大学，农业、工程、商科和研究资源丰富。'),
  ('Universiti Teknologi Malaysia', 'universiti-teknologi-malaysia', 'Johor Bahru', '简称 UTM。工程与技术方向突出，柔佛生活、交通和课程信息很实用。'),
  ('International Islamic University Malaysia', 'international-islamic-university-malaysia', 'Selangor', '简称 IIUM。位于 Gombak 一带，国际学生多，校园生活和住宿信息需求稳定。'),
  ('Universiti Utara Malaysia', 'universiti-utara-malaysia', 'Kedah', '简称 UUM。位于 Sintok 的管理类强校，适合分享北马生活、交通和课程经验。'),
  ('Universiti Malaysia Sabah', 'universiti-malaysia-sabah', 'Sabah', '简称 UMS。位于 Kota Kinabalu，适合沉淀沙巴留学生活、租房和新生求助信息。'),
  ('Universiti Malaysia Sarawak', 'universiti-malaysia-sarawak', 'Sarawak', '简称 UNIMAS。砂拉越重要公立大学，适合分享古晋周边生活、交通和住宿经验。'),
  ('Universiti Sains Islam Malaysia', 'universiti-sains-islam-malaysia', 'Negeri Sembilan', '简称 USIM。位于 Nilai，适合汇总校园生活、课程和通勤相关经验。'),
  ('Universiti Pendidikan Sultan Idris', 'universiti-pendidikan-sultan-idris', 'Perak', '简称 UPSI。位于 Tanjung Malim 的教育类大学，适合分享课程与生活经验。'),
  ('Taylor''s University', 'taylors-university', 'Selangor', '湖畔校园氛围鲜明，商科、酒店管理和传媒相关信息需求较多。'),
  ('UCSI University', 'ucsi-university', 'Kuala Lumpur', '简称 UCSI。位于吉隆坡，音乐、医学、商科等方向信息需求活跃。'),
  ('Sunway University', 'sunway-university', 'Selangor', '靠近 Sunway City，生活便利，留学生社区活跃。'),
  ('INTI International University', 'inti-international-university', 'Negeri Sembilan', '简称 INTI。位于 Nilai，国际学生多，适合分享住宿、交通和课程信息。'),
  ('Multimedia University', 'multimedia-university', 'Selangor', '简称 MMU。多媒体与科技方向突出，Cyberjaya 校园适合技术社群和租房互助。'),
  ('Limkokwing University of Creative Technology', 'limkokwing-university-of-creative-technology', 'Selangor', '简称 LUCT。创意、设计和传媒方向突出，适合分享作品、课程和校园生活信息。'),
  ('MAHSA University', 'mahsa-university', 'Selangor', '简称 MAHSA。医学、健康科学和商科相关信息需求较多，适合新生互助。'),
  ('SEGi University', 'segi-university', 'Selangor', '简称 SEGi。Kota Damansara 周边生活便利，适合发布租房、二手和新生求助。'),
  ('HELP University', 'help-university', 'Kuala Lumpur', '简称 HELP。以心理学、商科和传媒等方向闻名，吉隆坡生活资源丰富。'),
  ('Universiti Tunku Abdul Rahman', 'universiti-tunku-abdul-rahman', 'Perak', '简称 UTAR。Kampar 校区学生生活集中，适合分享租房、交通和课程信息。'),
  ('Tunku Abdul Rahman University of Management and Technology', 'tunku-abdul-rahman-university-of-management-and-technology', 'Kuala Lumpur', '简称 TAR UMT。以管理、会计、科技和应用学科见长，适合课程和生活互助。'),
  ('Asia Pacific University of Technology & Innovation', 'asia-pacific-university', 'Kuala Lumpur', '简称 APU。以科技、商科和国际学生社群闻名，位于吉隆坡科技园一带。'),
  ('Management and Science University', 'management-and-science-university', 'Selangor', '简称 MSU。Shah Alam 一带的综合型私立大学，适合校园生活和课程互助。'),
  ('International Medical University', 'international-medical-university', 'Kuala Lumpur', '简称 IMU。医学与健康科学方向突出，适合课程、实习和生活经验交流。'),
  ('Universiti Tenaga Nasional', 'universiti-tenaga-nasional', 'Selangor', '简称 UNITEN。能源、工程、IT 和商科方向活跃，适合课程和租房互助。'),
  ('Universiti Teknologi PETRONAS', 'universiti-teknologi-petronas', 'Perak', '简称 UTP。工程、能源和科技方向突出，适合分享课程、住宿和实习信息。'),
  ('Malaysia University of Science and Technology', 'malaysia-university-of-science-and-technology', 'Selangor', '简称 MUST。以科技、管理和应用学科为主，适合课程与生活信息交流。'),
  ('Monash University Malaysia', 'monash-university-malaysia', 'Selangor', '澳洲名校马来西亚校区，课程节奏紧凑，国际学生比例高。'),
  ('University of Nottingham Malaysia', 'university-of-nottingham-malaysia', 'Selangor', '简称 UNM。英式校园环境，适合集中展示租房、交通和课程互助信息。'),
  ('University of Southampton Malaysia', 'university-of-southampton-malaysia', 'Johor', '英国大学马来西亚校区，适合分享工程、商科和柔佛生活信息。'),
  ('Curtin University Malaysia', 'curtin-university-malaysia', 'Sarawak', '位于 Miri 的澳洲大学校区，适合分享东马生活和课程信息。'),
  ('University of Reading Malaysia', 'university-of-reading-malaysia', 'Johor', '英国大学马来西亚校区，位于 EduCity，适合分享课程、住宿和柔佛生活信息。'),
  ('Heriot-Watt University Malaysia', 'heriot-watt-university-malaysia', 'Putrajaya', '简称 HWUM。位于 Putrajaya，适合分享住宿、通勤和英式课程经验。'),
  ('University of Wollongong Malaysia', 'university-of-wollongong-malaysia', 'Selangor', '简称 UOW Malaysia。澳洲大学马来西亚校区，适合商科、传媒和生活互助信息。'),
  ('Xiamen University Malaysia', 'xiamen-university-malaysia', 'Selangor', '简称 XMUM。位于 Sepang，华人留学生群体活跃，适合生活和课程互助。');

insert into announcements (title, content, is_active) values
  ('试运行公告', 'Malaysia Student Wall 正在 MVP 试运行。投稿会先进入审核队列，通过后展示在信息流中。', true);
