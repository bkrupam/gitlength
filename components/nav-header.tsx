"use client";

import { Button } from "@/components/ui/button";

interface NavHeaderProps {
  combineMode: boolean;
  onCombineModeChange: (enabled: boolean) => void;
}

export function NavHeader({ combineMode, onCombineModeChange }: NavHeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-paper-white">
      <div className="page-container flex h-[72px] items-center justify-between py-[var(--spacing-24)]">
        <a href="/" className="type-wordmark lowercase text-onyx-button">
          gitlength
        </a>

        <nav className="hidden items-center gap-[var(--spacing-32)] md:flex">
          <a
            href="#repos"
            className="type-body-sm font-medium text-midnight-ink transition-colors hover:text-charcoal-whisper"
          >
            Trending repos
          </a>
          <button
            type="button"
            onClick={() => onCombineModeChange(!combineMode)}
            className="type-body-sm font-medium text-midnight-ink transition-colors hover:text-charcoal-whisper"
          >
            {combineMode ? "Exit mix mode" : "Mix repos"}
          </button>
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
            className="hidden md:inline-flex"
            onClick={() =>
              document.getElementById("repos")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Browse trending
          </Button>
        </div>
      </div>
    </header>
  );
}
