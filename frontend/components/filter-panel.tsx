"use client";

import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ROLE_TYPE_OPTIONS, SKILL_FILTER_OPTIONS } from "@/lib/constants";
import type { SearchFilters } from "@/lib/types";
import { cn } from "@/lib/utils";

interface FilterPanelProps {
  filters: SearchFilters;
  onChange: (next: SearchFilters) => void;
  className?: string;
}

export function FilterPanel({ filters, onChange, className }: FilterPanelProps) {
  const toggleSkill = (skill: string) => {
    const selected = filters.skills.includes(skill)
      ? filters.skills.filter((s) => s !== skill)
      : [...filters.skills, skill];
    onChange({ ...filters, skills: selected });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <fieldset>
        <legend className="text-sm font-medium text-foreground">Skills</legend>
        <p id="skills-filter-hint" className="mt-1 text-xs text-muted-foreground">
          Select required skills. Results must match every skill you choose.
        </p>
        <div
          className="mt-3 flex flex-wrap gap-2"
          role="group"
          aria-describedby="skills-filter-hint"
        >
          {SKILL_FILTER_OPTIONS.map((skill) => {
            const active = filters.skills.includes(skill);
            return (
              <button
                key={skill}
                type="button"
                aria-pressed={active}
                aria-label={`${active ? "Remove" : "Require"} skill ${skill}`}
                onClick={() => toggleSkill(skill)}
                className="focus-ring interactive rounded-full"
              >
                <Badge
                  variant={active ? "default" : "outline"}
                  className={cn(
                    "pointer-events-none cursor-pointer",
                    active && "ring-1 ring-primary/30"
                  )}
                >
                  {skill}
                </Badge>
              </button>
            );
          })}
        </div>
      </fieldset>

      <Separator />

      <fieldset className="grid grid-cols-2 gap-3">
        <legend className="col-span-2 text-sm font-medium text-foreground">
          Graduation year range
        </legend>
        <div>
          <Label htmlFor="grad-min">Minimum year</Label>
          <Input
            id="grad-min"
            type="number"
            min={2020}
            max={2035}
            placeholder="2025"
            className="focus-ring interactive mt-1.5"
            value={filters.gradYearMin ?? ""}
            onChange={(e) =>
              onChange({
                ...filters,
                gradYearMin: e.target.value ? Number(e.target.value) : null,
              })
            }
          />
        </div>
        <div>
          <Label htmlFor="grad-max">Maximum year</Label>
          <Input
            id="grad-max"
            type="number"
            min={2020}
            max={2035}
            placeholder="2028"
            className="focus-ring interactive mt-1.5"
            value={filters.gradYearMax ?? ""}
            onChange={(e) =>
              onChange({
                ...filters,
                gradYearMax: e.target.value ? Number(e.target.value) : null,
              })
            }
          />
        </div>
        <p className="col-span-2 text-xs text-muted-foreground">
          Applied on the server after retrieval, before reranking.
        </p>
      </fieldset>

      <Separator />

      <fieldset>
        <legend className="text-sm font-medium text-foreground">Role type</legend>
        <p className="mt-1 text-xs text-muted-foreground">
          Inferred from experience and graduation year.
        </p>
        <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label="Role type filter">
          {ROLE_TYPE_OPTIONS.map((opt) => {
            const active = filters.roleType === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => onChange({ ...filters, roleType: opt.value })}
                className="focus-ring interactive rounded-full"
              >
                <Badge variant={active ? "default" : "outline"} className="pointer-events-none">
                  {opt.label}
                </Badge>
              </button>
            );
          })}
        </div>
      </fieldset>

      <Separator />

      <div>
        <Label htmlFor="major-filter">Major contains</Label>
        <Input
          id="major-filter"
          type="text"
          placeholder="e.g. Computer Science"
          className="focus-ring interactive mt-1.5"
          value={filters.major}
          onChange={(e) => onChange({ ...filters, major: e.target.value })}
        />
      </div>
    </div>
  );
}
