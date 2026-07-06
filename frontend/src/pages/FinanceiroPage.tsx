import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { DespesaTable } from "@/components/financeiro/DespesaTable";
import { DespesaForm } from "@/components/financeiro/DespesaForm";
import { ReceitaTable } from "@/components/financeiro/ReceitaTable";
import { ReceitaForm } from "@/components/financeiro/ReceitaForm";
import { api } from "@/lib/api";
import { DespesaFormData } from "@/lib/schemas/despesaSchema";
import { ReceitaFormData } from "@/lib/schemas/receitaSchema";
import { Despesa, Receita, StatusFinanceiro } from "@/types";
import { Plus } from "lucide-react";

type TabType = "despesas" | "receitas";

export function FinanceiroPage() {
  const getCurrentMonth = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  };

  const [activeTab, setActiveTab] = useState<TabType>("despesas");
  const [selectedMonth, setSelectedMonth] = useState<string>(getCurrentMonth());
  const [showDespesaModal, setShowDespesaModal] = useState(false);
  const [showReceitaModal, setShowReceitaModal] = useState(false);
  const [editingDespesa, setEditingDespesa] = useState<Despesa | undefined>();
  const [editingReceita, setEditingReceita] = useState<Receita | undefined>();
  const queryClient = useQueryClient();

  const toOptional = (value?: string) => (value && value.trim() !== "" ? value : undefined);

  const [selectedYear, selectedMonthNumber] = selectedMonth.split("-").map((v) => Number(v));
  const inicio = `${selectedYear}-${String(selectedMonthNumber).padStart(2, "0")}-01`;
  const lastDayOfMonth = new Date(selectedYear, selectedMonthNumber, 0).getDate();
  const fim = `${selectedYear}-${String(selectedMonthNumber).padStart(2, "0")}-${String(lastDayOfMonth).padStart(
    2,
    "0"
  )}`;

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
    queryKey: ["despesas", selectedMonth],
    queryFn: () => api.despesas.listar(undefined, 0, 10, inicio, fim),
  });

  const { data: receitas, isLoading: loadingReceitas } = useQuery({
    queryKey: ["receitas", selectedMonth],
    queryFn: () => api.receitas.listar(undefined, 0, 10, inicio, fim),
  });

  const { data: totalPago } = useQuery({
    queryKey: ["totalPago", selectedMonth],
    queryFn: () => api.despesas.getTotalPago(inicio, fim),
  });

  const { data: totalRecebido } = useQuery({
    queryKey: ["totalRecebido", selectedMonth],
    queryFn: () => api.receitas.getTotalRecebido(inicio, fim),
  });

  const { data: totalComprasEntradas } = useQuery({
    queryKey: ["financeiro", "entradas", "totalFinalizadas", selectedMonth],
    queryFn: () => api.entradas.getTotalValorFinalizadas(inicio, fim),
  });

  const { data: totalVendasSaidas } = useQuery({
    queryKey: ["financeiro", "saidas", "totalFinalizadas", selectedMonth],
    queryFn: () => api.saidas.getTotalValorFinalizadas(inicio, fim),
  });

  const createDespesaMutation = useMutation({
    mutationFn: (data: DespesaFormData): Promise<Despesa> => {
      const payload: Omit<Despesa, "id" | "createdAt" | "active"> = {
        tipoDespesaId: toOptional(data.tipoDespesaId),
        entradaMaterialId: toOptional(data.entradaMaterialId),
        clienteId: toOptional(data.clienteId),
        fornecedorId: toOptional(data.fornecedorId),
        descricao: data.descricao,
        valor: data.valor,
        dataVencimento: data.dataVencimento,
        dataPagamento: toOptional(data.dataPagamento),
        status: data.status as StatusFinanceiro,
        observacoes: toOptional(data.observacoes),
      };
      return api.despesas.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["despesas"] });
      queryClient.invalidateQueries({ queryKey: ["totalDespesas"] });
      queryClient.invalidateQueries({ queryKey: ["totalPago"] });
      setShowDespesaModal(false);
      setEditingDespesa(undefined);
    },
  });

  const updateDespesaMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: DespesaFormData }): Promise<Despesa> => {
      const payload: Omit<Despesa, "id" | "createdAt" | "active"> = {
        tipoDespesaId: toOptional(data.tipoDespesaId),
        entradaMaterialId: toOptional(data.entradaMaterialId),
        clienteId: toOptional(data.clienteId),
        fornecedorId: toOptional(data.fornecedorId),
        descricao: data.descricao,
        valor: data.valor,
        dataVencimento: data.dataVencimento,
        dataPagamento: toOptional(data.dataPagamento),
        status: data.status as StatusFinanceiro,
        observacoes: toOptional(data.observacoes),
      };
      return api.despesas.update(id, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["despesas"] });
      queryClient.invalidateQueries({ queryKey: ["totalDespesas"] });
      queryClient.invalidateQueries({ queryKey: ["totalPago"] });
      setShowDespesaModal(false);
      setEditingDespesa(undefined);
    },
  });

  const createReceitaMutation = useMutation({
    mutationFn: (data: ReceitaFormData): Promise<Receita> => {
      const payload: Omit<Receita, "id" | "createdAt" | "active"> = {
        saidaMaterialId: toOptional(data.saidaMaterialId),
        clienteId: toOptional(data.clienteId),
        descricao: data.descricao,
        valor: data.valor,
        dataRecebimento: toOptional(data.dataRecebimento),
        status: data.status as StatusFinanceiro,
        observacoes: toOptional(data.observacoes),
      };
      return api.receitas.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["receitas"] });
      queryClient.invalidateQueries({ queryKey: ["totalReceitas"] });
      queryClient.invalidateQueries({ queryKey: ["totalRecebido"] });
      setShowReceitaModal(false);
      setEditingReceita(undefined);
    },
  });

  const updateReceitaMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ReceitaFormData }): Promise<Receita> => {
      const payload: Omit<Receita, "id" | "createdAt" | "active"> = {
        saidaMaterialId: toOptional(data.saidaMaterialId),
        clienteId: toOptional(data.clienteId),
        descricao: data.descricao,
        valor: data.valor,
        dataRecebimento: toOptional(data.dataRecebimento),
        status: data.status as StatusFinanceiro,
        observacoes: toOptional(data.observacoes),
      };
      return api.receitas.update(id, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["receitas"] });
      queryClient.invalidateQueries({ queryKey: ["totalReceitas"] });
      queryClient.invalidateQueries({ queryKey: ["totalRecebido"] });
      setShowReceitaModal(false);
      setEditingReceita(undefined);
    },
  });

  const handleOpenNovaDespesa = () => {
    setEditingDespesa(undefined);
    setShowDespesaModal(true);
  };

  const handleOpenNovaReceita = () => {
    setEditingReceita(undefined);
    setShowReceitaModal(true);
  };

  const handleOpenEditDespesa = (despesa: Despesa) => {
    setEditingDespesa(despesa);
    setShowDespesaModal(true);
  };

  const handleOpenEditReceita = (receita: Receita) => {
    setEditingReceita(receita);
    setShowReceitaModal(true);
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

  const saldo = (totalRecebido || 0) - (totalPago || 0);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">Financeiro</h1>
            <div className="w-full sm:w-44">
              <Input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2">
            {activeTab === "despesas" ? (
              <Button onClick={handleOpenNovaDespesa}>
                <Plus className="w-4 h-4 mr-2" />
                Nova Despesa
              </Button>
            ) : (
              <Button onClick={handleOpenNovaReceita}>
                <Plus className="w-4 h-4 mr-2" />
                Nova Receita
              </Button>
            )}
          </div>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div>
                <div className="text-xs font-medium text-gray-500">Compras (Entradas)</div>
                <div className="mt-1 text-xl font-semibold text-gray-900">
                  {formatCurrency(totalComprasEntradas || 0)}
                </div>
              </div>

              <div>
                <div className="text-xs font-medium text-gray-500">Vendas (Saídas)</div>
                <div className="mt-1 text-xl font-semibold text-gray-900">
                  {formatCurrency(totalVendasSaidas || 0)}
                </div>
              </div>

              <div>
                <div className="text-xs font-medium text-gray-500">Pago</div>
                <div className="mt-1 text-xl font-semibold text-gray-900">
                  {formatCurrency(totalPago || 0)}
                </div>
              </div>

              <div>
                <div className="text-xs font-medium text-gray-500">Recebido</div>
                <div className="mt-1 text-xl font-semibold text-gray-900">
                  {formatCurrency(totalRecebido || 0)}
                </div>
              </div>

              <div>
                <div className="text-xs font-medium text-gray-500">Saldo</div>
                <div className={`mt-1 text-xl font-semibold ${saldo >= 0 ? "text-green-700" : "text-red-700"}`}>
                  {formatCurrency(saldo)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

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
            onEdit={handleOpenEditDespesa}
          />
        ) : (
          <ReceitaTable
            data={receitas?.content || []}
            loading={loadingReceitas}
            onEdit={handleOpenEditReceita}
          />
        )}

        <Modal
          isOpen={showDespesaModal}
          title={editingDespesa ? "Editar Despesa" : "Nova Despesa"}
          onClose={() => {
            setShowDespesaModal(false);
            setEditingDespesa(undefined);
          }}
        >
          <DespesaForm
            tiposDespesa={tiposDespesa?.content || []}
            clientes={clientes?.content || []}
            fornecedores={fornecedores?.content || []}
            initialData={editingDespesa}
            onSubmit={async (data) => {
              if (editingDespesa) {
                await updateDespesaMutation.mutateAsync({ id: editingDespesa.id, data });
              } else {
                await createDespesaMutation.mutateAsync(data);
              }
            }}
            onCancel={() => {
              setShowDespesaModal(false);
              setEditingDespesa(undefined);
            }}
            isSubmitting={createDespesaMutation.isPending || updateDespesaMutation.isPending}
          />
        </Modal>

        <Modal
          isOpen={showReceitaModal}
          title={editingReceita ? "Editar Receita" : "Nova Receita"}
          onClose={() => {
            setShowReceitaModal(false);
            setEditingReceita(undefined);
          }}
        >
          <ReceitaForm
            clientes={clientes?.content || []}
            initialData={editingReceita}
            onSubmit={async (data) => {
              if (editingReceita) {
                await updateReceitaMutation.mutateAsync({ id: editingReceita.id, data });
              } else {
                await createReceitaMutation.mutateAsync(data);
              }
            }}
            onCancel={() => {
              setShowReceitaModal(false);
              setEditingReceita(undefined);
            }}
            isSubmitting={createReceitaMutation.isPending || updateReceitaMutation.isPending}
          />
        </Modal>
      </div>
    </MainLayout>
  );
}
