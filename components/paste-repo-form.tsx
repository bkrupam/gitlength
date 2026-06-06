"use client";

import { Link2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PasteRepoFormProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

export function PasteRepoForm({
  value,
  onChange,
  onSubmit,
  isSubmitting = false,
}: PasteRepoFormProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="flex w-full max-w-2xl flex-col items-stretch gap-[var(--spacing-12)] sm:flex-row sm:items-center"
    >
      <label className="relative min-w-0 flex-1">
        <span className="sr-only">GitHub repository URL</span>
        <div className="flex items-center gap-[var(--spacing-12)] rounded-[var(--radius-buttons)] bg-paper-white px-6 py-[14px] shadow-[var(--shadow-subtle)]">
          <Link2
            className="icon-control text-graphite-mute"
            strokeWidth={2}
            aria-hidden
          />
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="github.com/owner/repo"
            disabled={isSubmitting}
            className="min-w-0 flex-1 bg-transparent text-body text-midnight-ink placeholder:text-graphite-mute focus:outline-none disabled:opacity-60"
          />
        </div>
      </label>
      <Button type="submit" disabled={isSubmitting || !value.trim()}>
        {isSubmitting ? (
          <Loader2 className="animate-spin" strokeWidth={2} />
        ) : (
          "Cook idea"
        )}
      </Button>
    </form>
  );
}
