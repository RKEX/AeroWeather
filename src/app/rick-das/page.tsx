import RickDasContent from "@/components/pages/rick-das-content";
import { generateMetadataFromConfig } from "@/config/seoconfig";
import { type SearchParamsRecord, resolveUiLanguageFromRequest } from "@/lib/route-locale";
import { getRickDasCopy } from "@/locales/rick-das";
import { Metadata } from "next";

type PageProps = {
  searchParams?: Promise<SearchParamsRecord>;
};

const MULTILINGUAL_FOUNDER_KEYWORDS = [
  "Rick Das",
  "রিক দাস",
  "रिक दास",
  "リック・ダス",
  "릭 다스",
  "里克·达斯",
];

export async function generateMetadata(): Promise<Metadata> {
  const language = await resolveUiLanguageFromRequest();
  const copy = getRickDasCopy(language);

  return generateMetadataFromConfig({
    title: copy.metadata.title,
    description: copy.metadata.description,
    keywords: MULTILINGUAL_FOUNDER_KEYWORDS,
    locale: language,
    pathname: "/rick-das",
    type: "website", // Or "profile" if I want to be specific, but seoconfig uses "website" or "article"
  });
}

export default function WhoIsRickDasPage() {
  return <RickDasContent />;
}
