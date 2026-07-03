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

export enum StatusFinanceiro {
  PAGO = "PAGO",
  RECEBIDO = "RECEBIDO",
  PENDENTE = "PENDENTE",
  ATRASADO = "ATRASADO"
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
  clienteId?: string;
  clienteNome?: string;
  fornecedorId?: string;
  fornecedorNome?: string;
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

export interface SaidaMaterial {
  id: string;
  clienteId: string;
  clienteNome: string;
  materialId: string;
  materialNome: string;
  peso: number;
  valorKg: number;
  valorTotal: number;
  dataSaida: string;
  observacoes?: string;
  createdAt: string;
  active: boolean;
}

export interface TipoDespesa {
  id: string;
  nome: string;
  descricao?: string;
  createdAt: string;
  active: boolean;
}

export interface Despesa {
  id: string;
  tipoDespesaId?: string;
  tipoDespesaNome?: string;
  entradaMaterialId?: string;
  clienteId?: string;
  clienteNome?: string;
  fornecedorId?: string;
  fornecedorNome?: string;
  descricao: string;
  valor: number;
  dataVencimento: string;
  dataPagamento?: string;
  status: StatusFinanceiro;
  observacoes?: string;
  createdAt: string;
  active: boolean;
}

export interface Receita {
  id: string;
  saidaMaterialId?: string;
  clienteId?: string;
  clienteNome?: string;
  descricao: string;
  valor: number;
  dataRecebimento?: string;
  status: StatusFinanceiro;
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
