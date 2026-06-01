"use client";

import {
  getScoreTier,
  scoreBadgeClass,
  scoreStrokeClass,
  scoreTierLabel,
} from "@/lib/score";
import { cn } from "@/lib/utils";

interface MatchScoreRingProps {
  score: number;
  size?: number;
  className?: string;
}

export function MatchScoreRing({
  score,
  size = 44,
  className,
}: MatchScoreRingProps) {
  const tier = getScoreTier(score);
  const pct = Math.round(score * 100);
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.min(1, Math.max(0, score)));

  return (
    <div
      className={cn("flex flex-col items-center gap-1", className)}
      title={`${pct}% · ${scoreTierLabel(tier)}`}
    >
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="-rotate-90"
          aria-hidden
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            className="stroke-border"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            className={cn(scoreStrokeClass(tier), "transition-all duration-500")}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold tabular-nums text-foreground">
          {pct}
        </span>
      </div>
      <span
        className={cn(
          "rounded-full border px-1.5 py-0 text-[10px] font-medium leading-tight",
          scoreBadgeClass(tier)
        )}
      >
        {scoreTierLabel(tier)}
      </span>
    </div>
  );
}
