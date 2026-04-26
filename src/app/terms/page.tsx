import TermsContent from "@/components/pages/terms-content";
import { generateMetadataFromConfig } from "@/config/seoconfig";
import {
    getLocaleDictionary,
    resolveUiLanguageFromRequest,
    type SearchParamsRecord,
} from "@/lib/route-locale";
import { Metadata } from "next";

type TermsPageProps = {
  searchParams?: Promise<SearchParamsRecord>;
};

export async function generateMetadata(): Promise<Metadata> {
  const language = await resolveUiLanguageFromRequest();
  const dictionary = await getLocaleDictionary(language);

  return generateMetadataFromConfig({
    title: dictionary.termsTitle,
    description: dictionary.termsSubtitle,
    locale: language,
    pathname: "/terms",
  });
}

export default function TermsPage() {
  return <TermsContent />;
}
