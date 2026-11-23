"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useCreateTask } from "@/features/tasks/hooks";
import {
  TASK_CATEGORIES,
  TASK_PRIORITIES,
  newTaskSchema,
  type NewTaskFormValues,
} from "@/features/tasks/schema";
import { ASSIGNEES } from "@/features/tasks/task-details";
import type { Unit } from "@/types";

const fieldClass =
  "h-11 w-full rounded-lg border border-transparent bg-brand-50 px-3 text-sm text-ink outline-none " +
  "focus-visible:border-brand-600 focus-visible:ring-2 focus-visible:ring-brand-600/30";

function a11y(id: string, error?: string) {
  return {
    id,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? `${id}-error` : undefined,
  };
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-ink">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs font-medium text-danger-700">
          {error}
        </p>
      )}
    </div>
  );
}

type NewTaskDialogProps = {
  open: boolean;
  onClose: () => void;
  units: Unit[];
};

export function NewTaskDialog({ open, onClose, units }: NewTaskDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const { mutate, isPending, error, reset: resetMutation } = useCreateTask();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewTaskFormValues>({
    resolver: zodResolver(newTaskSchema),
    defaultValues: { priority: "normal" },
  });

  // Apenas fornecedores ativos ou em homologação podem receber tarefas
  const activeUnits = units.filter((u) => u.status !== "inativa");

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  function handleClose() {
    reset({ priority: "normal" });
    resetMutation();
    onClose();
  }

  function onSubmit(values: NewTaskFormValues) {
    mutate(
      {
        title: values.title,
        unitId: values.unitId,
        dueDate: values.dueDate,
        status: "pendente",
        category: values.category,
        priority: values.priority,
        assignee: values.assignee,
        description: values.description,
      },
      { onSuccess: handleClose },
    );
  }

  return (
    <dialog
      ref={ref}
      aria-labelledby="new-task-title"
      onCancel={(event) => {
        event.preventDefault();
        handleClose();
      }}
      className="m-auto w-full max-w-2xl rounded-2xl bg-white p-6 backdrop:bg-black/40"
    >
      <h2 id="new-task-title" className="text-lg font-semibold text-ink">
        Nova tarefa
      </h2>
      <p className="mt-1 text-sm text-slate-500">A tarefa entra como &quot;Pendente&quot; no checklist e no Kanban.</p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-5 space-y-4">
        <Field id="task-title" label="Título da tarefa" error={errors.title?.message}>
          <input
            {...a11y("task-title", errors.title?.message)}
            {...register("title")}
            placeholder="Ex.: Solicitar certidão negativa atualizada"
            className={fieldClass}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="task-unit" label="Fornecedor" error={errors.unitId?.message}>
            <select {...a11y("task-unit", errors.unitId?.message)} {...register("unitId")} className={fieldClass}>
              <option value="">Selecione...</option>
              {activeUnits.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.name}
                </option>
              ))}
            </select>
          </Field>

          <Field id="task-category" label="Categoria" error={errors.category?.message}>
            <select {...a11y("task-category", errors.category?.message)} {...register("category")} className={fieldClass}>
              <option value="">Selecione...</option>
              {TASK_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </Field>

          <Field id="task-priority" label="Prioridade" error={errors.priority?.message}>
            <select {...a11y("task-priority", errors.priority?.message)} {...register("priority")} className={fieldClass}>
              {TASK_PRIORITIES.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </Field>

          <Field id="task-assignee" label="Responsável" error={errors.assignee?.message}>
            <select {...a11y("task-assignee", errors.assignee?.message)} {...register("assignee")} className={fieldClass}>
              <option value="">Selecione...</option>
              {ASSIGNEES.map((person) => (
                <option key={person} value={person}>
                  {person}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field id="task-due-date" label="Prazo de vencimento" error={errors.dueDate?.message}>
          <input
            type="date"
            {...a11y("task-due-date", errors.dueDate?.message)}
            {...register("dueDate")}
            className={fieldClass}
          />
        </Field>

        <Field id="task-description" label="Descrição" error={errors.description?.message}>
          <textarea
            rows={3}
            {...a11y("task-description", errors.description?.message)}
            {...register("description")}
            placeholder="Descreva o que precisa ser verificado ou executado..."
            className="w-full rounded-lg border border-transparent bg-brand-50 p-3 text-sm text-ink outline-none focus-visible:border-brand-600 focus-visible:ring-2 focus-visible:ring-brand-600/30"
          />
        </Field>

        {error && (
          <p role="alert" className="text-sm font-medium text-danger-700">
            {error.message}
          </p>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Salvando..." : "Criar tarefa"}
          </Button>
        </div>
      </form>
    </dialog>
  );
}