import { formatDateToPtBr, getAge } from '@/lib/date';
import type { Animal } from '@/services/animal.service';
import type { Acolhedor } from '@/types/acolhedor';

export type AcolhedorPrintCategory =
  | 'identificacao'
  | 'contato'
  | 'vinculo'
  | 'animais'
  | 'termo';

export interface PrintSectionItem {
  label: string;
  value: string;
  fullWidth?: boolean;
}

export interface PrintSection {
  title: string;
  items: PrintSectionItem[];
}

export interface AcolhedorPrintFieldOption {
  id: string;
  label: string;
  category: AcolhedorPrintCategory;
  render: (acolhedor: Acolhedor, animais?: Animal[]) => PrintSectionItem | PrintSectionItem[];
}

export const ACOLHEDOR_CATEGORY_LABELS: Record<AcolhedorPrintCategory, string> = {
  identificacao: 'Dados Pessoais',
  contato: 'Contato & Endereço',
  vinculo: 'Vínculo Cadastral',
  animais: 'Animais Vinculados',
  termo: 'Termo de Responsabilidade',
};

export const ACOLHEDOR_PRINT_FIELDS: AcolhedorPrintFieldOption[] = [
  // Identificação
  {
    id: 'codigo',
    label: 'Código do Acolhedor',
    category: 'identificacao',
    render: (acolhedor) => ({
      label: 'Código',
      value: acolhedor.codigo != null ? `#${acolhedor.codigo}` : 'Não informado',
    }),
  },
  {
    id: 'nome',
    label: 'Nome Completo',
    category: 'identificacao',
    render: (acolhedor) => ({
      label: 'Nome Completo',
      value: acolhedor.nome || 'Não informado',
    }),
  },
  {
    id: 'cpf',
    label: 'CPF',
    category: 'identificacao',
    render: (acolhedor) => ({
      label: 'CPF',
      value: acolhedor.cpf || 'Não informado',
    }),
  },
  {
    id: 'dataNascimento',
    label: 'Data de Nascimento / Idade',
    category: 'identificacao',
    render: (acolhedor) => {
      if (!acolhedor.dataNascimento) {
        return { label: 'Data de Nascimento / Idade', value: '-' };
      }
      const formatted = formatDateToPtBr(acolhedor.dataNascimento);
      const age = getAge(acolhedor.dataNascimento);
      return {
        label: 'Data de Nascimento / Idade',
        value: age !== null ? `${formatted} (${age} anos)` : formatted,
      };
    },
  },

  // Contato
  {
    id: 'telefone',
    label: 'Telefone de Contato',
    category: 'contato',
    render: (acolhedor) => ({
      label: 'Telefone',
      value: acolhedor.telefone || 'Não informado',
    }),
  },
  {
    id: 'email',
    label: 'E-mail',
    category: 'contato',
    render: (acolhedor) => ({
      label: 'E-mail',
      value: acolhedor.email || 'Não informado',
    }),
  },
  {
    id: 'endereco',
    label: 'Endereço Completo',
    category: 'contato',
    render: (acolhedor) => ({
      label: 'Endereço Completo',
      value: acolhedor.endereco || 'Não informado',
      fullWidth: true,
    }),
  },

  // Vínculo
  {
    id: 'situacao',
    label: 'Situação (Adotante / Tutor)',
    category: 'vinculo',
    render: (acolhedor) => ({
      label: 'Classificação Cadastral',
      value: acolhedor.situacao === 'ADOTANTE' ? 'Adotante' : 'Tutor',
    }),
  },
  {
    id: 'totalAnimais',
    label: 'Total de Animais Vinculados',
    category: 'vinculo',
    render: (acolhedor, animais) => {
      const count = animais ? animais.length : acolhedor.totalAnimaisAdotados;
      return {
        label: 'Total de Animais Vinculados',
        value: `${count} ${count === 1 ? 'animal' : 'animais'}`,
      };
    },
  },

  // Animais Vinculados
  {
    id: 'animais',
    label: 'Relação de Animais Adotados / Sob Guarda',
    category: 'animais',
    render: (_acolhedor, animais) => {
      if (!animais || animais.length === 0) {
        return {
          label: 'Animais Registrados',
          value: 'Nenhum animal vinculado no momento.',
          fullWidth: true,
        };
      }
      return animais.map((animal) => ({
        label: `Animal: ${animal.nome} (${animal.numeroRegistro})`,
        value: `${animal.esp} · ${animal.raca} · ${animal.sexo} · ${animal.cor} · Status: ${animal.status}`,
        fullWidth: true,
      }));
    },
  },

  // Termo de Responsabilidade
  {
    id: 'termo',
    label: 'Termo de Declaração e Guarda Responsável',
    category: 'termo',
    render: () => ({
      label: 'Declaração de Posse Responsável',
      value:
        'Declaro assumir total responsabilidade pela guarda, alimentação, vacinação, assistência veterinária e bem-estar dos animais vinculados, comprometendo-me a nunca praticar abandono ou maus-tratos, conforme a Lei Federal nº 9.605/1998 (Crimes Ambientais).',
      fullWidth: true,
    }),
  },
];

export const DEFAULT_ACOLHEDOR_PRINT_FIELDS: string[] = ACOLHEDOR_PRINT_FIELDS.map((f) => f.id);

export function getAcolhedorPrintSections(
  acolhedor: Acolhedor,
  animais: Animal[] | undefined,
  selectedFieldIds: string[],
): PrintSection[] {
  const selectedSet = new Set(selectedFieldIds);
  const sections: PrintSection[] = [];

  const categories: AcolhedorPrintCategory[] = [
    'identificacao',
    'contato',
    'vinculo',
    'animais',
    'termo',
  ];

  for (const category of categories) {
    const fieldsInCategory = ACOLHEDOR_PRINT_FIELDS.filter(
      (f) => f.category === category && selectedSet.has(f.id),
    );

    if (fieldsInCategory.length === 0) continue;

    const items: PrintSectionItem[] = [];
    for (const field of fieldsInCategory) {
      const rendered = field.render(acolhedor, animais);
      if (Array.isArray(rendered)) {
        items.push(...rendered);
      } else {
        items.push(rendered);
      }
    }

    if (items.length > 0) {
      sections.push({
        title: ACOLHEDOR_CATEGORY_LABELS[category],
        items,
      });
    }
  }

  return sections;
}
