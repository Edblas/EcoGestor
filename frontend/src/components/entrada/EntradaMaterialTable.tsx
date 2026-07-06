import { DataTable } from "@/components/ui/DataTable";
import { EntradaMaterial, StatusEntradaMaterial } from "@/types";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, Edit2, Trash2 } from "lucide-react";

interface EntradaMaterialTableProps {
  data: EntradaMaterial[];
  loading?: boolean;
  onEdit?: (entrada: EntradaMaterial) => void;
  onDelete?: (entrada: EntradaMaterial) => void;
  onFinalize?: (entrada: EntradaMaterial) => void;
}

export function EntradaMaterialTable({ data, loading, onEdit, onDelete, onFinalize }: EntradaMaterialTableProps) {
  const columns = [
    {
      header: "Parceiro",
      accessor: (item: EntradaMaterial) => item.clienteNome || item.fornecedorNome,
    },
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
      header: "Status",
      accessor: (item: EntradaMaterial) =>
        item.status === StatusEntradaMaterial.FINALIZADO ? "Concluída" : "Em andamento",
      className: "whitespace-normal",
    },
    {
      header: "Data",
      accessor: (item: EntradaMaterial) =>
        new Date(item.dataEntrada).toLocaleDateString("pt-BR"),
    },
    {
      header: "Observações",
      accessor: "observacoes" as keyof EntradaMaterial,
      className: "max-w-xs whitespace-normal",
    },
    {
      header: "Ações",
      accessor: (entrada: EntradaMaterial) => (
        <div className="flex gap-2">
          {onEdit && entrada.status === StatusEntradaMaterial.EM_ANDAMENTO && (
            <Button
              variant="secondary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(entrada);
              }}
            >
              <Edit2 className="w-4 h-4 mr-1" />
              Editar
            </Button>
          )}
          {onFinalize && entrada.status === StatusEntradaMaterial.EM_ANDAMENTO && (
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onFinalize(entrada);
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
                onDelete(entrada);
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
      emptyMessage="Nenhuma entrada encontrada"
    />
  );
}
