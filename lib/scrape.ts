import * as cheerio from "cheerio";
import type { TrendingRepo, TrendingSince } from "./types";

function parseCount(text: string): number {
  const cleaned = text.replace(/,/g, "").trim();
  const match = cleaned.match(/([\d.]+)\s*(k|m)?/i);
  if (!match) return 0;
  const value = parseFloat(match[1]);
  const suffix = match[2]?.toLowerCase();
  if (suffix === "k") return Math.round(value * 1000);
  if (suffix === "m") return Math.round(value * 1000000);
  return Math.round(value);
}

export async function scrapeTrending(
  language = "",
  since: TrendingSince = "daily"
): Promise<TrendingRepo[]> {
  const langPath = language ? `/${encodeURIComponent(language)}` : "";
  const url = `https://github.com/trending${langPath}?since=${since}`;

  const response = await fetch(url, {
    headers: {
      "User-Agent": "Gitcook/1.0 (tool idea generator)",
      Accept: "text/html",
    },
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch trending repos: ${response.status}`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);
  const repos: TrendingRepo[] = [];

  $("article.Box-row").each((_, element) => {
    const row = $(element);
    const link = row.find("h2 a").first();
    const href = link.attr("href")?.trim() ?? "";
    const parts = href.split("/").filter(Boolean);
    if (parts.length < 2) return;

    const author = parts[0];
    const name = parts[1];

    const description =
      row.find("p.col-9").first().text().trim() ||
      row.find("p").first().text().trim();

    const language =
      row.find('span[itemprop="programmingLanguage"]').first().text().trim() ||
      "";

    const starsText = row.find('a[href$="/stargazers"]').first().text();
    const forksText = row.find('a[href$="/forks"]').first().text();

    const starsTodayText = row
      .find("span.d-inline-block.float-sm-right")
      .first()
      .text()
      .trim();

    const starsTodayMatch = starsTodayText.match(/([\d,]+)/);
    const starsToday = starsTodayMatch
      ? parseCount(starsTodayMatch[1])
      : 0;

    repos.push({
      author,
      name,
      url: `https://github.com/${author}/${name}`,
      description,
      language,
      stars: parseCount(starsText),
      forks: parseCount(forksText),
      starsToday,
    });
  });

  return repos;
}
