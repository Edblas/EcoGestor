import { DataTable } from "@/components/ui/DataTable";
import { Cliente } from "@/types";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ClienteTableProps {
  data: Cliente[];
  loading?: boolean;
  onEdit?: (cliente: Cliente) => void;
  onDelete?: (cliente: Cliente) => void;
  onSelect?: (cliente: Cliente) => void;
}

export function ClienteTable({ data, loading, onEdit, onDelete, onSelect }: ClienteTableProps) {
  const columns = [
    { header: "Nome", accessor: "nome" as keyof Cliente },
    { header: "CPF/CNPJ", accessor: "cpfCnpj" as keyof Cliente },
    { header: "Telefone", accessor: "telefone" as keyof Cliente },
    {
      header: "Ações",
      accessor: (cliente: Cliente) => (
        <div className="flex gap-2">
          {onEdit && (
            <Button
              variant="secondary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(cliente);
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
                onDelete(cliente);
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
      emptyMessage="Nenhum cliente encontrado"
      onRowClick={onSelect}
    />
  );
}
