import { onlyDigits } from '@/lib/utils';
import type { AcolhedorFormValues, SituacaoAcolhedor } from '@/types/acolhedor';

export function formatCpf(value: string) {
  const digits = onlyDigits(value).slice(0, 11);

  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;

  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

export function formatPhone(value: string) {
  const digits = onlyDigits(value).slice(0, 11);

  if (digits.length <= 2) return digits ? `(${digits}` : '';
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function isValidCpf(value: string) {
  const digits = onlyDigits(value);

  if (digits.length !== 11 || /^(\d)\1+$/.test(digits)) {
    return false;
  }

  const numbers = digits.split('').map(Number);

  const getVerifier = (sliceLength: number) => {
    const total = numbers
      .slice(0, sliceLength)
      .reduce((sum, digit, index) => sum + digit * (sliceLength + 1 - index), 0);
    const remainder = (total * 10) % 11;

    return remainder === 10 ? 0 : remainder;
  };

  return getVerifier(9) === numbers[9] && getVerifier(10) === numbers[10];
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
