"use client";



import Link from "next/link";

import { useCallback, useEffect, useState } from "react";

import { MatchScoreRing } from "@/components/match-score-ring";

import { useToast } from "@/components/toast-provider";

import { Badge } from "@/components/ui/badge";

import { Button, buttonVariants } from "@/components/ui/button";

import {

  Card,

  CardContent,

  CardDescription,

  CardFooter,

  CardHeader,

  CardTitle,

} from "@/components/ui/card";

import { resumeDetailPath } from "@/lib/api";

import { highlightSnippet } from "@/lib/highlight";

import { isResumeSaved, toggleSavedResume } from "@/lib/saved-resumes";

import type { ResumeSearchResult } from "@/lib/types";

import { cn } from "@/lib/utils";

import { Bookmark } from "lucide-react";



interface ResumeCardProps {

  resume: ResumeSearchResult;

  query: string;

  selected?: boolean;

  tabIndex?: number;

  onFocus?: () => void;

  animationDelayMs?: number;

}



export function ResumeCard({

  resume,

  query,

  selected = false,

  tabIndex = -1,

  onFocus,

  animationDelayMs = 0,

}: ResumeCardProps) {

  const { showToast } = useToast();

  const resumeId = resume.resume_id || resume.candidate_id;

  const [saved, setSaved] = useState(false);



  useEffect(() => {

    setSaved(isResumeSaved(resumeId));

  }, [resumeId]);



  const skills = resume.matched_skills ?? [];

  const topSkills = skills.slice(0, 4);

  const scorePct = Math.round(resume.score * 100);

  const snippet =

    resume.text_preview?.trim() ||

    resume.grok_summary?.trim() ||

    "No preview available.";

  const href = resumeDetailPath(resumeId);

  const displayName = resume.full_name || resume.filename;



  const handleSave = useCallback(

    (e: React.MouseEvent) => {

      e.preventDefault();

      e.stopPropagation();

      const nowSaved = toggleSavedResume(resume);

      setSaved(nowSaved);

      showToast(nowSaved ? "Resume saved" : "Removed from saved");

    },

    [resume, showToast]

  );



  return (

    <article

      className={cn(

        "opacity-0 animate-fade-in-up",

        selected && "relative z-[1]"

      )}

      style={{ animationDelay: `${animationDelayMs}ms` }}

      aria-label={`${displayName}, ${scorePct}% match`}

      tabIndex={tabIndex}

      onFocus={onFocus}

    >

      <Card

        className={cn(

          "flex h-full flex-col border-border/80 bg-card shadow-sm transition-all duration-200 ease-out",

          "hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md",

          selected && "ring-2 ring-ring ring-offset-2 ring-offset-background border-primary/40"

        )}

      >

        <CardHeader className="space-y-3 pb-3">

          <div className="flex items-start justify-between gap-3">

            <div className="min-w-0 flex-1">

              <CardTitle className="truncate text-lg leading-tight text-card-foreground">

                {displayName}

              </CardTitle>

              <CardDescription className="mt-0.5 truncate leading-relaxed">

                {resume.major || "—"}

              </CardDescription>

            </div>

            <MatchScoreRing score={resume.score} className="shrink-0" />

          </div>

          {topSkills.length > 0 && (

            <div className="flex flex-wrap gap-1.5" aria-label="Matched skills">

              {topSkills.map((skill) => (

                <Badge

                  key={skill}

                  variant="secondary"

                  className="border-transparent bg-secondary font-normal text-secondary-foreground"

                >

                  {skill}

                </Badge>

              ))}

              {skills.length > 4 && (

                <Badge variant="outline" className="font-normal">

                  +{skills.length - 4} more

                </Badge>

              )}

            </div>

          )}

        </CardHeader>

        <CardContent className="mt-auto pt-0">

          <p className="line-clamp-4 text-sm leading-relaxed text-muted-foreground">

            {highlightSnippet(snippet, query)}

          </p>

          {resume.graduation_year && (

            <p className="mt-3 text-xs text-muted-foreground">

              Class of{" "}

              <span className="font-mono text-foreground/80">

                {resume.graduation_year}

              </span>

              {resume.rank > 0 && (

                <span className="font-mono">

                  {" "}

                  · rank #{resume.rank}

                </span>

              )}

            </p>

          )}

        </CardContent>

        <CardFooter className="flex gap-2 border-t border-border/60 pt-3">

          <Link
            href={href}
            className={cn(
              buttonVariants({ size: "sm" }),
              "focus-ring interactive flex-1"
            )}
          >
            View
          </Link>

          <Button

            type="button"

            size="sm"

            variant="outline"

            className="focus-ring interactive gap-1.5"

            aria-pressed={saved}

            aria-label={saved ? "Remove from saved" : "Save resume"}

            onClick={handleSave}

          >

            <Bookmark

              className={cn("size-3.5", saved && "fill-current text-primary")}

              aria-hidden

            />

            Save

          </Button>

        </CardFooter>

      </Card>

    </article>

  );

}

