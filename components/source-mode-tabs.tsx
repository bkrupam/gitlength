"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export type SourceMode = "trending" | "paste";

const MODES: { label: string; value: SourceMode }[] = [
  { label: "Trending repos", value: "trending" },
  { label: "Paste URL", value: "paste" },
];

const tabEase = [0.23, 1, 0.32, 1] as const;

interface SourceModeTabsProps {
  mode: SourceMode;
  onModeChange: (mode: SourceMode) => void;
}

export function SourceModeTabs({ mode, onModeChange }: SourceModeTabsProps) {
  const reducedMotion = useReducedMotion();

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
              "relative rounded-[var(--radius-buttons)] px-6 py-[10px] type-body-sm font-medium transition-colors duration-200 ease-out",
              active ? "text-paper-white" : "text-graphite-mute hover:text-midnight-ink"
            )}
          >
            {active && (
              <motion.span
                layoutId="source-mode-pill"
                className="absolute inset-0 bg-onyx-button shadow-[var(--shadow-subtle-2)]"
                style={{ borderRadius: "var(--radius-buttons)" }}
                transition={
                  reducedMotion
                    ? { duration: 0.01 }
                    : { type: "spring", stiffness: 380, damping: 32, mass: 0.85 }
                }
              />
            )}
            <span className="relative z-10">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export const sourceModeContentTransition = {
  duration: 0.28,
  ease: tabEase,
} as const;
