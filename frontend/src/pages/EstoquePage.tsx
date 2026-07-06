import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { MovimentacaoEstoqueTable } from "@/components/estoque/MovimentacaoEstoqueTable";
import { MovimentacaoEstoqueForm } from "@/components/estoque/MovimentacaoEstoqueForm";
import { api } from "@/lib/api";
import { Package, Plus } from "lucide-react";
import { Material, TipoMovimentacao } from "@/types";

export function EstoquePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>("");
  const [filterTipo, setFilterTipo] = useState<TipoMovimentacao | "">("");
  const queryClient = useQueryClient();

  const { data: materials } = useQuery({
    queryKey: ["materiais"],
    queryFn: () => api.materiais.search(undefined, 0, 100),
  });

  const { data: movimentacoes, isLoading } = useQuery({
    queryKey: ["estoque", selectedMaterialId, filterTipo],
    queryFn: () =>
      api.estoque.listarMovimentacoes(selectedMaterialId, filterTipo || undefined),
    enabled: !!selectedMaterialId,
  });

  const { data: saldoMaterial, isLoading: isLoadingSaldo } = useQuery({
    queryKey: ["estoque", "saldo", selectedMaterialId],
    queryFn: () => api.estoque.getSaldoEstoque(selectedMaterialId),
    enabled: !!selectedMaterialId,
  });

  const mutation = useMutation({
    mutationFn: api.estoque.registrarMovimentacao,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["estoque"] });
      setIsModalOpen(false);
      alert("Movimentação registrada com sucesso!");
    },
    onError: (error: Error) => {
      alert(error.message || "Erro ao registrar movimentação");
    },
  });

  useEffect(() => {
    if (!selectedMaterialId && materials?.content?.length) {
      setSelectedMaterialId(materials.content[0].id);
    }
  }, [materials, selectedMaterialId]);

  const materialSelecionado = materials?.content?.find((material) => material.id === selectedMaterialId);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Estoque</h1>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Movimentação
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-green-600" />
                <h2 className="text-lg font-semibold text-gray-900">Materiais</h2>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
              {(materials?.content || []).map((material: Material) => {
                const isSelected = material.id === selectedMaterialId;

                return (
                  <button
                    key={material.id}
                    type="button"
                    onClick={() => setSelectedMaterialId(material.id)}
                    className={`w-full text-left px-4 py-4 rounded-lg border transition-colors ${
                      isSelected
                        ? "border-green-600 bg-green-50 text-green-900"
                        : "border-gray-200 bg-white hover:bg-gray-50"
                    }`}
                  >
                    <div className="font-medium">{material.nome}</div>
                    <div className="text-sm text-gray-500">
                      {material.categoria} • {material.unidadeMedida}
                    </div>
                  </button>
                );
              })}
            </CardContent>
          </Card>

          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {materialSelecionado ? materialSelecionado.nome : "Selecione um material"}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {materialSelecionado
                        ? `${materialSelecionado.categoria} • ${materialSelecionado.unidadeMedida}`
                        : "Escolha um material para visualizar o saldo total"}
                    </p>
                  </div>

                  <select
                    value={filterTipo}
                    onChange={(e) => setFilterTipo(e.target.value as TipoMovimentacao | "")}
                    className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    disabled={!selectedMaterialId}
                  >
                    <option value="">Todos os tipos</option>
                    <option value={TipoMovimentacao.ENTRADA}>Entrada</option>
                    <option value={TipoMovimentacao.SAIDA}>Saída</option>
                    <option value={TipoMovimentacao.AJUSTE}>Ajuste</option>
                  </select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg bg-gray-50 border border-gray-200 p-6">
                  <div className="text-sm text-gray-500">Quantidade total em estoque</div>
                  <div className="mt-2 text-3xl font-bold text-gray-900">
                    {selectedMaterialId
                      ? isLoadingSaldo
                        ? "Carregando..."
                        : `${(saldoMaterial || 0).toFixed(2)} ${materialSelecionado?.unidadeMedida || "kg"}`
                      : "-"}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-gray-900">Movimentações do material</h2>
              </CardHeader>
              <CardContent className="p-0">
                {selectedMaterialId ? (
                  <MovimentacaoEstoqueTable
                    data={movimentacoes?.content || []}
                    loading={isLoading}
                  />
                ) : (
                  <div className="py-12 text-center text-gray-500">
                    Selecione um material para visualizar as movimentações.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        title="Registrar Movimentação"
        onClose={() => setIsModalOpen(false)}
      >
        <MovimentacaoEstoqueForm
          materials={materials?.content || []}
          onSubmit={async (data) => {
            await mutation.mutateAsync(data);
          }}
          onCancel={() => setIsModalOpen(false)}
          isSubmitting={mutation.isPending}
        />
      </Modal>
    </MainLayout>
  );
}
