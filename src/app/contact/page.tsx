import ContactContent from "@/components/pages/contact-content";
import { constructMetadata, metadataConfig } from "@/config/metadata";

export const metadata = constructMetadata({
  title: metadataConfig.contact.title,
  description: metadataConfig.contact.description,
});

export default function ContactPage() {
  return <ContactContent />;
}
