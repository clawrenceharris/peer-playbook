import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function pluralize(value: number, unit: string) {
  return `${value} ${unit}${value === 1 ? "" : "s"}`;
}

/**
 * Converts a date-like string (anything `new Date(value)` can parse) into
 * a human readable relative time string like "3 minutes ago".
 */
export function timeAgo(dateLike: string) {
  const d = new Date(dateLike);
  const ms = d.getTime();
  if (!Number.isFinite(ms)) return "";

  const diffSeconds = Math.max(0, Math.floor((Date.now() - ms) / 1000));
  if (diffSeconds < 5) return "now";

  // Compute the absolute difference and direction
  const future = ms > Date.now();
  const absDiffSeconds = Math.abs(diffSeconds);
  const minutes = Math.floor(absDiffSeconds / 60);
  const hours = Math.floor(absDiffSeconds / 3600);
  const days = Math.floor(absDiffSeconds / 86400);
  const weeks = Math.floor(absDiffSeconds / 604800);
  const months = Math.floor(absDiffSeconds / 2592000); // ~30 days
  const years = Math.floor(absDiffSeconds / 31536000); // ~365 days

  // handle "just now" for both directions, plus in < 5 seconds
  if (absDiffSeconds < 5) return "now";

  // Helper for "next week", "next year", etc
  function nextUnit(unit: string) {
    return `next ${unit}`;
  }
  function inPluralize(num: number, unit: string) {
    return `in ${pluralize(num, unit)}`;
  }

  if (absDiffSeconds < 60)
    return future
      ? inPluralize(absDiffSeconds, "second")
      : `${pluralize(absDiffSeconds, "second")} ago`;
  if (minutes < 60)
    return future
      ? inPluralize(minutes, "minute")
      : `${pluralize(minutes, "minute")} ago`;
  if (hours < 24)
    return future
      ? inPluralize(hours, "hour")
      : `${pluralize(hours, "hour")} ago`;
  if (days === 1) return future ? "tomorrow" : "yesterday";
  if (days < 7)
    return future ? inPluralize(days, "day") : `${pluralize(days, "day")} ago`;
  if (weeks === 1) return future ? nextUnit("week") : "last week";
  if (weeks < 5)
    return future
      ? inPluralize(weeks, "week")
      : `${pluralize(weeks, "week")} ago`;
  if (months === 1) return future ? nextUnit("month") : "last month";
  if (months < 12)
    return future
      ? inPluralize(months, "month")
      : `${pluralize(months, "month")} ago`;
  if (years === 1) return future ? nextUnit("year") : "last year";
  return future
    ? inPluralize(years, "year")
    : `${pluralize(years, "year")} ago`;
}
