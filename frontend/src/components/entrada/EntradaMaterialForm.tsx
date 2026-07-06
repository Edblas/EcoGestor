import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { entradaMaterialSchema, EntradaMaterialFormData } from "@/lib/schemas/entradaSchema";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Material, Fornecedor, Cliente, EntradaMaterial, StatusEntradaMaterial } from "@/types";
import { useEffect } from "react";

interface EntradaMaterialFormProps {
  materials: Material[];
  fornecedores: Fornecedor[];
  clientes: Cliente[];
  initialData?: EntradaMaterial;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function EntradaMaterialForm({
  materials,
  fornecedores,
  clientes,
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
}: EntradaMaterialFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EntradaMaterialFormData>({
    resolver: zodResolver(entradaMaterialSchema),
    defaultValues: initialData
      ? {
          tipoParceiro: initialData.clienteId ? "CLIENTE" : "FORNECEDOR",
          status: initialData.status,
          clienteId: initialData.clienteId || "",
          fornecedorId: initialData.fornecedorId || "",
          materialId: initialData.materialId,
          peso: initialData.peso,
          valorKg: initialData.valorKg,
          dataEntrada: new Date(initialData.dataEntrada).toISOString().split("T")[0],
          observacoes: initialData.observacoes || "",
        }
      : {
          tipoParceiro: "FORNECEDOR",
          status: StatusEntradaMaterial.EM_ANDAMENTO,
          clienteId: "",
          fornecedorId: "",
          materialId: "",
          peso: 0,
          valorKg: 0,
          dataEntrada: new Date().toISOString().split("T")[0],
          observacoes: "",
        },
  });

  const selectedMaterialId = watch("materialId");
  const tipoParceiro = watch("tipoParceiro");

  useEffect(() => {
    const material = materials.find((m) => m.id === selectedMaterialId);
    if (material && material.valorPadraoKg != null) {
      if (!initialData || selectedMaterialId !== initialData.materialId) {
        setValue("valorKg", material.valorPadraoKg);
      }
    }
  }, [selectedMaterialId, materials, setValue, initialData]);

  const handleFormSubmit = (data: EntradaMaterialFormData) => {
    const { tipoParceiro, clienteId, fornecedorId, ...rest } = data;
    const submitData = {
      ...rest,
      status: initialData ? StatusEntradaMaterial.EM_ANDAMENTO : rest.status,
      clienteId: tipoParceiro === "CLIENTE" ? clienteId : undefined,
      fornecedorId: tipoParceiro === "FORNECEDOR" ? fornecedorId : undefined,
    };
    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Parceiro *
          </label>
          <select
            {...register("tipoParceiro")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="FORNECEDOR">Fornecedor</option>
            <option value="CLIENTE">Cliente</option>
          </select>
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
                <option value={StatusEntradaMaterial.EM_ANDAMENTO}>Em andamento</option>
              </select>
            </>
          ) : (
            <>
              <select
                {...register("status")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value={StatusEntradaMaterial.EM_ANDAMENTO}>Em andamento</option>
                <option value={StatusEntradaMaterial.FINALIZADO}>Finalizado</option>
              </select>
              {errors.status && (
                <p className="text-sm text-red-600 mt-1">{errors.status.message}</p>
              )}
            </>
          )}
        </div>

        {tipoParceiro === "FORNECEDOR" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fornecedor *
            </label>
            <select
              {...register("fornecedorId")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Selecione um fornecedor</option>
              {fornecedores.map((fornecedor) => (
                <option key={fornecedor.id} value={fornecedor.id}>
                  {fornecedor.nome}
                </option>
              ))}
            </select>
            {errors.fornecedorId && (
              <p className="text-sm text-red-600 mt-1">{errors.fornecedorId.message}</p>
            )}
          </div>
        )}

        {tipoParceiro === "CLIENTE" && (
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
        )}

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
            Valor/kg (R$)
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
            {...register("dataEntrada")}
            error={errors.dataEntrada?.message}
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
          {initialData ? "Salvar" : "Registrar"}
        </Button>
      </div>
    </form>
  );
}
