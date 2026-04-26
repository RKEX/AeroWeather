import PrivacyContent from "@/components/pages/privacy-content";
import { generateMetadataFromConfig } from "@/config/seoconfig";
import {
    getLocaleDictionary,
    resolveUiLanguageFromRequest,
    type SearchParamsRecord,
} from "@/lib/route-locale";
import { Metadata } from "next";

type PrivacyPageProps = {
  searchParams?: Promise<SearchParamsRecord>;
};

export async function generateMetadata(): Promise<Metadata> {
  const language = await resolveUiLanguageFromRequest();
  const dictionary = await getLocaleDictionary(language);

  return generateMetadataFromConfig({
    title: dictionary.privacyTitle,
    description: dictionary.privacySubtitle,
    locale: language,
    pathname: "/privacy",
  });
}

export default function PrivacyPage() {
  return <PrivacyContent />;
}
