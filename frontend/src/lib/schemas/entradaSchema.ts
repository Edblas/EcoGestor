import { z } from "zod";

export const entradaMaterialSchema = z.object({
  fornecedorId: z.string().min(1, "Fornecedor é obrigatório"),
  materialId: z.string().min(1, "Material é obrigatório"),
  peso: z.number().min(0.01, "Peso deve ser maior que 0"),
  valorKg: z.number().min(0, "Valor por kg deve ser maior ou igual a 0"),
  dataEntrada: z.string().min(1, "Data é obrigatória"),
  observacoes: z.string().optional(),
});

export type EntradaMaterialFormData = z.infer<typeof entradaMaterialSchema>;
