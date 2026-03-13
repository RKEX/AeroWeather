"use client";

import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Droplets,
  Eye,
  Gauge,
  Loader2,
  Sun,
  SunriseIcon,
  SunsetIcon,
  Thermometer,
  Wind,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { resolveDayIndex } from "@/lib/day-slug";
import { getWeatherData } from "@/lib/weather-api";
import {
  getThemeClasses,
  getWeatherIcon,
  getWeatherTheme,
} from "@/lib/weather-theme";
import { WeatherData } from "@/types/weather";

/* ─────────── Custom Recharts Tooltip ─────────── */

function HourTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value?: number }[];
  label?: string;
}) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="flex flex-col gap-1.5 rounded-xl border border-white/20 bg-black/60 p-3 text-white shadow-xl backdrop-blur-md">
      <p className="border-b border-white/20 pb-1 text-xs font-medium">
        {label}
      </p>

      <div className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-yellow-400" />
        <p className="text-sm">{payload[0]?.value}°C</p>
      </div>

      {payload[1] && (
        <div className="flex items-center gap-2">
          <Droplets className="h-3 w-3 text-blue-400" />
          <p className="text-sm text-blue-200">{payload[1]?.value}% rain</p>
        </div>
      )}
    </div>
  );
}

/* ─────────── Detail Metric Card ─────────── */

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon?: React.ElementType;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 p-4 transition-all hover:bg-white/10">
      {Icon && <Icon className="h-5 w-5 shrink-0 text-white/60" />}
      <div className="min-w-0">
        <p className="mb-0.5 truncate text-[10px] tracking-widest text-white/50 uppercase">
          {label}
        </p>
        <p className="text-lg leading-none font-semibold">{value}</p>
      </div>
    </div>
  );
}

/* ─────────── Page ─────────── */

