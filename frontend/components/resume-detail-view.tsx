"use client";

import Link from "next/link";
import { useCallback } from "react";
import { useToast } from "@/components/toast-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { publicResumeUrl } from "@/lib/public-url";
import type { ResumeDetail } from "@/lib/types";
import { ArrowLeft, ExternalLink, Link2 } from "lucide-react";

function formatEntry(entry: unknown): string {
  if (typeof entry === "string") return entry;
  if (entry && typeof entry === "object") {
    const obj = entry as Record<string, unknown>;
    if (typeof obj.raw_text === "string" && obj.raw_text.trim()) {
      return obj.raw_text.trim();
    }
    const parts = [
      obj.title,
      obj.company,
      obj.name,
      obj.degree,
      obj.school,
    ]
      .filter((p) => typeof p === "string" && String(p).trim())
      .map(String);
    if (parts.length) return parts.join(" · ");
    return JSON.stringify(obj, null, 0).slice(0, 500);
  }
  return String(entry ?? "");
}

interface ResumeDetailViewProps {
  resume: ResumeDetail;
}

export function ResumeDetailView({ resume }: ResumeDetailViewProps) {
  const { showToast } = useToast();
  const skills =
    resume.canonical_skills?.length > 0
      ? resume.canonical_skills
      : resume.skills ?? [];

  const copyShareLink = useCallback(async () => {
    const url = publicResumeUrl(resume.resume_id);
    try {
      await navigator.clipboard.writeText(url);
      showToast("Link copied to clipboard");
    } catch {
      showToast("Could not copy link");
    }
  }, [resume.resume_id, showToast]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/"
          className="focus-ring interactive inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-background px-3 text-sm font-medium text-foreground hover:bg-muted hover:text-primary"
        >
          <ArrowLeft className="size-4" />
          Back to search
        </Link>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="focus-ring interactive gap-2"
          onClick={() => void copyShareLink()}
        >
          <Link2 className="size-4" aria-hidden />
          Copy link
        </Button>
      </div>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {resume.full_name || resume.resume_id}
        </h1>
        <p className="mt-1 text-muted-foreground">
          {[resume.major, resume.graduation_year && `Class of ${resume.graduation_year}`]
            .filter(Boolean)
            .join(" · ")}
        </p>
        {resume.estimated_years_experience != null && (
          <p className="mt-1 text-sm text-muted-foreground">
            ~{resume.estimated_years_experience.toFixed(1)} years experience (estimated)
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {resume.resume_link && (
          <a
            href={resume.resume_link}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring interactive inline-flex h-9 items-center rounded-lg border border-border bg-background px-3 text-sm font-medium text-foreground hover:bg-muted hover:text-primary"
          >
            Resume PDF
            <ExternalLink className="ml-1 size-3.5" />
          </a>
        )}
        {resume.linkedin && (
          <a
            href={resume.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring interactive inline-flex h-9 items-center rounded-lg border border-border bg-background px-3 text-sm font-medium text-foreground hover:bg-muted hover:text-primary"
          >
            LinkedIn
            <ExternalLink className="ml-1 size-3.5" />
          </a>
        )}
        {resume.github && (
          <a
            href={resume.github}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring interactive inline-flex h-9 items-center rounded-lg border border-border bg-background px-3 text-sm font-medium text-foreground hover:bg-muted hover:text-primary"
          >
            GitHub
            <ExternalLink className="ml-1 size-3.5" />
          </a>
        )}
      </div>

      {skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {skills.map((skill) => (
            <Badge key={skill} variant="secondary">
              {skill}
            </Badge>
          ))}
        </div>
      )}

      {resume.summary && (
        <Card className="border-border/80 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
              {resume.summary}
            </p>
          </CardContent>
        </Card>
      )}

      {resume.experience?.length > 0 && (
        <Card className="border-border/80 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Experience</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {resume.experience.map((entry, i) => (
              <p key={i} className="text-sm leading-relaxed text-muted-foreground">
                {formatEntry(entry)}
              </p>
            ))}
          </CardContent>
        </Card>
      )}

      {resume.projects?.length > 0 && (
        <Card className="border-border/80 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Projects</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {resume.projects.map((entry, i) => (
              <p key={i} className="text-sm leading-relaxed text-muted-foreground">
                {formatEntry(entry)}
              </p>
            ))}
          </CardContent>
        </Card>
      )}

      {resume.education?.length > 0 && (
        <Card className="border-border/80 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Education</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {resume.education.map((entry, i) => (
              <p key={i} className="text-sm leading-relaxed text-muted-foreground">
                {formatEntry(entry)}
              </p>
            ))}
          </CardContent>
        </Card>
      )}

      {resume.employer_names?.length > 0 && (
        <>
          <Separator />
          <p className="text-sm text-muted-foreground">
            Employers: {resume.employer_names.join(", ")}
          </p>
        </>
      )}

      {resume.combined_text && (
        <Card className="border-border/80 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Full text</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="max-h-[28rem] overflow-auto whitespace-pre-wrap rounded-md bg-muted/50 p-4 text-xs leading-relaxed text-muted-foreground">
              {resume.combined_text}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
