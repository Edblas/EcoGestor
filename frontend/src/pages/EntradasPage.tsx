import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { EntradaMaterialTable } from "@/components/entrada/EntradaMaterialTable";
import { EntradaMaterialForm } from "@/components/entrada/EntradaMaterialForm";
import { api } from "@/lib/api";
import { Plus } from "lucide-react";

export function EntradasPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: materials } = useQuery({
    queryKey: ["materiais"],
    queryFn: () => api.materiais.search(),
  });

  const { data: fornecedores } = useQuery({
    queryKey: ["fornecedores"],
    queryFn: () => api.fornecedores.search(),
  });

  const { data: entradas, isLoading } = useQuery({
    queryKey: ["entradas"],
    queryFn: () => api.entradas.listar(),
  });

  const mutation = useMutation({
    mutationFn: api.entradas.registrar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entradas"] });
      queryClient.invalidateQueries({ queryKey: ["estoque"] });
      setIsModalOpen(false);
    },
  });

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Entradas de Materiais</h1>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Entrada
          </Button>
        </div>

        <EntradaMaterialTable
          data={entradas?.content || []}
          loading={isLoading}
        />

        {isModalOpen && (
          <Modal
            title="Registrar Entrada de Material"
            onClose={() => setIsModalOpen(false)}
          >
            <EntradaMaterialForm
              materials={materials?.content || []}
              fornecedores={fornecedores?.content || []}
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
