"use client";

import { useEffect, useMemo, useState } from "react";
import { Copy, Download, ExternalLink, X } from "lucide-react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

type BrowserEnvironment = {
  isAndroid: boolean;
  isIos: boolean;
  isIosSafari: boolean;
  isStandalone: boolean;
  isWeChat: boolean;
};

const FALLBACK_SITE_URL = "https://malaysia-student-wall-1.vercel.app";
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? FALLBACK_SITE_URL).replace(/\/$/, "");
const STORAGE_KEY = "msw-pwa-install-tip-dismissed";
const WECHAT_STORAGE_KEY = "msw-pwa-wechat-tip-dismissed";

function getBrowserEnvironment(): BrowserEnvironment {
  const userAgent = navigator.userAgent;
  const isAndroid = /android/i.test(userAgent);
  const isIos = /iphone|ipad|ipod/i.test(userAgent);
  const isWeChat = /micromessenger/i.test(userAgent);
  const isIosSafari = isIos && /safari/i.test(userAgent) && !/crios|fxios|edgios|micromessenger/i.test(userAgent);
  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches || Boolean((navigator as Navigator & { standalone?: boolean }).standalone);

  return {
    isAndroid,
    isIos,
    isIosSafari,
    isStandalone,
    isWeChat
  };
}

function installTipStorageKey(environment: BrowserEnvironment) {
  return environment.isWeChat ? WECHAT_STORAGE_KEY : STORAGE_KEY;
}

export function PwaInstallTip() {
  const [environment, setEnvironment] = useState<BrowserEnvironment | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "manual">("idle");

  const siteUrl = useMemo(() => SITE_URL, []);

  useEffect(() => {
    const nextEnvironment = getBrowserEnvironment();
    const storageKey = installTipStorageKey(nextEnvironment);

    setEnvironment(nextEnvironment);

    if (nextEnvironment.isStandalone) return;
    if (localStorage.getItem(storageKey) === "true" || localStorage.getItem(storageKey) === "1") return;

    setIsVisible(true);

    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };

    const onAppInstalled = () => {
      localStorage.setItem(STORAGE_KEY, "true");
      setIsVisible(false);
    };

    if (!nextEnvironment.isWeChat) {
      window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.addEventListener("appinstalled", onAppInstalled);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, []);

  if (!isVisible || !environment) return null;

  const handleDismiss = () => {
    localStorage.setItem(installTipStorageKey(environment), "true");
    setIsVisible(false);
  };

  const handleInstall = async () => {
    if (!installPrompt) return;

    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (choice.outcome === "accepted") {
      localStorage.setItem(STORAGE_KEY, "true");
      setIsVisible(false);
    }
    setInstallPrompt(null);
  };

  const handleCopy = async () => {
    if (!navigator.clipboard?.writeText) {
      setCopyState("manual");
      return;
    }

    try {
      await Promise.race([
        navigator.clipboard.writeText(siteUrl),
        new Promise((_, reject) => {
          window.setTimeout(() => reject(new Error("Clipboard timeout")), 1200);
        })
      ]);
      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 1800);
    } catch {
      setCopyState("manual");
    }
  };

  if (environment.isWeChat) {
    const steps = environment.isIos
      ? ["点击右上角「...」", "选择「在 Safari 中打开」", "点击 Safari 底部分享按钮", "选择「添加到主屏幕」"]
      : environment.isAndroid
        ? ["点击右上角「...」", "选择「在浏览器打开」", "在 Chrome / 默认浏览器中点击「添加到主屏幕」或「安装应用」"]
        : ["点击右上角「...」", "选择「在浏览器打开」", "打开后再选择「添加到主屏幕」"];

    return (
      <section className="container-page md:hidden">
        <div className="rounded-3xl border border-black/5 bg-white/90 p-3 shadow-soft backdrop-blur">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 rounded-2xl bg-mango/20 p-2 text-ink">
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-black leading-5 text-ink">正在微信内打开</p>
              <p className="mt-1 text-xs font-semibold leading-5 text-muted">
                如果想把 Malaysia Student Wall 添加到手机桌面，需要先用手机浏览器打开。
              </p>
              <ol className="mt-2 space-y-1 text-xs font-semibold leading-5 text-muted">
                {steps.map((step, index) => (
                  <li key={step} className="flex gap-2">
                    <span className="font-black text-coral">{index + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
              <div className="mt-3 flex flex-wrap gap-2">
                <button className="button-soft px-3 py-2 text-xs" type="button" onClick={handleCopy}>
                  <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                  {copyState === "copied" ? "已复制" : "复制网站链接"}
                </button>
                <button className="button-primary px-3 py-2 text-xs" type="button" onClick={handleDismiss}>
                  我知道了
                </button>
              </div>
              {copyState === "manual" ? (
                <p className="mt-2 break-all rounded-2xl bg-stone-50 px-3 py-2 text-xs font-semibold leading-5 text-muted">{siteUrl}</p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={handleDismiss}
              aria-label="关闭微信打开提示"
              className="rounded-full p-1.5 text-muted transition hover:bg-black/5 hover:text-ink"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="container-page md:hidden">
      <div className="rounded-3xl border border-black/5 bg-white/85 p-3 shadow-soft backdrop-blur">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 rounded-2xl bg-sky/10 p-2 text-sky">
            <Download className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-black leading-5 text-ink">像 App 一样快速打开</p>
            <p className="mt-1 text-xs font-semibold leading-5 text-muted">
              无需下载 App，打开网页即可使用。也可以添加到手机主屏幕，像 App 一样快速打开。
            </p>
            {environment.isIosSafari ? (
              <p className="mt-1 text-xs font-semibold leading-5 text-muted">iPhone 用户可点击 Safari 分享按钮，然后选择“添加到主屏幕”。</p>
            ) : null}
            <div className="mt-3 flex flex-wrap gap-2">
              {installPrompt ? (
                <button className="button-primary px-3 py-2 text-xs" type="button" onClick={handleInstall}>
                  添加到主屏幕
                </button>
              ) : null}
              <button className="button-soft px-3 py-2 text-xs" type="button" onClick={handleDismiss}>
                我知道了
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="关闭安装提示"
            className="rounded-full p-1.5 text-muted transition hover:bg-black/5 hover:text-ink"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
