import type { ResumeSearchResult } from "@/lib/types";

const STORAGE_KEY = "talentlens-saved-resumes";

export interface SavedResumeEntry {
  resume_id: string;
  full_name: string;
  major: string;
  graduation_year: string;
  score: number;
  savedAt: number;
}

export function getSavedResumes(): SavedResumeEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (row): row is SavedResumeEntry =>
        row !== null &&
        typeof row === "object" &&
        typeof (row as SavedResumeEntry).resume_id === "string"
    );
  } catch {
    return [];
  }
}

function writeSaved(entries: SavedResumeEntry[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function isResumeSaved(resumeId: string): boolean {
  return getSavedResumes().some((r) => r.resume_id === resumeId);
}

export function saveResumeFromResult(resume: ResumeSearchResult): void {
  const resumeId = resume.resume_id || resume.candidate_id;
  if (!resumeId) return;
  const entry: SavedResumeEntry = {
    resume_id: resumeId,
    full_name: resume.full_name || resume.filename,
    major: resume.major || "",
    graduation_year: resume.graduation_year || "",
    score: resume.score,
    savedAt: Date.now(),
  };
  const prev = getSavedResumes().filter((r) => r.resume_id !== resumeId);
  writeSaved([entry, ...prev]);
}

export function removeSavedResume(resumeId: string): void {
  writeSaved(getSavedResumes().filter((r) => r.resume_id !== resumeId));
}

export function toggleSavedResume(resume: ResumeSearchResult): boolean {
  const resumeId = resume.resume_id || resume.candidate_id;
  if (!resumeId) return false;
  if (isResumeSaved(resumeId)) {
    removeSavedResume(resumeId);
    return false;
  }
  saveResumeFromResult(resume);
  return true;
}
