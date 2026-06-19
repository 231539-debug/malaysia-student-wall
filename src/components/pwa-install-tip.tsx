"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

const STORAGE_KEY = "msw-pwa-install-tip-dismissed";

function isIosSafari() {
  if (typeof navigator === "undefined") return false;
  const userAgent = navigator.userAgent;
  const isIos = /iphone|ipad|ipod/i.test(userAgent);
  const isSafari = /safari/i.test(userAgent) && !/crios|fxios|edgios/i.test(userAgent);
  return isIos && isSafari;
}

export function PwaInstallTip() {
  const [isVisible, setIsVisible] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) === "1") return;
    if (window.matchMedia("(display-mode: standalone)").matches) return;

    setIsVisible(true);

    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };

    const onAppInstalled = () => {
      setInstalled(true);
      setIsVisible(false);
      localStorage.setItem(STORAGE_KEY, "1");
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, []);

  if (!isVisible || installed) return null;

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setIsVisible(false);
  };

  const handleInstall = async () => {
    if (!installPrompt) return;

    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (choice.outcome === "accepted") {
      localStorage.setItem(STORAGE_KEY, "1");
      setIsVisible(false);
    }
    setInstallPrompt(null);
  };

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
            {isIosSafari() ? (
              <p className="mt-1 text-xs font-semibold leading-5 text-muted">
                iPhone 用户可点击 Safari 分享按钮，然后选择“添加到主屏幕”。
              </p>
            ) : null}
            {installPrompt ? (
              <button className="button-primary mt-2 px-3 py-2 text-xs" type="button" onClick={handleInstall}>
                添加到主屏幕
              </button>
            ) : null}
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
