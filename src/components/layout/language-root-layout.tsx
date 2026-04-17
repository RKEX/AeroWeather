"use client";

import { useLanguage } from "@/components/Providers/language-provider";
import RootClientLayout from "@/components/layout/root-client-layout";
import { ReactNode } from "react";

export default function LanguageRootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { language } = useLanguage();

  return <RootClientLayout key={language}>{children}</RootClientLayout>;
}
