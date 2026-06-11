import { z } from 'zod/v3';

import type { CreateUserFormValues } from '@/types/user';

const passwordRegex = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,15}$/;

export const createUserSchema = z
  .object({
    name: z.string().trim().min(1, 'Nome obrigatório'),
    email: z.string().trim().min(1, 'E-mail obrigatório').email('E-mail inválido'),
    role: z.enum(['admin', 'protetor'], {
      errorMap: () => ({ message: 'Perfil obrigatório' }),
    }),
    password: z
      .string()
      .min(8, 'A senha deve ter entre 8 e 15 caracteres')
      .max(15, 'A senha deve ter entre 8 e 15 caracteres')
      .regex(passwordRegex, 'Use ao menos uma letra maiuscula e um caractere especial'),
    confirmPassword: z.string().min(1, 'Confirme a senha'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'As senhas precisam ser iguais',
  });

export const defaultCreateUserFormValues: CreateUserFormValues = {
  name: '',
  email: '',
  role: 'protetor',
  password: '',
  confirmPassword: '',
};
