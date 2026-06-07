"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { CardRect } from "@/components/repo-card";
import { RepoCardFace } from "@/components/repo-card-face";
import { IdeaPanel } from "@/components/idea-panel";
import { getCardTheme } from "@/lib/repo-card-themes";
import { cn } from "@/lib/utils";
import type { ToolIdea, TrendingRepo } from "@/lib/types";

const MIN_GENERATING_MS = 2000;
const LIFT_DURATION = 0.55;
const FLIP_DURATION = 0.45;
const EXIT_DURATION = 0.38;
const OVERLAY_EXIT_DURATION = 0.22;

const liftEase = [0.23, 1, 0.32, 1] as const;
const flipEase = [0.645, 0.045, 0.355, 1] as const;
const exitEase = [0.32, 0, 0.67, 0] as const;

interface CardIdeaFlowProps {
  repo: TrendingRepo;
  cardIndex: number;
  originRect: CardRect;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExitComplete?: () => void;
  idea: ToolIdea | null;
  loading: boolean;
  error: string | null;
  copied: boolean;
  onRegenerate: () => void;
  onCopy: () => void;
}

interface LayoutCustom {
  originRect: CardRect;
  metrics: ReturnType<typeof getLayoutMetrics>;
}

function getLayoutMetrics(rect: CardRect) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const centerLeft = (vw - rect.width) / 2;
  const centerTop = (vh - rect.height) / 2;
  const modalWidth = Math.min(vw - 32, 768);
  const modalHeight = vh * 0.9;

  return { centerLeft, centerTop, modalWidth, modalHeight };
}

const shellVariants = {
  origin: ({ originRect }: LayoutCustom) => ({
    left: originRect.left,
    top: originRect.top,
    x: 0,
    y: 0,
    width: originRect.width,
    height: originRect.height,
    scale: 1,
  }),
  lift: ({ originRect, metrics }: LayoutCustom) => ({
    left: metrics.centerLeft,
    top: metrics.centerTop,
    x: 0,
    y: 0,
    width: originRect.width,
    height: originRect.height,
    scale: 1.03,
    transition: { duration: LIFT_DURATION, ease: liftEase },
  }),
  modal: ({ metrics }: LayoutCustom) => ({
    left: "50%",
    top: "50%",
    x: "-50%",
    y: "-50%",
    width: metrics.modalWidth,
    height: metrics.modalHeight,
    scale: 1,
    transition: { duration: FLIP_DURATION, ease: flipEase },
  }),
  exit: ({ originRect }: LayoutCustom) => ({
    left: originRect.left,
    top: originRect.top,
    x: 0,
    y: 0,
    width: originRect.width,
    height: originRect.height,
    scale: 1,
    transition: { duration: EXIT_DURATION, ease: exitEase },
  }),
};

const flipVariants = {
  lift: {
    rotateY: 0,
    transition: { duration: FLIP_DURATION, ease: flipEase },
  },
  modal: {
    rotateY: 180,
    transition: { duration: FLIP_DURATION, ease: flipEase },
  },
  exit: {
    rotateY: 0,
    transition: { duration: EXIT_DURATION, ease: exitEase },
  },
};

export function CardIdeaFlow({
  repo,
  cardIndex,
  originRect,
  open,
  onOpenChange,
  onExitComplete,
  idea,
  loading,
  error,
  copied,
  onRegenerate,
  onCopy,
}: CardIdeaFlowProps) {
  const reducedMotion = useReducedMotion();
  const theme = getCardTheme(cardIndex);
  const [phase, setPhase] = useState<"lift" | "modal">("lift");
  const openedAt = useRef<number | null>(null);

  const metrics = useMemo(() => getLayoutMetrics(originRect), [originRect]);
  const layoutCustom = useMemo<LayoutCustom>(
    () => ({ originRect, metrics }),
    [originRect, metrics]
  );

  useEffect(() => {
    if (!open) return;
    setPhase("lift");
    openedAt.current = Date.now();
  }, [open]);

  useEffect(() => {
    if (!open || phase !== "lift") return;

    const advance = () => setPhase("modal");

    if (reducedMotion) {
      const timer = window.setTimeout(advance, 400);
      return () => window.clearTimeout(timer);
    }

    const elapsed = openedAt.current ? Date.now() - openedAt.current : 0;
    const remaining = Math.max(0, MIN_GENERATING_MS - elapsed);
    const timer = window.setTimeout(advance, remaining);
    return () => window.clearTimeout(timer);
  }, [open, phase, reducedMotion]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onOpenChange(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange]);

  const shellState = phase === "lift" ? "lift" : "modal";
  const flipState = phase === "lift" ? "lift" : "modal";

  const handleExitComplete = () => {
    setPhase("lift");
    onExitComplete?.();
  };

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {open && (
        <>
          <motion.div
            key="overlay"
            className="fixed inset-0 z-[100] bg-midnight-ink/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{
              opacity: 0,
              transition: {
                duration: reducedMotion ? 0.1 : OVERLAY_EXIT_DURATION,
                ease: exitEase,
              },
            }}
            transition={{
              duration: reducedMotion ? 0.1 : 0.28,
              ease: liftEase,
            }}
            onClick={() => onOpenChange(false)}
          />

          <motion.div
            key="card-shell"
            role="dialog"
            aria-modal="true"
            aria-label={
              phase === "lift"
                ? "Cooking an idea for you"
                : idea?.toolName ?? "Tool idea"
            }
            custom={layoutCustom}
            variants={shellVariants}
            initial="origin"
            animate={shellState}
            exit="exit"
            className={cn(
              "fixed z-[101] overflow-hidden shadow-[var(--shadow-subtle)] will-change-[transform,opacity]",
              phase === "modal" && "flex flex-col"
            )}
            style={{
              borderRadius: "var(--radius-cards)",
              transformOrigin: "center center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              className="relative h-full w-full"
              style={{ transformStyle: "preserve-3d" }}
              variants={flipVariants}
              animate={flipState}
              exit="exit"
            >
              <div
                className={cn("absolute inset-0 flex flex-col", theme.bg)}
                style={{
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                }}
              >
                <RepoCardFace
                  repo={repo}
                  cardIndex={cardIndex}
                  variant="cooking"
                />
              </div>

              <div
                className="absolute inset-0 flex h-full min-h-0 flex-col overflow-hidden bg-paper-white"
                style={{
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
              >
                {phase === "modal" && (
                  <IdeaPanel
                    idea={idea}
                    sourceRepos={[repo]}
                    mode="single"
                    loading={loading}
                    error={error}
                    copied={copied}
                    onRegenerate={onRegenerate}
                    onCopy={onCopy}
                    onClose={() => onOpenChange(false)}
                    showClose
                  />
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
