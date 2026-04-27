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
  return {
    title: "About AeroWeather – AI Weather Impact Intelligence Platform",
    description:
      "Discover how AeroWeather uses AI weather insights to analyze weather impact on mood, relationships, travel, and productivity.",
  };
}

export default function AboutPage() {
  return <AboutContent />;
}

