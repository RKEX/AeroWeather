import RickDasContent from "@/components/pages/rick-das-content";
import { constructMetadata } from "@/config/metadata";
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

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const language = await resolveUiLanguageFromRequest(resolvedSearchParams);
  const copy = getRickDasCopy(language);

  const founderBaseMetadata = constructMetadata({
    title: copy.metadata.title,
    description: copy.metadata.description,
    keywords: MULTILINGUAL_FOUNDER_KEYWORDS,
    locale: language,
    pathname: "/rick-das",
  });

  return {
    ...founderBaseMetadata,
    openGraph: {
      ...(founderBaseMetadata.openGraph ?? {}),
      title: copy.metadata.title,
      description: copy.metadata.openGraphDescription,
      url: `https://www.aeroweather.app/${language}/rick-das`,
      type: "profile",
    },
    twitter: {
      ...(founderBaseMetadata.twitter ?? {}),
      card: "summary_large_image",
      title: copy.metadata.title,
      description: copy.metadata.twitterDescription,
    },
  };
}

export default function WhoIsRickDasPage() {
  return <RickDasContent />;
}
