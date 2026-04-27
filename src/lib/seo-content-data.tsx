import { Brain, Heart, MapPin, Zap } from "lucide-react";

type FeatureKey = "impact" | "love" | "travel" | "meditation";

type RegionProfile = {
  regionLabel: string;
  climateSummary: string;
  seasonalContext: string;
  uniqueTip: string;
};

const REGION_FALLBACK: RegionProfile = {
  regionLabel: "global urban climate",
  climateSummary:
    "mixed humidity, moderate seasonal variability, and periodic pressure swings that can affect mood and daily energy",
  seasonalContext:
    "transitional weeks often bring unstable pressure behavior, which can increase fatigue on some days and focus spikes on others",
  uniqueTip: "Track pressure trend with humidity trend instead of temperature alone for better day planning.",
};

const REGION_BY_CITY: Record<string, RegionProfile> = {
  "new-york": {
    regionLabel: "humid subtropical to continental edge climate",
    climateSummary:
      "cold-front volatility in shoulder seasons and high summer humidity that can amplify perceived stress",
    seasonalContext:
      "spring and fall pressure dips can create abrupt comfort changes between morning and evening windows",
    uniqueTip: "Use mid-morning stability windows for high-focus tasks when fronts are passing.",
  },
  london: {
    regionLabel: "marine west coast climate",
    climateSummary:
      "frequent cloud transitions, variable wind, and gentle thermal ranges that influence emotional steadiness",
    seasonalContext:
      "winter moisture and low-light weeks can reduce perceived energy while stable high-pressure periods improve clarity",
    uniqueTip: "Pair planning with daylight windows because cloud density often drives mood more than raw temperature.",
  },
  delhi: {
    regionLabel: "semi-arid and monsoon-influenced climate",
    climateSummary:
      "strong heat phases, dust/AQI variability, and monsoon moisture shifts that affect breathing comfort",
    seasonalContext:
      "pre-monsoon heat can raise social friction while post-rain airflow usually restores comfort",
    uniqueTip: "Prioritize AQI and dew-point checks during peak summer and pre-monsoon periods.",
  },
  mumbai: {
    regionLabel: "tropical coastal monsoon climate",
    climateSummary:
      "high baseline humidity with sharp rain episodes and marine airflow affecting comfort and mobility",
    seasonalContext:
      "monsoon months create strong moisture and transit variability that can alter focus and schedule reliability",
    uniqueTip: "Use visibility and rainfall intensity windows for commute and travel planning, not just rain chance.",
  },
  kolkata: {
    regionLabel: "humid subtropical monsoon climate",
    climateSummary:
      "high humidity and warm-season convection patterns that can amplify fatigue and social sensitivity",
    seasonalContext:
      "monsoon transitions and post-monsoon recovery weeks often shift mood and productivity patterns",
    uniqueTip: "For consistent output, align deep work with lower humidity periods and stable pressure windows.",
  },
  tokyo: {
    regionLabel: "humid subtropical coastal climate",
    climateSummary:
      "seasonal humidity, typhoon-era pressure variability, and rapid weather transitions",
    seasonalContext:
      "late summer pressure instability can affect perceived stress, while autumn high-pressure spells improve focus",
    uniqueTip: "Watch wind-speed and pressure together before planning long outdoor activity blocks.",
  },
};

function normalizeCity(city: string): string {
  return city.trim().toLowerCase().replace(/\s+/g, "-");
}

