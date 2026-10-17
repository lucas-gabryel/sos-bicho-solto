import { formatCpf, formatCpfCnpj, formatCnpj, isValidCpf, isValidCpfCnpj, isValidCnpj } from '@/lib/documentos';
import { onlyDigits } from '@/lib/utils';
import type { AcolhedorFormValues, SituacaoAcolhedor } from '@/types/acolhedor';

export { formatCpf, formatCpfCnpj, formatCnpj, isValidCpf, isValidCpfCnpj, isValidCnpj };

export function formatPhone(value: string) {
  const digits = onlyDigits(value).slice(0, 11);

  if (digits.length <= 2) return digits ? `(${digits}` : '';
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}


export function getAcolhedorInitials(name: string) {
  const initials = name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return initials || '--';
}

export function normalizeAcolhedorValues(values: AcolhedorFormValues): AcolhedorFormValues {
  return {
    nome: values.nome.trim(),
    cpf: formatCpf(values.cpf),
    telefone: formatPhone(values.telefone),
    email: values.email.trim().toLowerCase(),
    endereco: values.endereco.trim(),
    dataNascimento: values.dataNascimento,
  };
}

export const SITUACAO_LABELS: Record<SituacaoAcolhedor, string> = {
  ADOTANTE: 'Adotante',
  TUTOR: 'Tutor',
};
