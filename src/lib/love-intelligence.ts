import { ImpactInputDay } from "./impact-intelligence";

// ─── Types ───────────────────────────────────────────────────────────────────

export type LoveLabel = "Excellent" | "Good" | "Neutral" | "Low";

export interface LoveDay {
  date: string;
  romanceScore: number;        // 0–100
  emotionalStability: number;  // 0–100
  communicationLevel: number;  // 0–100
  attractionEnergy: number;    // 0–100
  loveLabel: LoveLabel;
  insight: string;
  tags: string[];
  audienceHint: "singles" | "couples" | "married";
}

export type LoveSubTab = "romance" | "compatibility" | "dating" | "emotional";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

function hashToUnit(seed: string): number {
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) / 4294967295;
}

function jitter(seed: string, maxPct = 0.08): number {
  return (hashToUnit(seed) * 2 - 1) * maxPct;
}

// ─── Weather → Love Score Logic ──────────────────────────────────────────────
// Rain  → cozy / emotional bonding
// Clear → social / outgoing / dating friendly
// Heat  → irritability / low patience
// Wind  → instability / mood swings

function calcRomanceScore(day: ImpactInputDay): number {
  let score = 72;
  // Rain → cozy bonding boost
  if (day.precipitationProbability > 50) score += 10;
  else if (day.precipitationProbability < 15) score += 6;  // clear = outgoing
  // Extreme heat = irritability
  if (day.tempMax > 38) score -= 18;
  else if (day.tempMax > 34) score -= 10;
  // Comfortable temp range ideal for dates
  if (day.tempMax >= 18 && day.tempMax <= 28) score += 12;
  // High wind → mood swings, instability
  if (day.windMax > 30) score -= 14;
  else if (day.windMax > 20) score -= 6;
  // Moderate humidity → comfort
  if (day.humidityMax > 80) score -= 8;
  // Deterministic per-day jitter
  score *= 1 + jitter(`romance:${day.date}`, 0.06);
  return clamp(Math.round(score), 0, 100);
}

function calcEmotionalStability(day: ImpactInputDay): number {
  let score = 75;
  // Wind = instability
  if (day.windMax > 25) score -= 16;
  else if (day.windMax > 15) score -= 6;
  // Rain = emotional depth (slight positive)
  if (day.precipitationProbability > 40) score += 5;
  // Extreme heat = tension
  if (day.tempMax > 36) score -= 14;
  // Comfortable day → stable
  if (day.tempMax >= 20 && day.tempMax <= 30 && day.humidityMax < 70) score += 10;
  score *= 1 + jitter(`emotional:${day.date}`, 0.07);
  return clamp(Math.round(score), 0, 100);
}

function calcCommunicationLevel(day: ImpactInputDay): number {
  let score = 70;
  // Clear weather → outgoing / open communication
  if (day.precipitationProbability < 20) score += 12;
  // Moderate warmth = openness
  if (day.tempMax >= 22 && day.tempMax <= 30) score += 8;
  // High humidity → sluggishness
  if (day.humidityMax > 80) score -= 10;
  // Wind → scattered thoughts
  if (day.windMax > 25) score -= 12;
  score *= 1 + jitter(`comms:${day.date}`, 0.06);
  return clamp(Math.round(score), 0, 100);
}

function calcAttractionEnergy(day: ImpactInputDay): number {
  let score = 68;
  // Clear sky → high social energy
  if (day.precipitationProbability < 15) score += 14;
  // Perfect weather = magnetic energy
  if (day.tempMax >= 20 && day.tempMax <= 28 && day.windMax < 15) score += 10;
  // Heat → exhaustion
  if (day.tempMax > 35) score -= 15;
  // Heavy rain → cozy intimate energy (different kind)
  if (day.precipitationProbability > 60) score += 6;
  // Humidity drag
  if (day.humidityMax > 85) score -= 8;
  score *= 1 + jitter(`attract:${day.date}`, 0.07);
  return clamp(Math.round(score), 0, 100);
}

