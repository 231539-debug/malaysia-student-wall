"use client";

import { useMemo, useState } from "react";

type CopyXiaohongshuDraftProps = {
  title: string;
  content: string;
  categoryName?: string | null;
  schoolName?: string | null;
  cityName?: string | null;
  siteUrl: string;
};

function excerptForDraft(content: string) {
  const normalized = content.replace(/\s+/g, " ").trim();
  return normalized.length > 300 ? `${normalized.slice(0, 300)}...` : normalized;
}

export function CopyXiaohongshuDraft({ title, content, categoryName, schoolName, cityName, siteUrl }: CopyXiaohongshuDraftProps) {
  const [copied, setCopied] = useState(false);
  const [fallbackText, setFallbackText] = useState<string | null>(null);

  const draft = useMemo(() => {
    const metaLines = [
      categoryName ? `分类：${categoryName}` : null,
      schoolName ? `学校：${schoolName}` : null,
      cityName ? `地区：${cityName}` : null
    ].filter(Boolean);

    return [
      "【标题】",
      title,
      "",
      "【内容】",
      excerptForDraft(content),
      "",
      ...metaLines,
      metaLines.length ? "" : null,
      "信息来自：全马留学生信息墙",
      `网站：${siteUrl}`,
      "",
      "#马来西亚留学 #马来西亚留学生 #马来西亚租房 #留学生活 #二手交易 #课程组队 #新生求助"
    ]
      .filter((line): line is string => line !== null)
      .join("\n");
  }, [categoryName, cityName, content, schoolName, siteUrl, title]);

  async function copyDraft() {
    if (!navigator.clipboard) {
      setFallbackText(draft);
      return;
    }

    try {
      await navigator.clipboard.writeText(draft);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setFallbackText(draft);
    }
  }

  return (
    <div className="space-y-2">
      <button type="button" className="button-soft w-full py-2 sm:w-auto" onClick={copyDraft}>
        {copied ? "已复制" : "复制小红书文案"}
      </button>
      {fallbackText ? (
        <textarea
          className="field min-h-40 text-xs leading-5"
          readOnly
          value={fallbackText}
          aria-label="小红书同步文案"
        />
      ) : null}
    </div>
  );
}
