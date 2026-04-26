import AboutContent from "@/components/pages/about-content";
import { generateMetadataFromConfig } from "@/config/seoconfig";
import {
    getLocaleDictionary,
    resolveUiLanguageFromRequest,
    type SearchParamsRecord,
} from "@/lib/route-locale";
import { Metadata } from "next";

type AboutPageProps = {
  searchParams?: Promise<SearchParamsRecord>;
};

export async function generateMetadata(): Promise<Metadata> {
  const language = await resolveUiLanguageFromRequest();
  const dictionary = await getLocaleDictionary(language);

  return generateMetadataFromConfig({
    title: dictionary.aboutTitle,
    description: dictionary.aboutIntro,
    locale: language,
    pathname: "/about",
  });
}

export default function AboutPage() {
  return <AboutContent />;
}

