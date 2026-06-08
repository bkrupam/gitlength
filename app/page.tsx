"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FetchRepoModal } from "@/components/fetch-repo-modal";
import { PasteRepoForm } from "@/components/paste-repo-form";
import {
  SourceModeTabs,
  sourceModeContentTransition,
  type SourceMode,
} from "@/components/source-mode-tabs";
import { TrendingControls } from "@/components/trending-controls";
import { CardIdeaFlow } from "@/components/card-idea-flow";
import { IdeaModal } from "@/components/idea-modal";
import { NavHeader } from "@/components/nav-header";
import { SiteFooter } from "@/components/site-footer";
import { RepoCard, type CardRect } from "@/components/repo-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ideaToMarkdown } from "@/lib/idea-markdown";
import { parseGithubUrl } from "@/lib/parse-github-url";
import type { ToolIdea, TrendingRepo, TrendingSince } from "@/lib/types";

const HERO_COPY: Record<SourceMode, { title: string; subtitle: string }> = {
  trending: {
    title: "Turn trending repos into tools you can build",
    subtitle:
      "Browse what's hot on GitHub, click any repo, and get a practical tool concept — plus ideas for what extra you could add.",
  },
  paste: {
    title: "Turn any GitHub repo into a tool idea",
    subtitle:
      "Paste a repository URL and we'll read the source to sketch something useful you could build.",
  },
};

