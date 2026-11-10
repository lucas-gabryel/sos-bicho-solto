import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function onlyDigits(value: string) {
  return value.replace(/\D/g, '');
}

/**
 * Converte entradas numéricas (string, number) em number de forma determinística,
 * suportando formatos decimais com ponto (1.5 / 12.50) ou vírgula (1,5 / 1.250,50).
 */
export function parseNumericInput(value?: string | number | null): number | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  if (typeof value === 'number') return Number.isNaN(value) ? undefined : value;
  const str = String(value).trim();
  if (!str) return undefined;

  // Se contiver vírgula, assume formato brasileiro (ex: 1.250,50 ou 1,5)
  if (str.includes(',')) {
    const cleaned = str.replace(/\./g, '').replace(',', '.');
    const num = parseFloat(cleaned);
    return Number.isNaN(num) ? undefined : num;
  }

  // Se não contiver vírgula, assume formato padrão com ponto decimal (ex: 12.50 ou 100)
  const num = parseFloat(str);
  return Number.isNaN(num) ? undefined : num;
}

/**
 * Retorna a data civil atual no formato YYYY-MM-DD considerando o fuso horário local.
 * Evita o problema do toISOString() que avança o dia após as 21:00 no Brasil (UTC-3).
 */
export function getTodayDateString(): string {
  const now = new Date();
  const ano = now.getFullYear();
  const mes = String(now.getMonth() + 1).padStart(2, '0');
  const dia = String(now.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}