import { z } from "zod";

export const entradaMaterialSchema = z.object({
  tipoParceiro: z.enum(["CLIENTE", "FORNECEDOR"], {
    required_error: "Selecione um tipo de parceiro",
  }),
  clienteId: z.string().optional(),
  fornecedorId: z.string().optional(),
  materialId: z.string().min(1, "Material é obrigatório"),
  peso: z.number().min(0.01, "Peso deve ser maior que 0"),
  valorKg: z.number().min(0, "Valor por kg deve ser maior ou igual a 0"),
  dataEntrada: z.string().min(1, "Data é obrigatória"),
  observacoes: z.string().optional(),
}).refine((data) => {
  if (data.tipoParceiro === "CLIENTE" && !data.clienteId) return false;
  if (data.tipoParceiro === "FORNECEDOR" && !data.fornecedorId) return false;
  return true;
}, {
  message: "Selecione um parceiro",
  path: ["clienteId"],
});

export type EntradaMaterialFormData = z.infer<typeof entradaMaterialSchema>;
