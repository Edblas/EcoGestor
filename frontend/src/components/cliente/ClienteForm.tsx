import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { clienteSchema, ClienteFormData } from "@/lib/schemas/clienteSchema";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Cliente } from "@/types";
import { api } from "@/lib/api";

interface ClienteFormProps {
  initialData?: Cliente;
  onSubmit: (data: ClienteFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function ClienteForm({ initialData, onSubmit, onCancel, isSubmitting }: ClienteFormProps) {
  const [cpfCnpjError, setCpfCnpjError] = useState<string | undefined>(undefined);
  const [checkingCpfCnpj, setCheckingCpfCnpj] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
    clearErrors,
  } = useForm<ClienteFormData>({
    resolver: zodResolver(clienteSchema),
    defaultValues: initialData
      ? {
          nome: initialData.nome,
          cpfCnpj: initialData.cpfCnpj,
          telefone: initialData.telefone,
          whatsapp: initialData.whatsapp || "",
          email: initialData.email || "",
          endereco: initialData.endereco || "",
          cidade: initialData.cidade || "",
          estado: initialData.estado || "",
          cep: initialData.cep || "",
          observacoes: initialData.observacoes || "",
        }
      : {
          nome: "",
          cpfCnpj: "",
          telefone: "",
          whatsapp: "",
          email: "",
          endereco: "",
          cidade: "",
          estado: "",
          cep: "",
          observacoes: "",
        },
  });

  const watchedCpfCnpj = watch("cpfCnpj");

  const handleCpfCnpjBlur = async () => {
    if (!watchedCpfCnpj || watchedCpfCnpj === initialData?.cpfCnpj) {
      setCpfCnpjError(undefined);
      clearErrors("cpfCnpj");
      return;
    }

    setCheckingCpfCnpj(true);
    try {
      const exists = await api.clientes.checkCpfCnpj(watchedCpfCnpj);
      if (exists) {
        const message = "CPF/CNPJ já cadastrado";
        setCpfCnpjError(message);
        setError("cpfCnpj", { message });
      } else {
        setCpfCnpjError(undefined);
        clearErrors("cpfCnpj");
      }
    } catch (error) {
      console.error("Erro ao verificar CPF/CNPJ:", error);
    } finally {
      setCheckingCpfCnpj(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
          <Input {...register("nome")} error={errors.nome?.message} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">CPF/CNPJ *</label>
          <Input
            {...register("cpfCnpj")}
            error={errors.cpfCnpj?.message || cpfCnpjError}
            onBlur={handleCpfCnpjBlur}
            placeholder="Digite o CPF ou CNPJ"
          />
          {checkingCpfCnpj && (
            <p className="text-xs text-gray-500 mt-1">Verificando...</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Telefone *</label>
          <Input {...register("telefone")} error={errors.telefone?.message} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
          <Input {...register("whatsapp")} error={errors.whatsapp?.message} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
          <Input type="email" {...register("email")} error={errors.email?.message} />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
          <Input {...register("endereco")} error={errors.endereco?.message} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
          <Input {...register("cidade")} error={errors.cidade?.message} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
          <Input {...register("estado")} error={errors.estado?.message} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
          <Input {...register("cep")} error={errors.cep?.message} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
        <textarea
          {...register("observacoes")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          rows={3}
        />
      </div>
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={isSubmitting} disabled={!!cpfCnpjError}>
          {initialData ? "Atualizar" : "Cadastrar"}
        </Button>
      </div>
    </form>
  );
}
