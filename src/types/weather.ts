export interface LocationResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
  timezone: string;
}

export interface WeatherData {
  timezone: string; // ✅ TOP LEVEL এ, current এর বাইরে
  currentTime?: string;
  utcOffsetSeconds?: number;
  current: {
    temperature2m: number;
    relativeHumidity2m: number;
    apparentTemperature: number;
    isDay: number;
    precipitation: number;
    rain: number;
    showers: number;
    snowfall: number;
    weatherCode: number;
    cloudCover: number;
    pressureMsl: number;
    surfacePressure: number;
    windSpeed10m: number;
    windDirection10m: number;
    windGusts10m: number;
  };
  hourly: {
    time: string[];
    temperature2m: number[];
    relativeHumidity2m: number[];
    apparentTemperature: number[];
    precipitationProbability: number[];
    precipitation: number[];
    weatherCode: number[];
    visibility: number[];
    windSpeed10m: number[];
    uvIndex: number[];
  };
  daily: {
    time: string[];
    weatherCode: number[];
    temperature2mMax: number[];
    temperature2mMin: number[];
    sunrise: string[];
    sunset: string[];
    uvIndexMax: number[];
    precipitationSum: number[];
    precipitationProbabilityMax: number[];
  };
  airQuality?: {
    usAqi: number;
    pm10: number;
    pm2_5: number;
    carbonMonoxide: number;
    nitrogenDioxide: number;
    sulphurDioxide: number;
    ozone: number;
  };
}