
import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string; // texto lido por leitores de tela (acessibilidade)
  icon?: ReactNode; // ícone à esquerda
};

export function Input({ label, icon, className, ...props }: InputProps) {
  return (
    <label className="relative block">
      {/* Label invisível, mas associada ao campo */}
      <span className="sr-only">{label}</span>
      {icon && (
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </span>
      )}
      <input
        className={cn(
          "h-10 w-full rounded-lg border border-input bg-background pr-3 text-sm outline-none placeholder:text-slate-400 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
          icon ? "pl-10" : "pl-3",
          className,
        )}
        {...props}
      />
    </label>
  );
}
