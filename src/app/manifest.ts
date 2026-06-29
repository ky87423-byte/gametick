import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "겜틱 GameTick — 게임머니 시세",
    short_name: "겜틱",
    description: "게임머니 서버별 실시간 시세·차트·가격알림",
    start_url: "/",
    display: "standalone",
    background_color: "#09090b",
    theme_color: "#09090b",
    icons: [{ src: "/favicon.ico", sizes: "any", type: "image/x-icon" }],
  };
}
