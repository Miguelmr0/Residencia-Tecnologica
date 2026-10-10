import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const variants = {
  brand: "bg-brand-100 text-brand-700",
  danger: "bg-danger-50 text-danger-700",
  neutral: "bg-slate-200 text-slate-700",
} as const;

export type BadgeVariant = keyof typeof variants;

export function Badge({
  variant = "brand",
  children,
  className,
}: {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}