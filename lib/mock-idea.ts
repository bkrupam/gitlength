import type { ToolIdea, TrendingRepo } from "./types";

function buildIdea(
  toolName: string,
  tagline: string,
  repos: TrendingRepo[]
): ToolIdea {
  const repoLabel = repos.map((r) => `${r.author}/${r.name}`).join(" + ");
  const description = repos.map((r) => r.description).filter(Boolean).join(" ");

  return {
    toolName,
    tagline,
    whoItsFor:
      "Developers who want a focused, personal workflow tool built around what the source project already does well.",
    problemItSolves:
      "The upstream project is powerful but general-purpose — you need a narrower tool tuned to your own daily workflow.",
    toolConcept: `A lightweight personal wrapper around ${repoLabel} that strips away complexity and surfaces only what you actually use — inspired by: ${description || "the core capabilities of the source project"}.`,
    buildFirst: [
      "Minimal CLI or dashboard that wraps the repo's core API",
      "Saved presets for your most common workflows",
      "Local config file for quick setup without reading the full docs",
      "One-click shortcuts for the 3 tasks you do most often",
      "Simple output viewer so results are easy to scan",
    ],
    extraEnhancements: [
      "Keyboard shortcuts for power-user flows",
      "History log so you can replay or diff past runs",
      "Plugin slot for a custom script you write yourself",
      "Export results to your notes app or clipboard in one tap",
    ],
    whatMakesYoursUseful:
      "Opinionated and small — built for your workflow, not every possible use case the upstream project supports.",
  };
}

export function mockGenerateIdea(repo: TrendingRepo): ToolIdea {
  const name = repo.name.replace(/-/g, " ");
  return buildIdea(
    `${name.charAt(0).toUpperCase()}${name.slice(1)} Kit`,
    `A personal tool inspired by ${repo.author}/${repo.name}`,
    [repo]
  );
}

export function mockGenerateHybridIdea(
  repoA: TrendingRepo,
  repoB: TrendingRepo
): ToolIdea {
  return buildIdea(
    "BlendBoard",
    `Mix ${repoA.name} and ${repoB.name} into one useful tool with extras neither provides alone`,
    [repoA, repoB]
  );
}
