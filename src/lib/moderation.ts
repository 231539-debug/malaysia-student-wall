import type { RiskLevel } from "@/types/wall";

const highRiskKeywords = [
  "代写",
  "代考",
  "买卖答案",
  "假证明",
  "护照照片",
  "银行卡",
  "OTP",
  "otp",
  "刷单",
  "赌博",
  "裸聊",
  "色诱",
  "诈骗",
  "挂人",
  "曝光",
  "人肉",
  "骂人",
  "骗子",
  "贷款",
  "高薪兼职",
  "先交押金"
];

const mediumRiskKeywords = [
  "押金",
  "转账",
  "定金",
  "兼职",
  "招聘",
  "房源",
  "宽带",
  "合约",
  "代办",
  "微信",
  "WhatsApp",
  "whatsapp",
  "Telegram",
  "telegram"
];

function matchedKeywords(text: string, keywords: string[]) {
  const normalizedText = text.toLowerCase();

  return keywords.filter((keyword) => normalizedText.includes(keyword.toLowerCase()));
}

export function assessContentRisk(title: string, content: string): {
  level: RiskLevel;
  note: string | null;
  matched: string[];
} {
  const text = `${title}\n${content}`;
  const highMatches = matchedKeywords(text, highRiskKeywords);

  if (highMatches.length > 0) {
    return {
      level: "high",
      note: `建议谨慎审核，可能涉及违规内容。命中关键词：${highMatches.join("、")}。`,
      matched: highMatches
    };
  }

  const mediumMatches = matchedKeywords(text, mediumRiskKeywords);

  if (mediumMatches.length > 0) {
    return {
      level: "medium",
      note: `命中需留意关键词：${mediumMatches.join("、")}。`,
      matched: mediumMatches
    };
  }

  return {
    level: "low",
    note: null,
    matched: []
  };
}
