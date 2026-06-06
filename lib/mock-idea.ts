import type { MicroSaasIdea, TrendingRepo } from "./types";

function buildIdea(
  productName: string,
  tagline: string,
  repos: TrendingRepo[]
): MicroSaasIdea {
  const repoLabel = repos.map((r) => `${r.author}/${r.name}`).join(" + ");
  const description = repos.map((r) => r.description).filter(Boolean).join(" ");

  return {
    productName,
    tagline,
    targetAudience:
      "Indie hackers, solo founders, and small product teams looking to ship a paid tool built on top of open-source momentum.",
    coreProblem:
      "Developers spot promising trending repos but struggle to translate README hype into a focused, monetizable product with a clear wedge.",
    microSaasTwist: `Instead of self-hosting ${repoLabel}, users get a managed workspace with onboarding, billing, and opinionated workflows — inspired by: ${description || "the core capabilities of the source project"}.`,
    mvpFeatures: [
      "One-click import from the source repo's setup flow",
      "Hosted dashboard with usage metrics and team seats",
      "Stripe-powered subscriptions with a generous free tier",
      "Email alerts when upstream releases breaking changes",
      "Exportable product brief and landing page copy",
    ],
    revenueModel:
      "Free for 1 project and 100 events/month. Pro at $19/mo for unlimited projects. Team at $49/mo with 5 seats and priority support.",
    differentiator:
      "Ships in days, not months — pre-packaged positioning, pricing, and GTM copy derived from what's already trending on GitHub.",
    goToMarket: [
      "Launch on Product Hunt with a 'built on trending OSS' angle",
      "Post build-in-public threads in dev communities referencing the source repo",
      "Partner with maintainers for an official hosted tier affiliate link",
    ],
  };
}

export function mockGenerateIdea(repo: TrendingRepo): MicroSaasIdea {
  const name = repo.name.replace(/-/g, " ");
  return buildIdea(
    `${name.charAt(0).toUpperCase()}${name.slice(1)} Cloud`,
    `The managed micro-SaaS layer for ${repo.author}/${repo.name}`,
    [repo]
  );
}

export function mockGenerateHybridIdea(
  repoA: TrendingRepo,
  repoB: TrendingRepo
): MicroSaasIdea {
  return buildIdea(
    "FusionStack",
    `Combine ${repoA.name} and ${repoB.name} into one revenue-ready product`,
    [repoA, repoB]
  );
}
