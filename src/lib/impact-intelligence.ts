export type TravelStatus = "GOOD" | "POOR";
export type OutdoorStatus = "IDEAL" | "FAIR" | "POOR";
export type AirQualityStatus = "GOOD" | "POOR";
export type RiskStatus = "HIGH" | "LOW";

export interface ImpactDay {
  date: string;
  health: number;
  travel: TravelStatus;
  outdoor: OutdoorStatus;
  airQuality: AirQualityStatus;
  pests: RiskStatus;
  allergies: RiskStatus;
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

export function calculateImpactDay(day: ImpactInputDay): ImpactDay {
  return {
    date: day.date,
    health: calculateHealthScore(day),
    travel: calculateTravelStatus(day),
    outdoor: calculateOutdoorStatus(day),
    airQuality: calculateAirQualityStatus(day),
    pests: calculateRiskStatus(day),
    allergies: calculateRiskStatus(day),
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
