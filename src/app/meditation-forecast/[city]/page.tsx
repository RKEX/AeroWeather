import { permanentRedirect } from "next/navigation";

interface Props {
  params: Promise<{ city: string }>;
}

export default async function MeditationForecastPage({ params }: Props) {
  const { city } = await params;
  permanentRedirect(`/meditation/${encodeURIComponent(city.toLowerCase())}`);
}
