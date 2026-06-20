insert into categories (name, slug) values
  ('校园讨论', 'campus-discussion'),
  ('匿名树洞', 'anonymous-treehole'),
  ('课程吐槽', 'course-rant'),
  ('生活闲聊', 'life-chat')
on conflict (slug) do update
set name = excluded.name;

with seed_topics (title, content, category_slug, author_name, age) as (
  values
    (
      '留学生群聊信息太容易被刷没，大家有没有同感？',
      '很多有用信息在群里出现一下就被刷走了，后来想找租房经验、课程提醒或者生活攻略都很难翻。大家平时会怎么保存重要信息？有没有什么内容是你希望能沉淀到信息墙里的？',
      'campus-discussion',
      '茶水间话题',
      interval '22 hours'
    ),
    (
      '有没有人也觉得 group assignment 最难的不是作业，是找正常队友？',
      '每次小组作业最累的好像不是题目本身，而是沟通节奏。有的人回得很慢，有的人一直说 ok 但不知道进度。大家一般会怎么找队友？会不会一开始就把分工和 ddl 说清楚？',
      'course-rant',
      '同学们聊聊',
      interval '1 day 6 hours'
    ),
    (
      '在马来西亚租房，最让人头大的通常是什么？只聊现象不点名。',
      '租房这件事真的很看细节，交通、网络、室友习惯、维修速度都会影响体验。大家遇到过哪些让人头大的情况？可以只聊现象和避坑建议，不涉及具体个人或具体房号。',
      'campus-discussion',
      '匿名话题',
      interval '1 day 18 hours'
    ),
    (
      '刚来马来西亚那段时间，你最不适应的是什么？',
      '刚落地的时候，天气、语言、交通、饮食和办事流程都可能需要适应。有没有哪个瞬间让你觉得“原来留学生活和想象不太一样”？后来你是怎么慢慢习惯的？',
      'anonymous-treehole',
      '匿名话题',
      interval '2 days 4 hours'
    ),
    (
      '大家觉得哪个区域吃饭最方便？',
      '有些地方外卖选择多，有些地方走几步就有 mamak、咖啡店或商场。大家可以聊聊自己觉得生活便利的区域，也可以分享适合新生的吃饭小经验。',
      'life-chat',
      '同学们聊聊',
      interval '2 days 15 hours'
    ),
    (
      '留学生一个人住久了，会不会越来越宅？',
      '有时候下课回家就不太想出门，周末也可能只想补觉或者刷剧。大家会不会也有这种状态？你们平时会怎么让自己保持一点社交和生活节奏？',
      'anonymous-treehole',
      '茶水间话题',
      interval '3 days 3 hours'
    ),
    (
      '大家觉得马来西亚留学最真实的优点和缺点是什么？',
      '每个人感受都不一样，有人喜欢生活节奏，有人觉得办事流程需要耐心。只聊自己的体验，不上升到攻击。你觉得这里最加分和最需要适应的地方分别是什么？',
      'campus-discussion',
      '同学们聊聊',
      interval '3 days 16 hours'
    ),
    (
      '有没有人也觉得找靠谱队友比写 assignment 还难？',
      '选题、查资料、做 slides 都能慢慢推进，但如果小组沟通不顺，整个过程会特别消耗。大家有什么找队友或提前沟通规则的小技巧吗？',
      'course-rant',
      '匿名话题',
      interval '4 days 2 hours'
    ),
    (
      '新生最容易忽略的生活小坑有哪些？',
      '刚来时很多事情没人提醒就容易踩坑，比如电话卡、交通、住宿用品、看病、收快递这些小事。老同学们有没有什么想提醒新生提前准备的？',
      'campus-discussion',
      '茶水间话题',
      interval '4 days 13 hours'
    ),
    (
      '在马来西亚最离谱的一次 Grab 或拼车体验是什么？',
      '出门交通有时候很顺，有时候也会遇到路线绕、等待久、临时改计划之类的情况。大家可以分享自己的出行趣事或小经验，不涉及司机或乘客的个人信息。',
      'life-chat',
      '同学们聊聊',
      interval '5 days 1 hour'
    ),
    (
      '你会不会经常想回国，但又觉得国外生活也挺自由？',
      '留学生活有时候很矛盾，一边想念熟悉的环境，一边又觉得自己在慢慢变独立。大家有没有这种拉扯感？通常是什么时候最明显？',
      'anonymous-treehole',
      '匿名话题',
      interval '5 days 12 hours'
    ),
    (
      '有没有什么课上完后，很想提醒学弟学妹谨慎选择？',
      '可以聊课程节奏、作业量、考试形式或学习建议，也不要把课堂体验变成针对个人的攻击或定论。大家选课前最想知道哪些真实信息？',
      'course-rant',
      '同学们聊聊',
      interval '6 days 4 hours'
    ),
    (
      '留学生之间最容易产生误会的事情是什么？',
      '大家来自不同背景，沟通习惯、时间观念和生活边界可能都不一样。有没有哪些误会其实早点说清楚就能避免？你觉得室友或队友之间最该提前讲明白什么？',
      'life-chat',
      '茶水间话题',
      interval '6 days 17 hours'
    ),
    (
      '大家平时都是怎么认识新朋友的？',
      '有的人靠社团，有的人靠同班同学，也有人是在租房、运动或活动里慢慢熟起来。你觉得在马来西亚留学，认识新朋友最自然的方式是什么？',
      'life-chat',
      '同学们聊聊',
      interval '7 days 5 hours'
    ),
    (
      '有没有人觉得二手群和租房群信息太乱了？',
      '有时候想找一个东西或者一条租房信息，要在好几个群里来回翻。大家希望信息墙怎么整理这些内容？按学校、城市、分类，还是加更多筛选？',
      'campus-discussion',
      '茶水间话题',
      interval '7 days 19 hours'
    ),
    (
      '马来西亚生活久了之后，你最习惯和最不习惯的地方是什么？',
      '生活久了会慢慢形成自己的节奏，比如出门方式、吃饭习惯、办事耐心和周末安排。大家现在最适应的是什么？还有什么到现在都觉得需要磨合？',
      'life-chat',
      '匿名话题',
      interval '8 days 8 hours'
    ),
    (
      '你觉得留学生最需要一个什么样的信息平台？',
      '现在很多信息分散在群聊、朋友圈和私聊里，找起来不太方便。如果做一个给全马留学生用的信息墙，你最希望它解决什么问题？租房、二手、课程、拼车还是茶水间讨论？',
      'campus-discussion',
      '茶水间话题',
      interval '8 days 21 hours'
    ),
    (
      '茶水间第一帖：大家最近都在忙什么？',
      '这里可以随便聊聊最近的学习、生活、找房、赶 ddl、适应新环境，或者单纯说一句今天过得怎么样。希望这个茶水间能变成大家轻松交流的地方。你最近在忙什么？',
      'life-chat',
      '同学们聊聊',
      interval '9 days 10 hours'
    )
)
insert into posts (
  title,
  content,
  category_id,
  school_id,
  city_id,
  author_name,
  contact_info,
  is_anonymous,
  status,
  risk_level,
  moderation_note,
  report_count,
  is_pinned,
  view_count,
  image_urls,
  created_at,
  updated_at
)
select
  seed.title,
  seed.content,
  categories.id,
  null,
  null,
  seed.author_name,
  null,
  true,
  'approved'::moderation_status,
  'low',
  '茶水间冷启动安全话题。',
  0,
  false,
  0,
  null::text[],
  now() - seed.age,
  now() - seed.age
from seed_topics seed
join categories on categories.slug = seed.category_slug
where not exists (
  select 1
  from posts existing
  where existing.title = seed.title
);
