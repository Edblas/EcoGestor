import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { receitaSchema, ReceitaFormData } from "@/lib/schemas/receitaSchema";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Cliente, Receita } from "@/types";

interface ReceitaFormProps {
  clientes: Cliente[];
  initialData?: Receita;
  onSubmit: (data: ReceitaFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function ReceitaForm({
  clientes,
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
}: ReceitaFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReceitaFormData>({
    resolver: zodResolver(receitaSchema),
    defaultValues: initialData
      ? {
          clienteId: initialData.clienteId || "",
          saidaMaterialId: initialData.saidaMaterialId || "",
          descricao: initialData.descricao,
          valor: initialData.valor,
          dataRecebimento: initialData.dataRecebimento || "",
          status: initialData.status as ReceitaFormData["status"],
          observacoes: initialData.observacoes || "",
        }
      : {
          clienteId: "",
          saidaMaterialId: "",
          descricao: "",
          valor: 0,
          dataRecebimento: "",
          status: "PENDENTE",
          observacoes: "",
        },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input type="hidden" {...register("saidaMaterialId")} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cliente (opcional)
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
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            {...register("status")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="PENDENTE">Pendente</option>
            <option value="RECEBIDO">Recebido</option>
            <option value="ATRASADO">Atrasado</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Valor (R$) *
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
            Data de Recebimento
          </label>
          <Input
            type="date"
            {...register("dataRecebimento")}
            error={errors.dataRecebimento?.message}
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descrição *
        </label>
        <Input
          type="text"
          {...register("descricao")}
          error={errors.descricao?.message}
        />
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
          Salvar
        </Button>
      </div>
    </form>
  );
}
