"use client";

import { cn } from "@/lib/utils";

export type SourceMode = "trending" | "paste";

const MODES: { label: string; value: SourceMode }[] = [
  { label: "Trending repos", value: "trending" },
  { label: "Paste URL", value: "paste" },
];

interface SourceModeTabsProps {
  mode: SourceMode;
  onModeChange: (mode: SourceMode) => void;
}

export function SourceModeTabs({ mode, onModeChange }: SourceModeTabsProps) {
  return (
    <div
      className="inline-flex rounded-[var(--radius-buttons)] bg-paper-white p-1 shadow-[var(--shadow-subtle)]"
      role="tablist"
      aria-label="Idea source"
    >
      {MODES.map((item) => {
        const active = mode === item.value;
        return (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onModeChange(item.value)}
            className={cn(
              "rounded-[var(--radius-buttons)] px-6 py-[10px] type-body-sm font-medium transition-colors",
              active
                ? "bg-onyx-button text-paper-white shadow-[var(--shadow-subtle-2)]"
                : "text-graphite-mute hover:text-midnight-ink"
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
