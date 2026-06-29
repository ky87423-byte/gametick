import { redirect } from "next/navigation";
import { defaultLocale } from "@/i18n/config";

// 루트(/)는 기본 로케일로 보낸다.
export default function RootIndex() {
  redirect(`/${defaultLocale}`);
}
