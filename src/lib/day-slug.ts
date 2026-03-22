/**
 * Converts a date into a URL-friendly slug for the day detail page.
 * Returns: "today", "tomorrow", or lowercase weekday e.g. "monday"
 * For duplicate weekdays (day 7+), uses date-based slug e.g. "2026-03-29"
 */
export function getDaySlug(date: Date, allDates?: Date[]): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const target = new Date(date);
  target.setHours(0, 0, 0, 0);

  const diffDays = Math.round((target.getTime() - today.getTime()) / 86400000);

  if (diffDays === 0) return "today";
  if (diffDays === 1) return "tomorrow";

  const weekdaySlug = date
    .toLocaleDateString("en-US", { weekday: "long" })
    .toLowerCase();

  // ✅ allDates দেওয়া থাকলে duplicate check করো
  if (allDates) {
    const duplicates = allDates.filter((d) => {
      const dd = new Date(d);
      dd.setHours(0, 0, 0, 0);
      const diff = Math.round((dd.getTime() - today.getTime()) / 86400000);
      if (diff <= 1) return false;
      return dd.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase() === weekdaySlug;
    });

    // ✅ একাধিক একই weekday থাকলে date-based slug ব্যবহার করো
    if (duplicates.length > 1) {
      return target.toISOString().split("T")[0]!; // "2026-03-29"
    }
  }

  return weekdaySlug;
}

/**
 * Resolves which index in `dates` (array of ISO date strings) matches a given slug.
 * Returns the index, or -1 if not found.
 */
export function resolveDayIndex(slug: string, dates: string[]): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // ✅ Date-based slug (e.g. "2026-03-29") — exact match
  if (/^\d{4}-\d{2}-\d{2}$/.test(slug)) {
    return dates.findIndex((d) => d === slug || d.startsWith(slug));
  }

  for (let i = 0; i < dates.length; i++) {
    const d = new Date(dates[i] + "T00:00:00");
    d.setHours(0, 0, 0, 0);

    const diffDays = Math.round((d.getTime() - today.getTime()) / 86400000);
    const computedSlug =
      diffDays === 0
        ? "today"
        : diffDays === 1
        ? "tomorrow"
        : d.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();

    if (computedSlug === slug) return i;
  }

  return -1;
}