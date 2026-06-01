"use client";

import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface StatePanelProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
  iconClassName?: string;
  children?: React.ReactNode;
}

export function StatePanel({
  icon: Icon,
  title,
  description,
  className,
  iconClassName,
  children,
}: StatePanelProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-xl border border-dashed border-border bg-card px-6 py-14 text-center shadow-sm",
        className
      )}
      role="status"
    >
      <div
        className={cn(
          "mb-5 flex size-14 items-center justify-center rounded-2xl bg-accent text-primary",
          iconClassName
        )}
      >
        <Icon className="size-7" strokeWidth={1.5} aria-hidden />
      </div>
      <h2 className="text-lg font-semibold tracking-tight text-foreground">{title}</h2>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
      {children && (
        <div className="mt-6 flex flex-wrap justify-center gap-2">{children}</div>
      )}
    </div>
  );
}

interface StateActionProps {
  label: string;
  onClick?: () => void;
  variant?: "default" | "outline" | "secondary";
}

export function StateAction({
  label,
  onClick,
  variant = "default",
}: StateActionProps) {
  return (
    <Button
      type="button"
      variant={variant}
      className="focus-ring interactive"
      onClick={onClick}
    >
      {label}
    </Button>
  );
}
