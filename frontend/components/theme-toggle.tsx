"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      className={cn(
        "focus-ring interactive relative inline-flex size-9 items-center justify-center rounded-lg border border-border bg-card text-foreground hover:bg-accent hover:text-accent-foreground",
        className
      )}
      aria-label={
        mounted
          ? isDark
            ? "Switch to light mode"
            : "Switch to dark mode"
          : "Toggle color theme"
      }
      onClick={() => setTheme(isDark ? "light" : "dark")}
      disabled={!mounted}
    >
      <Sun
        className={cn(
          "size-4 transition-all duration-300 ease-out",
          mounted && isDark
            ? "rotate-90 scale-0 opacity-0"
            : "rotate-0 scale-100 opacity-100"
        )}
        aria-hidden
      />
      <Moon
        className={cn(
          "absolute size-4 transition-all duration-300 ease-out",
          mounted && isDark
            ? "rotate-0 scale-100 opacity-100"
            : "-rotate-90 scale-0 opacity-0"
        )}
        aria-hidden
      />
      <span className="sr-only">
        {mounted ? (isDark ? "Light mode" : "Dark mode") : "Theme"}
      </span>
    </button>
  );
}
