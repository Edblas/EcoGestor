import { DataTable } from "@/components/ui/DataTable";
import { SaidaMaterial } from "@/types";

interface SaidaMaterialTableProps {
  data: SaidaMaterial[];
  loading?: boolean;
}

export function SaidaMaterialTable({ data, loading }: SaidaMaterialTableProps) {
  const columns = [
    { header: "Cliente", accessor: "clienteNome" as keyof SaidaMaterial },
    { header: "Material", accessor: "materialNome" as keyof SaidaMaterial },
    {
      header: "Peso (kg)",
      accessor: (item: SaidaMaterial) => item.peso.toFixed(2),
    },
    {
      header: "Valor/kg (R$)",
      accessor: (item: SaidaMaterial) => item.valorKg.toFixed(2),
    },
    {
      header: "Valor Total (R$)",
      accessor: (item: SaidaMaterial) => item.valorTotal.toFixed(2),
    },
    {
      header: "Data",
      accessor: (item: SaidaMaterial) =>
        new Date(item.dataSaida).toLocaleDateString("pt-BR"),
    },
    { header: "Observações", accessor: "observacoes" as keyof SaidaMaterial },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      loading={loading}
      emptyMessage="Nenhuma saída encontrada"
    />
  );
}