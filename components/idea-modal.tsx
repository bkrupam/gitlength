"use client";

import type { ReactNode } from "react";
import { Check, Copy, ExternalLink, Loader2, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import type { MicroSaasIdea, TrendingRepo } from "@/lib/types";

interface IdeaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  idea: MicroSaasIdea | null;
  sourceRepos: TrendingRepo[];
  mode: "single" | "hybrid";
  loading: boolean;
  error: string | null;
  copied: boolean;
  onRegenerate: () => void;
  onCopy: () => void;
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

export function IdeaModal({
  open,
  onOpenChange,
  idea,
  sourceRepos,
  mode,
  loading,
  error,
  copied,
  onRegenerate,
  onCopy,
}: IdeaModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh]">
        <DialogHeader>
          {loading ? (
            <>
              <DialogTitle>Generating your idea…</DialogTitle>
              <DialogDescription>
                Reading the README and crafting a micro-SaaS concept.
              </DialogDescription>
            </>
          ) : error ? (
            <>
              <DialogTitle>Something went wrong</DialogTitle>
              <DialogDescription>{error}</DialogDescription>
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
              <DialogTitle>{idea.productName}</DialogTitle>
              <DialogDescription>{idea.tagline}</DialogDescription>
            </>
          ) : null}
        </DialogHeader>

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
              <Section label="Target Audience" value={idea.targetAudience} />
              <Section label="Core Problem" value={idea.coreProblem} />
              <Section label="Micro-SaaS Twist" value={idea.microSaasTwist} />

              <section className="flex flex-col gap-[var(--spacing-12)]">
                <SectionHeading>MVP Features</SectionHeading>
                <BulletList items={idea.mvpFeatures} />
              </section>

              <Section label="Revenue Model" value={idea.revenueModel} />
              <Section label="Differentiator" value={idea.differentiator} />

              <section className="flex flex-col gap-[var(--spacing-12)]">
                <SectionHeading>Go-to-Market</SectionHeading>
                <BulletList items={idea.goToMarket} />
              </section>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onRegenerate} disabled={loading}>
            <RefreshCw strokeWidth={2} />
            Regenerate
          </Button>
          <Button onClick={onCopy} disabled={!idea || loading}>
            <Copy strokeWidth={2} />
            {copied ? "Copied!" : "Copy as Markdown"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
