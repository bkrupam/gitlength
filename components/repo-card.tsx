"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { TrendingRepo } from "@/lib/types";

const WASHES = ["bg-wash-sky", "bg-wash-lilac", "bg-wash-petal"] as const;
const AVATAR_COLORS = ["bg-magenta-tile", "bg-iris-glow"] as const;

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
  const washClass = WASHES[index % WASHES.length];
  const avatarClass = AVATAR_COLORS[index % AVATAR_COLORS.length];

  const metaParts = [
    `${repo.stars.toLocaleString()} stars`,
    repo.language || null,
    `${repo.forks.toLocaleString()} forks`,
  ].filter(Boolean);

  return (
    <button type="button" onClick={onClick} className="w-full text-left">
      <article
        className={cn(
          "card-surface flex h-full flex-col",
          isHighlighted && "ring-2 ring-invoice-blue"
        )}
      >
        <div
          className={cn(
            "aspect-[16/10] w-full rounded-[var(--radius-images)]",
            washClass
          )}
          aria-hidden
        />

        <div className="mt-[var(--element-gap)] flex items-center gap-[var(--element-gap)]">
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-paper-white",
              avatarClass
            )}
          >
            <span className="text-body font-semibold">
              {repo.author.charAt(0).toUpperCase()}
            </span>
          </div>
          <h3 className="truncate text-body font-semibold text-midnight-ink">
            {repo.name}
          </h3>
        </div>

        <p className="mt-[var(--element-gap)] type-body-sm text-graphite-mute">
          {repo.author} · {metaParts.join(" · ")}
        </p>

        {repo.description && (
          <p className="mt-[var(--element-gap)] line-clamp-2 flex-1 type-body-sm text-charcoal-whisper">
            {repo.description}
          </p>
        )}

        <div className="mt-[var(--element-gap)] flex items-center justify-between gap-[var(--element-gap)]">
          {repo.language ? (
            <Badge>{repo.language}</Badge>
          ) : (
            <Badge>Open source</Badge>
          )}
          {repo.starsToday > 0 && (
            <span className="type-body-sm font-medium text-invoice-blue">
              +{repo.starsToday.toLocaleString()} today
            </span>
          )}
        </div>
      </article>
    </button>
  );
}
