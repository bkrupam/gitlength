"use client";

import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TrendingSince } from "@/lib/types";

const LANGUAGES = [
  "All",
  "JavaScript",
  "TypeScript",
  "Python",
  "Go",
  "Rust",
  "Java",
  "C++",
  "Ruby",
  "PHP",
  "Swift",
];

const TIME_RANGES: { label: string; value: TrendingSince }[] = [
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
];

const ALL_VALUE = "all";

interface TrendingControlsProps {
  search: string;
  language: string;
  since: TrendingSince;
  onSearchChange: (search: string) => void;
  onLanguageChange: (language: string) => void;
  onSinceChange: (since: TrendingSince) => void;
}

export function TrendingControls({
  search,
  language,
  since,
  onSearchChange,
  onLanguageChange,
  onSinceChange,
}: TrendingControlsProps) {
  return (
    <div className="flex w-full flex-col gap-[var(--element-gap)] sm:flex-row sm:items-center sm:justify-between">
      <label className="w-full sm:w-[460px] sm:shrink-0">
        <span className="sr-only">Search trending repositories</span>
        <div className="field-control">
          <Search
            className="h-5 w-5 shrink-0 text-graphite-mute"
            strokeWidth={1.75}
            aria-hidden
          />
          <input
            type="text"
            role="searchbox"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search repos..."
            className="field-control-input"
          />
        </div>
      </label>

      <div className="flex shrink-0 items-center gap-[var(--spacing-8)]">
        <Select
          value={language || ALL_VALUE}
          onValueChange={(value) =>
            onLanguageChange(value === ALL_VALUE ? "" : value)
          }
        >
          <SelectTrigger aria-label="Filter by language" className="min-w-[168px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LANGUAGES.map((lang) => (
              <SelectItem key={lang} value={lang === "All" ? ALL_VALUE : lang}>
                {lang}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={since}
          onValueChange={(value) => onSinceChange(value as TrendingSince)}
        >
          <SelectTrigger aria-label="Filter by time range" className="min-w-[152px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TIME_RANGES.map((range) => (
              <SelectItem key={range.value} value={range.value}>
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
