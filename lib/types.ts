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
  theBorrowedIdea: string;
  theTwist: string;
  whoItsFor: string;
  problemItSolves: string;
  whyItsCool: string;
  whyNow: string;
  buildSketch: string[];
  stretchIdeas: string[];
}

/** Shown ideas passed back on regenerate to avoid repeats. */
export interface PriorIdea {
  toolName: string;
  theBorrowedIdea: string;
}
