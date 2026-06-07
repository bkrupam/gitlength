"use client";

import { FollowingDots } from "@/components/following-dots";
import { getCardTheme } from "@/lib/repo-card-themes";
import { cn } from "@/lib/utils";
import type { TrendingRepo } from "@/lib/types";

interface RepoCardFaceProps {
  repo: TrendingRepo;
  cardIndex: number;
  className?: string;
  variant?: "default" | "cooking";
}

export function RepoCardFace({
  repo,
  cardIndex,
  className,
  variant = "default",
}: RepoCardFaceProps) {
  const theme = getCardTheme(cardIndex);
  const isCooking = variant === "cooking";

  const metaParts = [
    `${repo.stars.toLocaleString()} stars`,
    repo.language || null,
    `${repo.forks.toLocaleString()} forks`,
  ].filter(Boolean);

  if (isCooking) {
    return (
      <div
        className={cn(
          "flex h-full items-center justify-center p-[var(--card-padding)]",
          className
        )}
        aria-busy
        aria-live="polite"
      >
        <p
          className={cn(
            "whitespace-nowrap text-center type-subheading font-bold tracking-[var(--tracking-heading)]",
            theme.title
          )}
        >
          Cooking an idea for you
          <FollowingDots />
        </p>
      </div>
    );
  }

  return (
    <div className={cn("flex h-full flex-col p-[var(--card-padding)]", className)}>
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-paper-white shadow-[var(--shadow-subtle)]",
          theme.avatar
        )}
      >
        <span className="text-body font-semibold">
          {repo.author.charAt(0).toUpperCase()}
        </span>
      </div>

      <div className="mt-[var(--spacing-16)]">
        <h3
          className={cn(
            "truncate type-subheading font-bold tracking-[var(--tracking-subheading)]",
            theme.title
          )}
        >
          {repo.name}
        </h3>
        <p className={cn("mt-1 truncate type-body-sm", theme.meta)}>
          {repo.author} · {metaParts.join(" · ")}
        </p>
      </div>

      {repo.description && (
        <>
          <div
            className={cn(
              "mt-[var(--element-gap)] h-px w-full shrink-0",
              theme.divider
            )}
            aria-hidden
          />
          <p
            className={cn(
              "mt-[var(--element-gap)] line-clamp-3 flex-1 type-body-sm leading-[var(--leading-body-sm)]",
              theme.body
            )}
          >
            {repo.description}
          </p>
        </>
      )}

      <div className="mt-[var(--element-gap)] flex items-center justify-between gap-[var(--element-gap)]">
        <span
          className={cn(
            "inline-flex items-center rounded-[var(--radius-tags)] px-3 py-1 type-label font-medium",
            theme.chip
          )}
        >
          {repo.language || "Open source"}
        </span>
        {repo.starsToday > 0 && (
          <span className={cn("type-body-sm font-semibold", theme.stat)}>
            +{repo.starsToday.toLocaleString()} today
          </span>
        )}
      </div>
    </div>
  );
}
