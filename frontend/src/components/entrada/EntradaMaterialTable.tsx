import { DataTable } from "@/components/ui/DataTable";
import { EntradaMaterial } from "@/types";

interface EntradaMaterialTableProps {
  data: EntradaMaterial[];
  loading?: boolean;
}

export function EntradaMaterialTable({ data, loading }: EntradaMaterialTableProps) {
  const columns = [
    { header: "Fornecedor", accessor: "fornecedorNome" as keyof EntradaMaterial },
    { header: "Material", accessor: "materialNome" as keyof EntradaMaterial },
    {
      header: "Peso (kg)",
      accessor: (item: EntradaMaterial) => item.peso.toFixed(2),
    },
    {
      header: "Valor/kg (R$)",
      accessor: (item: EntradaMaterial) => item.valorKg.toFixed(2),
    },
    {
      header: "Valor Total (R$)",
      accessor: (item: EntradaMaterial) => item.valorTotal.toFixed(2),
    },
    {
      header: "Data",
      accessor: (item: EntradaMaterial) =>
        new Date(item.dataEntrada).toLocaleDateString("pt-BR"),
    },
    { header: "Observações", accessor: "observacoes" as keyof EntradaMaterial },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      loading={loading}
      emptyMessage="Nenhuma entrada encontrada"
    />
  );
}
