import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { getCached, setCached } from "@/lib/cache";
import { scrapeTrending } from "@/lib/scrape";
import type { TrendingSince } from "@/lib/types";

const CACHE_TTL_MS = 60 * 60 * 1000;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const language = searchParams.get("language") || "";
    const since = (searchParams.get("since") || "daily") as TrendingSince;

    if (!["daily", "weekly", "monthly"].includes(since)) {
      return NextResponse.json(
        { error: "Invalid since parameter" },
        { status: 400 }
      );
    }

    const cacheKey = `trending:${language}:${since}`;
    const cached = getCached<Awaited<ReturnType<typeof scrapeTrending>>>(cacheKey);
    if (cached) {
      return NextResponse.json({ repos: cached, cached: true });
    }

    const repos = await scrapeTrending(language, since);
    setCached(cacheKey, repos, CACHE_TTL_MS);

    return NextResponse.json({ repos, cached: false });
  } catch (error) {
    console.error("Trending scrape error:", error);
    return NextResponse.json(
      { error: "Failed to fetch trending repositories" },
      { status: 500 }
    );
  }
}
