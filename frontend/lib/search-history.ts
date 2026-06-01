const STORAGE_KEY = "talentlens-search-history";
const MAX_ENTRIES = 5;

export function getSearchHistory(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((q): q is string => typeof q === "string" && q.trim().length > 0);
  } catch {
    return [];
  }
}

export function pushSearchHistory(query: string): void {
  const trimmed = query.trim();
  if (!trimmed || typeof window === "undefined") return;
  const prev = getSearchHistory().filter((q) => q !== trimmed);
  const next = [trimmed, ...prev].slice(0, MAX_ENTRIES);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function clearSearchHistory(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}
