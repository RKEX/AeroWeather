/**
 * Converts a date into a URL-friendly slug for the day detail page.
 * Returns: "today", "tomorrow", or lowercase weekday e.g. "monday"
 */
export function getDaySlug(date: Date): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const target = new Date(date);
  target.setHours(0, 0, 0, 0);

  const diffDays = Math.round((target.getTime() - today.getTime()) / 86400000);

  if (diffDays === 0) return "today";
  if (diffDays === 1) return "tomorrow";

  return date
    .toLocaleDateString("en-US", { weekday: "long" })
    .toLowerCase(); // "monday", "tuesday", etc.
}

/**
 * Resolves which index in `dates` (array of ISO date strings) matches a given slug.
 * Returns the index, or -1 if not found.
 *
 * Matches "today", "tomorrow", or weekday name like "monday".
 * Since dates can repeat (e.g. two Mondays in 10-day window), we always pick
 * the FIRST occurrence that is >= today.
 */
export function resolveDayIndex(slug: string, dates: string[]): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < dates.length; i++) {
    const d = new Date(dates[i] + "T00:00:00");
    d.setHours(0, 0, 0, 0);

    const diffDays = Math.round((d.getTime() - today.getTime()) / 86400000);
    const computedSlug =
      diffDays === 0
        ? "today"
        : diffDays === 1
        ? "tomorrow"
        : d
            .toLocaleDateString("en-US", { weekday: "long" })
            .toLowerCase();

    if (computedSlug === slug) return i;
  }

  return -1;
}
