# Malaysia Student Wall / 马来西亚留学生墙

面向全马来西亚留学生的校园信息墙 Web App。第一阶段支持游客投稿、后台审核、按学校/城市/分类浏览、评论审核、举报和站长公告。

## 技术栈

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase
- Vercel 部署适配

## 本地运行

```bash
npm install
npm run dev
```

打开 `http://localhost:3000`。未配置 Supabase 时会使用 mock data 跑通页面。

## 环境变量

复制 `.env.example` 为 `.env.local`：

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ADMIN_PASSWORD=change-this-admin-password
```

`SUPABASE_SERVICE_ROLE_KEY` 只在服务端使用，用于投稿写入、评论写入和后台审核。不要暴露到浏览器端。

## Supabase 初始化

1. 在 Supabase 创建新项目。
2. 打开 SQL Editor。
3. 执行 `supabase/migrations/001_initial_schema.sql`。
4. 在项目设置中复制 URL、anon key、service role key 到 `.env.local` 或 Vercel 环境变量。

表结构包含：

- `schools`
- `cities`
- `categories`
- `posts`
- `comments`
- `announcements`
- `reports`

迁移文件已包含 RLS：公众只能读取已通过审核的帖子、评论和启用公告；写入和审核由服务端 service role 完成。

## 管理后台

访问 `/admin`，输入 `ADMIN_PASSWORD`。

后台功能：

- 查看 pending 帖子
- 批准、拒绝、删除帖子
- 置顶帖子
- 管理评论审核
- 发布站长公告
- 添加学校、城市、分类

## Vercel 部署

1. 将项目推送到 GitHub。
2. 在 Vercel 导入仓库。
3. Framework Preset 选择 `Next.js`。
4. Build & Development Settings 使用：
   - Install Command: `npm ci`
   - Build Command: `npm run build`
   - Output Directory: 保持默认
5. 在 Vercel Project Settings 的 Environment Variables 中填入 `.env.example` 对应变量：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_PASSWORD`
6. 部署即可。

如果线上 Supabase 数据库已经执行过 `001_initial_schema.sql`，后续补学校和城市数据时，请在 Supabase SQL Editor 执行 `supabase/migrations/002_upsert_schools_and_cities.sql`。

## 当前 MVP 说明

- 投稿和评论默认进入 `pending`。
- 图片第一版使用图片 URL，一行一个；后续可接 Supabase Storage 做真实上传。
- 页面语言先使用中文，结构上保留英文 slug 与标题，方便后续扩展 i18n。
- 未配置 Supabase 时，后台操作只展示交互，不会持久化。
