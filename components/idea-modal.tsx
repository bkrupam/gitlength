"use client";

import { IdeaPanel } from "@/components/idea-panel";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ToolIdea, TrendingRepo } from "@/lib/types";

interface IdeaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  idea: ToolIdea | null;
  sourceRepos: TrendingRepo[];
  mode: "single" | "hybrid";
  loading: boolean;
  error: string | null;
  copied: boolean;
  onRegenerate: () => void;
  onCopy: () => void;
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
        <DialogTitle className="sr-only">
          {loading
            ? "Generating your idea"
            : idea?.toolName ?? "Tool idea"}
        </DialogTitle>
        <IdeaPanel
          idea={idea}
          sourceRepos={sourceRepos}
          mode={mode}
          loading={loading}
          error={error}
          copied={copied}
          onRegenerate={onRegenerate}
          onCopy={onCopy}
        />
      </DialogContent>
    </Dialog>
  );
}
