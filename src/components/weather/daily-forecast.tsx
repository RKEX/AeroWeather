"use client";

import { useLanguage } from "@/components/Providers/language-provider";
import GlassCard from "@/components/ui/GlassCard";
import { getDaySlug } from "@/lib/day-slug";
import { toLocaleTag } from "@/lib/i18n";
import { getWeatherIcon } from "@/lib/weather-theme";
import { Link } from "@/navigation";
import { WeatherData } from "@/types/weather";
import { Droplets } from "lucide-react";
import { ElementType, memo, useMemo } from "react";

interface DailyForecastProps {
  weather: WeatherData;
}

function tempColor(temp: number): string {
  if (temp < 15) return "text-blue-400";
  if (temp > 30) return "text-orange-400";
  return "text-white";
}

export const DetailMetric = memo(({
  icon: Icon,
  label,
  value,
}: {
  icon?: ElementType;
  label: string;
  value: string | number;
}) => {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 transition-all hover:bg-white/10">
      {Icon && <Icon className="h-5 w-5 shrink-0 text-white/60" />}
      <div className="min-w-0">
        <p className="mb-0.5 truncate text-[10px] uppercase tracking-widest text-white/50">
          {label}
        </p>
        <p className="text-lg font-semibold leading-none text-white">{value}</p>
      </div>
    </div>
  );
});
DetailMetric.displayName = "DetailMetric";

const DailyForecastComponent = ({ weather }: DailyForecastProps) => {
  const textPrimary = "text-white";
  const textSecondary = "text-white/80";
  const { t, language } = useLanguage();
  const dayLabelFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(toLocaleTag(language), {
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
    [language]
  );

  const daily = weather.daily;
  const hourly = weather.hourly;

  const forecastDays = useMemo(() => {
    const getAggregates = (dayIdx: number) => {
      const start = dayIdx * 24;
      const humSlice = hourly.relativeHumidity2m.slice(start, start + 24);
      const windSlice = hourly.windSpeed10m.slice(start, start + 24);
      const avgHumidity =
        humSlice.length > 0
          ? Math.round(humSlice.reduce((a, b) => a + b, 0) / humSlice.length)
          : 0;
      const maxWind =
        windSlice.length > 0 ? Math.round(Math.max(...windSlice)) : 0;
      return { avgHumidity, maxWind };
    };

    // ✅ সব dates বানাও duplicate detection এর জন্য
    const allDates = daily.time.slice(1, 8).map((t) => new Date(t + "T00:00:00"));

    return daily.time.slice(1, 8).map((time, i) => {
      const globalIdx = i + 1;
      const aggs = getAggregates(globalIdx);
      const date = new Date(time + "T00:00:00");
      return {
        date,
        // ✅ allDates pass করো যাতে duplicate weekday detect হয়
        slug: getDaySlug(date, allDates),
        maxTemp: daily.temperature2mMax[globalIdx] !== undefined ? Math.round(daily.temperature2mMax[globalIdx]) : null,
        minTemp: daily.temperature2mMin[globalIdx] !== undefined ? Math.round(daily.temperature2mMin[globalIdx]) : null,
        code: daily.weatherCode[globalIdx] ?? 0,
        precipProb: daily.precipitationProbabilityMax[globalIdx] ?? null,
        uvIndexMax: daily.uvIndexMax?.[globalIdx]
          ? Math.round(daily.uvIndexMax[globalIdx])
          : 0,
        avgHumidity: aggs.avgHumidity,
        maxWind: aggs.maxWind,
      };
    });
  }, [daily, hourly]);

  return (
    <GlassCard className="flex w-full flex-col gap-3 p-6">
      <h3 className={`mb-2 text-xl font-semibold tracking-tight ${textPrimary}`}>
        {t("sevenDayForecast")}
      </h3>

      <div className="flex flex-col gap-2 touch-pan-y">
        {forecastDays.map((day, i) => {
          const Icon = getWeatherIcon(day.code, true);
          const label = i === 0 ? t("tomorrow") : dayLabelFormatter.format(day.date);
          const itemBg = "bg-white/5 border-white/10 hover:bg-white/10";

          return (
            <Link key={i} href={`/weather/${day.slug}`} className="outline-none">
              <div
                className={`flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 transition-all duration-150 hover:translate-x-0.5 hover:scale-[1.01] active:scale-[0.99] ${itemBg}`}
              >
                <span className={`w-28 shrink-0 text-sm font-medium ${textSecondary}`}>
                  {label}
                </span>

                <div className="flex flex-1 items-center justify-center gap-1.5">
                  <Icon className={`h-5 w-5 ${textPrimary}`} />
                  {day.precipProb !== null && day.precipProb > 5 && (
                    <span className="flex items-center gap-0.5 text-[10px] text-blue-500 font-bold">
                      <Droplets className="h-2.5 w-2.5" />
                      {day.precipProb}%
                    </span>
                  )}
                </div>

                <div className="flex gap-2 font-semibold">
                  <span className={day.maxTemp !== null ? tempColor(day.maxTemp) : "text-white/40"}>
                    {day.maxTemp !== null ? `${day.maxTemp}°` : "--"}
                  </span>
                  <span className="text-slate-400">
                    {day.minTemp !== null ? `${day.minTemp}°` : "--"}
                  </span>
                </div>

                <svg className="h-4 w-4 shrink-0 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          );
        })}
      </div>
    </GlassCard>
  );
};

export const DailyForecast = memo(DailyForecastComponent);
DailyForecast.displayName = "DailyForecast";

export { DetailMetric as _DetailMetric, tempColor };

