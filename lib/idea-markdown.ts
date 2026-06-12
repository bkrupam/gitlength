import type { ToolIdea, TrendingRepo } from "./types";

export function ideaToMarkdown(
  idea: ToolIdea,
  repos: TrendingRepo[],
  mode: "single" | "hybrid"
): string {
  const source =
    mode === "hybrid"
      ? `**Sources:** ${repos.map((r) => `${r.author}/${r.name}`).join(" + ")}`
      : `**Source:** ${repos[0].author}/${repos[0].name}`;

  return `# ${idea.toolName}

> ${idea.tagline}

${source}

## The Borrowed Idea
${idea.theBorrowedIdea}

## The Twist
${idea.theTwist}

## Who It's For
${idea.whoItsFor}

## Problem It Solves
${idea.problemItSolves}

## Why It's Cool
${idea.whyItsCool}

## Why Now
${idea.whyNow}

## Build Sketch
${idea.buildSketch.map((step) => `- ${step}`).join("\n")}

## Stretch Ideas
${idea.stretchIdeas.map((step) => `- ${step}`).join("\n")}
`;
}
