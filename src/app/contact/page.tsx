import ContactContent from "@/components/pages/contact-content";
import { generateMetadataFromConfig } from "@/config/seoconfig";
import {
    getLocaleDictionary,
    resolveUiLanguageFromRequest,
    type SearchParamsRecord,
} from "@/lib/route-locale";
import { Metadata } from "next";

type ContactPageProps = {
  searchParams?: Promise<SearchParamsRecord>;
};

export async function generateMetadata(): Promise<Metadata> {
  const language = await resolveUiLanguageFromRequest();
  const dictionary = await getLocaleDictionary(language);

  return generateMetadataFromConfig({
    title: dictionary.contactTitle,
    description: dictionary.contactSubtitle,
    locale: language,
    pathname: "/contact",
  });
}

export default function ContactPage() {
  return <ContactContent />;
}
