export type TravelStatus = "GOOD" | "POOR";
export type OutdoorStatus = "IDEAL" | "FAIR" | "POOR";
export type AirQualityStatus = "GOOD" | "POOR";
export type RiskStatus = "HIGH" | "LOW";
export type LoveLabel = "Excellent" | "Good" | "Neutral" | "Low";
export type MindLabel = "Peak" | "Good" | "Moderate" | "Low";

export interface ImpactDay {
  date: string;
  health: number;
  travel: TravelStatus;
  outdoor: OutdoorStatus;
  airQuality: AirQualityStatus;
  pests: RiskStatus;
  allergies: RiskStatus;
  // Love & Dating fields
  romanceScore: number;
  emotionalStability: number;
  communicationLevel: number;
  attractionEnergy: number;
  loveLabel: LoveLabel;
  loveInsight: string;
  loveTags: string[];
  loveAudience: "singles" | "couples" | "married";
  // Meditation & Mind fields
  focusLevel: number;
  stressIndex: number;
  mentalClarity: number;
  relaxationScore: number;
  mindLabel: MindLabel;
  mindInsight: string;
  mindTags: string[];
}

export interface ImpactInputDay {
  date: string;
  tempMax: number;
  tempMin: number;
  precipitationProbability: number;
  windMax: number;
  humidityMax: number;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function hashToUnit(seed: string): number {
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) / 4294967295;
}

function jitterPercent(seed: string, maxPct = 0.1): number {
  const unit = hashToUnit(seed);
  return (unit * 2 - 1) * maxPct;
}

function addDays(date: string, dayCount: number): string {
  const d = new Date(`${date}T00:00:00.000Z`);
  d.setUTCDate(d.getUTCDate() + dayCount);
  return d.toISOString().slice(0, 10);
}

export function calculateHealthScore(day: ImpactInputDay): number {
  let score = 100;
  if (day.humidityMax > 75) score -= 20;
  if (day.tempMax > 35) score -= 25;
  if (day.windMax > 25) score -= 10;
  if (day.precipitationProbability > 70) score -= 15;
  return clamp(score, 0, 100);
}

export function calculateTravelStatus(day: ImpactInputDay): TravelStatus {
  if (day.precipitationProbability > 60) return "POOR";
  if (day.windMax > 30) return "POOR";
  return "GOOD";
}

export function calculateOutdoorStatus(day: ImpactInputDay): OutdoorStatus {
  if (day.tempMax >= 20 && day.tempMax <= 30 && day.precipitationProbability < 20) {
    return "IDEAL";
  }
  if (day.precipitationProbability > 50) return "POOR";
  return "FAIR";
}

export function calculateAirQualityStatus(day: ImpactInputDay): AirQualityStatus {
  if (day.humidityMax > 75 && day.windMax < 12) return "POOR";
  return "GOOD";
}

export function calculateRiskStatus(day: ImpactInputDay): RiskStatus {
  if (day.humidityMax > 70) return "HIGH";
  if (day.tempMax > 30) return "HIGH";
  return "LOW";
}

// ─── Love & Dating Weather Logic ─────────────────────────────────────────────
// Rain  → cozy / emotional bonding
// Clear → social / outgoing / dating friendly
// Heat  → irritability / low patience
// Wind  → instability / mood swings

function calcRomanceScore(day: ImpactInputDay): number {
  let score = 72;
  if (day.precipitationProbability > 50) score += 10;
  else if (day.precipitationProbability < 15) score += 6;
  if (day.tempMax > 38) score -= 18;
  else if (day.tempMax > 34) score -= 10;
  if (day.tempMax >= 18 && day.tempMax <= 28) score += 12;
  if (day.windMax > 30) score -= 14;
  else if (day.windMax > 20) score -= 6;
  if (day.humidityMax > 80) score -= 8;
  score *= 1 + jitterPercent(`romance:${day.date}`, 0.06);
  return clamp(Math.round(score), 0, 100);
}

function calcEmotionalStability(day: ImpactInputDay): number {
  let score = 75;
  if (day.windMax > 25) score -= 16;
  else if (day.windMax > 15) score -= 6;
  if (day.precipitationProbability > 40) score += 5;
  if (day.tempMax > 36) score -= 14;
  if (day.tempMax >= 20 && day.tempMax <= 30 && day.humidityMax < 70) score += 10;
  score *= 1 + jitterPercent(`emotional:${day.date}`, 0.07);
  return clamp(Math.round(score), 0, 100);
}

