import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { MaterialTable } from "@/components/material/MaterialTable";
import { MaterialForm } from "@/components/material/MaterialForm";
import { api } from "@/lib/api";
import { Material, Page as PageType } from "@/types";
import { MaterialFormData } from "@/lib/schemas/materialSchema";

export function MateriaisPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | undefined>();
  const [deletingMaterial, setDeletingMaterial] = useState<Material | undefined>();
  const [currentPage, setCurrentPage] = useState(0);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<PageType<Material>>({
    queryKey: ["materiais", searchTerm, currentPage],
    queryFn: () => api.materiais.search(searchTerm, currentPage),
  });

  const createMutation = useMutation({
    mutationFn: (data: MaterialFormData) => api.materiais.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materiais"] });
      setIsModalOpen(false);
      alert("Material cadastrado com sucesso!");
    },
    onError: () => {
      alert("Erro ao cadastrar material");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: MaterialFormData }) => api.materiais.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materiais"] });
      setIsModalOpen(false);
      setEditingMaterial(undefined);
      alert("Material atualizado com sucesso!");
    },
    onError: () => {
      alert("Erro ao atualizar material");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.materiais.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materiais"] });
      setIsDeleteModalOpen(false);
      setDeletingMaterial(undefined);
      alert("Material excluído com sucesso!");
    },
    onError: () => {
      alert("Erro ao excluir material");
    },
  });

  const handleOpenCreateModal = () => {
    setEditingMaterial(undefined);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (material: Material) => {
    setEditingMaterial(material);
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (material: Material) => {
    setDeletingMaterial(material);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async (data: MaterialFormData) => {
    if (editingMaterial) {
      await updateMutation.mutateAsync({ id: editingMaterial.id, data });
    } else {
      await createMutation.mutateAsync(data);
    }
  };

  const handleDelete = async () => {
    if (deletingMaterial) {
      await deleteMutation.mutateAsync(deletingMaterial.id);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Materiais</h1>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Pesquisar por nome ou categoria..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button onClick={handleOpenCreateModal}>
                <Plus className="w-4 h-4 mr-2" />
                Novo Material
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <MaterialTable
              data={data?.content || []}
              loading={isLoading}
              onEdit={handleOpenEditModal}
              onDelete={handleOpenDeleteModal}
            />

            {data && data.totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  Mostrando {data.number * data.size + 1} a {Math.min((data.number + 1) * data.size, data.totalElements)} de {data.totalElements} resultados
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={data.first}
                    onClick={() => setCurrentPage(data.number - 1)}
                  >
                    Anterior
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={data.last}
                    onClick={() => setCurrentPage(data.number + 1)}
                  >
                    Próximo
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingMaterial ? "Editar Material" : "Novo Material"}
      >
        <MaterialForm
          initialData={editingMaterial}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
        />
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Excluir Material"
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
          Tem certeza que deseja excluir o material <strong>{deletingMaterial?.nome}</strong>?
        </p>
      </Modal>
    </MainLayout>
  );
}
