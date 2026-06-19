import type { Metadata, Viewport } from "next";
import "@/app/globals.css";
import { BottomNav } from "@/components/bottom-nav";
import { PwaRegister } from "@/components/pwa-register";
import { SiteHeader } from "@/components/site-header";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://malaysia-student-wall-1.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "Malaysia Student Wall",
  title: {
    default: "Malaysia Student Wall | 马来西亚留学生墙",
    template: "%s | Malaysia Student Wall"
  },
  description: "马来西亚留学生信息墙，发布和查看租房、二手、课程组队、新生求助和生活避坑信息。",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Student Wall"
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" }
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }]
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Malaysia Student Wall",
    title: "Malaysia Student Wall | 马来西亚留学生墙",
    description: "面向马来西亚留学生的信息互助平台，审核后展示租房、二手、课程组队、新生求助和生活避坑信息。",
    images: [
      {
        url: "/icons/icon-512.png",
        width: 512,
        height: 512,
        alt: "Malaysia Student Wall"
      }
    ],
    locale: "zh_CN"
  },
  twitter: {
    card: "summary",
    title: "Malaysia Student Wall | 马来西亚留学生墙",
    description: "马来西亚留学生信息墙，发布和查看租房、二手、课程组队、新生求助和生活避坑信息。",
    images: ["/icons/icon-512.png"]
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#fffaf6"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <PwaRegister />
        <SiteHeader />
        <main className="pb-24 pt-4 sm:pb-12">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
