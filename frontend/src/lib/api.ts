import { Cliente, Fornecedor, Material, Page, TipoMovimentacao, MovimentacaoEstoque, EntradaMaterial } from "@/types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

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
    listar: (fornecedorId?: string, materialId?: string, page = 0, size = 10): Promise<Page<EntradaMaterial>> => {
      const params = new URLSearchParams();
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
};
