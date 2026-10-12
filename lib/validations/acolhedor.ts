import { z } from 'zod/v3';

import { isValidCpf } from '@/lib/acolhedor';
import { onlyDigits } from '@/lib/utils';
import type { AcolhedorFormValues } from '@/types/acolhedor';

export const acolhedorSchema = z.object({
  nome: z.string().trim().min(1, 'Nome obrigatório'),
  cpf: z
    .string()
    .min(1, 'CPF obrigatório')
    .refine((value) => onlyDigits(value).length === 11 && isValidCpf(value), 'CPF inválido'),
  telefone: z
    .string()
    .min(1, 'Telefone obrigatório')
    .refine((value) => {
      const digits = onlyDigits(value);

      return digits.length === 10 || digits.length === 11;
    }, 'Telefone inválido'),
  email: z.string().trim().min(1, 'E-mail obrigatório').email('E-mail inválido'),
  endereco: z.string().trim().min(1, 'Endereço obrigatório'),
  dataNascimento: z
    .string()
    .min(1, 'Data de nascimento obrigatória')
    .refine((value) => {
      const date = new Date(`${value}T00:00:00`);

      return !Number.isNaN(date.getTime()) && date <= new Date();
    }, 'Data de nascimento inválida'),
});

export const defaultAcolhedorFormValues: AcolhedorFormValues = {
  nome: '',
  cpf: '',
  telefone: '',
  email: '',
  endereco: '',
  dataNascimento: '',
};
