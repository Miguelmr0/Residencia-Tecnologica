"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useCreateSupplier } from "@/features/units/suppliers-hooks";
import {
  BRAZIL_UFS,
  formatCnpj,
  newSupplierSchema,
  onlyDigits,
  type NewSupplierFormValues,
} from "@/features/units/schema";

// Todo fornecedor novo entra em homologação, ainda sem avaliação.
// Se o líder preferir outros valores, é só mudar aqui.
const NEW_SUPPLIER_DEFAULTS = {
  status: "em_homologacao",
  score: 60,
  docsOk: 0,
  docsTotal: 10,
} as const;

const fieldClass =
  "h-11 w-full rounded-lg border border-transparent bg-brand-50 px-3 text-sm text-ink outline-none " +
  "focus-visible:border-brand-600 focus-visible:ring-2 focus-visible:ring-brand-600/30";

// Atributos de acessibilidade: liga o campo à mensagem de erro
function a11y(id: string, error?: string) {
  return {
    id,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? `${id}-error` : undefined,
  };
}

// Rótulo + campo + mensagem de erro
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

type NewSupplierDialogProps = {
  open: boolean;
  onClose: () => void;
  categories: string[]; // categorias que já existem na lista
  existingCnpjs: string[]; // para recusar CNPJ repetido
};

export function NewSupplierDialog({ open, onClose, categories, existingCnpjs }: NewSupplierDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const { mutate, isPending, isError, reset: resetMutation } = useCreateSupplier();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<NewSupplierFormValues>({ resolver: zodResolver(newSupplierSchema) });

  // Abre ou fecha o <dialog> nativo conforme a prop "open"
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  function handleClose() {
    reset();
    resetMutation();
    onClose();
  }

  function onSubmit(values: NewSupplierFormValues) {
    const digits = onlyDigits(values.cnpj);
    if (existingCnpjs.some((cnpj) => onlyDigits(cnpj) === digits)) {
      setError("cnpj", { message: "Já existe um fornecedor com este CNPJ." });
      return;
    }
    mutate(
      {
        name: values.name,
        city: values.city,
        manager: values.manager,
        uf: values.uf,
        cnpj: formatCnpj(values.cnpj),
        category: values.category,
        contactName: values.contactName,
        contactEmail: values.contactEmail,
        ...NEW_SUPPLIER_DEFAULTS,
      },
      { onSuccess: handleClose },
    );
  }

  return (
    <dialog
      ref={ref}
      aria-labelledby="new-supplier-title"
      // Esc: avisamos a página em vez de fechar sozinho
      onCancel={(event) => {
        event.preventDefault();
        handleClose();
      }}
      className="m-auto w-full max-w-2xl rounded-2xl bg-white p-6 backdrop:bg-black/40"
    >
      <h2 id="new-supplier-title" className="text-lg font-semibold text-ink">
        Novo fornecedor
      </h2>
      <p className="mt-1 text-sm text-slate-500">O fornecedor entra como &quot;Em homologação&quot; até ser avaliado.</p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-5 space-y-4">
        <Field id="supplier-name" label="Razão social" error={errors.name?.message}>
          <input {...a11y("supplier-name", errors.name?.message)} {...register("name")} className={fieldClass} />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="supplier-cnpj" label="CNPJ" error={errors.cnpj?.message}>
            <input
              {...a11y("supplier-cnpj", errors.cnpj?.message)}
              {...register("cnpj")}
              placeholder="00.000.000/0000-00"
              className={fieldClass}
            />
          </Field>

          <Field id="supplier-category" label="Categoria" error={errors.category?.message}>
            <select {...a11y("supplier-category", errors.category?.message)} {...register("category")} className={fieldClass}>
              <option value="">Selecione...</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </Field>

          <Field id="supplier-city" label="Cidade" error={errors.city?.message}>
            <input {...a11y("supplier-city", errors.city?.message)} {...register("city")} className={fieldClass} />
          </Field>

          <Field id="supplier-uf" label="Estado (UF)" error={errors.uf?.message}>
            <select {...a11y("supplier-uf", errors.uf?.message)} {...register("uf")} className={fieldClass}>
              <option value="">Selecione...</option>
              {BRAZIL_UFS.map((uf) => (
                <option key={uf} value={uf}>
                  {uf}
                </option>
              ))}
            </select>
          </Field>

          <Field id="supplier-manager" label="Gerente responsável" error={errors.manager?.message}>
            <input {...a11y("supplier-manager", errors.manager?.message)} {...register("manager")} className={fieldClass} />
          </Field>

          <Field id="supplier-contact" label="Contato principal" error={errors.contactName?.message}>
            <input {...a11y("supplier-contact", errors.contactName?.message)} {...register("contactName")} className={fieldClass} />
          </Field>
        </div>

        <Field id="supplier-email" label="E-mail do contato" error={errors.contactEmail?.message}>
          <input
            type="email"
            {...a11y("supplier-email", errors.contactEmail?.message)}
            {...register("contactEmail")}
            className={fieldClass}
          />
        </Field>

        {isError && (
          <p role="alert" className="text-sm font-medium text-danger-700">
            Não foi possível salvar o fornecedor. Tente novamente.
          </p>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Salvando..." : "Salvar fornecedor"}
          </Button>
        </div>
      </form>
    </dialog>
  );
}