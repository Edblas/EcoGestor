import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { SaidaMaterialTable } from "@/components/saida/SaidaMaterialTable";
import { SaidaMaterialForm } from "@/components/saida/SaidaMaterialForm";
import { api } from "@/lib/api";
import { Plus } from "lucide-react";

export function SaidasPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: materials } = useQuery({
    queryKey: ["materiais"],
    queryFn: () => api.materiais.search(),
  });

  const { data: clientes } = useQuery({
    queryKey: ["clientes"],
    queryFn: () => api.clientes.search(),
  });

  const { data: saidas, isLoading } = useQuery({
    queryKey: ["saidas"],
    queryFn: () => api.saidas.listar(),
  });

  const mutation = useMutation({
    mutationFn: api.saidas.registrar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saidas"] });
      queryClient.invalidateQueries({ queryKey: ["estoque"] });
      setIsModalOpen(false);
    },
  });

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Saídas/Vendas de Materiais</h1>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Saída
          </Button>
        </div>

        <SaidaMaterialTable
          data={saidas?.content || []}
          loading={isLoading}
        />

        {isModalOpen && (
          <Modal
            title="Registrar Saída/Venda de Material"
            onClose={() => setIsModalOpen(false)}
          >
            <SaidaMaterialForm
              materials={materials?.content || []}
              clientes={clientes?.content || []}
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