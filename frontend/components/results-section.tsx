"use client";

import { ResumeCard } from "@/components/resume-card";
import { StateAction, StatePanel } from "@/components/state-panel";
import { Skeleton } from "@/components/ui/skeleton";
import type { ResumeSearchResult } from "@/lib/types";
import { SearchX, ServerCrash, Sparkles } from "lucide-react";

interface ResultsSectionProps {
  loading: boolean;
  error: string | null;
  results: ResumeSearchResult[];
  query: string;
  elapsedMs: number | null;
  hasSearched: boolean;
  selectedIndex: number;
  onSelectIndex: (index: number) => void;
  onRetry?: () => void;
  onClearFilters?: () => void;
  onFocusSearch?: () => void;
}

const STAGGER_MS = 55;
const MAX_STAGGER = 300;

function ResultSkeletons() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="space-y-3 rounded-xl border border-border bg-card p-4 shadow-sm"
          style={{ animationDelay: `${i * STAGGER_MS}ms` }}
        >
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
          <div className="flex gap-2">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
          <Skeleton className="h-16 w-full" />
        </div>
      ))}
    </div>
  );
}

export function ResultsSection({
  loading,
  error,
  results,
  query,
  elapsedMs,
  hasSearched,
  selectedIndex,
  onSelectIndex,
  onRetry,
  onClearFilters,
  onFocusSearch,
}: ResultsSectionProps) {
  if (loading) {
    return (
      <div className="animate-fade-in space-y-4" aria-busy="true" aria-live="polite">
        <Skeleton className="h-4 w-48" />
        <ResultSkeletons />
      </div>
    );
  }

  if (error) {
    return (
      <div role="alert">
        <StatePanel
          icon={ServerCrash}
          title="Search couldn&apos;t complete"
          description={error}
          className="border-destructive/20 bg-destructive/[0.02]"
          iconClassName="bg-destructive/10 text-destructive"
        >
        {onRetry && <StateAction label="Try again" onClick={onRetry} />}
        {onFocusSearch && (
          <StateAction
            label="Edit search"
            variant="outline"
            onClick={onFocusSearch}
          />
        )}
        </StatePanel>
      </div>
    );
  }

  if (!hasSearched) {
    return (
      <StatePanel
        icon={Sparkles}
        title="Start with a job description or skills"
        description="Paste a role description or enter comma-separated skills. Use filters to require technologies, graduation years, or major. Keyboard: ↑↓ to browse results, Enter to open a profile."
      >
        {onFocusSearch && (
          <StateAction label="Focus search" variant="secondary" onClick={onFocusSearch} />
        )}
      </StatePanel>
    );
  }

  if (results.length === 0) {
    return (
      <StatePanel
        icon={SearchX}
        title="No candidates matched"
        description="Your query and filters may be too strict. Try broader keywords, remove a skill requirement, or widen the graduation year range."
      >
        {onClearFilters && (
          <StateAction
            label="Clear filters"
            variant="outline"
            onClick={onClearFilters}
          />
        )}
        {onFocusSearch && (
          <StateAction label="Revise search" onClick={onFocusSearch} />
        )}
      </StatePanel>
    );
  }

  return (
    <div className="animate-fade-in space-y-4">
      {elapsedMs !== null && (
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{results.length}</span>{" "}
          {results.length === 1 ? "result" : "results"} in{" "}
          <span className="font-mono font-medium text-foreground">{elapsedMs}ms</span>
          <span className="hidden sm:inline"> · ↑↓ navigate · Enter to open</span>
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2" role="listbox" aria-label="Search results">
        {results.map((resume, index) => (
          <div
            key={resume.resume_id || resume.candidate_id || index}
            role="option"
            aria-selected={index === selectedIndex}
          >
            <ResumeCard
              resume={resume}
              query={query}
              selected={index === selectedIndex}
              tabIndex={index === selectedIndex ? 0 : -1}
              onFocus={() => onSelectIndex(index)}
              animationDelayMs={Math.min(index * STAGGER_MS, MAX_STAGGER)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
