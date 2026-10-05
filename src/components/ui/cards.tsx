import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Cards({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-2xl bg-white p-5 shadow-sm sm:p-6", className)}
      {...props}
    />
  );
}