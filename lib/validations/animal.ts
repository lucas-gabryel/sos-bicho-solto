import { z } from 'zod/v3';

export const createAnimalSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório').min(3, 'Nome deve ter ao menos 3 caracteres'),
  esp: z.enum(['Cão', 'Gato']),
  raca: z.string().min(1, 'Raça é obrigatória').min(2, 'Raça deve ter ao menos 2 caracteres'),
  sexo: z.enum(['Macho', 'Fêmea']),
  porte: z.enum(['Pequeno', 'Médio', 'Grande']).optional(),
  cor: z.string().min(1, 'Cor é obrigatória').min(2, 'Cor deve ter ao menos 2 caracteres'),
  peso: z.coerce.number().min(0.1, 'Peso deve ser maior que 0'),
  pesoAt: z.coerce.number().min(0.1, 'Peso atual deve ser maior que 0').optional().nullable(),
  castrado: z.boolean(),
  vacinado: z.boolean(),
  dataNascimento: z
    .string()
    .optional()
    .refine((value) => {
      if (!value) return true;
      const date = new Date(`${value}T00:00:00`);
      return !Number.isNaN(date.getTime()) && date <= new Date();
    }, 'Data de nascimento inválida'),
  local: z.string().min(1, 'Localização é obrigatória').min(3, 'Localização deve ter ao menos 3 caracteres'),
  obs: z.string().optional(),
  // Foto por URL (upload de arquivo virá depois). Vazio = imagem padrão é usada no service.
  fotoUrl: z.string().url('URL inválida').optional().or(z.literal('')),
});

export type CreateAnimalFormData = z.infer<typeof createAnimalSchema>;
