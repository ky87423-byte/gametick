import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { PhoneFarmSimulator } from "@/components/PhoneFarmSimulator";

// 검색엔진 비노출 — 개인용 페이지
export const metadata: Metadata = {
  title: "ROI",
  robots: { index: false, follow: false },
};

export default async function RoiPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <main className="min-h-screen bg-zinc-950 py-10">
      <PhoneFarmSimulator />
    </main>
  );
}
