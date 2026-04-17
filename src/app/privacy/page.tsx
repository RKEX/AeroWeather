import PrivacyContent from "@/components/pages/privacy-content";
import { constructMetadata, metadataConfig } from "@/config/metadata";

export const metadata = constructMetadata({
  title: metadataConfig.privacy.title,
  description: metadataConfig.privacy.description,
});

export default function PrivacyPage() {
  return <PrivacyContent />;
}
