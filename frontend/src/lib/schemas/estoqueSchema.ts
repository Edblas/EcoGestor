import { z } from "zod";
import { TipoMovimentacao } from "@/types";

export const movimentacaoEstoqueSchema = z.object({
  materialId: z.string().min(1, "Material é obrigatório"),
  tipo: z.nativeEnum(TipoMovimentacao, {
    required_error: "Tipo de movimentação é obrigatório",
  }),
  peso: z.number().min(0.01, "Peso deve ser maior que 0"),
  valor: z.number().min(0, "Valor deve ser maior ou igual a 0"),
  dataMovimentacao: z.string().min(1, "Data é obrigatória"),
  observacoes: z.string().optional(),
});

export type MovimentacaoEstoqueFormData = z.infer<typeof movimentacaoEstoqueSchema>;
