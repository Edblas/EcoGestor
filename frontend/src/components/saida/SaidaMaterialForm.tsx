import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { saidaMaterialSchema, SaidaMaterialFormData } from "@/lib/schemas/saidaSchema";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Material, Cliente, SaidaMaterial, StatusSaidaMaterial } from "@/types";
import { useEffect } from "react";

interface SaidaMaterialFormProps {
  materials: Material[];
  clientes: Cliente[];
  initialData?: SaidaMaterial;
  onSubmit: (data: SaidaMaterialFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function SaidaMaterialForm({
  materials,
  clientes,
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
}: SaidaMaterialFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SaidaMaterialFormData>({
    resolver: zodResolver(saidaMaterialSchema),
    defaultValues: initialData
      ? {
          clienteId: initialData.clienteId,
          materialId: initialData.materialId,
          peso: initialData.peso,
          valorKg: initialData.valorKg,
          dataSaida: new Date(initialData.dataSaida).toISOString().split("T")[0],
          status: initialData.status,
          observacoes: initialData.observacoes || "",
        }
      : {
          clienteId: "",
          materialId: "",
          peso: 0,
          valorKg: 0,
          dataSaida: new Date().toISOString().split("T")[0],
          status: StatusSaidaMaterial.FINALIZADO,
          observacoes: "",
        },
  });

  const selectedMaterialId = watch("materialId");

  useEffect(() => {
    const material = materials.find((m) => m.id === selectedMaterialId);
    if (material) {
      if (!initialData || selectedMaterialId !== initialData.materialId) {
        setValue("valorKg", material.valorPadraoKg);
      }
    }
  }, [selectedMaterialId, materials, setValue, initialData]);

  const handleFormSubmit = (data: SaidaMaterialFormData) => {
    const submitData = {
      ...data,
      status: initialData ? StatusSaidaMaterial.EM_ANDAMENTO : data.status,
    };
    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cliente *
          </label>
          <select
            {...register("clienteId")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="">Selecione um cliente</option>
            {clientes.map((cliente) => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.nome}
              </option>
            ))}
          </select>
          {errors.clienteId && (
            <p className="text-sm text-red-600 mt-1">{errors.clienteId.message}</p>
          )}
        </div>
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
            Valor/kg (R$) *
          </label>
          <Input
            type="number"
            step="0.01"
            {...register("valorKg", { valueAsNumber: true })}
            error={errors.valorKg?.message}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data *
          </label>
          <Input
            type="date"
            {...register("dataSaida")}
            error={errors.dataSaida?.message}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status *
          </label>
          {initialData ? (
            <>
              <input type="hidden" {...register("status")} />
              <select
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
              >
                <option value={StatusSaidaMaterial.EM_ANDAMENTO}>Em andamento</option>
              </select>
            </>
          ) : (
            <>
              <select
                {...register("status")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value={StatusSaidaMaterial.FINALIZADO}>Concluída</option>
                <option value={StatusSaidaMaterial.EM_ANDAMENTO}>Em andamento</option>
              </select>
              {errors.status && (
                <p className="text-sm text-red-600 mt-1">{errors.status.message}</p>
              )}
            </>
          )}
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
          {initialData ? "Salvar" : "Registrar"}
        </Button>
      </div>
    </form>
  );
}
