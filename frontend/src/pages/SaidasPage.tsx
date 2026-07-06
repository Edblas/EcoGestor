import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { SaidaMaterialTable } from "@/components/saida/SaidaMaterialTable";
import { SaidaMaterialForm } from "@/components/saida/SaidaMaterialForm";
import { api } from "@/lib/api";
import { Plus } from "lucide-react";
import { SaidaMaterial } from "@/types";

export function SaidasPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isFinalizeModalOpen, setIsFinalizeModalOpen] = useState(false);
  const [editingSaida, setEditingSaida] = useState<SaidaMaterial | undefined>();
  const [deletingSaida, setDeletingSaida] = useState<SaidaMaterial | undefined>();
  const [finalizingSaida, setFinalizingSaida] = useState<SaidaMaterial | undefined>();
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

  const createMutation = useMutation({
    mutationFn: api.saidas.registrar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saidas"] });
      queryClient.invalidateQueries({ queryKey: ["estoque"] });
      setIsModalOpen(false);
      setEditingSaida(undefined);
      alert("Saída registrada com sucesso!");
    },
    onError: () => {
      alert("Erro ao registrar saída");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.saidas.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saidas"] });
      queryClient.invalidateQueries({ queryKey: ["estoque"] });
      setIsModalOpen(false);
      setEditingSaida(undefined);
      alert("Saída atualizada com sucesso!");
    },
    onError: (error: Error) => {
      alert(error.message || "Erro ao atualizar saída");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.saidas.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saidas"] });
      queryClient.invalidateQueries({ queryKey: ["estoque"] });
      setIsDeleteModalOpen(false);
      setDeletingSaida(undefined);
      alert("Saída excluída com sucesso!");
    },
    onError: (error: Error) => {
      alert(error.message || "Erro ao excluir saída");
    },
  });

  const finalizeMutation = useMutation({
    mutationFn: (id: string) => api.saidas.finalizar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saidas"] });
      queryClient.invalidateQueries({ queryKey: ["estoque"] });
      setIsFinalizeModalOpen(false);
      setFinalizingSaida(undefined);
      alert("Saída concluída com sucesso!");
    },
    onError: (error: Error) => {
      alert(error.message || "Erro ao concluir saída");
    },
  });

  const handleOpenDeleteModal = (saida: SaidaMaterial) => {
    setDeletingSaida(saida);
    setIsDeleteModalOpen(true);
  };

  const handleOpenFinalizeModal = (saida: SaidaMaterial) => {
    setFinalizingSaida(saida);
    setIsFinalizeModalOpen(true);
  };

  const handleOpenNovaSaida = () => {
    setEditingSaida(undefined);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (saida: SaidaMaterial) => {
    setEditingSaida(saida);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (deletingSaida) {
      await deleteMutation.mutateAsync(deletingSaida.id);
    }
  };

  const handleFinalize = async () => {
    if (finalizingSaida) {
      await finalizeMutation.mutateAsync(finalizingSaida.id);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Saídas/Vendas de Materiais</h1>
          <Button onClick={handleOpenNovaSaida}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Saída
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            <SaidaMaterialTable
              data={saidas?.content || []}
              loading={isLoading}
              onEdit={handleOpenEditModal}
              onDelete={handleOpenDeleteModal}
              onFinalize={handleOpenFinalizeModal}
            />
          </CardContent>
        </Card>
      </div>

      <Modal
        isOpen={isModalOpen}
        title={editingSaida ? "Editar Saída/Venda de Material" : "Registrar Saída/Venda de Material"}
        onClose={() => {
          setIsModalOpen(false);
          setEditingSaida(undefined);
        }}
      >
        <SaidaMaterialForm
          materials={materials?.content || []}
          clientes={clientes?.content || []}
          initialData={editingSaida}
          onSubmit={async (data) => {
            if (editingSaida) {
              await updateMutation.mutateAsync({ id: editingSaida.id, data });
            } else {
              await createMutation.mutateAsync(data);
            }
          }}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingSaida(undefined);
          }}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
        />
      </Modal>

      <Modal
        isOpen={isFinalizeModalOpen}
        title="Concluir Saída"
        onClose={() => setIsFinalizeModalOpen(false)}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setIsFinalizeModalOpen(false)}
              disabled={finalizeMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleFinalize}
              isLoading={finalizeMutation.isPending}
            >
              Concluir
            </Button>
          </>
        }
      >
        <p className="text-gray-600">
          Ao concluir a saída de <strong>{finalizingSaida?.materialNome}</strong>, o peso será baixado do estoque.
        </p>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        title="Excluir Saída"
        onClose={() => setIsDeleteModalOpen(false)}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={deleteMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              isLoading={deleteMutation.isPending}
            >
              Excluir
            </Button>
          </>
        }
      >
        <p className="text-gray-600">
          Tem certeza que deseja excluir a saída de <strong>{deletingSaida?.materialNome}</strong>?
        </p>
      </Modal>
    </MainLayout>
  );
}
