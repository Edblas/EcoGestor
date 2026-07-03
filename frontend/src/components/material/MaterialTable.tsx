import { DataTable } from "@/components/ui/DataTable";
import { Material } from "@/types";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface MaterialTableProps {
  data: Material[];
  loading?: boolean;
  onEdit?: (material: Material) => void;
  onDelete?: (material: Material) => void;
}

export function MaterialTable({ data, loading, onEdit, onDelete }: MaterialTableProps) {
  const columns = [
    { header: "Nome", accessor: "nome" as keyof Material },
    { header: "Categoria", accessor: "categoria" as keyof Material },
    { header: "Unidade", accessor: "unidadeMedida" as keyof Material },
    {
      header: "Valor (kg)",
      accessor: (material: Material) =>
        new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(material.valorPadraoKg),
    },
    {
      header: "Ações",
      accessor: (material: Material) => (
        <div className="flex gap-2">
          {onEdit && (
            <Button
              variant="secondary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(material);
              }}
            >
              <Edit className="w-4 h-4" />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="danger"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(material);
              }}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      loading={loading}
      emptyMessage="Nenhum material encontrado"
    />
  );
}
