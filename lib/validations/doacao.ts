import { z } from 'zod/v3';
import type { DoacaoFormValues } from '@/types/doacao';

export const doacaoSchema = z
  .object({
    tipo: z.enum(['DINHEIRO', 'RACAO', 'MEDICAMENTO', 'PRODUTO_LIMPEZA', 'OUTRO'], {
      required_error: 'Selecione o tipo de doação',
    }),
    anonima: z.boolean(),
    doadorId: z.string().optional(),
    valor: z.union([z.string(), z.number()]).optional(),
    quantidade: z.union([z.string(), z.number()]).optional(),
    unidadeMedida: z.string().optional(),
    descricao: z.string().optional(),
    dataRecebimento: z.string().trim().min(1, 'A data de recebimento é obrigatória'),
  })
  .superRefine((data, ctx) => {
    if (!data.anonima && (!data.doadorId || data.doadorId.trim() === '')) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['doadorId'],
        message: 'Selecione um doador cadastrado ou marque a doação como anônima.',
      });
    }

    if (data.tipo === 'DINHEIRO') {
      const numVal =
        typeof data.valor === 'number'
          ? data.valor
          : parseFloat(String(data.valor || '').replace(/\./g, '').replace(',', '.'));

      if (Number.isNaN(numVal) || numVal <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['valor'],
          message: 'Informe um valor maior que zero para a doação em dinheiro.',
        });
      }
    } else {
      const numQtd =
        typeof data.quantidade === 'number'
          ? data.quantidade
          : parseFloat(String(data.quantidade || '').replace(',', '.'));

      if (Number.isNaN(numQtd) || numQtd <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['quantidade'],
          message: 'Informe uma quantidade válida maior que zero.',
        });
      }
    }
  });

export const defaultDoacaoFormValues: DoacaoFormValues = {
  tipo: 'DINHEIRO',
  anonima: false,
  doadorId: '',
  valor: '',
  quantidade: '',
  unidadeMedida: '',
  descricao: '',
  dataRecebimento: new Date().toISOString().slice(0, 10),
};
