import Groq from "groq-sdk";
import { mockGenerateHybridIdea, mockGenerateIdea } from "./mock-idea";
import type { ToolIdea, TrendingRepo } from "./types";

const MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
const USE_MOCK = process.env.USE_MOCK_IDEAS === "true";

function getGroqClient() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not configured");
  }
  return new Groq({ apiKey });
}

const SYSTEM_PROMPT = `You are a practical builder who turns open-source GitHub repositories into useful personal or side-project tool ideas.
Return ONLY valid JSON with these exact keys:
toolName, tagline, whoItsFor, problemItSolves, toolConcept, buildFirst (array of 5 strings), extraEnhancements (array of 4 strings), whatMakesYoursUseful.
Focus on usefulness over monetization — suggest something a developer could realistically build, with concrete extras that go beyond what the upstream project already provides.
Do NOT suggest pricing, billing, subscriptions, go-to-market tactics, or a "managed SaaS layer" framing.`;

function parseIdea(content: string): ToolIdea {
  const parsed = JSON.parse(content) as ToolIdea;
  if (!parsed.toolName || !Array.isArray(parsed.buildFirst)) {
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
): Promise<ToolIdea> {
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
): Promise<ToolIdea> {
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
You are combining TWO trending repositories into one useful tool idea that borrows the best parts of each. Suggest extras that neither repo provides alone.`,
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
