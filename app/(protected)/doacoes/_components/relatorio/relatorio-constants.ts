import {
  CircleDollarSign,
  Gift,
  Package,
  Pill,
  Sparkles,
} from 'lucide-react';
import type { TipoDoacao } from '@/types/doacao';
import { TIPO_DOACAO_LABELS } from '@/types/doacao';

export function formatCurrency(value?: number | null) {
  if (value === undefined || value === null) return '-';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatDate(dateStr: string) {
  if (!dateStr) return '-';
  const [year, month, day] = dateStr.slice(0, 10).split('-');
  if (!year || !month || !day) return dateStr;
  return `${day}/${month}/${year}`;
}

export function formatQuantity(qtd?: number | null, unidade?: string | null) {
  if (qtd === undefined || qtd === null) return '-';
  const formatted = new Intl.NumberFormat('pt-BR', {
    maximumFractionDigits: 2,
  }).format(qtd);
  return unidade ? `${formatted} ${unidade}` : formatted;
}

export const TIPO_BADGES: Record<
  TipoDoacao,
  { label: string; bg: string; text: string; icon: typeof CircleDollarSign }
> = {
  DINHEIRO: {
    label: TIPO_DOACAO_LABELS.DINHEIRO,
    bg: 'bg-emerald-100 dark:bg-emerald-950/40',
    text: 'text-emerald-700 dark:text-emerald-400',
    icon: CircleDollarSign,
  },
  RACAO: {
    label: TIPO_DOACAO_LABELS.RACAO,
    bg: 'bg-amber-100 dark:bg-amber-950/40',
    text: 'text-amber-700 dark:text-amber-400',
    icon: Package,
  },
  MEDICAMENTO: {
    label: TIPO_DOACAO_LABELS.MEDICAMENTO,
    bg: 'bg-blue-100 dark:bg-blue-950/40',
    text: 'text-blue-700 dark:text-blue-400',
    icon: Pill,
  },
  PRODUTO_LIMPEZA: {
    label: TIPO_DOACAO_LABELS.PRODUTO_LIMPEZA,
    bg: 'bg-cyan-100 dark:bg-cyan-950/40',
    text: 'text-cyan-700 dark:text-cyan-400',
    icon: Sparkles,
  },
  OUTRO: {
    label: TIPO_DOACAO_LABELS.OUTRO,
    bg: 'bg-stone-100 dark:bg-stone-800/40',
    text: 'text-stone-700 dark:text-stone-300',
    icon: Gift,
  },
};
