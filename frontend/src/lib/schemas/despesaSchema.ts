import { z } from "zod";

export const despesaSchema = z.object({
  tipoDespesaId: z.string().optional(),
  entradaMaterialId: z.string().optional(),
  clienteId: z.string().optional(),
  fornecedorId: z.string().optional(),
  descricao: z.string().min(3, "Descrição é obrigatória"),
  valor: z.number().min(0.01, "Valor deve ser maior que 0"),
  dataVencimento: z.string().min(1, "Data de vencimento é obrigatória"),
  dataPagamento: z.string().optional(),
  status: z.enum(["PAGO", "PENDENTE", "ATRASADO"]),
  observacoes: z.string().optional(),
});

export type DespesaFormData = z.infer<typeof despesaSchema>;
