// 환율 — KRW → VND / USD. 1시간 캐시. 바로템과 무관한 무료 API라 IP 차단 우려 없음.
// 실패 시 폴백값 사용.

interface Rates {
  vnd: number;
  usd: number;
}

const FALLBACK: Rates = { vnd: 17.1, usd: 0.00072 };
let cache: { rates: Rates; at: number } | null = null;
const TTL_MS = 60 * 60 * 1000;

export async function getRates(): Promise<Rates> {
  if (cache && Date.now() - cache.at < TTL_MS) return cache.rates;
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/KRW", {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error("rate fetch failed");
    const data = (await res.json()) as {
      result?: string;
      rates?: { VND?: number; USD?: number };
    };
    const vnd = data.rates?.VND;
    const usd = data.rates?.USD;
    const rates: Rates = {
      vnd: data.result === "success" && vnd && vnd > 0 ? vnd : FALLBACK.vnd,
      usd: data.result === "success" && usd && usd > 0 ? usd : FALLBACK.usd,
    };
    cache = { rates, at: Date.now() };
    return rates;
  } catch {
    return cache?.rates ?? FALLBACK;
  }
}

/** 로케일별 보조 통화 환산 문자열 (원가 → 현지통화) */
export function secondaryCurrency(
  krw: number | null,
  locale: string,
  rates: Rates
): string | null {
  if (krw === null) return null;
  if (locale === "vi") {
    return `≈ ${Math.round(krw * rates.vnd).toLocaleString("vi-VN")}₫`;
  }
  return null; // ko는 원화만 표시
}