function displayCity(city: string): string {
  return city
    .trim()
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function getRegionProfile(city: string): RegionProfile {
  return REGION_BY_CITY[normalizeCity(city)] ?? REGION_FALLBACK;
}

function buildFeatureSections(cityName: string, feature: FeatureKey, profile: RegionProfile) {
  if (feature === "love") {
    return {
      h1: `Relationships & Dating Weather Forecast for ${cityName}`,
      intro: `AeroWeather translates ${cityName}'s atmospheric behavior into relationship timing signals. In this ${profile.regionLabel}, social comfort is shaped by ${profile.climateSummary}.`,
      sections: [
        {
          title: "Social Friction & Humidity Dynamics",
          icon: <Heart className="h-6 w-6" />,
          body: `<p>In ${cityName}, emotional patience often changes with moisture load and temperature pairing. During high humidity windows, conversations can feel more effortful even when plans are unchanged.</p><p>This is especially relevant in a ${profile.regionLabel} where ${profile.seasonalContext}. Use lower-friction weather windows for meaningful conversations and date planning.</p>`,
        },
      ],
      tips: [
        `Use calmer weather windows in ${cityName} for important relationship decisions.`,
        "Check humidity plus evening temperature before outdoor date plans.",
        profile.uniqueTip,
      ],
    };
  }

  if (feature === "travel") {
    return {
      h1: `Travel Planning & Atmospheric Intelligence for ${cityName}`,
      intro: `Travel planning in ${cityName} requires more than rain checks. AeroWeather models how ${profile.climateSummary} influences mobility, comfort, and activity timing.`,
      sections: [
        {
          title: "Transit Efficiency & Local Weather Windows",
          icon: <MapPin className="h-6 w-6" />,
          body: `<p>${cityName} can produce strong variation between commute windows due to moisture, wind, and visibility shifts. In this ${profile.regionLabel}, these patterns are often the hidden cause of schedule slippage.</p><p>Our travel layer identifies the most reliable windows so you can optimize transit, outdoor plans, and city movement with less uncertainty.</p>`,
        },
      ],
      tips: [
        `Use hourly visibility and wind checks before long transfers in ${cityName}.`,
        "Plan high-mobility activities during stable pressure windows.",
        profile.uniqueTip,
      ],
    };
  }

  if (feature === "meditation") {
    return {
      h1: `Meditation & Mental Clarity Weather in ${cityName}`,
      intro: `Your focus state is linked to atmospheric rhythm. In ${cityName}, ${profile.climateSummary} often changes how restful or restless a day feels.`,
      sections: [
        {
          title: "Pressure Rhythm & Emotional Regulation",
          icon: <Brain className="h-6 w-6" />,
          body: `<p>Low-pressure shifts in ${cityName} can increase emotional noise and reduce perceived clarity, while stable pressure phases often support deeper mindfulness sessions.</p><p>Within this ${profile.regionLabel}, ${profile.seasonalContext}. Adapting meditation style to weather state improves consistency and resilience.</p>`,
        },
      ],
      tips: [
        `Match breathwork intensity to the atmospheric load in ${cityName}.`,
        "On high-friction days, choose shorter grounding sessions over long deep-focus blocks.",
        profile.uniqueTip,
      ],
    };
  }

  return {
    h1: `Weather Impact on Mood & Productivity in ${cityName} Today`,
    intro: `AeroWeather decodes how current conditions in ${cityName} affect cognition and energy. In this ${profile.regionLabel}, ${profile.climateSummary}.`,
    sections: [
      {
        title: "Atmospheric Influence on Cognitive Output",
        icon: <Zap className="h-6 w-6" />,
        body: `<p>Productivity in ${cityName} is strongly tied to pressure direction, humidity load, and overnight recovery conditions. Stable pressure periods tend to improve concentration, while high-moisture periods can increase mental fatigue.</p><p>Because ${cityName} sits in a ${profile.regionLabel}, ${profile.seasonalContext}. This makes weather-aware planning materially useful for demanding workdays.</p>`,
      },
      {
        title: "Health & Vitality Signals",
        icon: <Brain className="h-6 w-6" />,
        body: `<p>Air quality and moisture stress combine to shape stamina and emotional steadiness. Monitoring these signals in ${cityName} helps you decide whether today should prioritize execution, recovery, or low-friction tasks.</p>`,
      },
    ],
    tips: [
      `Schedule deep work in ${cityName} when pressure is stable and humidity is moderate.`,
      "Pair AQI checks with hydration strategy to reduce cognitive drop-offs.",
      profile.uniqueTip,
    ],
  };
}

export function getSeoContent(city: string, feature: string) {
  const cityName = displayCity(city);
  const featureKey = (feature as FeatureKey) || "impact";
  const profile = getRegionProfile(city);
  const baseContent = buildFeatureSections(cityName, featureKey, profile);

  const regionalSection = {
    title: `Regional Climate Notes for ${cityName}`,
    icon: <MapPin className="h-6 w-6" />,
    body: `<p>${cityName} follows a ${profile.regionLabel} pattern. This means day-to-day comfort is often influenced by ${profile.climateSummary}.</p><p>Seasonally, ${profile.seasonalContext}. Building plans around this pattern reduces avoidable friction in work, relationships, and travel.</p>`,
  };

  const methodologySection = {
    title: "Atmospheric Context Methodology",
    icon: <Zap className="h-6 w-6" />,
    body: `<p>AeroWeather combines pressure trend, dew point, wind profile, humidity, and AQI context to generate practical weather intelligence for ${cityName}. The goal is not just forecast visibility, but clearer decision timing.</p><p>By using region-aware interpretation and city-level weather behavior, each ${cityName} page reflects a unique context rather than a generic city template.</p>`,
  };

  return {
    ...baseContent,
    sections: [...baseContent.sections, regionalSection, methodologySection],
  };
}
