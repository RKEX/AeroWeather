import { permanentRedirect } from "next/navigation";

interface Props {
  params: Promise<{ city: string }>;
}

export default async function DatingWeatherPage({ params }: Props) {
  const { city } = await params;
  permanentRedirect(`/love/${encodeURIComponent(city.toLowerCase())}`);
}
