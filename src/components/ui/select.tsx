import { cn } from "@/lib/utils";

type SelectOption = { value: string; label: string };

type SelectProps = {
  label: string; // texto para leitores de tela
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  className?: string;
};

export function Select({ label, value, options, onChange, className }: SelectProps) {
  return (
    <label className={cn("block", className)}>
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}