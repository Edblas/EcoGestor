import { DataTable } from "@/components/ui/DataTable";
import { Despesa, StatusFinanceiro } from "@/types";
import { Button } from "@/components/ui/Button";
import { Edit2 } from "lucide-react";

interface DespesaTableProps {
  data: Despesa[];
  loading?: boolean;
  onEdit?: (despesa: Despesa) => void;
}

export function DespesaTable({ data, loading, onEdit }: DespesaTableProps) {
  const getStatusColor = (status: StatusFinanceiro) => {
    switch (status) {
      case StatusFinanceiro.PAGO:
        return "text-green-600 bg-green-100";
      case StatusFinanceiro.PENDENTE:
        return "text-yellow-600 bg-yellow-100";
      case StatusFinanceiro.ATRASADO:
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const columns = [
    { header: "Descrição", accessor: "descricao" as keyof Despesa },
    {
      header: "Tipo",
      accessor: (item: Despesa) => item.tipoDespesaNome || "Outro",
    },
    {
      header: "Valor",
      accessor: (item: Despesa) =>
        `R$ ${item.valor.toFixed(2)}`,
    },
    {
      header: "Vencimento",
      accessor: (item: Despesa) =>
        new Date(item.dataVencimento).toLocaleDateString("pt-BR"),
    },
    {
      header: "Status",
      accessor: (item: Despesa) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}
        >
          {item.status}
        </span>
      ),
    },
    {
      header: "Ações",
      accessor: (item: Despesa) => (
        <div className="flex gap-2">
          {onEdit && (
            <Button
              variant="secondary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(item);
              }}
            >
              <Edit2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      ),
      className: "w-24",
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      loading={loading}
      emptyMessage="Nenhuma despesa encontrada"
    />
  );
}
