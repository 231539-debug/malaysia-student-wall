import type { Metadata } from "next";
import "@/app/globals.css";
import { SiteHeader } from "@/components/site-header";
import { BottomNav } from "@/components/bottom-nav";

export const metadata: Metadata = {
  title: "Malaysia Student Wall | 马来西亚留学生墙",
  description: "面向全马来西亚留学生的信息墙、校园互助和轻社区平台。"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <SiteHeader />
        <main className="pb-24 pt-4 sm:pb-12">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
