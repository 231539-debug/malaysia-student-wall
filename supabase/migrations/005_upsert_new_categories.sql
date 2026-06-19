insert into categories (name, slug) values
  ('租房找室友', 'rent-roommate'),
  ('二手交易', 'second-hand'),
  ('生活避坑', 'life-tips'),
  ('宽带网络', 'internet'),
  ('失物招领', 'lost-found'),
  ('课程组队', 'course-team'),
  ('选课经验', 'course-review'),
  ('新生求助', 'freshman-help'),
  ('签证与学校事务', 'visa-school-affairs'),
  ('每日拼车', 'daily-carpool'),
  ('旅行约伴', 'travel-buddy'),
  ('吃喝玩乐', 'food-and-places'),
  ('实习经验', 'internship-experience'),
  ('实习内推', 'internship-referral'),
  ('校园讨论', 'campus-discussion'),
  ('匿名树洞', 'anonymous-treehole')
on conflict (slug) do update
set name = excluded.name;

update categories
set name = '校园讨论'
where slug = 'campus-talk';

update categories
set name = '实习内推'
where slug = 'jobs-internship';

update categories
set name = '旅行约伴'
where slug = 'events';
