import { z } from "zod";

export const saidaMaterialSchema = z.object({
  clienteId: z.string().min(1, "Cliente é obrigatório"),
  materialId: z.string().min(1, "Material é obrigatório"),
  peso: z.number().min(0.01, "Peso deve ser maior que 0"),
  valorKg: z.number().min(0.01, "Valor por kg deve ser maior que 0"),
  dataSaida: z.string().min(1, "Data é obrigatória"),
  observacoes: z.string().optional(),
});

export type SaidaMaterialFormData = z.infer<typeof saidaMaterialSchema>;