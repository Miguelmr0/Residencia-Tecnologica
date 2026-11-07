"use client";

import { useId, type ComponentProps, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InputProps extends ComponentProps<"input"> {
  label: string;
  error?: string;
  icon?: LucideIcon;
  endAdornment?: ReactNode;
  labelAction?: ReactNode;
}

export function Input({
  label,
  error,
  icon: Icon,
  endAdornment,
  labelAction,
  id,
  className,
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={inputId} className="text-sm font-semibold text-ink">
          {label}
        </label>
        {labelAction}
      </div>

      <div className="relative">
        {Icon && (
          <Icon
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
        )}

        <input
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            "h-11 w-full rounded-lg border border-transparent bg-brand-50 text-sm text-ink outline-none transition-colors",
            "placeholder:text-slate-500 focus-visible:border-brand-600 focus-visible:ring-2 focus-visible:ring-brand-600/30",
            "disabled:cursor-not-allowed disabled:opacity-50",
            Icon ? "pl-10" : "pl-3",
            endAdornment ? "pr-11" : "pr-3",
            error && "border-danger-700 bg-danger-50/40 focus-visible:border-danger-700 focus-visible:ring-danger-700/30",
            className
          )}
          {...props}
        />

        {endAdornment && (
          <div className="absolute right-1 top-1/2 -translate-y-1/2">{endAdornment}</div>
        )}
      </div>

      {error && (
        <p id={errorId} role="alert" className="text-xs font-medium text-danger-700">
          {error}
        </p>
      )}
    </div>
  );
}