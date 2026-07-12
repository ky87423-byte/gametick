// hreflang 언어 대체 링크 — 다국어 SEO. 각 페이지가 전 언어판을 가리키게 해
// 구글이 언어별 페이지를 중복이 아닌 대체로 인식하게 한다. x-default = 한국어.

import { locales } from "@/i18n/config";

/** 페이지 metadata.alternates.languages 용 (상대경로, metadataBase로 절대화됨) */
export function altLanguages(seg: string): Record<string, string> {
  const m: Record<string, string> = {};
  for (const l of locales) m[l] = `/${l}${seg}`;
  m["x-default"] = `/ko${seg}`;
  return m;
}
