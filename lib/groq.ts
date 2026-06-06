import Groq from "groq-sdk";
import { mockGenerateHybridIdea, mockGenerateIdea } from "./mock-idea";
import type { MicroSaasIdea, TrendingRepo } from "./types";

const MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
const USE_MOCK = process.env.USE_MOCK_IDEAS === "true";

function getGroqClient() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not configured");
  }
  return new Groq({ apiKey });
}

const SYSTEM_PROMPT = `You are a startup strategist who turns open-source GitHub repositories into viable micro-SaaS product ideas.
Return ONLY valid JSON with these exact keys:
productName, tagline, targetAudience, coreProblem, microSaasTwist, mvpFeatures (array of 5 strings), revenueModel, differentiator, goToMarket (array of 3 strings).
Focus on realistic monetization, a clear wedge vs the OSS project, and an MVP a solo founder could ship in weeks.`;

function parseIdea(content: string): MicroSaasIdea {
  const parsed = JSON.parse(content) as MicroSaasIdea;
  if (!parsed.productName || !Array.isArray(parsed.mvpFeatures)) {
    throw new Error("Invalid idea response from LLM");
  }
  return parsed;
}

export function isMockIdeasEnabled() {
  return USE_MOCK;
}

export async function generateIdea(
  repo: TrendingRepo,
  readme: string
): Promise<MicroSaasIdea> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 600));
    return mockGenerateIdea(repo);
  }

  const completion = await getGroqClient().chat.completions.create({
    model: MODEL,
    temperature: 0.8,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `Repository: ${repo.author}/${repo.name}
URL: ${repo.url}
Language: ${repo.language || "Unknown"}
Stars: ${repo.stars}
Description: ${repo.description || "No description"}
README excerpt:
${readme}`,
      },
    ],
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) throw new Error("Empty response from Groq");
  return parseIdea(content);
}

export async function generateHybridIdea(
  repoA: TrendingRepo,
  readmeA: string,
  repoB: TrendingRepo,
  readmeB: string
): Promise<MicroSaasIdea> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 800));
    return mockGenerateHybridIdea(repoA, repoB);
  }

  const completion = await getGroqClient().chat.completions.create({
    model: MODEL,
    temperature: 0.9,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `${SYSTEM_PROMPT}
You are combining TWO trending repositories into one hybrid micro-SaaS concept that fuses their strengths.`,
      },
      {
        role: "user",
        content: `Repo A: ${repoA.author}/${repoA.name}
Description: ${repoA.description}
README A:
${readmeA}

Repo B: ${repoB.author}/${repoB.name}
Description: ${repoB.description}
README B:
${readmeB}`,
      },
    ],
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) throw new Error("Empty response from Groq");
  return parseIdea(content);
}