export default function DayDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = typeof params.day === "string" ? params.day : "";

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [locationName, setLocationName] = useState("Your Location");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* Read location from localStorage and fetch fresh weather */
  useEffect(() => {
    try {
      const raw = localStorage.getItem("aeroweather_location");
      const loc =
        raw ?
          JSON.parse(raw)
        : { lat: 40.7128, lon: -74.006, name: "New York" };
      if (loc.name) setLocationName(loc.name);

      getWeatherData(loc.lat, loc.lon).then((data) => {
        if (data) {
          setWeather(data);
          const daySlug = typeof params.day === "string" ? params.day : "";
          const dayIndex = resolveDayIndex(daySlug, data.daily.time);
          if (dayIndex !== -1) {
            window.dispatchEvent(
              new CustomEvent("aeroweather_code_update", {
                detail: data.daily.weatherCode[dayIndex],
              }),
            );
          }
        } else setError("Failed to load weather data.");
        setLoading(false);
      });
    } catch {
      setError("Could not read location data.");
      setLoading(false);
    }
  }, [params.day]); // Added params.day to dependencies to re-run effect if slug changes

  /* ── Resolve which daily index matches the slug ── */
  const dayIndex = weather ? resolveDayIndex(slug, weather.daily.time) : -1;
  const daily = weather?.daily;

  /* ── Swipe navigation ── compute prev/next slugs from daily.time array */
  const allSlugs =
    weather ?
      weather.daily.time.map((t) => {
        const d = new Date(t + "T00:00:00");
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const diff = Math.round((d.getTime() - today.getTime()) / 86400000);
        if (diff === 0) return "today";
        if (diff === 1) return "tomorrow";
        return d.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
      })
    : [];
  const slugIndex = allSlugs.indexOf(slug);
  const prevSlug = slugIndex > 0 ? allSlugs[slugIndex - 1] : null;
  const nextSlug =
    slugIndex >= 0 && slugIndex < allSlugs.length - 1 ?
      allSlugs[slugIndex + 1]
    : null;

  const handleSwipe = (offsetX: number) => {
    if (offsetX < -60 && nextSlug) router.push(`/weather/${nextSlug}`);
    if (offsetX > 60 && prevSlug) router.push(`/weather/${prevSlug}`);
  };

  const dayDate =
    dayIndex >= 0 && daily ?
      new Date(daily.time[dayIndex] + "T00:00:00")
    : null;
  const maxTemp =
    dayIndex >= 0 && daily ?
      Math.round(daily.temperature2mMax[dayIndex])
    : null;
  const minTemp =
    dayIndex >= 0 && daily ?
      Math.round(daily.temperature2mMin[dayIndex])
    : null;
  const code = dayIndex >= 0 && daily ? daily.weatherCode[dayIndex] : 0;
  const precipProb =
    dayIndex >= 0 && daily ?
      (daily.precipitationProbabilityMax[dayIndex] ?? 0)
    : 0;
  const uvMax =
    dayIndex >= 0 && daily && daily.uvIndexMax ?
      Math.round(daily.uvIndexMax[dayIndex])
    : 0;
  const sunrise =
    dayIndex >= 0 && daily?.sunrise?.[dayIndex] ?
      daily.sunrise[dayIndex]
    : null;
  const sunset =
    dayIndex >= 0 && daily?.sunset?.[dayIndex] ? daily.sunset[dayIndex] : null;

  /* ── Hourly slice for that day ── */
  const hourlyChart = (() => {
    if (!weather || dayIndex < 0) return [];
    const start = dayIndex * 24;
    return weather.hourly.time.slice(start, start + 24).map((t, i) => ({
      time: format(new Date(t), "ha"),
      temp: Math.round(weather.hourly.temperature2m[start + i]),
      precip: weather.hourly.precipitationProbability[start + i],
    }));
  })();

  /* ── Hourly aggregates ── */
  const avgHumidity = (() => {
    if (!weather || dayIndex < 0) return 0;
    const start = dayIndex * 24;
    const sl = weather.hourly.relativeHumidity2m.slice(start, start + 24);
    return sl.length ?
        Math.round(sl.reduce((a, b) => a + b, 0) / sl.length)
      : 0;
  })();
  const maxWind = (() => {
    if (!weather || dayIndex < 0) return 0;
    const start = dayIndex * 24;
    const sl = weather.hourly.windSpeed10m.slice(start, start + 24);
    return sl.length ? Math.round(Math.max(...sl)) : 0;
  })();
  const avgVisibility = (() => {
    if (!weather || dayIndex < 0) return 0;
    const start = dayIndex * 24;
    const sl = weather.hourly.visibility.slice(start, start + 24);
    return sl.length ?
        Math.round(sl.reduce((a, b) => a + b, 0) / sl.length / 1000)
      : 0;
  })();

  /* ── Theme ── */
  const themeCode =
    weather ? getWeatherTheme(code, weather.current.isDay) : "clear";
  const themeClasses = getThemeClasses(themeCode);

  const WeatherIconCode = code;

  const dayLabel =
    slug === "today" ? "Today"
    : slug === "tomorrow" ? "Tomorrow"
    : slug.charAt(0).toUpperCase() + slug.slice(1);

  /* ─── Loading / Error states ─── */
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 text-white">
        <Loader2 className="h-10 w-10 animate-spin text-white/50" />
      </div>
    );
  }

  if (error || dayIndex < 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-900 text-white">
        <p className="text-white/60">
          {error ?? `Could not find forecast for "${slug}".`}
        </p>
        <Link
          href="/"
          className="rounded-xl bg-white/10 px-6 py-2 transition-colors hover:bg-white/20">
          ← Back to Dashboard
        </Link>
      </div>
    );
  }
  const DayIcon = getWeatherIcon(WeatherIconCode, true);

  return (
    <main
      className={`relative min-h-screen overflow-x-hidden text-white ${themeClasses}`}>
      {/* Background glows */}
      <div className="pointer-events-none fixed top-1/4 left-1/4 h-[50vw] w-[50vw] rounded-full bg-white/10 mix-blend-overlay blur-[150px]" />
      <div className="pointer-events-none fixed right-1/4 bottom-1/4 h-[40vw] w-[40vw] rounded-full bg-white/5 mix-blend-overlay blur-[120px]" />

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col gap-6 px-4 py-8 md:py-12">
        <AnimatePresence>
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.1}
            onDragEnd={(_, info) => handleSwipe(info.offset.x)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex cursor-grab flex-col gap-6 select-none active:cursor-grabbing">
            {/* ── Back nav ── */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 backdrop-blur-md transition-colors hover:bg-white/15">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Link>
            </motion.div>

            {/* ── Hero card ── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.45 }}
              className="flex flex-col items-start justify-between gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl sm:flex-row sm:items-center">
              <div>
                <p className="mb-1 text-sm font-medium tracking-widest text-white/50 uppercase">
                  {locationName}
                </p>
                <h1 className="text-4xl font-bold tracking-tight">
                  {dayLabel}
                </h1>
                {dayDate && (
                  <p className="mt-1 text-white/60">
                    {format(dayDate, "EEEE, MMMM do, yyyy")}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/10 px-6 py-4">
                <DayIcon className="h-14 w-14 drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]" />
                <div>
                  <div className="text-5xl leading-none font-light tracking-tighter">
                    {maxTemp}°
                  </div>
                  <div className="mt-1 text-xl text-white/40">/ {minTemp}°</div>
                </div>
              </div>
            </motion.div>

            {/* ── Hourly chart ── */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-xl">
              <h2 className="mb-5 text-lg font-semibold">Hourly Temperature</h2>
              <div className="h-52 w-full">
                <ResponsiveContainer
                  width="100%"
                  height="100%">
                  <AreaChart
                    data={hourlyChart}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient
                        id="tempGrad"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1">
                        <stop
                          offset="5%"
                          stopColor="#facc15"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#facc15"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="time"
                      stroke="rgba(255,255,255,0.3)"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      minTickGap={30}
                    />
                    <YAxis
                      stroke="rgba(255,255,255,0.3)"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => `${v}°`}
                    />
                    <Tooltip
                      content={<HourTooltip />}
                      cursor={{ stroke: "rgba(255,255,255,0.15)" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="temp"
                      stroke="#facc15"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#tempGrad)"
                      activeDot={{
                        r: 5,
                        fill: "#facc15",
                        stroke: "#fff",
                        strokeWidth: 2,
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* ── Metrics grid ── */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}>
              <h2 className="mb-3 text-lg font-semibold">Day Details</h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                <Metric
                  icon={Droplets}
                  label="Rain Prob"
                  value={`${precipProb}%`}
                />
                <Metric
                  icon={Sun}
                  label="UV Index"
                  value={uvMax}
                />
                <Metric
                  icon={Wind}
                  label="Max Wind"
                  value={`${maxWind} km/h`}
                />
                <Metric
                  icon={Thermometer}
                  label="Avg Humidity"
                  value={`${avgHumidity}%`}
                />
                <Metric
                  icon={Eye}
                  label="Avg Visibility"
                  value={`${avgVisibility} km`}
                />
                <Metric
                  icon={SunriseIcon}
                  label="Sunrise"
                  value={sunrise ? format(new Date(sunrise), "h:mm a") : "—"}
                />
                <Metric
                  icon={SunsetIcon}
                  label="Sunset"
                  value={sunset ? format(new Date(sunset), "h:mm a") : "—"}
                />
                <Metric
                  icon={Gauge}
                  label="Precip. Sum"
                  value={
                    daily?.precipitationSum?.[dayIndex] != null ?
                      `${daily.precipitationSum[dayIndex].toFixed(1)} mm`
                    : "—"
                  }
                />
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}
