export type RoleTypeFilter = "all" | "intern" | "new_grad" | "experienced";

export interface SearchFilters {
  skills: string[];
  gradYearMin: number | null;
  gradYearMax: number | null;
  major: string;
  roleType: RoleTypeFilter;
}

export interface ResumeSearchResult {
  rank: number;
  resume_id: string;
  candidate_id: string;
  filename: string;
  score: number;
  semantic_score: number;
  full_name: string;
  major: string;
  graduation_year: string;
  matched_skills: string[];
  text_preview: string;
  resume_link?: string;
  linkedin?: string;
  github?: string;
  grok_summary?: string;
  top_evidence_chunks?: { section_type: string; score: number; text: string }[];
  ranking_details?: Record<string, unknown>;
}

export interface ResumeDetail {
  resume_id: string;
  candidate_id: string;
  filename: string;
  source: string;
  full_name: string;
  major: string;
  graduation_year: string;
  resume_link: string;
  linkedin: string;
  github: string;
  skills: string[];
  canonical_skills: string[];
  summary: string;
  education: unknown[];
  experience: unknown[];
  projects: unknown[];
  employer_names: string[];
  estimated_years_experience: number | null;
  combined_text: string;
}

export interface SearchResponse {
  results: ResumeSearchResult[];
  elapsedMs: number;
}
