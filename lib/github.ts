import type { TrendingRepo } from "./types";

const README_MAX_CHARS = 6000;

function githubHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "User-Agent": "Gitlength/1.0",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

interface GithubRepoResponse {
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
}

export async function fetchRepo(
  owner: string,
  repo: string
): Promise<TrendingRepo> {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}`,
    { headers: githubHeaders() }
  );

  if (response.status === 404) {
    throw new Error(`Repository ${owner}/${repo} was not found on GitHub.`);
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch ${owner}/${repo} from GitHub (${response.status}).`);
  }

  const data = (await response.json()) as GithubRepoResponse;
  const [author, name] = data.full_name.split("/");

  return {
    author,
    name,
    url: data.html_url,
    description: data.description ?? "",
    language: data.language ?? "",
    stars: data.stargazers_count,
    forks: data.forks_count,
    starsToday: 0,
  };
}

export async function fetchReadme(
  owner: string,
  repo: string
): Promise<string> {
  const headers: HeadersInit = {
    ...githubHeaders(),
    Accept: "application/vnd.github.raw",
  };

  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/readme`,
    { headers }
  );

  if (response.status === 404) {
    return `No README found for ${owner}/${repo}.`;
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch README for ${owner}/${repo}: ${response.status}`);
  }

  const text = await response.text();
  return text.slice(0, README_MAX_CHARS);
}
