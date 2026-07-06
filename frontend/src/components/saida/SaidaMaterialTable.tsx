import { DataTable } from "@/components/ui/DataTable";
import { SaidaMaterial, StatusSaidaMaterial } from "@/types";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, Edit2, Trash2 } from "lucide-react";

interface SaidaMaterialTableProps {
  data: SaidaMaterial[];
  loading?: boolean;
  onEdit?: (saida: SaidaMaterial) => void;
  onDelete?: (saida: SaidaMaterial) => void;
  onFinalize?: (saida: SaidaMaterial) => void;
}

export function SaidaMaterialTable({ data, loading, onEdit, onDelete, onFinalize }: SaidaMaterialTableProps) {
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
      header: "Status",
      accessor: (item: SaidaMaterial) =>
        item.status === StatusSaidaMaterial.FINALIZADO ? "Concluída" : "Em andamento",
      className: "whitespace-normal",
    },
    {
      header: "Data",
      accessor: (item: SaidaMaterial) =>
        new Date(item.dataSaida).toLocaleDateString("pt-BR"),
    },
    {
      header: "Observações",
      accessor: "observacoes" as keyof SaidaMaterial,
      className: "max-w-xs whitespace-normal",
    },
    {
      header: "Ações",
      accessor: (saida: SaidaMaterial) => (
        <div className="flex gap-2">
          {onEdit && saida.status === StatusSaidaMaterial.EM_ANDAMENTO && (
            <Button
              variant="secondary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(saida);
              }}
            >
              <Edit2 className="w-4 h-4 mr-1" />
              Editar
            </Button>
          )}
          {onFinalize && saida.status === StatusSaidaMaterial.EM_ANDAMENTO && (
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onFinalize(saida);
              }}
            >
              <CheckCircle2 className="w-4 h-4 mr-1" />
              Concluir
            </Button>
          )}
          {onDelete && (
            <Button
              variant="danger"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(saida);
              }}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Excluir
            </Button>
          )}
        </div>
      ),
      className: "w-48",
    },
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