function calcCommunicationLevel(day: ImpactInputDay): number {
  let score = 70;
  if (day.precipitationProbability < 20) score += 12;
  if (day.tempMax >= 22 && day.tempMax <= 30) score += 8;
  if (day.humidityMax > 80) score -= 10;
  if (day.windMax > 25) score -= 12;
  score *= 1 + jitterPercent(`comms:${day.date}`, 0.06);
  return clamp(Math.round(score), 0, 100);
}

function calcAttractionEnergy(day: ImpactInputDay): number {
  let score = 68;
  if (day.precipitationProbability < 15) score += 14;
  if (day.tempMax >= 20 && day.tempMax <= 28 && day.windMax < 15) score += 10;
  if (day.tempMax > 35) score -= 15;
  if (day.precipitationProbability > 60) score += 6;
  if (day.humidityMax > 85) score -= 8;
  score *= 1 + jitterPercent(`attract:${day.date}`, 0.07);
  return clamp(Math.round(score), 0, 100);
}

function getLoveLabel(romanceScore: number): LoveLabel {
  if (romanceScore >= 80) return "Excellent";
  if (romanceScore >= 60) return "Good";
  if (romanceScore >= 40) return "Neutral";
  return "Low";
}

const LOVE_INSIGHTS: Record<"high" | "mid" | "low", string[]> = {
  high: [
    "Today is a great day to express your feelings openly.",
    "Strong emotional clarity—ideal for meaningful conversations.",
    "High attraction window. Your confidence peaks today.",
    "Perfect conditions for sparking a deep connection.",
    "The atmosphere supports warmth and emotional resonance.",
  ],
  mid: [
    "A calm, grounded day. Quality over quantity in interactions.",
    "Moderate bonding energy. Presence matters most today.",
    "Steady emotional currents—good for meaningful chats.",
    "The atmosphere supports quiet confidence and authenticity.",
  ],
  low: [
    "Avoid misunderstandings—communication may feel tense.",
    "Low social energy—recharge and invest in self-care.",
    "The atmosphere stirs restlessness. Be patient.",
    "Take today for self-reflection. Inner clarity comes first.",
  ],
};

function pickLoveInsight(romanceScore: number, date: string): string {
  const tier = romanceScore >= 75 ? "high" : romanceScore >= 50 ? "mid" : "low";
  const pool = LOVE_INSIGHTS[tier];
  const idx = Math.floor(hashToUnit(`insight:${date}`) * pool.length);
  return pool[idx % pool.length];
}

function pickLoveAudience(date: string): "singles" | "couples" | "married" {
  const v = hashToUnit(`audience:${date}`);
  if (v < 0.33) return "singles";
  if (v < 0.66) return "couples";
  return "married";
}

function generateLoveTags(romance: number, emotional: number, comms: number, attraction: number): string[] {
  const tags: string[] = [];
  if (romance >= 80) tags.push("Perfect for Date Night");
  if (emotional >= 80 && comms >= 75) tags.push("High Chemistry");
  if (emotional >= 70 && comms >= 70) tags.push("Low Conflict Risk");
  if (attraction >= 80) tags.push("High Attraction Window");
  if (romance < 45) tags.push("Avoid Arguments");
  if (emotional >= 85) tags.push("Emotional Clarity");
  return tags.slice(0, 3);
}

// ─── Meditation & Mind Weather Logic ─────────────────────────────────────────
// Rain  → calm, reflective → high meditation & calmness
// Clear → high focus, mental clarity
// Heat  → low patience, high stress
// Wind  → unstable focus, scattered mind

function calcFocusLevel(day: ImpactInputDay): number {
  let score = 72;
  // Clear sky → sharp focus
  if (day.precipitationProbability < 20) score += 14;
  // Comfortable temp → sustained concentration
  if (day.tempMax >= 18 && day.tempMax <= 26) score += 10;
  // Heat → mental fatigue
  if (day.tempMax > 35) score -= 18;
  else if (day.tempMax > 32) score -= 8;
  // Wind → scattered attention
  if (day.windMax > 25) score -= 14;
  else if (day.windMax > 15) score -= 5;
  // High humidity → sluggishness
  if (day.humidityMax > 80) score -= 8;
  score *= 1 + jitterPercent(`focus:${day.date}`, 0.06);
  return clamp(Math.round(score), 0, 100);
}

function calcStressIndex(day: ImpactInputDay): number {
  // Higher = MORE stress (inverted: bad)
  let score = 30;
  // Heat → high stress
  if (day.tempMax > 36) score += 25;
  else if (day.tempMax > 32) score += 12;
  // Wind → agitation
  if (day.windMax > 25) score += 15;
  else if (day.windMax > 18) score += 6;
  // High humidity → discomfort stress
  if (day.humidityMax > 80) score += 10;
  // Rain → calming (reduces stress)
  if (day.precipitationProbability > 40) score -= 8;
  // Pleasant conditions → low stress
  if (day.tempMax >= 18 && day.tempMax <= 26 && day.windMax < 12) score -= 12;
  score *= 1 + jitterPercent(`stress:${day.date}`, 0.06);
  return clamp(Math.round(score), 0, 100);
}

