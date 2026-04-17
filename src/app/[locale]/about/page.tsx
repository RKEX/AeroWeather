import AboutContent from "@/components/pages/about-content";
import { constructMetadata } from "@/config/metadata";
import { getLocaleDictionary } from "@/lib/route-locale";
import {
  normalizeSupportedLocale,
  type SupportedLocale,
} from "@/lib/locales";
import { Metadata } from "next";

type AboutPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: AboutPageProps): Promise<Metadata> {
  const { locale } = await params;
  const language = normalizeSupportedLocale(locale) as SupportedLocale;
  const dictionary = await getLocaleDictionary(language);

  return constructMetadata({
    title: dictionary.aboutTitle,
    description: dictionary.aboutIntro,
    locale: language,
    pathname: "/about",
  });
}

export default function AboutPage() {
  return <AboutContent />;
}