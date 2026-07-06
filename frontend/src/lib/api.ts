import { Cliente, Fornecedor, Material, Page, TipoMovimentacao, MovimentacaoEstoque, EntradaMaterial, SaidaMaterial, TipoDespesa, Despesa, Receita, StatusEntradaMaterial, StatusFinanceiro, StatusSaidaMaterial } from "@/types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

type EntradaMaterialRequest = {
  clienteId?: string;
  fornecedorId?: string;
  materialId: string;
  peso: number;
  valorKg: number;
  dataEntrada: string;
  status: StatusEntradaMaterial;
  observacoes?: string;
};

type SaidaMaterialRequest = {
  clienteId: string;
  materialId: string;
  peso: number;
  valorKg: number;
  dataSaida: string;
  status: StatusSaidaMaterial;
  observacoes?: string;
};

type MaterialRequest = {
  nome: string;
  categoria: string;
  unidadeMedida: string;
  valorPadraoKg?: number | null;
};

type MovimentacaoEstoqueRequest = {
  materialId: string;
  tipo: TipoMovimentacao;
  peso: number;
  valor: number;
  dataMovimentacao: string;
  observacoes?: string;
};

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("token");
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = `Erro: ${response.status}`;
    const errorText = await response.text();

    if (errorText) {
      try {
        const errorData = JSON.parse(errorText);
        if (errorData?.message) {
          errorMessage = errorData.message;
        } else {
          errorMessage = errorText;
        }
      } catch {
        errorMessage = errorText;
      }
    }

    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export const api = {
  relatorios: {
    downloadPDF: async (dataInicio: string, dataFim: string, materialId?: string, clienteId?: string, fornecedorId?: string): Promise<void> => {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams();
      params.append("dataInicio", dataInicio);
      params.append("dataFim", dataFim);
      if (materialId) params.append("materialId", materialId);
      if (clienteId) params.append("clienteId", clienteId);
      if (fornecedorId) params.append("fornecedorId", fornecedorId);

      const response = await fetch(`${API_BASE_URL}/relatorios/pdf?${params.toString()}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Erro ao baixar relatório");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `relatorio_${dataInicio}_${dataFim}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    },
  },
  clientes: {
    checkCpfCnpj: async (cpfCnpj: string): Promise<boolean> => {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams();
      params.append("cpfCnpj", cpfCnpj);
      const response = await fetch(`${API_BASE_URL}/clientes/check-cpf-cnpj?${params.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Erro ao verificar CPF/CNPJ");
      return response.json();
    },
    search: (search?: string, page = 0, size = 10): Promise<Page<Cliente>> => {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      params.append("page", page.toString());
      params.append("size", size.toString());
      return apiRequest(`/clientes?${params.toString()}`);
    },
    get: (id: string): Promise<Cliente> => apiRequest(`/clientes/${id}`),
    create: (data: Omit<Cliente, "id" | "createdAt" | "updatedAt" | "active">): Promise<Cliente> =>
      apiRequest("/clientes", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Omit<Cliente, "id" | "createdAt" | "updatedAt" | "active">): Promise<Cliente> =>
      apiRequest(`/clientes/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: string): Promise<void> =>
      apiRequest(`/clientes/${id}`, {
        method: "DELETE",
      }),
  },
  fornecedores: {
    checkCpfCnpj: async (cpfCnpj: string): Promise<boolean> => {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams();
      params.append("cpfCnpj", cpfCnpj);
      const response = await fetch(`${API_BASE_URL}/fornecedores/check-cpf-cnpj?${params.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Erro ao verificar CPF/CNPJ");
      return response.json();
    },
    search: (search?: string, page = 0, size = 10): Promise<Page<Fornecedor>> => {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      params.append("page", page.toString());
      params.append("size", size.toString());
      return apiRequest(`/fornecedores?${params.toString()}`);
    },
    get: (id: string): Promise<Fornecedor> => apiRequest(`/fornecedores/${id}`),
    create: (data: Omit<Fornecedor, "id" | "createdAt" | "updatedAt" | "active">): Promise<Fornecedor> =>
      apiRequest("/fornecedores", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Omit<Fornecedor, "id" | "createdAt" | "updatedAt" | "active">): Promise<Fornecedor> =>
      apiRequest(`/fornecedores/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: string): Promise<void> =>
      apiRequest(`/fornecedores/${id}`, {
        method: "DELETE",
      }),
  },
  auth: {
    login: (email: string, password: string): Promise<{ token: string }> =>
      apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),
  },
  materiais: {
    search: (search?: string, page = 0, size = 10): Promise<Page<Material>> => {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      params.append("page", page.toString());
      params.append("size", size.toString());
      return apiRequest(`/materiais?${params.toString()}`);
    },
    get: (id: string): Promise<Material> => apiRequest(`/materiais/${id}`),
    create: (data: MaterialRequest): Promise<Material> =>
      apiRequest("/materiais", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: MaterialRequest): Promise<Material> =>
      apiRequest(`/materiais/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: string): Promise<void> =>
      apiRequest(`/materiais/${id}`, {
        method: "DELETE",
      }),
  },
  estoque: {
    listarMovimentacoes: (materialId?: string, tipo?: TipoMovimentacao, page = 0, size = 10): Promise<Page<MovimentacaoEstoque>> => {
      const params = new URLSearchParams();
      if (materialId) params.append("materialId", materialId);
      if (tipo) params.append("tipo", tipo);
      params.append("page", page.toString());
      params.append("size", size.toString());
      return apiRequest(`/estoque/movimentacoes?${params.toString()}`);
    },
    getMovimentacao: (id: string): Promise<MovimentacaoEstoque> => apiRequest(`/estoque/movimentacoes/${id}`),
    registrarMovimentacao: (data: MovimentacaoEstoqueRequest): Promise<MovimentacaoEstoque> =>
      apiRequest("/estoque/movimentacoes", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    getSaldoEstoque: (materialId: string): Promise<number> => apiRequest(`/estoque/movimentacoes/saldo/${materialId}`),
    getEntradasHoje: (): Promise<number> => apiRequest(`/estoque/movimentacoes/hoje/${TipoMovimentacao.ENTRADA}`),
    getSaidasHoje: (): Promise<number> => apiRequest(`/estoque/movimentacoes/hoje/${TipoMovimentacao.SAIDA}`),
  },
  entradas: {
    listar: (clienteId?: string, fornecedorId?: string, materialId?: string, page = 0, size = 10): Promise<Page<EntradaMaterial>> => {
      const params = new URLSearchParams();
      if (clienteId) params.append("clienteId", clienteId);
      if (fornecedorId) params.append("fornecedorId", fornecedorId);
      if (materialId) params.append("materialId", materialId);
      params.append("page", page.toString());
      params.append("size", size.toString());
      return apiRequest(`/entradas?${params.toString()}`);
    },
    get: (id: string): Promise<EntradaMaterial> => apiRequest(`/entradas/${id}`),
    registrar: (data: EntradaMaterialRequest): Promise<EntradaMaterial> =>
      apiRequest("/entradas", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: EntradaMaterialRequest): Promise<EntradaMaterial> =>
      apiRequest(`/entradas/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: string): Promise<void> =>
      apiRequest(`/entradas/${id}`, {
        method: "DELETE",
      }),
    getTotalValorFinalizadas: (inicio?: string, fim?: string): Promise<number> => {
      const params = new URLSearchParams();
      if (inicio && fim) {
        params.append("inicio", inicio);
        params.append("fim", fim);
      }
      const query = params.toString();
      return apiRequest(`/entradas/totais/valor-finalizadas${query ? `?${query}` : ""}`);
    },
    finalizar: (id: string): Promise<EntradaMaterial> =>
      apiRequest(`/entradas/${id}/finalizar`, {
        method: "PATCH",
      }),
  },
  saidas: {
    listar: (clienteId?: string, materialId?: string, page = 0, size = 10): Promise<Page<SaidaMaterial>> => {
      const params = new URLSearchParams();
      if (clienteId) params.append("clienteId", clienteId);
      if (materialId) params.append("materialId", materialId);
      params.append("page", page.toString());
      params.append("size", size.toString());
      return apiRequest(`/saidas?${params.toString()}`);
    },
    get: (id: string): Promise<SaidaMaterial> => apiRequest(`/saidas/${id}`),
    registrar: (data: SaidaMaterialRequest): Promise<SaidaMaterial> =>
      apiRequest("/saidas", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: SaidaMaterialRequest): Promise<SaidaMaterial> =>
      apiRequest(`/saidas/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: string): Promise<void> =>
      apiRequest(`/saidas/${id}`, {
        method: "DELETE",
      }),
    getTotalValorFinalizadas: (inicio?: string, fim?: string): Promise<number> => {
      const params = new URLSearchParams();
      if (inicio && fim) {
        params.append("inicio", inicio);
        params.append("fim", fim);
      }
      const query = params.toString();
      return apiRequest(`/saidas/totais/valor-finalizadas${query ? `?${query}` : ""}`);
    },
    finalizar: (id: string): Promise<SaidaMaterial> =>
      apiRequest(`/saidas/${id}/finalizar`, {
        method: "PATCH",
      }),
  },
  tiposDespesa: {
    listar: (page = 0, size = 10): Promise<Page<TipoDespesa>> => {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("size", size.toString());
      return apiRequest(`/tipos-despesa?${params.toString()}`);
    },
    get: (id: string): Promise<TipoDespesa> => apiRequest(`/tipos-despesa/${id}`),
    create: (data: Omit<TipoDespesa, "id" | "createdAt" | "active">): Promise<TipoDespesa> =>
      apiRequest("/tipos-despesa", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    delete: (id: string): Promise<void> =>
      apiRequest(`/tipos-despesa/${id}`, {
        method: "DELETE",
      }),
  },
  despesas: {
    listar: (status?: StatusFinanceiro, page = 0, size = 10, inicio?: string, fim?: string): Promise<Page<Despesa>> => {
      const params = new URLSearchParams();
      if (status) params.append("status", status);
      if (inicio) params.append("inicio", inicio);
      if (fim) params.append("fim", fim);
      params.append("page", page.toString());
      params.append("size", size.toString());
      return apiRequest(`/despesas?${params.toString()}`);
    },
    get: (id: string): Promise<Despesa> => apiRequest(`/despesas/${id}`),
    create: (data: Omit<Despesa, "id" | "createdAt" | "active">): Promise<Despesa> =>
      apiRequest("/despesas", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Omit<Despesa, "id" | "createdAt" | "active">): Promise<Despesa> =>
      apiRequest(`/despesas/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: string): Promise<void> =>
      apiRequest(`/despesas/${id}`, {
        method: "DELETE",
      }),
    getTotalDespesas: (): Promise<number> => apiRequest("/despesas/total"),
    getTotalPago: (inicio?: string, fim?: string): Promise<number> => {
      if (inicio && fim) {
        const params = new URLSearchParams();
        params.append("inicio", inicio);
        params.append("fim", fim);
        return apiRequest(`/despesas/total-pago-por-periodo?${params.toString()}`);
      }
      return apiRequest("/despesas/total-pago");
    },
    getTotalPendente: (): Promise<number> => apiRequest("/despesas/total-pendente"),
  },
  receitas: {
    listar: (status?: StatusFinanceiro, page = 0, size = 10, inicio?: string, fim?: string): Promise<Page<Receita>> => {
      const params = new URLSearchParams();
      if (status) params.append("status", status);
      if (inicio) params.append("inicio", inicio);
      if (fim) params.append("fim", fim);
      params.append("page", page.toString());
      params.append("size", size.toString());
      return apiRequest(`/receitas?${params.toString()}`);
    },
    get: (id: string): Promise<Receita> => apiRequest(`/receitas/${id}`),
    create: (data: Omit<Receita, "id" | "createdAt" | "active">): Promise<Receita> =>
      apiRequest("/receitas", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Omit<Receita, "id" | "createdAt" | "active">): Promise<Receita> =>
      apiRequest(`/receitas/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: string): Promise<void> =>
      apiRequest(`/receitas/${id}`, {
        method: "DELETE",
      }),
    getTotalReceitas: (): Promise<number> => apiRequest("/receitas/total"),
    getTotalRecebido: (inicio?: string, fim?: string): Promise<number> => {
      if (inicio && fim) {
        const params = new URLSearchParams();
        params.append("inicio", inicio);
        params.append("fim", fim);
        return apiRequest(`/receitas/total-recebido-por-periodo?${params.toString()}`);
      }
      return apiRequest("/receitas/total-recebido");
    },
    getTotalPendente: (): Promise<number> => apiRequest("/receitas/total-pendente"),
  },
};
