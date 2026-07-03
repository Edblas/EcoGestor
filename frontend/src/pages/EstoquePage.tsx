import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { MovimentacaoEstoqueTable } from "@/components/estoque/MovimentacaoEstoqueTable";
import { MovimentacaoEstoqueForm } from "@/components/estoque/MovimentacaoEstoqueForm";
import { api } from "@/lib/api";
import { Plus, Filter } from "lucide-react";
import { TipoMovimentacao } from "@/types";

export function EstoquePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterTipo, setFilterTipo] = useState<TipoMovimentacao | "">("");
  const queryClient = useQueryClient();

  const { data: materials } = useQuery({
    queryKey: ["materiais"],
    queryFn: () => api.materiais.search(),
  });

  const { data: movimentacoes, isLoading } = useQuery({
    queryKey: ["estoque", filterTipo],
    queryFn: () =>
      api.estoque.listarMovimentacoes(undefined, filterTipo || undefined),
  });

  const mutation = useMutation({
    mutationFn: api.estoque.registrarMovimentacao,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["estoque"] });
      setIsModalOpen(false);
    },
  });

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Movimentações de Estoque</h1>
          <div className="flex gap-3">
            <select
              value={filterTipo}
              onChange={(e) => setFilterTipo(e.target.value as TipoMovimentacao | "")}
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Todos os tipos</option>
              <option value={TipoMovimentacao.ENTRADA}>Entrada</option>
              <option value={TipoMovimentacao.SAIDA}>Saída</option>
              <option value={TipoMovimentacao.AJUSTE}>Ajuste</option>
            </select>
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Nova Movimentação
            </Button>
          </div>
        </div>

        <MovimentacaoEstoqueTable
          data={movimentacoes?.content || []}
          loading={isLoading}
        />

        {isModalOpen && (
          <Modal
            title="Registrar Movimentação"
            onClose={() => setIsModalOpen(false)}
          >
            <MovimentacaoEstoqueForm
              materials={materials?.content || []}
              onSubmit={(data) => mutation.mutateAsync(data)}
              onCancel={() => setIsModalOpen(false)}
              isSubmitting={mutation.isPending}
            />
          </Modal>
        )}
      </div>
    </MainLayout>
  );
}
