import { z } from "zod";

export const materialSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  categoria: z.string().min(1, "Categoria é obrigatória"),
  unidadeMedida: z.string().min(1, "Unidade de medida é obrigatória"),
  valorPadraoKg: z
    .number()
    .min(0.01, "Valor padrão por kg deve ser maior que zero")
    .optional()
    .nullable(),
});

export type MaterialFormData = z.infer<typeof materialSchema>;
