import AboutContent from "@/components/pages/about-content";
import { constructMetadata } from "@/config/metadata";
import {
    getLocaleDictionary,
    resolveUiLanguageFromRequest,
    type SearchParamsRecord,
} from "@/lib/route-locale";
import { Metadata } from "next";

type AboutPageProps = {
  searchParams?: Promise<SearchParamsRecord>;
};

export async function generateMetadata({
  searchParams,
}: AboutPageProps): Promise<Metadata> {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const language = await resolveUiLanguageFromRequest(resolvedSearchParams);
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

