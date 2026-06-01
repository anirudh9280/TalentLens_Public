"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ResumeDetailView } from "@/components/resume-detail-view";
import { StateAction, StatePanel } from "@/components/state-panel";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiError, fetchResume } from "@/lib/api";
import type { ResumeDetail } from "@/lib/types";
import { FileQuestion } from "lucide-react";

export default function ResumeDetailPage() {
  const params = useParams();
  const rawId = params?.id;
  const resumeId = decodeURIComponent(
    Array.isArray(rawId) ? rawId[0] ?? "" : rawId ?? ""
  );

  const [resume, setResume] = useState<ResumeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadResume = useCallback(async () => {
    if (!resumeId) {
      setError("Missing resume id.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await fetchResume(resumeId);
      setResume(data);
    } catch (err) {
      setResume(null);
      if (err instanceof ApiError) {
        setError(
          err.status === 404
            ? `No resume found for id “${resumeId}”. It may have been removed from the index.`
            : err.message
        );
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Could not load this profile. Check that the API is running.");
      }
    } finally {
      setLoading(false);
    }
  }, [resumeId]);

  useEffect(() => {
    void loadResume();
  }, [loadResume]);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/80 bg-background/90 backdrop-blur-md">
        <div className="relative mx-auto flex max-w-3xl items-center gap-3 px-4 py-3 sm:px-6">
          <Link
            href="/"
            className="focus-ring rounded-sm text-sm font-semibold tracking-tight text-foreground transition-colors duration-200 hover:text-primary"
          >
            TalentLens
          </Link>
          <Badge
            variant="secondary"
            className="border border-primary/20 bg-primary/10 text-[9px] font-medium uppercase tracking-wider text-primary"
          >
            DS3
          </Badge>
          <span className="ml-auto hidden max-w-[12rem] truncate font-mono text-xs text-muted-foreground sm:inline">
            {resumeId}
          </span>
          <div className="sm:ml-2">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main id="main-content" className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
        {loading && (
          <div className="animate-fade-in space-y-4" aria-busy="true" aria-live="polite">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
        )}

        {!loading && error && (
          <StatePanel
            icon={FileQuestion}
            title="Profile unavailable"
            description={error}
            iconClassName="bg-muted text-muted-foreground"
          >
            <StateAction label="Retry" onClick={() => void loadResume()} />
            <Link
              href="/"
              className="focus-ring interactive inline-flex h-9 items-center justify-center rounded-lg border border-border bg-background px-3 text-sm font-medium text-foreground hover:bg-muted"
            >
              Back to search
            </Link>
          </StatePanel>
        )}

        {!loading && !error && resume && (
          <article className="animate-fade-in">
            <ResumeDetailView resume={resume} />
          </article>
        )}
      </main>
    </div>
  );
}
