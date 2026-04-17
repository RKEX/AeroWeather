import TermsContent from "@/components/pages/terms-content";
import { constructMetadata, metadataConfig } from "@/config/metadata";

export const metadata = constructMetadata({
  title: metadataConfig.terms.title,
  description: metadataConfig.terms.description,
});

export default function TermsPage() {
  return <TermsContent />;
}
