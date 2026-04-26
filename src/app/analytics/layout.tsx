import { generateMetadataFromConfig } from "@/config/seoconfig";
import { Metadata } from "next";

export const metadata: Metadata = generateMetadataFromConfig({
  title: "Platform Analytics",
  description: "Real-time traffic and usage analytics for the AeroWeather platform.",
  pathname: "/analytics",
});

export default function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
