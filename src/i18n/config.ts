// 지원 로케일 — 한국(메인) + 영어·중국어·베트남 + 일본·태국·필리핀
export const locales = ["ko", "en", "zh", "vi", "ja", "th", "tl"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ko";

export function isLocale(v: string): v is Locale {
  return (locales as readonly string[]).includes(v);
}
