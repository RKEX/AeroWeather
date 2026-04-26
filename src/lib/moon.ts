import SunCalc from "suncalc";

export interface MoonData {
  moonrise: Date | null;
  moonset: Date | null;
  phase: number;
  illumination: number;
  phaseName: string;
}

export function getMoonData(lat: number, lon: number, date: Date = new Date()): MoonData {
  const moonTimes = SunCalc.getMoonTimes(date, lat, lon);
  const illumination = SunCalc.getMoonIllumination(date);
  
  return {
    moonrise: moonTimes.rise || null,
    moonset: moonTimes.set || null,
    phase: illumination.phase,
    illumination: Math.round(illumination.fraction * 100),
    phaseName: getPhaseName(illumination.phase)
  };
}

function getPhaseName(phase: number): string {
  // SunCalc phase: 0 (New Moon) -> 0.25 (First Quarter) -> 0.5 (Full Moon) -> 0.75 (Last Quarter)
  if (phase < 0.03 || phase > 0.97) return "New Moon";
  if (phase < 0.23) return "Waxing Crescent";
  if (phase < 0.27) return "First Quarter";
  if (phase < 0.47) return "Waxing Gibbous";
  if (phase < 0.53) return "Full Moon";
  if (phase < 0.73) return "Waning Gibbous";
  if (phase < 0.77) return "Last Quarter";
  return "Waning Crescent";
}
