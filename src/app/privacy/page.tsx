import PrivacyContent from "@/components/pages/privacy-content";
import { constructMetadata } from "@/config/metadata";
import {
    getLocaleDictionary,
    resolveUiLanguageFromRequest,
    type SearchParamsRecord,
} from "@/lib/route-locale";
import { Metadata } from "next";

type PrivacyPageProps = {
  searchParams?: Promise<SearchParamsRecord>;
};

export async function generateMetadata({
  searchParams,
}: PrivacyPageProps): Promise<Metadata> {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const language = await resolveUiLanguageFromRequest(resolvedSearchParams);
  const dictionary = await getLocaleDictionary(language);

  return constructMetadata({
    title: dictionary.privacyTitle,
    description: dictionary.privacySubtitle,
    locale: language,
    pathname: "/privacy",
  });
}

export default function PrivacyPage() {
  return <PrivacyContent />;
}
