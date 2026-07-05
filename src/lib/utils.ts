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
  if (diffSeconds < 5) return "just now";

  const minutes = Math.floor(diffSeconds / 60);
  const hours = Math.floor(diffSeconds / 3600);
  const days = Math.floor(diffSeconds / 86400);
  const weeks = Math.floor(diffSeconds / 604800);
  const months = Math.floor(diffSeconds / 2592000); // ~30 days
  const years = Math.floor(diffSeconds / 31536000); // ~365 days

  if (diffSeconds < 60) return `${pluralize(diffSeconds, "second")} ago`;
  if (minutes < 60) return `${pluralize(minutes, "minute")} ago`;
  if (hours < 24) return `${pluralize(hours, "hour")} ago`;
  if (days < 7) return `${pluralize(days, "day")} ago`;
  if (weeks < 5) return `${pluralize(weeks, "week")} ago`;
  if (months < 12) return `${pluralize(months, "month")} ago`;
  return `${pluralize(years, "year")} ago`;
}
