import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "免費事業健檢 | solo.tw",
  description: "7 道快速診斷，找出你一人事業的強項與盲點，獲得個人化行動建議。",
  alternates: { canonical: "https://www.solo.tw/diagnose" },
};

export default function DiagnoseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
