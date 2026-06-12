import { NextRequest, NextResponse } from "next/server";
import { getCached, getCachedMeta, getCachedStale, setCached } from "@/lib/cache";
import { scrapeTrending } from "@/lib/scrape";
import { trendingCacheKey, trendingCacheTtl } from "@/lib/trending-cache";
import type { TrendingSince } from "@/lib/types";

export const dynamic = "force-dynamic";

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, max-age=0",
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const language = searchParams.get("language") || "";
    const since = (searchParams.get("since") || "daily") as TrendingSince;

    if (!["daily", "weekly", "monthly"].includes(since)) {
      return NextResponse.json(
        { error: "Invalid since parameter" },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    const cacheKey = trendingCacheKey(language, since);
    const ttlMs = trendingCacheTtl(since);

    const fresh = getCached<Awaited<ReturnType<typeof scrapeTrending>>>(cacheKey);
    if (fresh) {
      const meta = getCachedMeta(cacheKey);
      return NextResponse.json(
        {
          repos: fresh,
          cached: true,
          stale: false,
          fetchedAt: meta?.fetchedAt ?? Date.now(),
        },
        { headers: NO_CACHE_HEADERS }
      );
    }

    try {
      const repos = await scrapeTrending(language, since);
      setCached(cacheKey, repos, ttlMs);

      return NextResponse.json(
        {
          repos,
          cached: false,
          stale: false,
          fetchedAt: Date.now(),
        },
        { headers: NO_CACHE_HEADERS }
      );
    } catch (scrapeError) {
      console.error("Trending scrape error:", scrapeError);

      const fallback = getCachedStale<
        Awaited<ReturnType<typeof scrapeTrending>>
      >(cacheKey);
      if (fallback) {
        console.warn(
          `Serving stale trending cache for ${cacheKey} after scrape failure`
        );
        return NextResponse.json(
          {
            repos: fallback.value,
            cached: true,
            stale: true,
            fetchedAt: fallback.fetchedAt,
          },
          { headers: NO_CACHE_HEADERS }
        );
      }

      throw scrapeError;
    }
  } catch (error) {
    console.error("Trending API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch trending repositories" },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}
