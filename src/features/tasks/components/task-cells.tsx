import { CalendarDays, ShieldAlert } from "lucide-react";
import { Badge, type BadgeVariant } from "@/components/ui/badge";
import type { TaskItem, TaskPriority } from "@/features/tasks/types";
import { formatDeadline, PRIORITY_LABEL, type DeadlineTone } from "@/features/tasks/utils";
import { getInitials } from "@/features/units/utils";
import { cn } from "@/lib/utils";

// Etiqueta de prioridade, usando as variantes que a squad já criou:
// crítica = vermelho forte, alta = danger, média = info (azul), normal = neutral (cinza).
const priorityVariant: Record<TaskPriority, BadgeVariant> = {
  critica: "danger",
  alta: "danger",
  media: "info",
  normal: "neutral",
};

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  return (
    <Badge variant={priorityVariant[priority]} className={cn(priority === "critica" && "bg-danger-700 text-white")}>
      {priority === "critica" && <ShieldAlert size={12} className="mr-1" aria-hidden="true" />}
      {PRIORITY_LABEL[priority]}
    </Badge>
  );
}

// Bolinha com as iniciais do responsável.
export function TaskAvatar({ name }: { name: string }) {
  return (
    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
      {getInitials(name)}
    </span>
  );
}

const deadlineTone: Record<DeadlineTone, string> = {
  danger: "text-danger-700 font-semibold",
  warning: "text-amber-700",
  neutral: "text-slate-500",
};

// Linha do prazo, ex.: "Em 5 dias (22/09/2026)".
export function TaskDeadline({ task }: { task: TaskItem }) {
  const { text, tone } = formatDeadline(task);
  return (
    <p className={cn("flex items-center gap-1.5 text-xs", deadlineTone[tone])}>
      <CalendarDays size={14} aria-hidden="true" /> {text}
    </p>
  );
}