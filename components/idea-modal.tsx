"use client";

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

function Section({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col stack-gap">
      <h4 className="type-body-sm font-semibold text-midnight-ink">{label}</h4>
      <p className="text-body text-charcoal-whisper">{value}</p>
    </div>
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
      <ExternalLink className="h-3.5 w-3.5 text-graphite-mute" />
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
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <span className="type-body-sm text-graphite-mute">
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

        <div className="min-h-0 flex-1 overflow-y-auto px-[var(--card-padding)] pb-[var(--spacing-16)]">
          {loading && (
            <div className="flex flex-col items-center gap-[var(--spacing-24)] py-[var(--spacing-32)]">
              <Loader2 className="h-8 w-8 animate-spin text-graphite-mute" />
              <div className="flex w-full flex-col stack-gap">
                <Skeleton className="h-16 w-full rounded-[var(--radius-cards)]" />
                <Skeleton className="h-16 w-full rounded-[var(--radius-cards)]" />
                <Skeleton className="h-24 w-full rounded-[var(--radius-cards)]" />
              </div>
            </div>
          )}

          {!loading && error && (
            <div className="py-[var(--spacing-32)] text-center">
              <Button onClick={onRegenerate}>
                <RefreshCw className="h-4 w-4" />
                Try again
              </Button>
            </div>
          )}

          {!loading && idea && (
            <div className="flex flex-col gap-[var(--spacing-24)]">
              <Section label="Target Audience" value={idea.targetAudience} />
              <Section label="Core Problem" value={idea.coreProblem} />
              <Section label="Micro-SaaS Twist" value={idea.microSaasTwist} />

              <div className="flex flex-col stack-gap">
                <h4 className="type-body-sm font-semibold text-midnight-ink">
                  MVP Features
                </h4>
                <ul className="flex flex-col stack-gap">
                  {idea.mvpFeatures.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-[var(--element-gap)] text-body text-charcoal-whisper"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-invoice-blue" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Section label="Revenue Model" value={idea.revenueModel} />
              <Section label="Differentiator" value={idea.differentiator} />

              <div className="flex flex-col stack-gap">
                <h4 className="type-body-sm font-semibold text-midnight-ink">
                  Go-to-Market
                </h4>
                <ul className="flex flex-col stack-gap">
                  {idea.goToMarket.map((channel) => (
                    <li
                      key={channel}
                      className="flex items-start gap-[var(--element-gap)] text-body text-charcoal-whisper"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-invoice-blue" />
                      <span>{channel}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onRegenerate} disabled={loading}>
            <RefreshCw className="h-4 w-4" />
            Regenerate
          </Button>
          <Button onClick={onCopy} disabled={!idea || loading}>
            <Copy className="h-4 w-4" />
            {copied ? "Copied!" : "Copy as Markdown"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
