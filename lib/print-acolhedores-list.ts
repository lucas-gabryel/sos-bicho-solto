import { formatDateToPtBr, getAge } from '@/lib/date';
import type { Acolhedor, SituacaoAcolhedor } from '@/types/acolhedor';

export interface AcolhedorListPrintColumnOption {
  id: string;
  label: string;
  defaultSelected: boolean;
  align?: 'left' | 'center' | 'right';
  render: (acolhedor: Acolhedor) => string;
}

export function formatAgeDisplay(birthDate?: string): string {
  if (!birthDate) return '-';
  const age = getAge(birthDate);
  if (age === null || age === undefined || Number.isNaN(age)) return '-';
  return `${age} anos`;
}

export const ACOLHEDOR_LIST_PRINT_COLUMNS: AcolhedorListPrintColumnOption[] = [
  {
    id: 'codigo',
    label: 'Código',
    defaultSelected: true,
    align: 'left',
    render: (a) => (a.codigo ? `#${a.codigo}` : '-'),
  },
  {
    id: 'nome',
    label: 'Nome',
    defaultSelected: true,
    align: 'left',
    render: (a) => a.nome || '-',
  },
  {
    id: 'cpf',
    label: 'CPF',
    defaultSelected: true,
    align: 'center',
    render: (a) => a.cpf || '-',
  },
  {
    id: 'situacao',
    label: 'Situação',
    defaultSelected: true,
    align: 'center',
    render: (a) => (a.situacao === 'ADOTANTE' ? 'Adotante' : 'Tutor'),
  },
  {
    id: 'telefone',
    label: 'Telefone',
    defaultSelected: true,
    align: 'center',
    render: (a) => a.telefone || '-',
  },
  {
    id: 'email',
    label: 'E-mail',
    defaultSelected: false,
    align: 'left',
    render: (a) => a.email || '-',
  },
  {
    id: 'endereco',
    label: 'Endereço',
    defaultSelected: true,
    align: 'left',
    render: (a) => a.endereco || '-',
  },
  {
    id: 'dataNascimento',
    label: 'Nascimento (Idade)',
    defaultSelected: false,
    align: 'center',
    render: (a) => {
      if (!a.dataNascimento) return '-';
      const ageStr = formatAgeDisplay(a.dataNascimento);
      return `${formatDateToPtBr(a.dataNascimento)} (${ageStr})`;
    },
  },
  {
    id: 'totalAnimais',
    label: 'Animais Vinculados',
    defaultSelected: true,
    align: 'center',
    render: (a) => String(a.totalAnimaisAdotados ?? 0),
  },
];

export const DEFAULT_ACOLHEDOR_LIST_COLUMNS = ACOLHEDOR_LIST_PRINT_COLUMNS.filter(
  (col) => col.defaultSelected,
).map((col) => col.id);

export interface AcolhedorListPrintFilterSummary {
  busca?: string;
  situacao?: SituacaoAcolhedor;
}
