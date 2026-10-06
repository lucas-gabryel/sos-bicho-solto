import { formatDateToPtBr } from '@/lib/tutor';
import type { Animal } from '@/services/animal.service';
import type { Tutor } from '@/types/tutor';

export type AnimalPrintCategory =
  | 'identificacao'
  | 'caracteristicas'
  | 'saude'
  | 'localizacao'
  | 'adocao';

export interface PrintSectionItem {
  label: string;
  value: string;
  fullWidth?: boolean;
}

export interface PrintSection {
  title: string;
  items: PrintSectionItem[];
}

export interface AnimalPrintFieldOption {
  id: string;
  label: string;
  category: AnimalPrintCategory;
  render: (animal: Animal, tutor?: Tutor | null) => PrintSectionItem | PrintSectionItem[];
}

export const CATEGORY_LABELS: Record<AnimalPrintCategory, string> = {
  identificacao: 'Identificação Básica',
  caracteristicas: 'Características Físicas',
  saude: 'Saúde & Cuidados',
  localizacao: 'Origem & Resgate',
  adocao: 'Status & Vinculação',
};

export function calculateAge(birthDateStr?: string): string | undefined {
  if (!birthDateStr) return undefined;

  let birth: Date;
  const match = birthDateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    const year = parseInt(match[1], 10);
    const month = parseInt(match[2], 10) - 1;
    const day = parseInt(match[3], 10);
    birth = new Date(year, month, day, 0, 0, 0, 0);
    if (birth.getFullYear() !== year || birth.getMonth() !== month || birth.getDate() !== day) {
      return undefined;
    }
  } else {
    const parsed = new Date(birthDateStr.includes('T') ? birthDateStr : `${birthDateStr}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) return undefined;
    birth = new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate(), 0, 0, 0, 0);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (birth.getTime() > today.getTime()) {
    return undefined;
  }

  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();
  const days = today.getDate() - birth.getDate();

  if (days < 0) {
    months -= 1;
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  if (years > 0) {
    const yearStr = `${years} ano${years > 1 ? 's' : ''}`;
    if (months > 0) {
      const monthStr = `${months} m${months > 1 ? 'eses' : 'ês'}`;
      return `${yearStr} e ${monthStr}`;
    }
    return yearStr;
  }

  if (months > 0) {
    return `${months} m${months > 1 ? 'eses' : 'ês'}`;
  }

  return 'Menos de 1 mês';
}

export const ANIMAL_PRINT_FIELDS: AnimalPrintFieldOption[] = [
  // Identificação
  {
    id: 'numeroRegistro',
    label: 'Número de Registro',
    category: 'identificacao',
    render: (animal) => ({ label: 'Nº de Registro', value: animal.numeroRegistro || 'Não informado' }),
  },
  {
    id: 'nome',
    label: 'Nome do Animal',
    category: 'identificacao',
    render: (animal) => ({ label: 'Nome', value: animal.nome || 'Sem nome' }),
  },
  {
    id: 'esp',
    label: 'Espécie',
    category: 'identificacao',
    render: (animal) => ({ label: 'Espécie', value: animal.esp || 'Não informada' }),
  },
  {
    id: 'raca',
    label: 'Raça',
    category: 'identificacao',
    render: (animal) => ({ label: 'Raça', value: animal.raca || 'Não informada' }),
  },
  {
    id: 'sexo',
    label: 'Sexo',
    category: 'identificacao',
    render: (animal) => ({ label: 'Sexo', value: animal.sexo || 'Não informado' }),
  },
  {
    id: 'cor',
    label: 'Cor / Pelagem',
    category: 'identificacao',
    render: (animal) => ({ label: 'Cor / Pelagem', value: animal.cor || 'Não informada' }),
  },
  {
    id: 'data',
    label: 'Data de Resgate / Cadastro',
    category: 'identificacao',
    render: (animal) => ({ label: 'Data de Resgate/Cadastro', value: animal.data || 'Não informada' }),
  },

  // Características
  {
    id: 'porte',
    label: 'Porte',
    category: 'caracteristicas',
    render: (animal) => ({ label: 'Porte', value: animal.porte || 'Não informado' }),
  },
  {
    id: 'dataNascimento',
    label: 'Data de Nascimento / Idade',
    category: 'caracteristicas',
    render: (animal) => {
      if (!animal.dataNascimento) {
        return { label: 'Data de Nascimento / Idade', value: '-' };
      }
      const formattedDate = formatDateToPtBr(animal.dataNascimento);
      if (formattedDate === '-') {
        return { label: 'Data de Nascimento / Idade', value: '-' };
      }
      const age = calculateAge(animal.dataNascimento);
      return {
        label: 'Data de Nascimento / Idade',
        value: age ? `${formattedDate} (${age})` : formattedDate,
      };
    },
  },
  {
    id: 'peso',
    label: 'Peso Inicial',
    category: 'caracteristicas',
    render: (animal) => ({
      label: 'Peso Inicial',
      value: animal.peso != null ? `${animal.peso.toFixed(1)} kg` : '-',
    }),
  },
  {
    id: 'pesoAt',
    label: 'Peso Atual',
    category: 'caracteristicas',
    render: (animal) => ({
      label: 'Peso Atual',
      value: animal.pesoAt != null ? `${animal.pesoAt.toFixed(1)} kg` : 'Não registrado',
    }),
  },

  // Saúde & Cuidados
  {
    id: 'castrado',
    label: 'Castrado',
    category: 'saude',
    render: (animal) => ({ label: 'Castrado', value: animal.castrado ? 'Sim' : 'Não' }),
  },
  {
    id: 'vacinado',
    label: 'Vacinado',
    category: 'saude',
    render: (animal) => ({ label: 'Vacinado', value: animal.vacinado ? 'Sim' : 'Não' }),
  },
  {
    id: 'obs',
    label: 'Observações de Saúde',
    category: 'saude',
    render: (animal) => ({
      label: 'Observações de Saúde',
      value: animal.obs?.trim() || 'Nenhuma observação registrada',
      fullWidth: true,
    }),
  },

  // Localização
  {
    id: 'local',
    label: 'Localidade de Resgate',
    category: 'localizacao',
    render: (animal) => ({
      label: 'Localidade de Resgate',
      value: animal.local?.trim() || 'Não informada',
      fullWidth: true,
    }),
  },

  // Status & Adoção
  {
    id: 'status',
    label: 'Status (Acolhimento / Adotado)',
    category: 'adocao',
    render: (animal) => ({ label: 'Status Atual', value: animal.status || 'Acolhimento' }),
  },
  {
    id: 'tutor',
    label: 'Dados do Tutor Responsável',
    category: 'adocao',
    render: (_animal, tutor) => {
      if (tutor) {
        return [
          { label: 'Tutor Responsável', value: tutor.nome || '-' },
          { label: 'CPF do Tutor', value: tutor.cpf || '-' },
          { label: 'Telefone', value: tutor.telefone || '-' },
          { label: 'E-mail', value: tutor.email || '-' },
          { label: 'Endereço', value: tutor.endereco || '-', fullWidth: true },
        ];
      }
      return {
        label: 'Tutor Responsável',
        value: 'Nenhum tutor vinculado (Disponível para adoção)',
        fullWidth: true,
      };
    },
  },
];

export const DEFAULT_SELECTED_FIELDS: string[] = ANIMAL_PRINT_FIELDS.map((f) => f.id);

export function getAnimalPrintSections(
  animal: Animal,
  tutor: Tutor | null | undefined,
  selectedFieldIds: string[],
): PrintSection[] {
  const selectedSet = new Set(selectedFieldIds);
  const sections: PrintSection[] = [];

  const categories: AnimalPrintCategory[] = [
    'identificacao',
    'caracteristicas',
    'saude',
    'localizacao',
    'adocao',
  ];

  for (const category of categories) {
    const fieldsInCategory = ANIMAL_PRINT_FIELDS.filter(
      (f) => f.category === category && selectedSet.has(f.id),
    );

    if (fieldsInCategory.length === 0) continue;

    const items: PrintSectionItem[] = [];
    for (const field of fieldsInCategory) {
      const rendered = field.render(animal, tutor);
      if (Array.isArray(rendered)) {
        items.push(...rendered);
      } else {
        items.push(rendered);
      }
    }

    if (items.length > 0) {
      sections.push({
        title: CATEGORY_LABELS[category],
        items,
      });
    }
  }

  return sections;
}
