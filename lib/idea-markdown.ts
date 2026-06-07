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

## Who It's For
${idea.whoItsFor}

## Problem It Solves
${idea.problemItSolves}

## Your Tool Concept
${idea.toolConcept}

## What to Build First
${idea.buildFirst.map((f) => `- ${f}`).join("\n")}

## Extra Enhancements
${idea.extraEnhancements.map((e) => `- ${e}`).join("\n")}

## What Makes Yours Useful
${idea.whatMakesYoursUseful}
`;
}
