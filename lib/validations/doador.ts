import { z } from 'zod/v3';

import { isValidCpfCnpj } from '@/lib/documentos';
import { onlyDigits } from '@/lib/utils';
import type { DoadorFormValues } from '@/types/doador';

export const doadorSchema = z.object({
  nome: z.string().trim().min(1, 'Nome ou Razão Social é obrigatório'),
  cpfCnpj: z
    .string()
    .trim()
    .min(1, 'CPF ou CNPJ é obrigatório')
    .refine((value) => {
      const digits = onlyDigits(value);
      return (digits.length === 11 || digits.length === 14) && isValidCpfCnpj(value);
    }, 'CPF ou CNPJ inválido'),
  telefone: z
    .string()
    .trim()
    .min(1, 'Telefone é obrigatório')
    .refine((value) => {
      const digits = onlyDigits(value);
      return digits.length === 10 || digits.length === 11;
    }, 'Telefone inválido'),
  email: z.string().trim().min(1, 'E-mail é obrigatório').email('E-mail inválido'),
  endereco: z.string().trim().min(1, 'Endereço é obrigatório'),
});

export const defaultDoadorFormValues: DoadorFormValues = {
  nome: '',
  cpfCnpj: '',
  telefone: '',
  email: '',
  endereco: '',
};
