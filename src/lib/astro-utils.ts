/**
 * Calculates moon phase (0-7) based on a specific date.
 * 0 → New Moon
 * 1 → Waxing Crescent
 * 2 → First Quarter
 * 3 → Waxing Gibbous
 * 4 → Full Moon
 * 5 → Waning Gibbous
 * 6 → Last Quarter
 * 7 → Waning Crescent
 */
export const calculateMoonPhase = (date: Date): number => {
  const lp = 2551443; // Lunar period in seconds (approx 29.53 days)
  const newMoon = new Date(1970, 0, 7, 20, 35, 0);
  const phase = ((date.getTime() - newMoon.getTime()) / 1000) % lp;
  return Math.floor((phase / lp) * 8);
};

export const getMoonPhaseName = (phaseIndex: number): string => {
  const phases = [
    "New Moon",
    "Waxing Crescent",
    "First Quarter",
    "Waxing Gibbous",
    "Full Moon",
    "Waning Gibbous",
    "Last Quarter",
    "Waning Crescent"
  ];
  return phases[phaseIndex] || "Unknown";
};

/**
 * Simple illumination calculation based on phase index.
 * 0 or 8 is New Moon (0%), 4 is Full Moon (100%)
 */
export const calculateMoonIllumination = (phaseIndex: number): number => {
  // Map 0-4-7 to 0-100-0
  const illumination = [0, 25, 50, 75, 100, 75, 50, 25];
  return illumination[phaseIndex] || 0;
};
