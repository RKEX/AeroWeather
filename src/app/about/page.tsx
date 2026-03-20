import AboutContent from "@/components/pages/about-content";
import { constructMetadata, metadataConfig } from "@/config/metadata";

export const metadata = constructMetadata({
  title: metadataConfig.about.title,
  description: metadataConfig.about.description,
});

export default function AboutPage() {
  return <AboutContent />;
}

