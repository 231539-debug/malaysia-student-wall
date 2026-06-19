alter table posts
  add column if not exists risk_level text not null default 'low',
  add column if not exists moderation_note text,
  add column if not exists report_count integer not null default 0;

alter table comments
  add column if not exists risk_level text not null default 'low',
  add column if not exists moderation_note text;

update posts
set risk_level = 'low'
where risk_level is null;

update posts
set report_count = 0
where report_count is null;

update comments
set risk_level = 'low'
where risk_level is null;
