import TermsContent from "@/components/pages/terms-content";
import { constructMetadata } from "@/config/metadata";
import {
    getLocaleDictionary,
    resolveUiLanguageFromRequest,
    type SearchParamsRecord,
} from "@/lib/route-locale";
import { Metadata } from "next";

type TermsPageProps = {
  searchParams?: Promise<SearchParamsRecord>;
};

export async function generateMetadata({
  searchParams,
}: TermsPageProps): Promise<Metadata> {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const language = await resolveUiLanguageFromRequest(resolvedSearchParams);
  const dictionary = await getLocaleDictionary(language);

  return constructMetadata({
    title: dictionary.termsTitle,
    description: dictionary.termsSubtitle,
    locale: language,
    pathname: "/terms",
  });
}

export default function TermsPage() {
  return <TermsContent />;
}
