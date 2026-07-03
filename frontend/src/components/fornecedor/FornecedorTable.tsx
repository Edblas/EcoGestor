import { DataTable } from "@/components/ui/DataTable";
import { Fornecedor } from "@/types";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface FornecedorTableProps {
  data: Fornecedor[];
  loading?: boolean;
  onEdit?: (fornecedor: Fornecedor) => void;
  onDelete?: (fornecedor: Fornecedor) => void;
}

export function FornecedorTable({ data, loading, onEdit, onDelete }: FornecedorTableProps) {
  const columns = [
    { header: "Nome", accessor: "nome" as keyof Fornecedor },
    { header: "CPF/CNPJ", accessor: "cpfCnpj" as keyof Fornecedor },
    { header: "Telefone", accessor: "telefone" as keyof Fornecedor },
    {
      header: "Ações",
      accessor: (fornecedor: Fornecedor) => (
        <div className="flex gap-2">
          {onEdit && (
            <Button
              variant="secondary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(fornecedor);
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
                onDelete(fornecedor);
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
      emptyMessage="Nenhum fornecedor encontrado"
    />
  );
}
