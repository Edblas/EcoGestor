import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { materialSchema, MaterialFormData } from "@/lib/schemas/materialSchema";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Material } from "@/types";

interface MaterialFormProps {
  initialData?: Material;
  onSubmit: (data: MaterialFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function MaterialForm({ initialData, onSubmit, onCancel, isSubmitting }: MaterialFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MaterialFormData>({
    resolver: zodResolver(materialSchema),
    defaultValues: initialData
      ? {
          nome: initialData.nome,
          categoria: initialData.categoria,
          unidadeMedida: initialData.unidadeMedida,
          valorPadraoKg: initialData.valorPadraoKg,
        }
      : {
          nome: "",
          categoria: "",
          unidadeMedida: "",
          valorPadraoKg: undefined,
        },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
          <Input {...register("nome")} error={errors.nome?.message} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Categoria *</label>
          <Input {...register("categoria")} error={errors.categoria?.message} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Unidade de Medida *</label>
          <Input {...register("unidadeMedida")} error={errors.unidadeMedida?.message} placeholder="kg, tonelada" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Valor Padrão por kg</label>
          <Input
            type="number"
            step="0.01"
            {...register("valorPadraoKg", { 
              valueAsNumber: true,
              setValueAs: (v) => v === "" ? undefined : Number(v)
            })}
            error={errors.valorPadraoKg?.message}
          />
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {initialData ? "Atualizar" : "Cadastrar"}
        </Button>
      </div>
    </form>
  );
}
