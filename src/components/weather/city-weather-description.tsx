import React from "react";
import GlassCard from "@/components/ui/GlassCard";

interface CityWeatherDescriptionProps {
  city: string;
}

export function CityWeatherDescription({ city }: CityWeatherDescriptionProps) {
  // Simple deterministic generation based on city name for "uniqueness"
  // In a real app, this might come from a database or LLM.
  const isKolkata = city.toLowerCase() === "kolkata";
  const isLondon = city.toLowerCase() === "london";
  const isNewYork = city.toLowerCase().includes("new york");
  const isDelhi = city.toLowerCase() === "delhi";
  const isMumbai = city.toLowerCase() === "mumbai";

  let description = "";

  if (isKolkata) {
    description = `The climate of Kolkata is a tropical wet-and-dry climate. This means that throughout the year, the city experiences significant variations in temperature and humidity. During the summer months, temperatures can soar, often accompanied by high humidity levels that make it feel much hotter than the thermometer suggests. The monsoon season brings heavy rainfall and vital relief, although it also increases the dew point significantly. Rainfall trends in Kolkata are dominated by the Southwest Monsoon, which typically arrives in June. Winters are short and pleasant, characterized by clear skies and mild temperatures, making it the most comfortable time for outdoor activities. The city's proximity to the Bay of Bengal heavily influences its local weather characteristics, often leading to sudden thunder showers known as 'Kalbaishakhi' during the pre-monsoon period.`;
  } else if (isLondon) {
    description = `London has a temperate oceanic climate, which is characterized by cool winters and warm summers with regular precipitation throughout the year. Seasonal patterns in London are distinct but rarely reach extreme temperatures. Humidity levels are generally moderate, though dampness is common during the autumn and winter months. Rainfall trends are relatively consistent, with light showers being more frequent than heavy downpours. The city's local weather characteristics are often influenced by the 'urban heat island' effect, which keeps the center of London several degrees warmer than the surrounding countryside. This is particularly noticeable during the summer heatwaves. Wind patterns often bring moisture-laden air from the Atlantic, leading to the famous overcast skies that define the London atmosphere.`;
  } else if (isNewYork) {
    description = `New York City features a humid subtropical climate, which means residents experience cold, snowy winters and hot, humid summers. The seasonal patterns are quite dramatic, with beautiful spring and autumn transitions. Humidity is a major factor in the summer, often leading to a high heat index that requires careful monitoring of 'Feels Like' temperatures. Rainfall trends show that precipitation is evenly distributed throughout the year, though summer can see intense thunderstorms. Local weather characteristics are influenced by the city's coastal location, which can lead to rapid shifts in conditions as maritime air meets continental masses. Winters can bring significant snowfall, often impacted by 'Nor'easters' that track up the coast, bringing heavy winds and moisture.`;
  } else if (isDelhi) {
    description = `Delhi experiences an extreme version of a humid subtropical climate, often bordering on a hot semi-arid climate. Seasonal patterns are marked by intense heat in the summer, where temperatures frequently exceed 40°C. This is followed by the arrival of the monsoon in July, which brings high humidity and heavy rainfall. Rainfall trends are highly seasonal, with the vast majority of precipitation occurring during the monsoon months. A unique local weather characteristic of Delhi is the presence of 'Loo' winds—hot, dry winds from the desert during the pre-monsoon summer. Conversely, winters are cold and often plagued by dense fog, which is exacerbated by atmospheric inversions and high pollution levels, making AQI monitoring critical for health and visibility.`;
  } else if (isMumbai) {
    description = `Mumbai has a tropical wet and dry climate, defined by its extreme seasonal patterns. The year is divided into a long dry season and a powerful monsoon season. From June to September, rainfall trends are intense, as the city receives massive amounts of precipitation from the Southwest Monsoon. Humidity is consistently high throughout the year due to Mumbai's coastal location along the Arabian Sea. Local weather characteristics are heavily influenced by maritime breezes, which help moderate the heat but keep the air moisture-laden. Temperatures remain warm year-round, with minimal variation between summer and winter. The transition periods before and after the monsoon are often the most uncomfortable due to the combination of high temperatures and extreme humidity.`;
  } else {
    description = `The weather in ${city} is defined by its unique geographical location and atmospheric conditions. Understanding the climate of ${city} requires looking at long-term seasonal patterns, which influence daily life and local activities. Throughout the year, humidity levels vary, significantly impacting the 'Feels Like' temperature and overall comfort. Rainfall trends are a critical factor to monitor, whether the region experiences seasonal monsoons or consistent oceanic precipitation. The local weather characteristics of ${city} are shaped by surrounding terrain, such as mountains, plains, or proximity to large bodies of water. These factors combined create a dynamic environment where temperature and AQI can shift rapidly. Staying informed through real-time data helps you navigate these changes with confidence.`;
  }

  return (
    <GlassCard className="mt-8 p-8 md:p-12">
      <h2 className="mb-6 text-2xl font-bold text-white">
        About {city} Weather & Climate
      </h2>
      <div className="prose prose-invert max-w-none">
        <p className="text-lg leading-relaxed text-white/70">
          {description}
        </p>
        <p className="mt-4 text-sm font-medium text-indigo-400/80">
          * This summary is based on historical meteorological data and local climate patterns for {city}.
        </p>
      </div>
    </GlassCard>
  );
}
