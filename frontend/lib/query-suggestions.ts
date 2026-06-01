/** Hardcoded v1 query suggestions shown while typing. */
export const QUERY_SUGGESTIONS = [
  "machine learning engineer",
  "data scientist new grad",
  "frontend react",
  "python backend intern",
  "computer vision research",
] as const;

export function matchQuerySuggestions(input: string, limit = 5): string[] {
  const q = input.trim().toLowerCase();
  if (!q) return [];
  return QUERY_SUGGESTIONS.filter((s) => s.toLowerCase().includes(q)).slice(0, limit);
}