function getLoveLabel(romanceScore: number): LoveLabel {
  if (romanceScore >= 80) return "Excellent";
  if (romanceScore >= 60) return "Good";
  if (romanceScore >= 40) return "Neutral";
  return "Low";
}

// ─── AI Insight Generation ───────────────────────────────────────────────────

const SINGLES_INSIGHTS = {
  high: [
    "Today radiates magnetic energy—step outside and let new connections find you.",
    "The atmosphere is charged with social warmth. A great day to meet someone new.",
    "High attraction window detected. Your confidence peaks today.",
    "Perfect conditions for sparking a new connection. Be open to surprises.",
    "The air carries possibility. A chance encounter could shift everything.",
  ],
  mid: [
    "A calm, grounded day. Quality over quantity in social interactions.",
    "Moderate social energy—focus on genuine conversations over grand gestures.",
    "Steady emotional currents. A good day for meaningful one-on-one chats.",
    "The atmosphere supports quiet confidence. Let authenticity lead.",
  ],
  low: [
    "Take today for self-reflection. Your inner clarity matters more than external pursuit.",
    "Low social energy—recharge alone and invest in personal growth.",
    "Not the best day for first impressions. Focus on self-care instead.",
    "The atmosphere suggests introspection. Journal your thoughts.",
  ],
};

const COUPLES_INSIGHTS = {
  high: [
    "Today is a great day to express your feelings openly and freely.",
    "Strong emotional clarity—ideal for meaningful conversations with your partner.",
    "The weather amplifies emotional resonance. Plan something spontaneous together.",
    "Perfect for date night. The atmosphere supports deep connection.",
    "High chemistry day. Share something vulnerable with your partner.",
  ],
  mid: [
    "Good day to connect on small, everyday moments. Presence matters most.",
    "Moderate bonding energy. A walk together could unlock deeper connection.",
    "Emotional balance favors teamwork. Tackle something together today.",
    "Steady rhythms today—cook together, share stories, enjoy the ordinary.",
  ],
  low: [
    "Avoid misunderstandings—communication may feel tense. Choose words carefully.",
    "Low conflict risk if you give each other space today.",
    "The atmosphere stirs restlessness. Be patient with your partner.",
    "Emotional turbulence possible. Pause before reacting.",
  ],
};

const MARRIED_INSIGHTS = {
  high: [
    "Emotional harmony is strong today. Share gratitude openly.",
    "The atmosphere fosters deep trust. Revisit a cherished memory together.",
    "High stability day. Ideal for making plans or discussing the future.",
    "Strong partnership energy. Your bond feels effortless today.",
    "The weather nurtures warmth. A quiet evening together renews everything.",
  ],
  mid: [
    "Balanced day—small gestures of care amplify the connection.",
    "Moderate emotional energy. Check in with each other over coffee.",
    "Steady currents. A good day for routine comforts and shared laughter.",
    "The atmosphere supports practical love. Teamwork makes the dream work.",
  ],
  low: [
    "Give each other breathing room today. Space can strengthen bonds.",
    "Potential for miscommunication. Listen more, assume less.",
    "Low emotional bandwidth—be gentle with expectations.",
    "The weather stirs tension. Avoid heavy topics until the energy shifts.",
  ],
};

function pickInsight(pool: string[], seed: string): string {
  const idx = Math.floor(hashToUnit(seed) * pool.length);
  return pool[idx % pool.length];
}

function pickAudience(seed: string): "singles" | "couples" | "married" {
  const v = hashToUnit(seed);
  if (v < 0.33) return "singles";
  if (v < 0.66) return "couples";
  return "married";
}

