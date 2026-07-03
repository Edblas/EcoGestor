import { z } from "zod";

export const receitaSchema = z.object({
  saidaMaterialId: z.string().optional(),
  clienteId: z.string().optional(),
  descricao: z.string().min(3, "Descrição é obrigatória"),
  valor: z.number().min(0.01, "Valor deve ser maior que 0"),
  dataRecebimento: z.string().optional(),
  status: z.enum(["RECEBIDO", "PENDENTE", "ATRASADO"]),
  observacoes: z.string().optional(),
});

export type ReceitaFormData = z.infer<typeof receitaSchema>;