function calcMentalClarity(day: ImpactInputDay): number {
  let score = 70;
  // Clear sky → clear mind
  if (day.precipitationProbability < 15) score += 12;
  // Moderate temp → peak clarity
  if (day.tempMax >= 18 && day.tempMax <= 28) score += 10;
  // Extreme heat → mental fog
  if (day.tempMax > 35) score -= 16;
  // Wind → mental noise
  if (day.windMax > 25) score -= 12;
  // Moderate humidity ok, high = sluggish
  if (day.humidityMax > 82) score -= 8;
  // Light rain can boost clarity (white noise)
  if (day.precipitationProbability >= 30 && day.precipitationProbability <= 60) score += 6;
  score *= 1 + jitterPercent(`clarity:${day.date}`, 0.07);
  return clamp(Math.round(score), 0, 100);
}

function calcRelaxationScore(day: ImpactInputDay): number {
  let score = 68;
  // Rain → deeply calming, cozy
  if (day.precipitationProbability > 50) score += 14;
  else if (day.precipitationProbability > 30) score += 8;
  // Comfortable temp → ease
  if (day.tempMax >= 20 && day.tempMax <= 28) score += 10;
  // Heat → restlessness
  if (day.tempMax > 35) score -= 14;
  // Low wind → peaceful
  if (day.windMax < 10) score += 8;
  else if (day.windMax > 25) score -= 10;
  // Moderate humidity comfort
  if (day.humidityMax > 85) score -= 6;
  score *= 1 + jitterPercent(`relax:${day.date}`, 0.07);
  return clamp(Math.round(score), 0, 100);
}

function getMindLabel(focus: number, clarity: number): MindLabel {
  const avg = (focus + clarity) / 2;
  if (avg >= 80) return "Peak";
  if (avg >= 60) return "Good";
  if (avg >= 40) return "Moderate";
  return "Low";
}

const MIND_INSIGHTS: Record<"high" | "mid" | "low", string[]> = {
  high: [
    "Great day for deep focus and productivity.",
    "Mental clarity is exceptionally high—tackle complex tasks.",
    "Calm environment supports mindfulness and creativity.",
    "Peak cognitive conditions. Ideal for strategic thinking.",
    "Your mind is sharp today. Make the most of it.",
  ],
  mid: [
    "Moderate focus available. Break tasks into smaller chunks.",
    "Decent mental conditions—mindful breathing can amplify clarity.",
    "A balanced day. Light meditation could boost your state.",
    "Steady mental energy. Good for routine work and reflection.",
  ],
  low: [
    "High stress signals detected—consider meditation or rest.",
    "Mental clarity may be low. Avoid major decisions if possible.",
    "The atmosphere may feel heavy—gentle stretching can help.",
    "Focus may waver today. Prioritize self-care and recovery.",
  ],
};

function pickMindInsight(focus: number, clarity: number, date: string): string {
  const avg = (focus + clarity) / 2;
  const tier = avg >= 70 ? "high" : avg >= 45 ? "mid" : "low";
  const pool = MIND_INSIGHTS[tier];
  const idx = Math.floor(hashToUnit(`mind:${date}`) * pool.length);
  return pool[idx % pool.length];
}

function generateMindTags(focus: number, stress: number, clarity: number, relaxation: number): string[] {
  const tags: string[] = [];
  if (focus >= 80) tags.push("Peak Focus");
  if (clarity >= 80) tags.push("Crystal Clear");
  if (stress <= 25) tags.push("Low Stress Day");
  if (relaxation >= 80) tags.push("Deep Calm");
  if (stress >= 65) tags.push("High Stress Alert");
  if (focus >= 70 && clarity >= 70) tags.push("Productivity Window");
  return tags.slice(0, 3);
}

