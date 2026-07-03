import { Cliente, Fornecedor, Material, Page, TipoMovimentacao, MovimentacaoEstoque, EntradaMaterial, SaidaMaterial, TipoDespesa, Despesa, Receita, StatusFinanceiro } from "@/types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8081/api";

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
    throw new Error(`Erro: ${response.status}`);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export const api = {
  auth: {
    login: (email: string, password: string): Promise<{ token: string }> =>
      apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),
  },
  clientes: {
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
  materiais: {
    search: (search?: string, page = 0, size = 10): Promise<Page<Material>> => {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      params.append("page", page.toString());
      params.append("size", size.toString());
      return apiRequest(`/materiais?${params.toString()}`);
    },
    get: (id: string): Promise<Material> => apiRequest(`/materiais/${id}`),
    create: (data: Omit<Material, "id" | "createdAt" | "updatedAt" | "active">): Promise<Material> =>
      apiRequest("/materiais", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Omit<Material, "id" | "createdAt" | "updatedAt" | "active">): Promise<Material> =>
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
    registrarMovimentacao: (data: Omit<MovimentacaoEstoque, "id" | "createdAt" | "updatedAt" | "active">): Promise<MovimentacaoEstoque> =>
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
    registrar: (data: Omit<EntradaMaterial, "id" | "createdAt" | "updatedAt" | "active">): Promise<EntradaMaterial> =>
      apiRequest("/entradas", {
        method: "POST",
        body: JSON.stringify(data),
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
    registrar: (data: Omit<SaidaMaterial, "id" | "createdAt" | "updatedAt" | "active">): Promise<SaidaMaterial> =>
      apiRequest("/saidas", {
        method: "POST",
        body: JSON.stringify(data),
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
    listar: (status?: StatusFinanceiro, page = 0, size = 10): Promise<Page<Despesa>> => {
      const params = new URLSearchParams();
      if (status) params.append("status", status);
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
    delete: (id: string): Promise<void> =>
      apiRequest(`/despesas/${id}`, {
        method: "DELETE",
      }),
    getTotalDespesas: (): Promise<number> => apiRequest("/despesas/total"),
    getTotalPago: (): Promise<number> => apiRequest("/despesas/total-pago"),
    getTotalPendente: (): Promise<number> => apiRequest("/despesas/total-pendente"),
  },
  receitas: {
    listar: (status?: StatusFinanceiro, page = 0, size = 10): Promise<Page<Receita>> => {
      const params = new URLSearchParams();
      if (status) params.append("status", status);
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
    delete: (id: string): Promise<void> =>
      apiRequest(`/receitas/${id}`, {
        method: "DELETE",
      }),
    getTotalReceitas: (): Promise<number> => apiRequest("/receitas/total"),
    getTotalRecebido: (): Promise<number> => apiRequest("/receitas/total-recebido"),
    getTotalPendente: (): Promise<number> => apiRequest("/receitas/total-pendente"),
  },
};
