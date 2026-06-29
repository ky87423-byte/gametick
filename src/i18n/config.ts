// 지원 로케일 — 한국(메인) + 베트남(보조)
export const locales = ["ko", "vi"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ko";

export function isLocale(v: string): v is Locale {
  return (locales as readonly string[]).includes(v);
}
