/** Public share URL for a resume detail page (production host). */
export function publicResumeUrl(resumeId: string): string {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "https://ds3atucsd.com";
  return `${base}/talentlens/resume/${encodeURIComponent(resumeId)}`;
}
