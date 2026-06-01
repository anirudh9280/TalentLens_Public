"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FilterPanel } from "@/components/filter-panel";
import { ResultsSection } from "@/components/results-section";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ApiError, resumeDetailPath, searchResumes } from "@/lib/api";
import { pushSearchHistory } from "@/lib/search-history";
import type { ResumeSearchResult, SearchFilters } from "@/lib/types";
import { Filter } from "lucide-react";

const DEBOUNCE_MS = 300;

const DEFAULT_FILTERS: SearchFilters = {
  skills: [],
  gradYearMin: null,
  gradYearMax: null,
  major: "",
  roleType: "all",
};

function isTypingTarget(target: EventTarget | null): boolean {
  if (!target || !(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || target.isContentEditable;
}

export default function HomePage() {
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS);
  const [results, setResults] = useState<ResumeSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [elapsedMs, setElapsedMs] = useState<number | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQuery(query);
    }, DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [query]);

  const filtersKey = useMemo(() => JSON.stringify(filters), [filters]);

  const executeSearch = useCallback(async () => {
    const trimmed = debouncedQuery.trim();
    if (!trimmed) {
      setResults([]);
      setElapsedMs(null);
      setHasSearched(false);
      setError(null);
      setLoading(false);
      setSelectedIndex(-1);
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);
    setSelectedIndex(-1);

    try {
      const { results: nextResults, elapsedMs: ms } = await searchResumes(
        trimmed,
        filters,
        20
      );
      setResults(nextResults);
      setElapsedMs(ms);
      setSelectedIndex(nextResults.length > 0 ? 0 : -1);
      pushSearchHistory(trimmed);
    } catch (err) {
      setResults([]);
      setElapsedMs(null);
      setSelectedIndex(-1);
      if (err instanceof ApiError) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          "Could not reach the search API. Confirm the backend is running and CORS allows this origin."
        );
      }
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, filters]);

  useEffect(() => {
    void executeSearch();
  }, [debouncedQuery, filtersKey, executeSearch]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target)) return;
      if (results.length === 0 || loading || error) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => {
          const next = i < 0 ? 0 : Math.min(i + 1, results.length - 1);
          return next;
        });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => {
          const next = i <= 0 ? 0 : i - 1;
          return next;
        });
      } else if (e.key === "Enter" && selectedIndex >= 0) {
        e.preventDefault();
        const row = results[selectedIndex];
        const id = row.resume_id || row.candidate_id;
        if (id) {
          router.push(resumeDetailPath(id));
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [results, loading, error, selectedIndex, router]);

  const hasActiveFilters =
    filters.skills.length > 0 ||
    filters.gradYearMin !== null ||
    filters.gradYearMax !== null ||
    filters.major.trim().length > 0 ||
    filters.roleType !== "all";

  const focusSearch = () => {
    searchInputRef.current?.focus();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearFilters = () => setFilters(DEFAULT_FILTERS);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader
        ref={searchInputRef}
        query={query}
        onQueryChange={setQuery}
        onQueryPick={setQuery}
      />

      <main id="main-content" className="mx-auto max-w-6xl px-4 pb-12 pt-6 sm:px-6 sm:pt-8">
        <div className="flex gap-6 lg:gap-8">
          <nav
            aria-label="Search filters"
            className="hidden w-64 shrink-0 lg:block xl:w-72"
          >
            <div className="sticky top-[4.5rem] rounded-xl border border-border/80 bg-card p-4 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <Filter className="size-4 text-primary" aria-hidden />
                <h2 className="text-sm font-semibold tracking-tight">Filters</h2>
              </div>
              <FilterPanel filters={filters} onChange={setFilters} />
            </div>
          </nav>

          <section
            aria-label="Search results"
            className="min-w-0 flex-1 space-y-4"
          >
            <div className="flex items-center justify-between lg:hidden">
              <Sheet>
                <SheetTrigger
                  render={
                    <Button
                      variant="outline"
                      size="sm"
                      className="focus-ring interactive gap-2"
                      aria-label={
                        hasActiveFilters
                          ? "Open filters, filters active"
                          : "Open filters"
                      }
                    />
                  }
                >
                  <Filter className="size-4" aria-hidden />
                  <span>Filters</span>
                  {hasActiveFilters && (
                    <Badge
                      variant="default"
                      className="ml-1 h-5 min-w-5 bg-primary px-1"
                      aria-hidden
                    >
                      {filters.skills.length || "·"}
                    </Badge>
                  )}
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="w-[min(100%,20rem)] overflow-y-auto"
                >
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                    <SheetDescription>
                      Narrow results by skills, graduation year, and major.
                    </SheetDescription>
                  </SheetHeader>
                  <nav aria-label="Search filters" className="px-4 pb-6">
                    <FilterPanel filters={filters} onChange={setFilters} />
                  </nav>
                </SheetContent>
              </Sheet>
            </div>

            <ResultsSection
              loading={loading}
              error={error}
              results={results}
              query={debouncedQuery}
              elapsedMs={elapsedMs}
              hasSearched={hasSearched}
              selectedIndex={selectedIndex}
              onSelectIndex={setSelectedIndex}
              onRetry={() => void executeSearch()}
              onClearFilters={clearFilters}
              onFocusSearch={focusSearch}
            />
          </section>
        </div>
      </main>
    </div>
  );
}
