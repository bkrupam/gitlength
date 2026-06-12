"use client";

import { Button } from "@/components/ui/button";

const GITHUB_REPO = "https://github.com/bkrupam/gitcook";
const GITHUB_CONTRIBUTE = `${GITHUB_REPO}/blob/main/CONTRIBUTING.md`;
const GITHUB_STARS = `${GITHUB_REPO}/stargazers`;

const NAV_LINKS = [
  { label: "GitHub", href: GITHUB_REPO },
  { label: "Contribute", href: GITHUB_CONTRIBUTE },
  { label: "Star", href: GITHUB_STARS },
] as const;

interface NavHeaderProps {
  combineMode: boolean;
  onCombineModeChange: (enabled: boolean) => void;
}

export function NavHeader({ combineMode, onCombineModeChange }: NavHeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-paper-white">
      <div className="page-container flex h-[72px] items-center justify-between py-[var(--spacing-24)]">
        <a href="/" className="type-wordmark lowercase text-onyx-button">
          gitcook
        </a>

        <nav className="hidden items-center gap-[var(--spacing-8)] md:flex">
          {NAV_LINKS.map((link) => (
            <Button key={link.label} variant="ghost" size="sm" asChild>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.label}
              </a>
            </Button>
          ))}
        </nav>

        <div className="flex items-center gap-[var(--element-gap)]">
          <Button
            type="button"
            variant={combineMode ? "default" : "ghost"}
            size="sm"
            className="md:hidden"
            onClick={() => onCombineModeChange(!combineMode)}
          >
            {combineMode ? "Mixing" : "Mix"}
          </Button>
          <Button
            type="button"
            variant={combineMode ? "default" : "ghost"}
            size="sm"
            className="hidden md:inline-flex"
            onClick={() => onCombineModeChange(!combineMode)}
          >
            {combineMode ? "Exit mix mode" : "Mix repos"}
          </Button>
        </div>
      </div>
    </header>
  );
}
