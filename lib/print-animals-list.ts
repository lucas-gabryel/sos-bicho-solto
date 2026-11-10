import { formatDateToPtBr, getAge } from '@/lib/date';
import type { Animal, AnimalEsp, AnimalStatus } from '@/services/animal.service';

export interface AnimalListPrintColumnOption {
  id: string;
  label: string;
  defaultSelected: boolean;
  align?: 'left' | 'center' | 'right';
  render: (animal: Animal) => string;
}

export function formatAgeDisplay(birthDate?: string): string {
  if (!birthDate) return '-';
  const age = getAge(birthDate);
  if (age === null || age === undefined || Number.isNaN(age)) return '-';
  if (age === 0) return '< 1 ano';
  return `${age} ${age === 1 ? 'ano' : 'anos'}`;
}

export const ANIMAL_LIST_PRINT_COLUMNS: AnimalListPrintColumnOption[] = [
  {
    id: 'numeroRegistro',
    label: 'Nº Registro',
    defaultSelected: true,
    align: 'left',
    render: (animal) => animal.numeroRegistro || '-',
  },
  {
    id: 'nome',
    label: 'Nome',
    defaultSelected: true,
    align: 'left',
    render: (animal) => animal.nome || '-',
  },
  {
    id: 'especie',
    label: 'Espécie',
    defaultSelected: true,
    align: 'center',
    render: (animal) => animal.esp || '-',
  },
  {
    id: 'raca',
    label: 'Raça',
    defaultSelected: true,
    align: 'left',
    render: (animal) => animal.raca || '-',
  },
  {
    id: 'sexo',
    label: 'Sexo',
    defaultSelected: true,
    align: 'center',
    render: (animal) => animal.sexo || '-',
  },
  {
    id: 'porte',
    label: 'Porte',
    defaultSelected: true,
    align: 'center',
    render: (animal) => animal.porte || '-',
  },
  {
    id: 'idade',
    label: 'Idade',
    defaultSelected: true,
    align: 'center',
    render: (animal) => formatAgeDisplay(animal.dataNascimento),
  },
  {
    id: 'peso',
    label: 'Peso',
    defaultSelected: false,
    align: 'right',
    render: (animal) => {
      const peso = animal.pesoAt ?? animal.peso;
      return peso ? `${peso} kg` : '-';
    },
  },
  {
    id: 'castrado',
    label: 'Castrado',
    defaultSelected: false,
    align: 'center',
    render: (animal) => (animal.castrado ? 'Sim' : 'Não'),
  },
  {
    id: 'vacinado',
    label: 'Vacinado',
    defaultSelected: false,
    align: 'center',
    render: (animal) => (animal.vacinado ? 'Sim' : 'Não'),
  },
  {
    id: 'local',
    label: 'Local Resgate',
    defaultSelected: false,
    align: 'left',
    render: (animal) => animal.local || '-',
  },
  {
    id: 'status',
    label: 'Status',
    defaultSelected: true,
    align: 'center',
    render: (animal) => animal.status || '-',
  },
  {
    id: 'dataCadastro',
    label: 'Cadastro',
    defaultSelected: false,
    align: 'center',
    render: (animal) => animal.data || '—',
  },
];

export const DEFAULT_ANIMAL_LIST_COLUMNS = ANIMAL_LIST_PRINT_COLUMNS.filter(
  (col) => col.defaultSelected,
).map((col) => col.id);

export interface AnimalListPrintFilterSummary {
  busca?: string;
  especie?: AnimalEsp;
  status?: AnimalStatus;
}
