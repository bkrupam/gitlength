"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface FetchRepoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loading: boolean;
  error: string | null;
  repoLabel?: string;
  onRetry?: () => void;
}

export function FetchRepoModal({
  open,
  onOpenChange,
  loading,
  error,
  repoLabel,
  onRetry,
}: FetchRepoModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {error ? "Could not fetch repository" : "Fetching GitHub repo…"}
          </DialogTitle>
          <DialogDescription>
            {error
              ? error
              : repoLabel
                ? `Pulling metadata and README for ${repoLabel}.`
                : "Pulling repository metadata from GitHub."}
          </DialogDescription>
        </DialogHeader>

        {loading && !error && (
          <div className="flex justify-center py-[var(--spacing-32)]">
            <Loader2 className="icon-display animate-spin text-graphite-mute" strokeWidth={2} />
          </div>
        )}

        {error && onRetry && (
          <DialogFooter>
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={onRetry}>Try again</Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
