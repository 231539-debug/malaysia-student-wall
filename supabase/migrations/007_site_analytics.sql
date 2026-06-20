create table if not exists page_views (
  id uuid primary key default gen_random_uuid(),
  path text not null,
  referrer text,
  user_agent text,
  session_id text,
  created_at timestamptz not null default now()
);

create table if not exists online_sessions (
  session_id text primary key,
  path text,
  last_seen timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists page_views_created_at_idx on page_views(created_at desc);
create index if not exists page_views_path_created_at_idx on page_views(path, created_at desc);
create index if not exists page_views_session_created_at_idx on page_views(session_id, created_at desc);
create index if not exists online_sessions_last_seen_idx on online_sessions(last_seen desc);

alter table page_views enable row level security;
alter table online_sessions enable row level security;
