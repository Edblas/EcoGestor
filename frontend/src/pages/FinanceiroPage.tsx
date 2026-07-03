import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { DespesaTable } from "@/components/financeiro/DespesaTable";
import { DespesaForm } from "@/components/financeiro/DespesaForm";
import { ReceitaTable } from "@/components/financeiro/ReceitaTable";
import { ReceitaForm } from "@/components/financeiro/ReceitaForm";
import { api } from "@/lib/api";
import { Plus, ArrowDown, ArrowUp, DollarSign } from "lucide-react";

type TabType = "despesas" | "receitas";

export function FinanceiroPage() {
  const [activeTab, setActiveTab] = useState<TabType>("despesas");
  const [showDespesaModal, setShowDespesaModal] = useState(false);
  const [showReceitaModal, setShowReceitaModal] = useState(false);
  const queryClient = useQueryClient();

  const { data: tiposDespesa } = useQuery({
    queryKey: ["tiposDespesa"],
    queryFn: () => api.tiposDespesa.listar(),
  });

  const { data: clientes } = useQuery({
    queryKey: ["clientes"],
    queryFn: () => api.clientes.search(),
  });

  const { data: fornecedores } = useQuery({
    queryKey: ["fornecedores"],
    queryFn: () => api.fornecedores.search(),
  });

  const { data: despesas, isLoading: loadingDespesas } = useQuery({
    queryKey: ["despesas"],
    queryFn: () => api.despesas.listar(),
  });

  const { data: receitas, isLoading: loadingReceitas } = useQuery({
    queryKey: ["receitas"],
    queryFn: () => api.receitas.listar(),
  });

  const { data: totalDespesas } = useQuery({
    queryKey: ["totalDespesas"],
    queryFn: () => api.despesas.getTotalDespesas(),
  });

  const { data: totalPago } = useQuery({
    queryKey: ["totalPago"],
    queryFn: () => api.despesas.getTotalPago(),
  });

  const { data: totalReceitas } = useQuery({
    queryKey: ["totalReceitas"],
    queryFn: () => api.receitas.getTotalReceitas(),
  });

  const { data: totalRecebido } = useQuery({
    queryKey: ["totalRecebido"],
    queryFn: () => api.receitas.getTotalRecebido(),
  });

  const createDespesaMutation = useMutation({
    mutationFn: api.despesas.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["despesas"] });
      queryClient.invalidateQueries({ queryKey: ["totalDespesas"] });
      queryClient.invalidateQueries({ queryKey: ["totalPago"] });
      setShowDespesaModal(false);
    },
  });

  const createReceitaMutation = useMutation({
    mutationFn: api.receitas.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["receitas"] });
      queryClient.invalidateQueries({ queryKey: ["totalReceitas"] });
      queryClient.invalidateQueries({ queryKey: ["totalRecebido"] });
      setShowReceitaModal(false);
    },
  });

  const saldo = (totalRecebido || 0) - (totalPago || 0);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Financeiro</h1>
          <div className="flex gap-2">
            {activeTab === "despesas" ? (
              <Button onClick={() => setShowDespesaModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Nova Despesa
              </Button>
            ) : (
              <Button onClick={() => setShowReceitaModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Nova Receita
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-full">
                <ArrowDown className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Despesas</p>
                <p className="text-2xl font-bold text-red-600">
                  R$ {(totalDespesas || 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <ArrowUp className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Receitas</p>
                <p className="text-2xl font-bold text-green-600">
                  R$ {(totalReceitas || 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Saldo</p>
                <p className={`text-2xl font-bold ${saldo >= 0 ? "text-green-600" : "text-red-600"}`}>
                  R$ {saldo.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Recebido / Pago</p>
                <p className="text-2xl font-bold text-purple-600">
                  R$ {(totalRecebido || 0).toFixed(2)} / R$ {(totalPago || 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("despesas")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "despesas"
                ? "border-green-500 text-green-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Despesas
          </button>
          <button
            onClick={() => setActiveTab("receitas")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "receitas"
                ? "border-green-500 text-green-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Receitas
          </button>
        </div>

        {activeTab === "despesas" ? (
          <DespesaTable
            data={despesas?.content || []}
            loading={loadingDespesas}
          />
        ) : (
          <ReceitaTable
            data={receitas?.content || []}
            loading={loadingReceitas}
          />
        )}

        {showDespesaModal && (
          <Modal
            title="Nova Despesa"
            onClose={() => setShowDespesaModal(false)}
          >
            <DespesaForm
              tiposDespesa={tiposDespesa?.content || []}
              clientes={clientes?.content || []}
              fornecedores={fornecedores?.content || []}
              onSubmit={(data) => createDespesaMutation.mutateAsync(data)}
              onCancel={() => setShowDespesaModal(false)}
              isSubmitting={createDespesaMutation.isPending}
            />
          </Modal>
        )}

        {showReceitaModal && (
          <Modal
            title="Nova Receita"
            onClose={() => setShowReceitaModal(false)}
          >
            <ReceitaForm
              clientes={clientes?.content || []}
              onSubmit={(data) => createReceitaMutation.mutateAsync(data)}
              onCancel={() => setShowReceitaModal(false)}
              isSubmitting={createReceitaMutation.isPending}
            />
          </Modal>
        )}
      </div>
    </MainLayout>
  );
}
