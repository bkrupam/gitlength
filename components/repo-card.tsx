"use client";

import { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { RepoCardFace } from "@/components/repo-card-face";
import { getCardTheme } from "@/lib/repo-card-themes";
import { cn } from "@/lib/utils";
import type { TrendingRepo } from "@/lib/types";

const hoverEase = [0.23, 1, 0.32, 1] as const;

export interface CardRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface RepoCardProps {
  repo: TrendingRepo;
  active?: boolean;
  selected?: boolean;
  onClick?: (rect: CardRect) => void;
  index?: number;
  flowSource?: boolean;
}

export function RepoCard({
  repo,
  active = false,
  selected = false,
  onClick,
  index = 0,
  flowSource = false,
}: RepoCardProps) {
  const cardRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const isHighlighted = active || selected;
  const theme = getCardTheme(index);
  const isInteractive = !flowSource;

  const handleClick = () => {
    if (!cardRef.current || !onClick) return;
    const rect = cardRef.current.getBoundingClientRect();
    onClick({
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "w-full rounded-[var(--radius-cards)] text-left",
        isInteractive &&
          "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-invoice-blue focus-visible:ring-offset-2"
      )}
    >
      <motion.article
        ref={cardRef}
        whileHover={
          isInteractive && !reducedMotion
            ? {
                y: -4,
                scale: 1.015,
                transition: { duration: 0.22, ease: hoverEase },
              }
            : undefined
        }
        whileTap={
          isInteractive
            ? {
                y: 0,
                scale: 0.985,
                transition: { duration: 0.12, ease: hoverEase },
              }
            : undefined
        }
        className={cn(
          "flex h-full flex-col rounded-[var(--radius-cards)] shadow-[var(--shadow-subtle)]",
          theme.bg,
          isInteractive &&
            "ring-1 ring-transparent transition-[box-shadow,ring-color] duration-200 ease-out hover:shadow-[0_10px_28px_rgba(0,0,0,0.08)] hover:ring-stone-edge/45",
          isHighlighted && "ring-2 ring-invoice-blue",
          flowSource && "pointer-events-none invisible"
        )}
        style={{ borderRadius: "var(--radius-cards)" }}
      >
        <RepoCardFace repo={repo} cardIndex={index} />
      </motion.article>
    </button>
  );
}
