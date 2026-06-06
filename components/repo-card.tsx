"use client";

import { cn } from "@/lib/utils";
import type { TrendingRepo } from "@/lib/types";

const CARD_THEMES = [
  {
    bg: "bg-card-sky",
    title: "text-card-sky-ink",
    meta: "text-card-sky-muted",
    body: "text-card-sky-body",
    divider: "bg-card-sky-ink/10",
    chip: "bg-paper-white/80 text-card-sky-ink",
    stat: "text-card-sky-ink",
    avatar: "bg-magenta-tile",
  },
  {
    bg: "bg-card-lilac",
    title: "text-card-lilac-ink",
    meta: "text-card-lilac-muted",
    body: "text-card-lilac-body",
    divider: "bg-card-lilac-ink/10",
    chip: "bg-paper-white/80 text-card-lilac-ink",
    stat: "text-card-lilac-ink",
    avatar: "bg-iris-glow",
  },
  {
    bg: "bg-card-petal",
    title: "text-card-petal-ink",
    meta: "text-card-petal-muted",
    body: "text-card-petal-body",
    divider: "bg-card-petal-ink/10",
    chip: "bg-paper-white/80 text-card-petal-ink",
    stat: "text-card-petal-ink",
    avatar: "bg-magenta-tile",
  },
] as const;

interface RepoCardProps {
  repo: TrendingRepo;
  active?: boolean;
  selected?: boolean;
  onClick?: () => void;
  index?: number;
}

export function RepoCard({
  repo,
  active = false,
  selected = false,
  onClick,
  index = 0,
}: RepoCardProps) {
  const isHighlighted = active || selected;
  const theme = CARD_THEMES[index % CARD_THEMES.length];

  const metaParts = [
    `${repo.stars.toLocaleString()} stars`,
    repo.language || null,
    `${repo.forks.toLocaleString()} forks`,
  ].filter(Boolean);

  return (
    <button type="button" onClick={onClick} className="w-full text-left">
      <article
        className={cn(
          "flex h-full flex-col rounded-[var(--radius-cards)] p-[var(--card-padding)] shadow-[var(--shadow-subtle)]",
          theme.bg,
          isHighlighted && "ring-2 ring-invoice-blue"
        )}
      >
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
      </article>
    </button>
  );
}
