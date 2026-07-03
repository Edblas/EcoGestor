import { DataTable } from "@/components/ui/DataTable";
import { MovimentacaoEstoque, TipoMovimentacao } from "@/types";

interface MovimentacaoEstoqueTableProps {
  data: MovimentacaoEstoque[];
  loading?: boolean;
}

export function MovimentacaoEstoqueTable({ data, loading }: MovimentacaoEstoqueTableProps) {
  const getTipoBadge = (tipo: TipoMovimentacao) => {
    const styles = {
      [TipoMovimentacao.ENTRADA]: "bg-green-100 text-green-800",
      [TipoMovimentacao.SAIDA]: "bg-red-100 text-red-800",
      [TipoMovimentacao.AJUSTE]: "bg-yellow-100 text-yellow-800",
    };
    const labels = {
      [TipoMovimentacao.ENTRADA]: "Entrada",
      [TipoMovimentacao.SAIDA]: "Saída",
      [TipoMovimentacao.AJUSTE]: "Ajuste",
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[tipo]}`}>
        {labels[tipo]}
      </span>
    );
  };

  const columns = [
    { header: "Material", accessor: "materialNome" as keyof MovimentacaoEstoque },
    {
      header: "Tipo",
      accessor: (item: MovimentacaoEstoque) => getTipoBadge(item.tipo),
    },
    {
      header: "Peso (kg)",
      accessor: (item: MovimentacaoEstoque) => item.peso.toFixed(2),
    },
    {
      header: "Valor (R$)",
      accessor: (item: MovimentacaoEstoque) => item.valor.toFixed(2),
    },
    {
      header: "Data",
      accessor: (item: MovimentacaoEstoque) =>
        new Date(item.dataMovimentacao).toLocaleDateString("pt-BR"),
    },
    { header: "Observações", accessor: "observacoes" as keyof MovimentacaoEstoque },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      loading={loading}
      emptyMessage="Nenhuma movimentação encontrada"
    />
  );
}
