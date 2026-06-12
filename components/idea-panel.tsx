"use client";

import type { ReactNode } from "react";
import { Check, Copy, ExternalLink, Loader2, RefreshCw, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { ToolIdea, TrendingRepo } from "@/lib/types";

interface IdeaPanelProps {
  idea: ToolIdea | null;
  sourceRepos: TrendingRepo[];
  mode: "single" | "hybrid";
  loading: boolean;
  error: string | null;
  copied: boolean;
  onRegenerate: () => void;
  onCopy: () => void;
  onClose?: () => void;
  showClose?: boolean;
}

function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <h4 className="type-subheading font-semibold tracking-[var(--tracking-subheading)] text-midnight-ink">
      {children}
    </h4>
  );
}

function SectionBody({ children }: { children: ReactNode }) {
  return <p className="type-body text-charcoal-whisper">{children}</p>;
}

function Section({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <section className="flex flex-col gap-[var(--spacing-8)]">
      <SectionHeading>{label}</SectionHeading>
      <SectionBody>{value}</SectionBody>
    </section>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-[var(--spacing-12)]">
      {items.map((item) => (
        <li
          key={item}
          className="flex items-start gap-[var(--spacing-12)] type-body text-charcoal-whisper"
        >
          <Check
            className="icon-inline mt-0.5 text-invoice-blue"
            strokeWidth={2.5}
            aria-hidden
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function SourceAttribution({ repo }: { repo: TrendingRepo }) {
  return (
    <a
      href={repo.url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 transition-opacity hover:opacity-80"
    >
      <span className="type-body-sm font-medium text-midnight-ink">
        {repo.author}/{repo.name}
      </span>
      {repo.starsToday > 0 && (
        <span className="type-body-sm font-medium text-invoice-blue">
          +{repo.starsToday.toLocaleString()} today
        </span>
      )}
      {repo.language && <Badge>{repo.language}</Badge>}
      <ExternalLink className="icon-inline text-graphite-mute" strokeWidth={2} aria-hidden />
    </a>
  );
}

export function IdeaPanel({
  idea,
  sourceRepos,
  mode,
  loading,
  error,
  copied,
  onRegenerate,
  onCopy,
  onClose,
  showClose = false,
}: IdeaPanelProps) {
  return (
    <>
      <header className="relative flex flex-col gap-[var(--spacing-12)] px-[var(--card-padding)] pb-[var(--spacing-20)] pt-[var(--card-padding)] pr-[calc(var(--card-padding)+var(--spacing-40))]">
        {showClose && onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute right-[var(--card-padding)] top-[var(--card-padding)] flex h-10 w-10 items-center justify-center rounded-[var(--radius-tags)] text-midnight-ink transition-colors hover:bg-cool-mist"
          >
            <X className="icon-control" strokeWidth={2} aria-hidden />
            <span className="sr-only">Close</span>
          </button>
        )}

        {loading ? (
          <>
            <h2 className="type-heading font-semibold text-midnight-ink">
              Cooking up an idea…
            </h2>
            <p className="type-body text-charcoal-whisper">
              Reading what we can from the repo and looking for the mechanism worth stealing.
            </p>
          </>
        ) : error ? (
          <>
            <h2 className="type-heading font-semibold text-midnight-ink">
              Something went wrong
            </h2>
            <p className="type-body text-charcoal-whisper">{error}</p>
          </>
        ) : idea ? (
          <>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-2">
              <span className="type-label uppercase tracking-[0.06em] text-graphite-mute">
                {mode === "hybrid" ? "Based on" : "Inspired by"}
              </span>
              {sourceRepos.map((repo) => (
                <SourceAttribution
                  key={`${repo.author}/${repo.name}`}
                  repo={repo}
                />
              ))}
              {mode === "hybrid" && <Badge variant="accent">Hybrid</Badge>}
            </div>
            <h2 className="type-heading font-semibold text-midnight-ink">
              {idea.toolName}
            </h2>
            <p className="type-body text-charcoal-whisper">{idea.tagline}</p>
          </>
        ) : null}
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-[var(--card-padding)] pb-[var(--spacing-24)]">
        {loading && (
          <div className="flex flex-col items-center gap-[var(--spacing-24)] py-[var(--spacing-32)]">
            <Loader2 className="icon-display animate-spin text-graphite-mute" strokeWidth={2} />
            <div className="flex w-full flex-col gap-[var(--element-gap)]">
              <Skeleton className="h-16 w-full rounded-[var(--radius-cards)]" />
              <Skeleton className="h-16 w-full rounded-[var(--radius-cards)]" />
              <Skeleton className="h-24 w-full rounded-[var(--radius-cards)]" />
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="py-[var(--spacing-32)] text-center">
            <Button onClick={onRegenerate}>
              <RefreshCw strokeWidth={2} />
              Try again
            </Button>
          </div>
        )}

        {!loading && idea && (
          <div className="flex flex-col gap-[var(--spacing-32)]">
            <Section label="The borrowed idea" value={idea.theBorrowedIdea} />
            <Section label="The twist" value={idea.theTwist} />
            <Section label="Who it's for" value={idea.whoItsFor} />
            <Section label="Problem it solves" value={idea.problemItSolves} />
            <Section label="Why it's cool" value={idea.whyItsCool} />
            <Section label="Why now" value={idea.whyNow} />

            <section className="flex flex-col gap-[var(--spacing-12)]">
              <SectionHeading>Build sketch</SectionHeading>
              <BulletList items={idea.buildSketch} />
            </section>

            <section className="flex flex-col gap-[var(--spacing-12)]">
              <SectionHeading>Stretch ideas</SectionHeading>
              <BulletList items={idea.stretchIdeas} />
            </section>
          </div>
        )}
      </div>

      <footer className="dialog-hairline flex flex-wrap items-center justify-end gap-[var(--element-gap)] bg-paper-white px-[var(--card-padding)] py-[var(--spacing-20)]">
        <Button variant="ghost" onClick={onRegenerate} disabled={loading}>
          <RefreshCw strokeWidth={2} />
          Regenerate
        </Button>
        <Button onClick={onCopy} disabled={!idea || loading}>
          <Copy strokeWidth={2} />
          {copied ? "Copied!" : "Copy as Markdown"}
        </Button>
      </footer>
    </>
  );
}
