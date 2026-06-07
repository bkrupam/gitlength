export type TrendingSince = "daily" | "weekly" | "monthly";

export interface TrendingRepo {
  author: string;
  name: string;
  url: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  starsToday: number;
}

export interface ToolIdea {
  toolName: string;
  tagline: string;
  whoItsFor: string;
  problemItSolves: string;
  toolConcept: string;
  buildFirst: string[];
  extraEnhancements: string[];
  whatMakesYoursUseful: string;
}
