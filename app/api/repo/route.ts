import { NextRequest, NextResponse } from "next/server";
import { fetchRepo } from "@/lib/github";
import { parseGithubUrl } from "@/lib/parse-github-url";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const url = typeof body.url === "string" ? body.url : "";

    const parsed = parseGithubUrl(url);
    if (!parsed) {
      return NextResponse.json(
        { error: "Enter a valid GitHub URL (e.g. github.com/owner/repo)" },
        { status: 400 }
      );
    }

    const repo = await fetchRepo(parsed.owner, parsed.repo);
    return NextResponse.json({ repo });
  } catch (error) {
    console.error("Repo fetch error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to fetch repository";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
