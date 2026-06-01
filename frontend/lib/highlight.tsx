import type { ReactNode } from "react";

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Wrap case-insensitive query token matches in <mark> */
export function highlightSnippet(text: string, query: string): ReactNode {
  const trimmed = query.trim();
  if (!trimmed) {
    return text;
  }

  const tokens = trimmed
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 1);

  if (tokens.length === 0) {
    return text;
  }

  const pattern = new RegExp(`(${tokens.map(escapeRegex).join("|")})`, "gi");
  const parts = text.split(pattern);

  return parts.map((part, index) => {
    const isMatch = tokens.some(
      (token) => part.toLowerCase() === token.toLowerCase()
    );
    if (isMatch) {
      return (
        <mark key={`${part}-${index}`} className="query-highlight">
          {part}
        </mark>
      );
    }
    return <span key={`${part}-${index}`}>{part}</span>;
  });
}
