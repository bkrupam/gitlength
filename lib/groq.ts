import Groq from "groq-sdk";
import { IDEA_SYSTEM_PROMPT, buildIdeaUserMessage } from "./idea-prompt";
import type { PriorIdea, ToolIdea, TrendingRepo } from "./types";

const MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
const TEMPERATURE_INITIAL = 0.95;
const TEMPERATURE_REGENERATE = 1.05;

function getGroqClient() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not configured");
  }
  return new Groq({ apiKey });
}

function stripJsonFences(content: string): string {
  const trimmed = content.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  if (fenced) return fenced[1].trim();

  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start !== -1 && end > start) {
    return trimmed.slice(start, end + 1);
  }

  return trimmed;
}

function parseIdea(content: string): ToolIdea {
  let parsed: ToolIdea;
  try {
    parsed = JSON.parse(stripJsonFences(content)) as ToolIdea;
  } catch {
    throw new Error("Invalid idea response from LLM");
  }

  const requiredStrings = [
    "toolName",
    "tagline",
    "theBorrowedIdea",
    "theTwist",
    "whoItsFor",
    "problemItSolves",
    "whyItsCool",
    "whyNow",
  ] as const;

  for (const key of requiredStrings) {
    if (typeof parsed[key] !== "string") {
      throw new Error("Invalid idea response from LLM");
    }
  }

  if (
    !Array.isArray(parsed.buildSketch) ||
    parsed.buildSketch.length !== 4 ||
    !Array.isArray(parsed.stretchIdeas) ||
    parsed.stretchIdeas.length !== 3
  ) {
    throw new Error("Invalid idea response from LLM");
  }

  return parsed;
}

async function completeIdea(
  repos: TrendingRepo[],
  readmes: string[],
  priorIdeas: PriorIdea[]
): Promise<ToolIdea> {
  const isRegenerate = priorIdeas.length > 0;

  const completion = await getGroqClient().chat.completions.create({
    model: MODEL,
    temperature: isRegenerate ? TEMPERATURE_REGENERATE : TEMPERATURE_INITIAL,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: IDEA_SYSTEM_PROMPT },
      {
        role: "user",
        content: buildIdeaUserMessage(repos, readmes, priorIdeas),
      },
    ],
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) throw new Error("Empty response from Groq");
  return parseIdea(content);
}

export async function generateIdea(
  repo: TrendingRepo,
  readme: string,
  priorIdeas: PriorIdea[] = []
): Promise<ToolIdea> {
  return completeIdea([repo], [readme], priorIdeas);
}

export async function generateHybridIdea(
  repoA: TrendingRepo,
  readmeA: string,
  repoB: TrendingRepo,
  readmeB: string,
  priorIdeas: PriorIdea[] = []
): Promise<ToolIdea> {
  return completeIdea([repoA, repoB], [readmeA, readmeB], priorIdeas);
}
