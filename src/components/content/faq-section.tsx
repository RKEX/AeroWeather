import GlassCard from "@/components/ui/GlassCard";

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "What makes AeroWeather's forecasts unique?",
    answer: "AeroWeather uses a hybrid intelligence system that combines data from the European Centre for Medium-Range Weather Forecasts (ECMWF) and the Global Forecast System (GFS) with high-resolution localized models. This ensures a balance between global accuracy and local precision."
  },
  {
    question: "How often is the weather data updated?",
    answer: "Our real-time dashboard updates every 15 minutes for current conditions, while our high-resolution numerical models are re-calculated every 3 to 6 hours to provide the most accurate hourly and daily outlooks."
  },
  {
    question: "Is air quality data available for all cities?",
    answer: "We provide Air Quality Index (AQI) data for over 50,000 cities worldwide, tracking major pollutants like PM2.5, PM10, Ozone, and Nitrogen Dioxide using a combination of ground sensors and satellite re-analysis."
  },
  {
    question: "Does AeroWeather track storms and rain in real-time?",
    answer: "Yes, our interactive radar map provides a high-cadence visualization of precipitation systems, allowing you to track rain, snow, and thunderstorms as they move across your region."
  },
  {
    question: "What is the 'Weather Story' or 'AI Insight' feature?",
    answer: "The 'Weather Story' uses advanced logic to translate complex meteorology data into human-readable insights. Instead of just seeing 'Humidity 90%', you'll understand how that moisture affects your comfort and what precautions to take."
  },
  {
    question: "Is my location data saved or tracked?",
    answer: "Privacy is a core value at AeroWeather. We use your location solely to provide accurate local forecasts. This data is handled in the browser (client-side) and is not stored on our servers linked to your personal identity."
  }
];

export function FaqSection() {
  return (
    <GlassCard className="p-8 md:p-12">
      <h2 className="mb-8 text-2xl font-bold md:text-3xl text-white">Frequently Asked Questions</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {FAQ_ITEMS.map((item, index) => (
          <div key={index} className="space-y-2">
            <h3 className="text-lg font-semibold text-white/90">{item.question}</h3>
            <p className="text-white/60 leading-relaxed">{item.answer}</p>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
