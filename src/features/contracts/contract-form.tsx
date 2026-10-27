"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useCreateContract } from "@/features/contracts/hooks";

const contractSchema = z.object({
  code: z.string().min(1, "Informe o código do contrato"),
  object: z.string().min(1, "Informe o objeto do contrato"),
  supplierName: z.string().min(1, "Informe o nome do fornecedor"),
  supplierCnpj: z.string().min(1, "Informe o CNPJ do fornecedor"),
  type: z.string().min(1, "Informe o tipo do contrato"),
  monthlyValue: z.coerce.number().positive("Valor mensal deve ser maior que zero"),
  annualValue: z.coerce.number().positive("Valor anual deve ser maior que zero"),
  startDate: z.string().min(1, "Informe a data de início"),
  endDate: z.string().min(1, "Informe a data de término"),
  readjustmentIndex: z.string().min(1, "Informe o índice de reajuste"),
  nextReadjustmentDate: z.string().min(1, "Informe a data do próximo reajuste"),
  responsible: z.string().min(1, "Informe o responsável"),
  status: z.enum(["vigente", "a_renovar", "em_aditivo", "vencido"], {
    errorMap: () => ({ message: "Selecione um status" }),
  }),
});

type ContractFormValues = z.infer<typeof contractSchema>;

export function ContractForm({ onSuccess }: { onSuccess: () => void }) {
  const { mutate, isPending, error } = useCreateContract();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContractFormValues>({ resolver: zodResolver(contractSchema) });

  function onSubmit(data: ContractFormValues) {
    mutate(data, { onSuccess });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="code" className="block text-sm font-medium mb-1">Código</label>
          <input id="code" {...register("code")} className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm" />
          {errors.code && <p className="text-xs text-red-600 mt-1">{errors.code.message}</p>}
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium mb-1">Tipo</label>
          <input id="type" {...register("type")} className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm" />
          {errors.type && <p className="text-xs text-red-600 mt-1">{errors.type.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="object" className="block text-sm font-medium mb-1">Objeto</label>
        <input id="object" {...register("object")} className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm" />
        {errors.object && <p className="text-xs text-red-600 mt-1">{errors.object.message}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="supplierName" className="block text-sm font-medium mb-1">Fornecedor</label>
          <input id="supplierName" {...register("supplierName")} className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm" />
          {errors.supplierName && <p className="text-xs text-red-600 mt-1">{errors.supplierName.message}</p>}
        </div>

        <div>
          <label htmlFor="supplierCnpj" className="block text-sm font-medium mb-1">CNPJ</label>
          <input id="supplierCnpj" {...register("supplierCnpj")} className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm" />
          {errors.supplierCnpj && <p className="text-xs text-red-600 mt-1">{errors.supplierCnpj.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="monthlyValue" className="block text-sm font-medium mb-1">Valor mensal (R$)</label>
          <input id="monthlyValue" type="number" step="0.01" {...register("monthlyValue")} className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm" />
          {errors.monthlyValue && <p className="text-xs text-red-600 mt-1">{errors.monthlyValue.message}</p>}
        </div>

        <div>
          <label htmlFor="annualValue" className="block text-sm font-medium mb-1">Valor anual (R$)</label>
          <input id="annualValue" type="number" step="0.01" {...register("annualValue")} className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm" />
          {errors.annualValue && <p className="text-xs text-red-600 mt-1">{errors.annualValue.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium mb-1">Início da vigência</label>
          <input id="startDate" type="date" {...register("startDate")} className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm" />
          {errors.startDate && <p className="text-xs text-red-600 mt-1">{errors.startDate.message}</p>}
        </div>

        <div>
          <label htmlFor="endDate" className="block text-sm font-medium mb-1">Término da vigência</label>
          <input id="endDate" type="date" {...register("endDate")} className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm" />
          {errors.endDate && <p className="text-xs text-red-600 mt-1">{errors.endDate.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="readjustmentIndex" className="block text-sm font-medium mb-1">Índice de reajuste</label>
          <input id="readjustmentIndex" {...register("readjustmentIndex")} className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm" />
          {errors.readjustmentIndex && <p className="text-xs text-red-600 mt-1">{errors.readjustmentIndex.message}</p>}
        </div>

        <div>
          <label htmlFor="nextReadjustmentDate" className="block text-sm font-medium mb-1">Próximo reajuste</label>
          <input id="nextReadjustmentDate" type="date" {...register("nextReadjustmentDate")} className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm" />
          {errors.nextReadjustmentDate && <p className="text-xs text-red-600 mt-1">{errors.nextReadjustmentDate.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="responsible" className="block text-sm font-medium mb-1">Responsável</label>
          <input id="responsible" {...register("responsible")} className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm" />
          {errors.responsible && <p className="text-xs text-red-600 mt-1">{errors.responsible.message}</p>}
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium mb-1">Status</label>
          <select id="status" {...register("status")} className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm">
            <option value="">Selecione...</option>
            <option value="vigente">Vigente</option>
            <option value="a_renovar">A Renovar</option>
            <option value="em_aditivo">Em Aditivo</option>
            <option value="vencido">Vencido</option>
          </select>
          {errors.status && <p className="text-xs text-red-600 mt-1">{errors.status.message}</p>}
        </div>
      </div>

      {error && <p className="text-sm text-red-600">Não foi possível salvar o contrato.</p>}

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Salvando..." : "Salvar Contrato"}
      </Button>
    </form>
  );
}