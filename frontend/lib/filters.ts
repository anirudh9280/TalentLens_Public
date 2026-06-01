import type { SearchFilters } from "@/lib/types";

export function filtersToApiBody(filters: SearchFilters): Record<string, unknown> {
  const body: Record<string, unknown> = {
    input_mode: "Job Description",
  };

  if (filters.skills.length > 0) {
    body.skill_filters = filters.skills;
  }

  if (filters.gradYearMin !== null) {
    body.grad_year_min = filters.gradYearMin;
  }
  if (filters.gradYearMax !== null) {
    body.grad_year_max = filters.gradYearMax;
  }

  const major = filters.major.trim();
  if (major) {
    body.major_filter = major;
  }

  if (filters.roleType && filters.roleType !== "all") {
    body.role_type = filters.roleType;
  }

  return body;
}
