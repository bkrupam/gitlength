import { NextRequest, NextResponse } from "next/server";
import { fetchReadme } from "@/lib/github";
import { generateHybridIdea, isMockIdeasEnabled } from "@/lib/groq";
import type { TrendingRepo } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    if (!isMockIdeasEnabled() && !process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "GROQ_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const repoA = body.repoA as TrendingRepo | undefined;
    const repoB = body.repoB as TrendingRepo | undefined;

    if (!repoA?.author || !repoA?.name || !repoB?.author || !repoB?.name) {
      return NextResponse.json(
        { error: "Invalid repo payload" },
        { status: 400 }
      );
    }

    let readmeA = "";
    let readmeB = "";
    if (!isMockIdeasEnabled()) {
      [readmeA, readmeB] = await Promise.all([
        fetchReadme(repoA.author, repoA.name),
        fetchReadme(repoB.author, repoB.name),
      ]);
    }

    const idea = await generateHybridIdea(repoA, readmeA, repoB, readmeB);

    return NextResponse.json({ idea, mock: isMockIdeasEnabled() });
  } catch (error) {
    console.error("Combine idea error:", error);
    return NextResponse.json(
      { error: "Failed to generate hybrid idea" },
      { status: 500 }
    );
  }
}
