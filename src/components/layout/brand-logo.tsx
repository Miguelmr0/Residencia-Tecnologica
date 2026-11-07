import { cn } from "@/lib/utils";

export function BrandLogo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        aria-hidden
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-700 font-bold text-white"
      >
        V
      </div>
      <div className="leading-tight">
        <p className="text-xl font-bold text-ink">
          Vendor<span className="text-brand-700">Hub</span>
        </p>
        <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
          Enterprise Procurement Suite
        </p>
      </div>
    </div>
  );
}