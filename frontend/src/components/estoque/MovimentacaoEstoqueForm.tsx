import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  movimentacaoEstoqueSchema,
  MovimentacaoEstoqueFormData,
} from "@/lib/schemas/estoqueSchema";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Material, TipoMovimentacao } from "@/types";
import { useEffect } from "react";

interface MovimentacaoEstoqueFormProps {
  materials: Material[];
  onSubmit: (data: MovimentacaoEstoqueFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function MovimentacaoEstoqueForm({
  materials,
  onSubmit,
  onCancel,
  isSubmitting,
}: MovimentacaoEstoqueFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<MovimentacaoEstoqueFormData>({
    resolver: zodResolver(movimentacaoEstoqueSchema),
    defaultValues: {
      materialId: "",
      tipo: TipoMovimentacao.ENTRADA,
      peso: 0,
      valor: 0,
      dataMovimentacao: new Date().toISOString().split("T")[0],
      observacoes: "",
    },
  });

  const selectedMaterialId = watch("materialId");
  const peso = watch("peso");

  useEffect(() => {
    const material = materials.find((m) => m.id === selectedMaterialId);
    if (material && peso > 0) {
      setValue("valor", material.valorPadraoKg * peso);
    }
  }, [selectedMaterialId, peso, materials, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Material *
          </label>
          <select
            {...register("materialId")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="">Selecione um material</option>
            {materials.map((material) => (
              <option key={material.id} value={material.id}>
                {material.nome}
              </option>
            ))}
          </select>
          {errors.materialId && (
            <p className="text-sm text-red-600 mt-1">{errors.materialId.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo *
          </label>
          <select
            {...register("tipo")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value={TipoMovimentacao.ENTRADA}>Entrada</option>
            <option value={TipoMovimentacao.SAIDA}>Saída</option>
            <option value={TipoMovimentacao.AJUSTE}>Ajuste</option>
          </select>
          {errors.tipo && (
            <p className="text-sm text-red-600 mt-1">{errors.tipo.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Peso (kg) *
          </label>
          <Input
            type="number"
            step="0.01"
            {...register("peso", { valueAsNumber: true })}
            error={errors.peso?.message}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Valor (R$)
          </label>
          <Input
            type="number"
            step="0.01"
            {...register("valor", { valueAsNumber: true })}
            error={errors.valor?.message}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data *
          </label>
          <Input
            type="date"
            {...register("dataMovimentacao")}
            error={errors.dataMovimentacao?.message}
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Observações
        </label>
        <textarea
          {...register("observacoes")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          rows={3}
        />
      </div>
      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          Registrar
        </Button>
      </div>
    </form>
  );
}
