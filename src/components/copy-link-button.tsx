"use client";

import { useState } from "react";

type CopyLinkButtonProps = {
  label: string;
  copiedLabel?: string;
  url?: string;
  className?: string;
};

export function CopyLinkButton({ label, copiedLabel = "已复制", url, className = "button-soft w-full" }: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);
  const [fallbackUrl, setFallbackUrl] = useState<string | null>(null);

  async function copyLink() {
    const targetUrl = url || window.location.href;

    if (!navigator.clipboard) {
      setFallbackUrl(targetUrl);
      return;
    }

    try {
      await navigator.clipboard.writeText(targetUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setFallbackUrl(targetUrl);
    }
  }

  return (
    <div className="space-y-2">
      <button type="button" className={className} onClick={copyLink}>
        {copied ? copiedLabel : label}
      </button>
      {fallbackUrl ? (
        <p className="break-all rounded-2xl bg-white px-3 py-2 text-xs font-semibold leading-5 text-muted">{fallbackUrl}</p>
      ) : null}
    </div>
  );
}
