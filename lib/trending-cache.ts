import type { TrendingSince } from "./types";

const DAILY_REFRESH_MS = 30 * 60 * 1000;
const WEEKLY_REFRESH_MS = 60 * 60 * 1000;
const MONTHLY_REFRESH_MS = 2 * 60 * 60 * 1000;

/** UTC calendar date — GitHub daily trending resets at midnight UTC. */
function utcDateKey(): string {
  return new Date().toISOString().slice(0, 10);
}

/** UTC year-month for monthly trending periods. */
function utcMonthKey(): string {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

/** ISO week key for weekly trending periods. */
function utcWeekKey(): string {
  const d = new Date();
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil(
    ((d.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7
  );
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

/**
 * Cache key includes the trending period so a new GitHub day/week/month
 * automatically misses stale entries and triggers a fresh scrape.
 */
export function trendingCacheKey(language: string, since: TrendingSince): string {
  const lang = language || "all";
  if (since === "daily") return `trending:${utcDateKey()}:${lang}:daily`;
  if (since === "weekly") return `trending:${utcWeekKey()}:${lang}:weekly`;
  return `trending:${utcMonthKey()}:${lang}:monthly`;
}

/** How long to serve a scrape before fetching again. */
export function trendingCacheTtl(since: TrendingSince): number {
  if (since === "daily") return DAILY_REFRESH_MS;
  if (since === "weekly") return WEEKLY_REFRESH_MS;
  return MONTHLY_REFRESH_MS;
}
