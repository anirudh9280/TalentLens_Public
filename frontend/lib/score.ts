export type ScoreTier = "high" | "mid" | "low";

export function getScoreTier(score: number): ScoreTier {
  if (score >= 0.8) return "high";
  if (score >= 0.6) return "mid";
  return "low";
}

export function scoreTierLabel(tier: ScoreTier): string {
  switch (tier) {
    case "high":
      return "Strong match";
    case "mid":
      return "Good match";
    default:
      return "Partial match";
  }
}

export function scoreStrokeClass(tier: ScoreTier): string {
  switch (tier) {
    case "high":
      return "stroke-score-high";
    case "mid":
      return "stroke-score-mid";
    default:
      return "stroke-score-low";
  }
}

export function scoreBadgeClass(tier: ScoreTier): string {
  switch (tier) {
    case "high":
      return "bg-score-high/12 text-score-high border-score-high/25";
    case "mid":
      return "bg-score-mid/12 text-score-mid border-score-mid/25";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
}
