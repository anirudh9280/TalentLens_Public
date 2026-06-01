"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { useToast } from "@/components/toast-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatePanel } from "@/components/state-panel";
import { resumeDetailPath } from "@/lib/api";
import {
  getSavedResumes,
  removeSavedResume,
  type SavedResumeEntry,
} from "@/lib/saved-resumes";
import { Bookmark, Trash2 } from "lucide-react";

export default function SavedResumesPage() {
  const { showToast } = useToast();
  const [saved, setSaved] = useState<SavedResumeEntry[]>([]);

  const refresh = useCallback(() => {
    setSaved(getSavedResumes());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleRemove = (resumeId: string) => {
    removeSavedResume(resumeId);
    refresh();
    showToast("Removed from saved");
  };

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
          <span className="ml-2 text-sm text-muted-foreground">Saved</span>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main id="main-content" className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
        <h1 className="text-2xl font-semibold tracking-tight">Saved resumes</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Bookmarks are stored in this browser only.
        </p>

        {saved.length === 0 ? (
          <div className="mt-8">
            <StatePanel
              icon={Bookmark}
              title="No saved resumes yet"
              description="Use Save on a search result card to bookmark a profile here."
              iconClassName="bg-muted text-muted-foreground"
            >
              <Link
                href="/"
                className="focus-ring interactive inline-flex h-9 items-center justify-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Back to search
              </Link>
            </StatePanel>
          </div>
        ) : (
          <ul className="mt-6 space-y-3">
            {saved.map((entry) => (
              <li key={entry.resume_id}>
                <Card className="border-border/80">
                  <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0 pb-2">
                    <div className="min-w-0">
                      <CardTitle className="truncate text-lg">
                        {entry.full_name || entry.resume_id}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {[entry.major, entry.graduation_year && `Class of ${entry.graduation_year}`]
                          .filter(Boolean)
                          .join(" · ") || "—"}
                      </p>
                    </div>
                    {entry.score > 0 && (
                      <Badge variant="secondary" className="shrink-0 font-mono">
                        {Math.round(entry.score * 100)}%
                      </Badge>
                    )}
                  </CardHeader>
                  <CardContent className="flex gap-2 pt-0">
                    <Link
                      href={resumeDetailPath(entry.resume_id)}
                      className="focus-ring interactive inline-flex h-8 flex-1 items-center justify-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                    >
                      View
                    </Link>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="focus-ring interactive gap-1.5"
                      aria-label={`Remove ${entry.full_name} from saved`}
                      onClick={() => handleRemove(entry.resume_id)}
                    >
                      <Trash2 className="size-3.5" aria-hidden />
                      Remove
                    </Button>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
