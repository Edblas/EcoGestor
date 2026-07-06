import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Cliente, EntradaMaterial, SaidaMaterial, StatusEntradaMaterial } from "@/types";

interface ClienteDetalhesProps {
  cliente?: Cliente;
  entradas: EntradaMaterial[];
  saidas: SaidaMaterial[];
  isLoading?: boolean;
}

type OperacaoCliente = {
  id: string;
  tipo: "ENTRADA" | "SAIDA";
  materialNome: string;
  peso: number;
  valorTotal: number;
  data: string;
  status?: StatusEntradaMaterial;
  observacoes?: string;
};

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const dateFormatter = new Intl.DateTimeFormat("pt-BR");

export function ClienteDetalhes({
  cliente,
  entradas,
  saidas,
  isLoading,
}: ClienteDetalhesProps) {
  if (isLoading) {
    return <div className="py-8 text-center text-gray-500">Carregando informações do cliente...</div>;
  }

  if (!cliente) {
    return <div className="py-8 text-center text-gray-500">Cliente não encontrado.</div>;
  }

  const totalEntradas = entradas.reduce((total, entrada) => total + entrada.valorTotal, 0);
  const totalSaidas = saidas.reduce((total, saida) => total + saida.valorTotal, 0);
  const pesoEntradas = entradas.reduce((total, entrada) => total + entrada.peso, 0);
  const pesoSaidas = saidas.reduce((total, saida) => total + saida.peso, 0);

  const materiaisMap = new Map<
    string,
    { nome: string; entradas: number; saidas: number; pesoEntradas: number; pesoSaidas: number }
  >();

  entradas.forEach((entrada) => {
    const material = materiaisMap.get(entrada.materialId) || {
      nome: entrada.materialNome,
      entradas: 0,
      saidas: 0,
      pesoEntradas: 0,
      pesoSaidas: 0,
    };

    material.entradas += 1;
    material.pesoEntradas += entrada.peso;
    materiaisMap.set(entrada.materialId, material);
  });

  saidas.forEach((saida) => {
    const material = materiaisMap.get(saida.materialId) || {
      nome: saida.materialNome,
      entradas: 0,
      saidas: 0,
      pesoEntradas: 0,
      pesoSaidas: 0,
    };

    material.saidas += 1;
    material.pesoSaidas += saida.peso;
    materiaisMap.set(saida.materialId, material);
  });

  const materiais = Array.from(materiaisMap.values()).sort((a, b) => a.nome.localeCompare(b.nome));

  const operacoes: OperacaoCliente[] = [
    ...entradas.map((entrada) => ({
      id: entrada.id,
      tipo: "ENTRADA" as const,
      materialNome: entrada.materialNome,
      peso: entrada.peso,
      valorTotal: entrada.valorTotal,
      data: entrada.dataEntrada,
      status: entrada.status,
      observacoes: entrada.observacoes,
    })),
    ...saidas.map((saida) => ({
      id: saida.id,
      tipo: "SAIDA" as const,
      materialNome: saida.materialNome,
      peso: saida.peso,
      valorTotal: saida.valorTotal,
      data: saida.dataSaida,
      observacoes: saida.observacoes,
    })),
  ].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

  const primeiraOperacao = operacoes.length > 0 ? operacoes[operacoes.length - 1].data : undefined;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">{cliente.nome}</h3>
          <p className="text-sm text-gray-500">
            Cliente desde {dateFormatter.format(new Date(cliente.createdAt))}
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-500">CPF/CNPJ</div>
              <div className="font-medium text-gray-900">{cliente.cpfCnpj}</div>
            </div>
            <div>
              <div className="text-gray-500">Telefone</div>
              <div className="font-medium text-gray-900">{cliente.telefone}</div>
            </div>
            <div>
              <div className="text-gray-500">WhatsApp</div>
              <div className="font-medium text-gray-900">{cliente.whatsapp || "-"}</div>
            </div>
            <div>
              <div className="text-gray-500">E-mail</div>
              <div className="font-medium text-gray-900">{cliente.email || "-"}</div>
            </div>
            <div>
              <div className="text-gray-500">Cidade / Estado</div>
              <div className="font-medium text-gray-900">
                {[cliente.cidade, cliente.estado].filter(Boolean).join(" / ") || "-"}
              </div>
            </div>
            <div>
              <div className="text-gray-500">Primeira operação</div>
              <div className="font-medium text-gray-900">
                {primeiraOperacao ? dateFormatter.format(new Date(primeiraOperacao)) : "Sem operações"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card>
          <CardContent>
            <div className="text-sm text-gray-500">Entradas vinculadas</div>
            <div className="mt-2 text-2xl font-bold text-gray-900">{entradas.length}</div>
            <div className="text-sm text-gray-600">{pesoEntradas.toFixed(2)} kg</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="text-sm text-gray-500">Saídas realizadas</div>
            <div className="mt-2 text-2xl font-bold text-gray-900">{saidas.length}</div>
            <div className="text-sm text-gray-600">{pesoSaidas.toFixed(2)} kg</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="text-sm text-gray-500">Valor em entradas</div>
            <div className="mt-2 text-2xl font-bold text-gray-900">{currencyFormatter.format(totalEntradas)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="text-sm text-gray-500">Valor em saídas</div>
            <div className="mt-2 text-2xl font-bold text-gray-900">{currencyFormatter.format(totalSaidas)}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Materiais negociados</h3>
        </CardHeader>
        <CardContent>
          {materiais.length === 0 ? (
            <div className="text-sm text-gray-500">Este cliente ainda não possui movimentações registradas.</div>
          ) : (
            <div className="space-y-3">
              {materiais.map((material) => (
                <div
                  key={material.nome}
                  className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 rounded-lg border border-gray-200 px-4 py-3"
                >
                  <div>
                    <div className="font-medium text-gray-900">{material.nome}</div>
                    <div className="text-sm text-gray-500">
                      {material.entradas} entrada(s) • {material.saidas} saída(s)
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    Entradas: {material.pesoEntradas.toFixed(2)} kg • Saídas: {material.pesoSaidas.toFixed(2)} kg
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Histórico recente</h3>
        </CardHeader>
        <CardContent>
          {operacoes.length === 0 ? (
            <div className="text-sm text-gray-500">Nenhuma operação registrada para este cliente.</div>
          ) : (
            <div className="space-y-3">
              {operacoes.slice(0, 12).map((operacao) => (
                <div
                  key={`${operacao.tipo}-${operacao.id}`}
                  className="rounded-lg border border-gray-200 px-4 py-3"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div>
                      <div className="font-medium text-gray-900">
                        {operacao.tipo === "ENTRADA" ? "Entrada" : "Saída"} • {operacao.materialNome}
                      </div>
                      <div className="text-sm text-gray-500">
                        {dateFormatter.format(new Date(operacao.data))}
                        {operacao.tipo === "ENTRADA" && operacao.status
                          ? ` • ${operacao.status === StatusEntradaMaterial.FINALIZADO ? "Finalizado" : "Em andamento"}`
                          : ""}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      {operacao.peso.toFixed(2)} kg • {currencyFormatter.format(operacao.valorTotal)}
                    </div>
                  </div>
                  {operacao.observacoes && (
                    <div className="mt-2 text-sm text-gray-600">{operacao.observacoes}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
