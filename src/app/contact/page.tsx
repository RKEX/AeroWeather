import ContactContent from "@/components/pages/contact-content";
import { constructMetadata } from "@/config/metadata";
import {
    getLocaleDictionary,
    resolveUiLanguageFromRequest,
    type SearchParamsRecord,
} from "@/lib/route-locale";
import { Metadata } from "next";

type ContactPageProps = {
  searchParams?: Promise<SearchParamsRecord>;
};

export async function generateMetadata({
  searchParams,
}: ContactPageProps): Promise<Metadata> {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const language = await resolveUiLanguageFromRequest(resolvedSearchParams);
  const dictionary = await getLocaleDictionary(language);

  return constructMetadata({
    title: dictionary.contactTitle,
    description: dictionary.contactSubtitle,
    locale: language,
    pathname: "/contact",
  });
}

export default function ContactPage() {
  return <ContactContent />;
}
