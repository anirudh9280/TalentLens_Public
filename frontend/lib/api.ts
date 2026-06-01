import { filtersToApiBody } from "@/lib/filters";
import type { ResumeDetail, ResumeSearchResult, SearchFilters, SearchResponse } from "@/lib/types";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:8000";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function parseErrorMessage(res: Response): Promise<string> {
  try {
    const data = await res.json();
    if (typeof data?.detail === "string") return data.detail;
    if (Array.isArray(data?.detail)) {
      return data.detail.map((d: { msg?: string }) => d.msg ?? JSON.stringify(d)).join("; ");
    }
    return JSON.stringify(data);
  } catch {
    return res.statusText || `Request failed (${res.status})`;
  }
}

export async function searchResumes(
  query: string,
  filters: SearchFilters,
  topK = 20
): Promise<SearchResponse> {
  const start = performance.now();
  const res = await fetch(`${API_BASE_URL}/api/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: query.trim(),
      top_k: topK,
      filters: filtersToApiBody(filters),
    }),
  });

  if (!res.ok) {
    throw new ApiError(res.status, await parseErrorMessage(res));
  }

  const results = (await res.json()) as ResumeSearchResult[];

  return {
    results,
    elapsedMs: Math.round(performance.now() - start),
  };
}

export async function fetchResume(resumeId: string): Promise<ResumeDetail> {
  const res = await fetch(
    `${API_BASE_URL}/api/resume/${encodeURIComponent(resumeId)}`
  );

  if (!res.ok) {
    throw new ApiError(res.status, await parseErrorMessage(res));
  }

  return res.json() as Promise<ResumeDetail>;
}

export function resumeDetailPath(resumeId: string): string {
  return `/resume/${encodeURIComponent(resumeId)}`;
}
