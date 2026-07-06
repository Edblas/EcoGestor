import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { EntradaMaterialTable } from "@/components/entrada/EntradaMaterialTable";
import { EntradaMaterialForm } from "@/components/entrada/EntradaMaterialForm";
import { api } from "@/lib/api";
import { Plus } from "lucide-react";
import { EntradaMaterial } from "@/types";

export function EntradasPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isFinalizeModalOpen, setIsFinalizeModalOpen] = useState(false);
  const [editingEntrada, setEditingEntrada] = useState<EntradaMaterial | undefined>();
  const [deletingEntrada, setDeletingEntrada] = useState<EntradaMaterial | undefined>();
  const [finalizingEntrada, setFinalizingEntrada] = useState<EntradaMaterial | undefined>();
  const queryClient = useQueryClient();

  const { data: materials } = useQuery({
    queryKey: ["materiais"],
    queryFn: () => api.materiais.search(),
  });

  const { data: fornecedores } = useQuery({
    queryKey: ["fornecedores"],
    queryFn: () => api.fornecedores.search(),
  });

  const { data: clientes } = useQuery({
    queryKey: ["clientes"],
    queryFn: () => api.clientes.search(),
  });

  const { data: entradas, isLoading } = useQuery({
    queryKey: ["entradas"],
    queryFn: () => api.entradas.listar(),
  });

  const createMutation = useMutation({
    mutationFn: api.entradas.registrar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entradas"] });
      queryClient.invalidateQueries({ queryKey: ["estoque"] });
      setIsModalOpen(false);
      setEditingEntrada(undefined);
      alert("Entrada registrada com sucesso!");
    },
    onError: () => {
      alert("Erro ao registrar entrada");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.entradas.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entradas"] });
      queryClient.invalidateQueries({ queryKey: ["estoque"] });
      setIsModalOpen(false);
      setEditingEntrada(undefined);
      alert("Entrada atualizada com sucesso!");
    },
    onError: (error: Error) => {
      alert(error.message || "Erro ao atualizar entrada");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.entradas.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entradas"] });
      queryClient.invalidateQueries({ queryKey: ["estoque"] });
      setIsDeleteModalOpen(false);
      setDeletingEntrada(undefined);
      alert("Entrada excluída com sucesso!");
    },
    onError: (error: Error) => {
      alert(error.message || "Erro ao excluir entrada");
    },
  });

  const finalizeMutation = useMutation({
    mutationFn: (id: string) => api.entradas.finalizar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entradas"] });
      queryClient.invalidateQueries({ queryKey: ["estoque"] });
      setIsFinalizeModalOpen(false);
      setFinalizingEntrada(undefined);
      alert("Entrada finalizada com sucesso!");
    },
    onError: (error: Error) => {
      alert(error.message || "Erro ao finalizar entrada");
    },
  });

  const handleOpenDeleteModal = (entrada: EntradaMaterial) => {
    setDeletingEntrada(entrada);
    setIsDeleteModalOpen(true);
  };

  const handleOpenFinalizeModal = (entrada: EntradaMaterial) => {
    setFinalizingEntrada(entrada);
    setIsFinalizeModalOpen(true);
  };

  const handleOpenNovaEntrada = () => {
    setEditingEntrada(undefined);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (entrada: EntradaMaterial) => {
    setEditingEntrada(entrada);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (deletingEntrada) {
      await deleteMutation.mutateAsync(deletingEntrada.id);
    }
  };

  const handleFinalize = async () => {
    if (finalizingEntrada) {
      await finalizeMutation.mutateAsync(finalizingEntrada.id);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Entradas/Compras de Materiais</h1>
          <Button onClick={handleOpenNovaEntrada}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Entrada
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            <EntradaMaterialTable
              data={entradas?.content || []}
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
        title={editingEntrada ? "Editar Entrada/Compra de Material" : "Registrar Entrada/Compra de Material"}
        onClose={() => {
          setIsModalOpen(false);
          setEditingEntrada(undefined);
        }}
      >
        <EntradaMaterialForm
          materials={materials?.content || []}
          fornecedores={fornecedores?.content || []}
          clientes={clientes?.content || []}
          initialData={editingEntrada}
          onSubmit={async (data) => {
            if (editingEntrada) {
              await updateMutation.mutateAsync({ id: editingEntrada.id, data });
            } else {
              await createMutation.mutateAsync(data);
            }
          }}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingEntrada(undefined);
          }}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
        />
      </Modal>

      <Modal
        isOpen={isFinalizeModalOpen}
        title="Concluir Entrada"
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
          Ao concluir a entrada de <strong>{finalizingEntrada?.materialNome}</strong>, o peso será adicionado ao estoque.
        </p>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        title="Excluir Entrada"
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
          Tem certeza que deseja excluir a entrada de <strong>{deletingEntrada?.materialNome}</strong>?
        </p>
      </Modal>
    </MainLayout>
  );
}
