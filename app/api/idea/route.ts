import { NextRequest, NextResponse } from "next/server";
import { fetchReadme } from "@/lib/github";
import { generateIdea } from "@/lib/groq";
import type { PriorIdea, TrendingRepo } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "GROQ_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const repo = body.repo as TrendingRepo | undefined;

    if (!repo?.author || !repo?.name) {
      return NextResponse.json(
        { error: "Invalid repo payload" },
        { status: 400 }
      );
    }

    const priorIdeas = (body.priorIdeas as PriorIdea[] | undefined) ?? [];
    const readme = await fetchReadme(repo.author, repo.name);
    const idea = await generateIdea(repo, readme, priorIdeas);

    return NextResponse.json({ idea });
  } catch (error) {
    console.error("Idea generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate idea" },
      { status: 500 }
    );
  }
}
