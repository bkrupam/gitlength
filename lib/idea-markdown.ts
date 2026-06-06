import type { MicroSaasIdea, TrendingRepo } from "./types";

export function ideaToMarkdown(
  idea: MicroSaasIdea,
  repos: TrendingRepo[],
  mode: "single" | "hybrid"
): string {
  const source =
    mode === "hybrid"
      ? `**Sources:** ${repos.map((r) => `${r.author}/${r.name}`).join(" + ")}`
      : `**Source:** ${repos[0].author}/${repos[0].name}`;

  return `# ${idea.productName}

> ${idea.tagline}

${source}

## Target Audience
${idea.targetAudience}

## Core Problem
${idea.coreProblem}

## Micro-SaaS Twist
${idea.microSaasTwist}

## MVP Features
${idea.mvpFeatures.map((f) => `- ${f}`).join("\n")}

## Revenue Model
${idea.revenueModel}

## Differentiator
${idea.differentiator}

## Go-to-Market
${idea.goToMarket.map((c) => `- ${c}`).join("\n")}
`;
}
