import { DataTable } from "@/components/ui/DataTable";
import { Receita, StatusFinanceiro } from "@/types";

interface ReceitaTableProps {
  data: Receita[];
  loading?: boolean;
}

export function ReceitaTable({ data, loading }: ReceitaTableProps) {
  const getStatusColor = (status: StatusFinanceiro) => {
    switch (status) {
      case StatusFinanceiro.RECEBIDO:
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
    { header: "Descrição", accessor: "descricao" as keyof Receita },
    {
      header: "Cliente",
      accessor: (item: Receita) => item.clienteNome || "-",
    },
    {
      header: "Valor",
      accessor: (item: Receita) =>
        `R$ ${item.valor.toFixed(2)}`,
    },
    {
      header: "Recebimento",
      accessor: (item: Receita) =>
        item.dataRecebimento ? new Date(item.dataRecebimento).toLocaleDateString("pt-BR") : "-",
    },
    {
      header: "Status",
      accessor: (item: Receita) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}
        >
          {item.status}
        </span>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      loading={loading}
      emptyMessage="Nenhuma receita encontrada"
    />
  );
}
