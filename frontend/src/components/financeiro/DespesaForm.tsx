import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { despesaSchema, DespesaFormData } from "@/lib/schemas/despesaSchema";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { TipoDespesa, Cliente, Fornecedor, Despesa } from "@/types";

interface DespesaFormProps {
  tiposDespesa: TipoDespesa[];
  clientes: Cliente[];
  fornecedores: Fornecedor[];
  initialData?: Despesa;
  onSubmit: (data: DespesaFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function DespesaForm({
  tiposDespesa,
  clientes,
  fornecedores,
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
}: DespesaFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DespesaFormData>({
    resolver: zodResolver(despesaSchema),
    defaultValues: initialData
      ? {
          tipoDespesaId: initialData.tipoDespesaId || "",
          entradaMaterialId: initialData.entradaMaterialId || "",
          clienteId: initialData.clienteId || "",
          fornecedorId: initialData.fornecedorId || "",
          descricao: initialData.descricao,
          valor: initialData.valor,
          dataVencimento: initialData.dataVencimento,
          dataPagamento: initialData.dataPagamento || "",
          status: initialData.status as DespesaFormData["status"],
          observacoes: initialData.observacoes || "",
        }
      : {
          tipoDespesaId: "",
          entradaMaterialId: "",
          clienteId: "",
          fornecedorId: "",
          descricao: "",
          valor: 0,
          dataVencimento: new Date().toISOString().split("T")[0],
          dataPagamento: "",
          status: "PENDENTE",
          observacoes: "",
        },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input type="hidden" {...register("entradaMaterialId")} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Despesa
          </label>
          <select
            {...register("tipoDespesaId")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="">Selecione um tipo</option>
            {tiposDespesa.map((tipo) => (
              <option key={tipo.id} value={tipo.id}>
                {tipo.nome}
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
            <option value="PAGO">Pago</option>
            <option value="ATRASADO">Atrasado</option>
          </select>
        </div>
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
            Fornecedor (opcional)
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
            Data de Vencimento *
          </label>
          <Input
            type="date"
            {...register("dataVencimento")}
            error={errors.dataVencimento?.message}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data de Pagamento
          </label>
          <Input
            type="date"
            {...register("dataPagamento")}
            error={errors.dataPagamento?.message}
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
