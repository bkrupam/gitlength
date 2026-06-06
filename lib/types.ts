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

export interface MicroSaasIdea {
  productName: string;
  tagline: string;
  targetAudience: string;
  coreProblem: string;
  microSaasTwist: string;
  mvpFeatures: string[];
  revenueModel: string;
  differentiator: string;
  goToMarket: string[];
}
