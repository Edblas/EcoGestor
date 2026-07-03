import { z } from "zod";

export const fornecedorSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  cpfCnpj: z.string().min(1, "CPF/CNPJ é obrigatório"),
  telefone: z.string().min(1, "Telefone é obrigatório"),
  whatsapp: z.string().optional(),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
  endereco: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
  cep: z.string().optional(),
  observacoes: z.string().optional(),
});

export type FornecedorFormData = z.infer<typeof fornecedorSchema>;