export function calculateImpactDay(day: ImpactInputDay): ImpactDay {
  const romanceScore = calcRomanceScore(day);
  const emotionalStability = calcEmotionalStability(day);
  const communicationLevel = calcCommunicationLevel(day);
  const attractionEnergy = calcAttractionEnergy(day);
  const focusLevel = calcFocusLevel(day);
  const stressIndex = calcStressIndex(day);
  const mentalClarity = calcMentalClarity(day);
  const relaxationScore = calcRelaxationScore(day);

  return {
    date: day.date,
    health: calculateHealthScore(day),
    travel: calculateTravelStatus(day),
    outdoor: calculateOutdoorStatus(day),
    airQuality: calculateAirQualityStatus(day),
    pests: calculateRiskStatus(day),
    allergies: calculateRiskStatus(day),
    romanceScore,
    emotionalStability,
    communicationLevel,
    attractionEnergy,
    loveLabel: getLoveLabel(romanceScore),
    loveInsight: pickLoveInsight(romanceScore, day.date),
    loveTags: generateLoveTags(romanceScore, emotionalStability, communicationLevel, attractionEnergy),
    loveAudience: pickLoveAudience(day.date),
    focusLevel,
    stressIndex,
    mentalClarity,
    relaxationScore,
    mindLabel: getMindLabel(focusLevel, mentalClarity),
    mindInsight: pickMindInsight(focusLevel, mentalClarity, day.date),
    mindTags: generateMindTags(focusLevel, stressIndex, mentalClarity, relaxationScore),
  };
}

function buildEstimatedDay(date: string, recentDays: ImpactInputDay[], lat: number, lon: number): ImpactInputDay {
  const history = recentDays.slice(-5);
  const seedBase = `${lat.toFixed(3)}:${lon.toFixed(3)}:${date}`;

  const avgTempMax = average(history.map((d) => d.tempMax));
  const avgTempMin = average(history.map((d) => d.tempMin));
  const avgPrecip = average(history.map((d) => d.precipitationProbability));
  const avgWind = average(history.map((d) => d.windMax));
  const avgHumidity = average(history.map((d) => d.humidityMax));

  return {
    date,
    tempMax: clamp(avgTempMax * (1 + jitterPercent(`${seedBase}:tempMax`, 0.1)), -20, 55),
    tempMin: clamp(avgTempMin * (1 + jitterPercent(`${seedBase}:tempMin`, 0.1)), -30, 45),
    precipitationProbability: clamp(
      avgPrecip * (1 + jitterPercent(`${seedBase}:precip`, 0.1)),
      0,
      100
    ),
    windMax: clamp(avgWind * (1 + jitterPercent(`${seedBase}:wind`, 0.1)), 0, 120),
    humidityMax: clamp(avgHumidity * (1 + jitterPercent(`${seedBase}:humidity`, 0.1)), 15, 100),
  };
}

export function buildImpactInputs(params: {
  lat: number;
  lon: number;
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
    wind_speed_10m_max?: number[];
    windspeed_10m_max?: number[];
    relative_humidity_2m_max: number[];
  };
}): ImpactInputDay[] {
  const { lat, lon, daily } = params;

  const windArray = daily.wind_speed_10m_max ?? daily.windspeed_10m_max ?? [];

  const apiDays: ImpactInputDay[] = daily.time.map((date, index) => ({
    date,
    tempMax: daily.temperature_2m_max[index] ?? 28,
    tempMin: daily.temperature_2m_min[index] ?? 20,
    precipitationProbability: daily.precipitation_probability_max[index] ?? 30,
    windMax: windArray[index] ?? 12,
    humidityMax: daily.relative_humidity_2m_max[index] ?? 65,
  }));

  if (apiDays.length === 0) {
    throw new Error("Open-Meteo daily data is empty");
  }

  const output: ImpactInputDay[] = [...apiDays.slice(0, 30)];
  const firstDate = output[0]?.date;
  if (!firstDate) {
    throw new Error("Unable to resolve daily start date");
  }

  while (output.length < 30) {
    const date = addDays(firstDate, output.length);
    output.push(buildEstimatedDay(date, output, lat, lon));
  }

  return output;
}

export function createFallbackImpactDays(lat: number, lon: number): ImpactDay[] {
  const today = new Date();
  const inputDays: ImpactInputDay[] = Array.from({ length: 30 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index);
    const isoDate = date.toISOString().slice(0, 10);
    const seed = `${lat.toFixed(3)}:${lon.toFixed(3)}:${isoDate}`;
    const seasonal = Math.sin((index / 8) * Math.PI) * 0.08;

    const tempMax = clamp(29 * (1 + jitterPercent(`${seed}:tempMax`, 0.1) + seasonal), -10, 48);
    const tempMin = clamp(20 * (1 + jitterPercent(`${seed}:tempMin`, 0.1) + seasonal * 0.5), -15, 40);

    return {
      date: isoDate,
      tempMax,
      tempMin,
      precipitationProbability: clamp(
        35 * (1 + jitterPercent(`${seed}:precip`, 0.1) - seasonal * 0.4),
        0,
        100
      ),
      windMax: clamp(14 * (1 + jitterPercent(`${seed}:wind`, 0.1)), 0, 80),
      humidityMax: clamp(68 * (1 + jitterPercent(`${seed}:humidity`, 0.1)), 20, 100),
    };
  });

  return inputDays.map(calculateImpactDay);
}
