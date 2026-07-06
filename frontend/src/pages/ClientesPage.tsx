import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { ClienteTable } from "@/components/cliente/ClienteTable";
import { ClienteDetalhes } from "@/components/cliente/ClienteDetalhes";
import { ClienteForm } from "@/components/cliente/ClienteForm";
import { api } from "@/lib/api";
import { Cliente, Page as PageType } from "@/types";
import { ClienteFormData } from "@/lib/schemas/clienteSchema";

export function ClientesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | undefined>();
  const [deletingCliente, setDeletingCliente] = useState<Cliente | undefined>();
  const [selectedCliente, setSelectedCliente] = useState<Cliente | undefined>();
  const [currentPage, setCurrentPage] = useState(0);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<PageType<Cliente>>({
    queryKey: ["clientes", searchTerm, currentPage],
    queryFn: () => api.clientes.search(searchTerm, currentPage),
  });

  const { data: clienteDetalhes, isLoading: isLoadingClienteDetalhes } = useQuery({
    queryKey: ["clientes", "detalhes", selectedCliente?.id],
    queryFn: () => api.clientes.get(selectedCliente!.id),
    enabled: !!selectedCliente,
  });

  const { data: entradasCliente, isLoading: isLoadingEntradasCliente } = useQuery({
    queryKey: ["clientes", "entradas", selectedCliente?.id],
    queryFn: () => api.entradas.listar(selectedCliente!.id, undefined, undefined, 0, 100),
    enabled: !!selectedCliente,
  });

  const { data: saidasCliente, isLoading: isLoadingSaidasCliente } = useQuery({
    queryKey: ["clientes", "saidas", selectedCliente?.id],
    queryFn: () => api.saidas.listar(selectedCliente!.id, undefined, 0, 100),
    enabled: !!selectedCliente,
  });

  const createMutation = useMutation({
    mutationFn: (data: ClienteFormData) => api.clientes.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientes"] });
      setIsModalOpen(false);
      alert("Cliente cadastrado com sucesso!");
    },
    onError: () => {
      alert("Erro ao cadastrar cliente");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ClienteFormData }) => api.clientes.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientes"] });
      setIsModalOpen(false);
      setEditingCliente(undefined);
      alert("Cliente atualizado com sucesso!");
    },
    onError: () => {
      alert("Erro ao atualizar cliente");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.clientes.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientes"] });
      setIsDeleteModalOpen(false);
      setDeletingCliente(undefined);
      alert("Cliente excluído com sucesso!");
    },
    onError: () => {
      alert("Erro ao excluir cliente");
    },
  });

  const handleOpenCreateModal = () => {
    setEditingCliente(undefined);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cliente: Cliente) => {
    setEditingCliente(cliente);
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (cliente: Cliente) => {
    setDeletingCliente(cliente);
    setIsDeleteModalOpen(true);
  };

  const handleOpenDetailsModal = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setIsDetailsModalOpen(true);
  };

  const handleSubmit = async (data: ClienteFormData) => {
    if (editingCliente) {
      await updateMutation.mutateAsync({ id: editingCliente.id, data });
    } else {
      await createMutation.mutateAsync(data);
    }
  };

  const handleDelete = async () => {
    if (deletingCliente) {
      await deleteMutation.mutateAsync(deletingCliente.id);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
          <Button onClick={handleOpenCreateModal}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Cliente
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Pesquisar por nome, CPF/CNPJ ou telefone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ClienteTable
              data={data?.content || []}
              loading={isLoading}
              onEdit={handleOpenEditModal}
              onDelete={handleOpenDeleteModal}
              onSelect={handleOpenDetailsModal}
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
        title={editingCliente ? "Editar Cliente" : "Novo Cliente"}
      >
        <ClienteForm
          initialData={editingCliente}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
        />
      </Modal>

      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title={selectedCliente ? `Histórico de ${selectedCliente.nome}` : "Histórico do Cliente"}
      >
        <ClienteDetalhes
          cliente={clienteDetalhes}
          entradas={entradasCliente?.content || []}
          saidas={saidasCliente?.content || []}
          isLoading={
            isLoadingClienteDetalhes ||
            isLoadingEntradasCliente ||
            isLoadingSaidasCliente
          }
        />
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Excluir Cliente"
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
          Tem certeza que deseja excluir o cliente <strong>{deletingCliente?.nome}</strong>?
        </p>
      </Modal>
    </MainLayout>
  );
}
