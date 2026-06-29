// 로컬 차트 확인용 샘플 시세 데이터 생성기 (바로템 호출 없음).
// 기존 history 파일의 serverId 키를 재사용해, 최근 24h를 15분 간격으로 랜덤워크 생성.
// 사용: node scripts/gen-sample.mjs [dataDir]
// 주의: 실데이터가 아님. 배포 후에는 lc_vn 수집기의 실제 데이터를 사용한다.

import { promises as fs } from "fs";
import path from "path";

const DATA_DIR =
  process.argv[2] || process.env.GAMETICK_DATA_DIR || "C:/Users/User/lc_vn/data";

const GAMES = {
  "lineage-classic": 2000,
  aion2: 4000,
  "maplestory-world": 1500,
  "sol-enchant": 800,
};

const POINTS = 96; // 24h / 15min
const STEP = 15 * 60 * 1000;

async function serverIdsOf(slug) {
  try {
    const raw = await fs.readFile(
      path.join(DATA_DIR, `history-${slug}.json`),
      "utf8"
    );
    const parsed = JSON.parse(raw.replace(/^﻿/, ""));
    const pts = parsed.points || [];
    const keys = new Set();
    for (const pt of pts) for (const k of Object.keys(pt.p || {})) keys.add(k);
    return [...keys];
  } catch {
    return [];
  }
}

function genSeries(base) {
  // 서버별 시작가: base ± 40%
  let v = base * (0.6 + Math.random() * 0.8);
  const series = [];
  for (let i = 0; i < POINTS; i++) {
    v *= 1 + (Math.random() - 0.5) * 0.04; // ±2% 랜덤워크
    series.push(Math.max(1, Math.round(v)));
  }
  return series;
}

async function main() {
  const now = Date.now();
  for (const [slug, base] of Object.entries(GAMES)) {
    const ids = await serverIdsOf(slug);
    if (ids.length === 0) {
      console.log(`skip ${slug} (서버 ID 없음)`);
      continue;
    }
    const series = {};
    for (const id of ids) series[id] = genSeries(base);
    const points = [];
    for (let i = 0; i < POINTS; i++) {
      const t = now - (POINTS - 1 - i) * STEP;
      const p = {};
      const c = {};
      for (const id of ids) {
        p[id] = series[id][i];
        c[id] = 10 + Math.floor(Math.random() * 200);
      }
      points.push({ t, p, c });
    }
    await fs.writeFile(
      path.join(DATA_DIR, `history-${slug}.json`),
      JSON.stringify({ points })
    );
    console.log(`${slug}: ${ids.length}개 서버 × ${POINTS}점 생성`);
  }
}

main();
