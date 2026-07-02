"use client";

// 라이트/다크 테마 토글. html에 .light 클래스 on/off + localStorage 저장.
// 기본은 다크(클래스 없음). 플래시 방지 스크립트는 layout에서 선적용.

import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [light, setLight] = useState(false);

  useEffect(() => {
    setLight(document.documentElement.classList.contains("light"));
  }, []);

  const toggle = () => {
    const el = document.documentElement;
    const next = !el.classList.contains("light");
    el.classList.toggle("light", next);
    try {
      localStorage.setItem("theme", next ? "light" : "dark");
    } catch {}
    setLight(next);
  };

  return (
    <button
      onClick={toggle}
      aria-label="테마 전환"
      title="라이트/다크"
      className="leading-none hover:opacity-80"
    >
      {light ? "🌙" : "☀️"}
    </button>
  );
}