function generateInsight(romanceScore: number, date: string, audience: "singles" | "couples" | "married"): string {
  const tier = romanceScore >= 75 ? "high" : romanceScore >= 50 ? "mid" : "low";
  const seed = `insight:${date}:${audience}`;
  if (audience === "singles") return pickInsight(SINGLES_INSIGHTS[tier], seed);
  if (audience === "couples") return pickInsight(COUPLES_INSIGHTS[tier], seed);
  return pickInsight(MARRIED_INSIGHTS[tier], seed);
}

// ─── Tag Badges ──────────────────────────────────────────────────────────────

function generateTags(day: LoveDay): string[] {
  const tags: string[] = [];
  if (day.romanceScore >= 80) tags.push("Perfect for Date Night");
  if (day.emotionalStability >= 80 && day.communicationLevel >= 75) tags.push("High Chemistry");
  if (day.emotionalStability >= 70 && day.communicationLevel >= 70) tags.push("Low Conflict Risk");
  if (day.attractionEnergy >= 80) tags.push("High Attraction Window");
  if (day.romanceScore < 45) tags.push("Avoid Arguments");
  if (day.emotionalStability >= 85) tags.push("Emotional Clarity");
  if (day.communicationLevel >= 85) tags.push("Open Hearts");
  return tags.slice(0, 3); // max 3 tags
}

// ─── Main Calculator ────────────────────────────────────────────────────────

export function calculateLoveDay(input: ImpactInputDay, lat: number, lon: number): LoveDay {
  const romanceScore = calcRomanceScore(input);
  const emotionalStability = calcEmotionalStability(input);
  const communicationLevel = calcCommunicationLevel(input);
  const attractionEnergy = calcAttractionEnergy(input);
  const loveLabel = getLoveLabel(romanceScore);
  const audience = pickAudience(`audience:${input.date}:${lat.toFixed(2)}:${lon.toFixed(2)}`);
  const insight = generateInsight(romanceScore, input.date, audience);

  const day: LoveDay = {
    date: input.date,
    romanceScore,
    emotionalStability,
    communicationLevel,
    attractionEnergy,
    loveLabel,
    insight,
    tags: [],
    audienceHint: audience,
  };

  day.tags = generateTags(day);
  return day;
}

// ─── Best Day Finder ─────────────────────────────────────────────────────────

export function findBestLoveDay(days: LoveDay[]): { dayIndex: number; dayName: string } | null {
  if (days.length === 0) return null;
  let bestIdx = 0;
  let bestScore = -1;
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  for (let i = 0; i < Math.min(days.length, 7); i++) {
    if (days[i].romanceScore > bestScore) {
      bestScore = days[i].romanceScore;
      bestIdx = i;
    }
  }
  const d = new Date(`${days[bestIdx].date}T00:00:00.000Z`);
  return { dayIndex: bestIdx, dayName: dayNames[d.getUTCDay()] };
}

// ─── Sub-Tab Value Extractor ─────────────────────────────────────────────────

export function getLoveSubTabValue(day: LoveDay, tab: LoveSubTab): { score: number; label: string } {
  switch (tab) {
    case "romance":
      return { score: day.romanceScore, label: `${day.romanceScore}/100` };
    case "compatibility":
      return { score: Math.round((day.emotionalStability + day.communicationLevel) / 2), label: `${Math.round((day.emotionalStability + day.communicationLevel) / 2)}/100` };
    case "dating":
      return { score: day.attractionEnergy, label: `${day.attractionEnergy}/100` };
    case "emotional":
      return { score: day.emotionalStability, label: `${day.emotionalStability}/100` };
  }
}

export function getLoveScoreColor(score: number): string {
  if (score >= 80) return "bg-rose-500 border-rose-300/40";
  if (score >= 60) return "bg-pink-500 border-pink-300/40";
  if (score >= 40) return "bg-violet-500 border-violet-300/40";
  return "bg-slate-500 border-slate-300/40";
}

export function getLoveLabelEmoji(label: LoveLabel): string {
  switch (label) {
    case "Excellent": return "❤️";
    case "Good": return "💚";
    case "Neutral": return "⚪";
    case "Low": return "💔";
  }
}
