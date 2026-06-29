// 시장표 빌더 — 공유 history에서 서버별 "현재 시장가 + 24h 등락 + 스파크라인"을 만든다.
// 겜틱은 시세 정보 사이트이므로 매입가/할인 없이 시장가(바로템 최저가)를 그대로 보여준다.

import { GameInfo } from "@/data/games";
import { change24h, downsample, readHistory, seriesFor } from "@/lib/history";

export interface ServerMarket {
  serverId: string;
  nameKo: string;
  nameEn: string;
  /** 현재 시장가 (원/단위), 매물/이력 없으면 null */
  priceKrw: number | null;
  /** 24시간 전 대비 등락률(%) — 이력 부족 시 null */
  change24hPercent: number | null;
  /** 최근 24시간 시세 스파크라인 (다운샘플, 원/단위) */
  spark: number[];
  /** 이 서버 마지막 갱신 시각 (epoch ms), 없으면 null */
  updatedAt: number | null;
}

export interface MarketTable {
  game: {
    slug: string;
    nameKo: string;
    nameEn: string;
    currency: string;
    unitAmount: number;
    unitLabelKo: string;
  };
  servers: ServerMarket[];
  /** 전체 데이터 중 가장 최근 갱신 시각 (epoch ms), 없으면 null */
  updatedAt: number | null;
}

export async function getMarketTable(game: GameInfo): Promise<MarketTable> {
  const history = await readHistory(game.slug);
  const since24h = Date.now() - 24 * 60 * 60 * 1000;
  let latest: number | null = null;

  const servers: ServerMarket[] = game.servers.map((s) => {
    const all = seriesFor(history, s.id, 0);
    const last = all.length > 0 ? all[all.length - 1] : null;
    const price = last ? last.v : null;
    if (last && (latest === null || last.t > latest)) latest = last.t;
    const spark = downsample(seriesFor(history, s.id, since24h), 40).map(
      (p) => p.v
    );
    return {
      serverId: s.id,
      nameKo: s.nameKo,
      nameEn: s.nameEn,
      priceKrw: price !== null ? Math.round(price) : null,
      change24hPercent: change24h(history, s.id, price),
      spark,
      updatedAt: last ? last.t : null,
    };
  });

  return {
    game: {
      slug: game.slug,
      nameKo: game.nameKo,
      nameEn: game.nameEn,
      currency: game.currency,
      unitAmount: game.unitAmount,
      unitLabelKo: game.unitLabelKo,
    },
    servers,
    updatedAt: latest,
  };
}