export default function HomePage() {
  const [sourceMode, setSourceMode] = useState<SourceMode>("trending");
  const [language, setLanguage] = useState("");
  const [since, setSince] = useState<TrendingSince>("daily");
  const [search, setSearch] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [combineMode, setCombineMode] = useState(false);
  const [repos, setRepos] = useState<TrendingRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<TrendingRepo[]>([]);
  const [activeRepo, setActiveRepo] = useState<TrendingRepo | null>(null);
  const [fetchModalOpen, setFetchModalOpen] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [fetchRepoLabel, setFetchRepoLabel] = useState<string | undefined>();
  const [flowCard, setFlowCard] = useState<{
    repo: TrendingRepo;
    index: number;
    rect: CardRect;
  } | null>(null);
  const [flowMounted, setFlowMounted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [ideaLoading, setIdeaLoading] = useState(false);
  const [ideaError, setIdeaError] = useState<string | null>(null);
  const [idea, setIdea] = useState<ToolIdea | null>(null);
  const [ideaRepos, setIdeaRepos] = useState<TrendingRepo[]>([]);
  const [ideaMode, setIdeaMode] = useState<"single" | "hybrid">("single");
  const [copied, setCopied] = useState(false);

  const fetchTrending = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ since });
      if (language) params.set("language", language);
      const res = await fetch(`/api/trending?${params.toString()}`, {
        cache: "no-store",
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data) {
        throw new Error(data?.error || "Failed to load trending repos");
      }
      setRepos(data.repos);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load repos");
    } finally {
      setLoading(false);
    }
  }, [language, since]);

  useEffect(() => {
    fetchTrending();
  }, [fetchTrending]);

  useEffect(() => {
    if (!combineMode) setSelected([]);
  }, [combineMode]);

  const filteredRepos = useMemo(() => {
    if (!search.trim()) return repos;
    const q = search.toLowerCase();
    return repos.filter(
      (repo) =>
        repo.name.toLowerCase().includes(q) ||
        repo.author.toLowerCase().includes(q) ||
        repo.description.toLowerCase().includes(q) ||
        repo.language.toLowerCase().includes(q)
    );
  }, [repos, search]);

  const fetchIdea = useCallback(
    async (targetRepos: TrendingRepo[], mode: "single" | "hybrid") => {
      setIdeaLoading(true);
      setIdeaError(null);
      setIdea(null);
      setIdeaRepos(targetRepos);
      setIdeaMode(mode);
      setCopied(false);
      if (mode === "single") setActiveRepo(targetRepos[0]);

      try {
        const endpoint = mode === "hybrid" ? "/api/combine" : "/api/idea";
        const body =
          mode === "hybrid"
            ? { repoA: targetRepos[0], repoB: targetRepos[1] }
            : { repo: targetRepos[0] };
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = await res.json().catch(() => null);
        if (!res.ok || !data) {
          throw new Error(data?.error || "Failed to generate idea");
        }
        setIdea(data.idea);
      } catch (err) {
        setIdeaError(err instanceof Error ? err.message : "Failed to generate idea");
      } finally {
        setIdeaLoading(false);
      }
    },
    []
  );

  const generateIdea = useCallback(
    async (targetRepos: TrendingRepo[], mode: "single" | "hybrid") => {
      setModalOpen(true);
      await fetchIdea(targetRepos, mode);
    },
    [fetchIdea]
  );

  const handleGithubUrlSubmit = useCallback(async () => {
    const trimmed = githubUrl.trim();
    if (!trimmed) return;

    const parsed = parseGithubUrl(trimmed);
    if (!parsed) {
      setFetchError("Enter a valid GitHub URL (e.g. github.com/owner/repo)");
      setFetchRepoLabel(undefined);
      setFetchModalOpen(true);
      setFetchLoading(false);
      return;
    }

    setFetchModalOpen(true);
    setFetchLoading(true);
    setFetchError(null);
    setFetchRepoLabel(`${parsed.owner}/${parsed.repo}`);

    try {
      const res = await fetch("/api/repo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmed }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data) {
        throw new Error(data?.error || "Failed to fetch repository");
      }
      setFetchModalOpen(false);
      setFetchLoading(false);
      setGithubUrl("");
      setModalOpen(true);
      await fetchIdea([data.repo], "single");
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : "Failed to fetch repository");
      setFetchLoading(false);
    }
  }, [githubUrl, fetchIdea]);

  const handleRepoClick = (
    repo: TrendingRepo,
    index: number,
    rect: CardRect
  ) => {
    if (combineMode) {
      setSelected((prev) => {
        const exists = prev.find(
          (r) => r.author === repo.author && r.name === repo.name
        );
        if (exists) return prev.filter((r) => !(r.author === repo.author && r.name === repo.name));
        if (prev.length >= 2) return prev;
        return [...prev, repo];
      });
      return;
    }
    setFlowCard({ repo, index, rect });
    setFlowMounted(true);
    void fetchIdea([repo], "single");
  };

  const handleFlowOpenChange = (open: boolean) => {
    if (!open) setFlowMounted(false);
  };

  const handleFlowExitComplete = () => {
    setFlowCard(null);
    setActiveRepo(null);
    setIdea(null);
    setIdeaError(null);
    setIdeaLoading(false);
    setCopied(false);
  };

  const handleCombine = () => {
    if (selected.length !== 2) return;
    generateIdea(selected, "hybrid");
  };

  const handleCopy = async () => {
    if (!idea) return;
    await navigator.clipboard.writeText(ideaToMarkdown(idea, ideaRepos, ideaMode));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isRepoActive = (repo: TrendingRepo) =>
    activeRepo?.author === repo.author && activeRepo?.name === repo.name;

  const isRepoSelected = (repo: TrendingRepo) =>
    selected.some((r) => r.author === repo.author && r.name === repo.name);

  const isTrending = sourceMode === "trending";
  const copy = HERO_COPY[sourceMode];
  const reducedMotion = useReducedMotion();
  const contentMotion = reducedMotion
    ? { initial: false, animate: { opacity: 1 }, exit: { opacity: 1 } }
    : {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -6 },
        transition: sourceModeContentTransition,
      };

  return (
    <div className="min-h-screen bg-cool-mist">
      <NavHeader combineMode={combineMode} onCombineModeChange={setCombineMode} />

      <main className="page-container pb-[var(--section-gap)]">
        {/* ── Hero ── */}
        <section className="flex flex-col items-center pt-[var(--spacing-64)] text-center">
          <SourceModeTabs mode={sourceMode} onModeChange={setSourceMode} />

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={sourceMode}
              className="flex w-full flex-col items-center"
              {...contentMotion}
            >
              <p className="type-eyebrow mt-[var(--spacing-32)]">
                GitHub → useful tool ideas
              </p>

              <h1 className="type-display mt-[var(--spacing-16)] max-w-4xl text-midnight-ink">
                {copy.title}
              </h1>

              <p className="mt-[var(--element-gap)] max-w-2xl type-subheading text-charcoal-whisper">
                {copy.subtitle}
              </p>

              {!isTrending && (
                <div className="mt-[var(--spacing-32)] flex w-full flex-col items-center">
                  <PasteRepoForm
                    value={githubUrl}
                    onChange={setGithubUrl}
                    onSubmit={handleGithubUrlSubmit}
                    isSubmitting={fetchLoading}
                  />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </section>

        {/* ── Trending grid (only in trending mode) ── */}
        <AnimatePresence initial={false}>
          {isTrending && (
          <motion.section
            key="trending-grid"
            className="mt-[var(--spacing-32)]"
            initial={reducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? undefined : { opacity: 0, y: -8 }}
            transition={sourceModeContentTransition}
          >
            <div className="mb-[var(--spacing-24)]">
              <TrendingControls
                search={search}
                language={language}
                since={since}
                onSearchChange={setSearch}
                onLanguageChange={setLanguage}
                onSinceChange={setSince}
              />
            </div>

            {combineMode && (
              <p className="mb-[var(--spacing-24)] text-center type-body-sm text-invoice-blue">
                Select two repos to mix into one tool idea with extra utility from both
              </p>
            )}

            {error && (
              <div className="mb-[var(--spacing-24)] rounded-[var(--radius-cards)] bg-paper-white px-[var(--card-padding)] py-[var(--spacing-16)] text-center type-body-sm text-midnight-ink shadow-[var(--shadow-subtle)]">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 grid-gap sm:grid-cols-2 lg:grid-cols-3">
              {loading
                ? Array.from({ length: 9 }).map((_, i) => (
                    <Skeleton key={i} className="h-[340px] rounded-[var(--radius-cards)]" />
                  ))
                : filteredRepos.map((repo, index) => (
                    <RepoCard
                      key={`${repo.author}/${repo.name}`}
                      repo={repo}
                      index={index}
                      active={!combineMode && isRepoActive(repo)}
                      selected={combineMode && isRepoSelected(repo)}
                      flowSource={
                        flowCard?.repo.author === repo.author &&
                        flowCard?.repo.name === repo.name
                      }
                      onClick={(rect) => handleRepoClick(repo, index, rect)}
                    />
                  ))}
            </div>

            {!loading && filteredRepos.length === 0 && !error && (
              <p className="mt-[var(--spacing-32)] text-center type-subheading text-graphite-mute">
                {search.trim()
                  ? "No repositories match your search."
                  : "No trending repositories found for this filter."}
              </p>
            )}
          </motion.section>
          )}
        </AnimatePresence>
      </main>

      <SiteFooter />

      {/* ── Combine float ── */}
      {isTrending && combineMode && selected.length === 2 && (
        <div className="fixed bottom-[var(--spacing-32)] left-1/2 z-40 -translate-x-1/2">
          <Button className="shadow-[var(--shadow-subtle-2)]" onClick={handleCombine}>
            Mix these 2
          </Button>
        </div>
      )}

      <FetchRepoModal
        open={fetchModalOpen}
        onOpenChange={(open) => {
          setFetchModalOpen(open);
          if (!open) { setFetchLoading(false); setFetchError(null); }
        }}
        loading={fetchLoading}
        error={fetchError}
        repoLabel={fetchRepoLabel}
        onRetry={handleGithubUrlSubmit}
      />

      {flowCard && (
        <CardIdeaFlow
          repo={flowCard.repo}
          cardIndex={flowCard.index}
          originRect={flowCard.rect}
          open={flowMounted}
          onOpenChange={handleFlowOpenChange}
          onExitComplete={handleFlowExitComplete}
          idea={idea}
          loading={ideaLoading}
          error={ideaError}
          copied={copied}
          onRegenerate={() => fetchIdea(ideaRepos, ideaMode)}
          onCopy={handleCopy}
        />
      )}

      <IdeaModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        idea={idea}
        sourceRepos={ideaRepos}
        mode={ideaMode}
        loading={ideaLoading}
        error={ideaError}
        copied={copied}
        onRegenerate={() => generateIdea(ideaRepos, ideaMode)}
        onCopy={handleCopy}
      />
    </div>
  );
}
