"use client";

import { forwardRef, useEffect, useId, useState } from "react";
import Link from "next/link";
import { SearchAutocomplete } from "@/components/search-autocomplete";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Bookmark } from "lucide-react";

interface SiteHeaderProps {
  query: string;
  onQueryChange: (value: string) => void;
  onQueryPick?: (value: string) => void;
  compact?: boolean;
}

export const SiteHeader = forwardRef<HTMLInputElement, SiteHeaderProps>(
  function SiteHeader({ query, onQueryChange, onQueryPick, compact = false }, ref) {
    const [scrolled, setScrolled] = useState(compact);
    const searchLabelId = useId();
    const searchHintId = useId();

    useEffect(() => {
      if (compact) {
        setScrolled(true);
        return;
      }
      const onScroll = () => setScrolled(window.scrollY > 48);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }, [compact]);

    const isCompact = scrolled || compact;
    const searchInputId = isCompact ? "search-compact" : "search";

    return (
      <header
        className={cn(
          "sticky top-0 z-50 border-b border-border/80 bg-background/90 backdrop-blur-md transition-all duration-200",
          isCompact ? "shadow-sm" : ""
        )}
      >
        <div
          className={cn(
            "relative mx-auto max-w-6xl px-4 transition-all duration-200 sm:px-6",
            isCompact ? "py-2.5" : "py-0"
          )}
        >
          <div
            className={cn(
              "absolute z-10 flex items-center gap-1",
              isCompact ? "right-4 top-2 sm:right-6" : "right-4 top-6 sm:right-6 sm:top-8"
            )}
          >
            <Link
              href="/saved"
              className="focus-ring interactive inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Saved resumes"
            >
              <Bookmark className="size-4" aria-hidden />
            </Link>
            <ThemeToggle />
          </div>

          {!isCompact ? (
            <div className="hero-surface -mx-4 px-4 pb-8 pt-6 sm:-mx-6 sm:px-6 sm:pb-10 sm:pt-8">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex items-center gap-2.5">
                  <Link
                    href="/"
                    className="focus-ring rounded-sm text-2xl font-semibold tracking-tight text-foreground transition-colors duration-200 hover:text-primary sm:text-3xl"
                  >
                    TalentLens
                  </Link>
                  <Badge
                    variant="secondary"
                    className="border border-primary/20 bg-primary/10 text-[10px] font-medium uppercase tracking-wider text-primary"
                  >
                    by DS3
                  </Badge>
                </div>
                <p
                  id={searchHintId}
                  className="mb-6 max-w-lg text-sm leading-relaxed text-muted-foreground"
                >
                  Rank DS3 member resumes against a job description or skill set.
                  Semantic search, reranking, and recruiter-grade scoring.
                </p>
                <div className="w-full max-w-2xl">
                  <label id={searchLabelId} htmlFor={searchInputId} className="sr-only">
                    Search resumes by job description or skills
                  </label>
                  <SearchAutocomplete
                    ref={ref}
                    inputId={searchInputId}
                    query={query}
                    onQueryChange={onQueryChange}
                    onQueryPick={onQueryPick}
                    placeholder="Job description or skills (e.g. Python, machine learning)…"
                    labelledBy={`${searchLabelId} ${searchHintId}`}
                    inputClassName="focus-ring interactive h-12 border-border/80 bg-card pl-10 text-base shadow-sm"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 pr-24">
              <Link
                href="/"
                className="focus-ring shrink-0 rounded-sm text-sm font-semibold tracking-tight text-foreground transition-colors duration-200 hover:text-primary"
              >
                TalentLens
              </Link>
              <Badge
                variant="secondary"
                className="hidden border border-primary/20 bg-primary/10 text-[9px] font-medium uppercase tracking-wider text-primary sm:inline-flex"
              >
                DS3
              </Badge>
              <div className="min-w-0 flex-1">
                <label htmlFor={searchInputId} className="sr-only">
                  Search resumes
                </label>
                <SearchAutocomplete
                  ref={ref}
                  inputId={searchInputId}
                  query={query}
                  onQueryChange={onQueryChange}
                  onQueryPick={onQueryPick}
                  placeholder="Search resumes…"
                  inputClassName="focus-ring interactive h-9 border-border/80 bg-card pl-10 text-sm"
                />
              </div>
            </div>
          )}
        </div>
      </header>
    );
  }
);
