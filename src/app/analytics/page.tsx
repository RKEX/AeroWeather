"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  Globe, 
  MapPin, 
  TrendingUp, 
  ArrowUpRight, 
  ChevronDown,
  BarChart3,
  Activity
} from "lucide-react";

const TRAFFIC_DATA = [
  { day: "Mon", visitors: 12000 },
  { day: "Tue", visitors: 15400 },
  { day: "Wed", visitors: 13200 },
  { day: "Thu", visitors: 18900 },
  { day: "Fri", visitors: 22100 },
  { day: "Sat", visitors: 25400 },
  { day: "Sun", visitors: 21200 },
];

const COUNTRY_DATA = [
  { name: "United States", code: "US", flag: "🇺🇸", visitors: 45200 },
  { name: "India", code: "IN", flag: "🇮🇳", visitors: 38700 },
  { name: "United Kingdom", code: "GB", flag: "🇬🇧", visitors: 18400 },
  { name: "Germany", code: "DE", flag: "🇩🇪", visitors: 12100 },
  { name: "Japan", code: "JP", flag: "🇯🇵", visitors: 8900 },
  { name: "Canada", code: "CA", flag: "🇨🇦", visitors: 6500 },
];

const CITY_DATA = [
  { name: "New York", country: "US", visitors: 12400 },
  { name: "Kolkata", country: "IN", visitors: 9800 },
  { name: "London", country: "GB", visitors: 8200 },
  { name: "Berlin", country: "DE", visitors: 5400 },
  { name: "Tokyo", country: "JP", visitors: 4900 },
];

export default function AnalyticsPage() {
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  const sortedCountries = [...COUNTRY_DATA].sort((a, b) => 
    sortOrder === "desc" ? b.visitors - a.visitors : a.visitors - b.visitors
  );

  const totalVisitors = TRAFFIC_DATA.reduce((acc, curr) => acc + curr.visitors, 0);
  
  return (
    <main className="mx-auto max-w-7xl px-4 py-20">
      <header className="mb-16">
        <div className="flex items-center gap-3 text-indigo-400 mb-4">
          <Activity className="h-6 w-6" />
          <span className="text-sm font-black uppercase tracking-[0.3em]">Platform Analytics</span>
        </div>
        <h1 className="text-4xl font-black text-white md:text-6xl tracking-tight">
          Performance <span className="text-white/40">&</span> Traffic
        </h1>
      </header>

      {/* Summary Cards */}
      <section className="grid gap-6 md:grid-cols-3 mb-12">
        <SummaryCard 
          title="Total Visitors" 
          value={totalVisitors.toLocaleString()} 
          icon={<Users className="h-6 w-6" />}
          trend="+12.5%"
        />
        <SummaryCard 
          title="Top Country" 
          value={COUNTRY_DATA[0].name} 
          icon={<Globe className="h-6 w-6" />}
          subValue={`${COUNTRY_DATA[0].flag} ${(COUNTRY_DATA[0].visitors / totalVisitors * 100).toFixed(1)}% share`}
        />
        <SummaryCard 
          title="Top City" 
          value={CITY_DATA[0].name} 
          icon={<MapPin className="h-6 w-6" />}
          subValue={`${CITY_DATA[0].visitors.toLocaleString()} active users`}
        />
      </section>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Traffic Trend Chart */}
        <section className="rounded-[2.5rem] border border-white/10 bg-white/5 p-8">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-indigo-400" />
              Traffic Trend
            </h2>
            <span className="text-xs font-bold text-white/30 uppercase tracking-widest">Last 7 Days</span>
          </div>
          
          <div className="h-64 w-full flex items-end gap-3 px-4">
            {TRAFFIC_DATA.map((d, i) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-4 group">
                <div className="relative w-full">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${(d.visitors / 30000) * 100}%` }}
                    transition={{ delay: i * 0.1, duration: 1, ease: "circOut" }}
                    className="w-full bg-indigo-500/20 group-hover:bg-indigo-500/40 rounded-t-xl border-t border-indigo-500/30 transition-colors"
                  />
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white text-slate-900 text-[10px] font-black px-2 py-1 rounded-md pointer-events-none">
                    {d.visitors.toLocaleString()}
                  </div>
                </div>
                <span className="text-xs font-bold text-white/30">{d.day}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Countries Table */}
        <section className="rounded-[2.5rem] border border-white/10 bg-white/5 p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              <BarChart3 className="h-5 w-5 text-indigo-400" />
              Geographical Reach
            </h2>
            <button 
              onClick={() => setSortOrder(prev => prev === "desc" ? "asc" : "desc")}
              className="flex items-center gap-2 rounded-xl bg-white/5 px-4 py-2 text-xs font-bold text-white/60 hover:bg-white/10 hover:text-white transition-all"
            >
              Sort by Visitors
              <ChevronDown className={`h-4 w-4 transition-transform ${sortOrder === "asc" ? "rotate-180" : ""}`} />
            </button>
          </div>

          <div className="space-y-4">
            {sortedCountries.map((c, i) => (
              <div key={c.code} className="flex items-center gap-4 group">
                <div className="text-2xl w-8 h-8 flex items-center justify-center bg-white/5 rounded-lg border border-white/5">
                  {c.flag}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm font-bold text-white">{c.name}</span>
                    <span className="text-xs font-black text-indigo-400">{c.visitors.toLocaleString()}</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(c.visitors / 50000) * 100}%` }}
                      transition={{ delay: i * 0.1 + 0.5, duration: 1, ease: "circOut" }}
                      className="h-full bg-indigo-500/50 group-hover:bg-indigo-400 transition-colors"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

interface SummaryCardProps {
  title: string;
  value: string;
  icon: React.ReactElement;
  trend?: string;
  subValue?: string;
}

function SummaryCard({ title, value, icon, trend, subValue }: SummaryCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-8 transition-all hover:bg-white/10 hover:border-white/20">
      <div className="absolute -right-4 -top-4 text-white/5 transition-transform group-hover:scale-110 group-hover:rotate-12">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {React.cloneElement(icon, { size: 120 } as any)}
      </div>
      <div className="relative z-10">
        <div className="mb-6 flex items-center justify-between">
          <div className="rounded-xl bg-indigo-500/10 p-3 text-indigo-400">
            {icon}
          </div>
          {trend && (
            <span className="flex items-center gap-1 text-xs font-black text-green-400">
              <ArrowUpRight className="h-3 w-3" />
              {trend}
            </span>
          )}
        </div>
        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white/40 mb-2">{title}</h4>
        <div className="text-3xl font-black text-white">{value}</div>
        {subValue && <p className="mt-2 text-xs font-medium text-white/30">{subValue}</p>}
      </div>
    </div>
  );
}
