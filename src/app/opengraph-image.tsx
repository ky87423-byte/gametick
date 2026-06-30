// 사이트 공유 썸네일(OG 이미지) — 카톡/디스코드/SNS에 링크 붙일 때 뜨는 카드 이미지.
// 루트에 두어 모든 페이지에 기본 적용된다(페이지별 메타 title/description과 함께).

import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "게임시세 — 게임머니 서버별 실시간 시세";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const font = await readFile(
    join(process.cwd(), "src/assets/BlackHanSans.woff")
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 90px",
          background:
            "linear-gradient(135deg, #0a0a0b 0%, #18181b 60%, #1c1117 100%)",
          color: "#fafafa",
          fontFamily: "BHS",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 16,
              height: 64,
              background: "#f87171",
              borderRadius: 8,
            }}
          />
          <div style={{ fontSize: 100, color: "#f87171", lineHeight: 1 }}>
            게임시세
          </div>
        </div>
        <div style={{ marginTop: 26, fontSize: 46, color: "#e4e4e7" }}>
          게임머니 서버별 실시간 시세 · 차트 · 가격알림
        </div>
        <div style={{ marginTop: 40, display: "flex", gap: 14 }}>
          {["바로템·아이템베이 통합 최저가", "텔레그램·디스코드 알림", "14개 게임"].map(
            (t) => (
              <div
                key={t}
                style={{
                  display: "flex",
                  fontSize: 26,
                  color: "#a1a1aa",
                  border: "2px solid #3f3f46",
                  borderRadius: 999,
                  padding: "8px 22px",
                }}
              >
                {t}
              </div>
            )
          )}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 54,
            right: 90,
            fontSize: 30,
            color: "#71717a",
          }}
        >
          gamesise.co.kr
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "BHS", data: font, weight: 400, style: "normal" }],
    }
  );
}
