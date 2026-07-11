import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ContactForm } from "@/components/ContactForm";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale as Locale);
  return { title: `${dict.adInquiry} | ${dict.brand}`, robots: { index: false } };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <>
      <Header locale={locale} />
      <main className="mx-auto w-full max-w-lg px-4 py-8">
        <h1 className="mb-1 text-2xl font-bold">{dict.adInquiry}</h1>
        <p className="mb-6 text-sm text-zinc-500">ad@gamesise.co.kr</p>
        <ContactForm
          labels={{
            title: dict.contactTitle,
            body: dict.contactBody,
            contact: dict.contactContact,
            send: dict.contactSend,
            sent: dict.contactSent,
          }}
        />
      </main>
      <Footer locale={locale} />
    </>
  );
}
