import { useQuery } from "@tanstack/react-query";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Users, Truck, Package, ArrowDownToLine, ArrowUpFromLine, Warehouse } from "lucide-react";
import { api } from "@/lib/api";

export function DashboardPage() {
  const { data: clientes } = useQuery({
    queryKey: ["clientes"],
    queryFn: () => api.clientes.search(),
  });

  const { data: fornecedores } = useQuery({
    queryKey: ["fornecedores"],
    queryFn: () => api.fornecedores.search(),
  });

  const { data: materiais } = useQuery({
    queryKey: ["materiais"],
    queryFn: () => api.materiais.search(),
  });

  const { data: entradasHoje } = useQuery({
    queryKey: ["entradas-hoje"],
    queryFn: () => api.estoque.getEntradasHoje(),
  });

  const { data: saidasHoje } = useQuery({
    queryKey: ["saidas-hoje"],
    queryFn: () => api.estoque.getSaidasHoje(),
  });

  const { data: movimentacoes } = useQuery({
    queryKey: ["estoque"],
    queryFn: () => api.estoque.listarMovimentacoes(),
  });

  // Calculate total stock (simplified - in real app you'd have a proper endpoint)
  const totalStock = movimentacoes?.content?.reduce((acc, mov) => {
    if (mov.tipo === "ENTRADA") return acc + mov.peso;
    if (mov.tipo === "SAIDA") return acc - mov.peso;
    return acc;
  }, 0) || 0;

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Clientes</CardTitle>
              <Users className="w-5 h-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {clientes?.totalElements || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Fornecedores</CardTitle>
              <Truck className="w-5 h-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {fornecedores?.totalElements || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Materiais</CardTitle>
              <Package className="w-5 h-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {materiais?.totalElements || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Entradas Hoje</CardTitle>
              <ArrowDownToLine className="w-5 h-5 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {entradasHoje || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Saídas Hoje</CardTitle>
              <ArrowUpFromLine className="w-5 h-5 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {saidasHoje || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Estoque Total</CardTitle>
              <Warehouse className="w-5 h-5 text-indigo-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {totalStock.toFixed(2)} kg
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
