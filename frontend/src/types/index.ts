export interface Cliente {
  id: string;
  nome: string;
  cpfCnpj: string;
  telefone: string;
  whatsapp?: string;
  email?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  observacoes?: string;
  createdAt: string;
  updatedAt: string;
  active: boolean;
}

export interface Fornecedor {
  id: string;
  nome: string;
  cpfCnpj: string;
  telefone: string;
  whatsapp?: string;
  email?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  observacoes?: string;
  createdAt: string;
  updatedAt: string;
  active: boolean;
}

export interface Material {
  id: string;
  nome: string;
  categoria: string;
  unidadeMedida: string;
  valorPadraoKg: number;
  createdAt: string;
  updatedAt: string;
  active: boolean;
}

export enum TipoMovimentacao {
  ENTRADA = "ENTRADA",
  SAIDA = "SAIDA",
  AJUSTE = "AJUSTE"
}

export interface MovimentacaoEstoque {
  id: string;
  materialId: string;
  materialNome: string;
  tipo: TipoMovimentacao;
  peso: number;
  valor: number;
  dataMovimentacao: string;
  usuarioId?: string;
  usuarioNome?: string;
  observacoes?: string;
  createdAt: string;
  active: boolean;
}

export interface EntradaMaterial {
  id: string;
  fornecedorId: string;
  fornecedorNome: string;
  materialId: string;
  materialNome: string;
  peso: number;
  valorKg: number;
  valorTotal: number;
  dataEntrada: string;
  observacoes?: string;
  createdAt: string;
  active: boolean;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}
