import { formatDateToPtBr } from '@/lib/tutor';
import type { Animal } from '@/services/animal.service';
import type { Tutor } from '@/types/tutor';

export interface AnimalPrintFieldOption {
  id: string;
  label: string;
  category: 'identificacao' | 'caracteristicas' | 'saude' | 'localizacao' | 'adocao';
}

export const ANIMAL_PRINT_FIELDS: AnimalPrintFieldOption[] = [
  // Identificação
  { id: 'numeroRegistro', label: 'Número de Registro', category: 'identificacao' },
  { id: 'nome', label: 'Nome do Animal', category: 'identificacao' },
  { id: 'esp', label: 'Espécie', category: 'identificacao' },
  { id: 'raca', label: 'Raça', category: 'identificacao' },
  { id: 'sexo', label: 'Sexo', category: 'identificacao' },
  { id: 'cor', label: 'Cor / Pelagem', category: 'identificacao' },
  { id: 'data', label: 'Data de Resgate / Cadastro', category: 'identificacao' },

  // Características
  { id: 'porte', label: 'Porte', category: 'caracteristicas' },
  { id: 'dataNascimento', label: 'Data de Nascimento / Idade', category: 'caracteristicas' },
  { id: 'peso', label: 'Peso Inicial', category: 'caracteristicas' },
  { id: 'pesoAt', label: 'Peso Atual', category: 'caracteristicas' },

  // Saúde & Cuidados
  { id: 'castrado', label: 'Castrado', category: 'saude' },
  { id: 'vacinado', label: 'Vacinado', category: 'saude' },
  { id: 'obs', label: 'Observações de Saúde', category: 'saude' },

  // Localização
  { id: 'local', label: 'Localidade de Resgate', category: 'localizacao' },

  // Status & Adoção
  { id: 'status', label: 'Status (Acolhimento / Adotado)', category: 'adocao' },
  { id: 'tutor', label: 'Dados do Tutor Responsável', category: 'adocao' },
];

export const CATEGORY_LABELS: Record<AnimalPrintFieldOption['category'], string> = {
  identificacao: 'Identificação Básica',
  caracteristicas: 'Características Físicas',
  saude: 'Saúde & Cuidados',
  localizacao: 'Origem & Resgate',
  adocao: 'Status & Vinculação',
};

export const DEFAULT_SELECTED_FIELDS: string[] = ANIMAL_PRINT_FIELDS.map((f) => f.id);

export function calculateAge(birthDateStr?: string): string | undefined {
  if (!birthDateStr) return undefined;
  const birth = new Date(birthDateStr);
  if (isNaN(birth.getTime())) return undefined;

  const now = new Date();
  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();

  if (months < 0 || (months === 0 && now.getDate() < birth.getDate())) {
    years--;
    months += 12;
  }

  if (years > 0) {
    return `${years} ano${years > 1 ? 's' : ''}${months > 0 ? ` e ${months} m${months > 1 ? 'eses' : 'ês'}` : ''}`;
  }
  if (months > 0) {
    return `${months} m${months > 1 ? 'eses' : 'ês'}`;
  }
  return 'Menos de 1 mês';
}

export interface PrintSectionItem {
  label: string;
  value: string;
  fullWidth?: boolean;
}

export interface PrintSection {
  title: string;
  items: PrintSectionItem[];
}

export function getAnimalPrintSections(
  animal: Animal,
  tutor: Tutor | null | undefined,
  selectedFieldIds: string[],
): PrintSection[] {
  const selectedSet = new Set(selectedFieldIds);
  const sections: PrintSection[] = [];

  // Identificação
  const identItems: PrintSectionItem[] = [];
  if (selectedSet.has('numeroRegistro')) {
    identItems.push({ label: 'Nº de Registro', value: animal.numeroRegistro || 'Não informado' });
  }
  if (selectedSet.has('nome')) {
    identItems.push({ label: 'Nome', value: animal.nome || 'Sem nome' });
  }
  if (selectedSet.has('esp')) {
    identItems.push({ label: 'Espécie', value: animal.esp || 'Não informada' });
  }
  if (selectedSet.has('raca')) {
    identItems.push({ label: 'Raça', value: animal.raca || 'Não informada' });
  }
  if (selectedSet.has('sexo')) {
    identItems.push({ label: 'Sexo', value: animal.sexo || 'Não informado' });
  }
  if (selectedSet.has('cor')) {
    identItems.push({ label: 'Cor / Pelagem', value: animal.cor || 'Não informada' });
  }
  if (selectedSet.has('data')) {
    identItems.push({ label: 'Data de Resgate/Cadastro', value: animal.data || 'Não informada' });
  }
  if (identItems.length > 0) {
    sections.push({ title: 'Identificação Básica', items: identItems });
  }

  // Características
  const caracItems: PrintSectionItem[] = [];
  if (selectedSet.has('porte')) {
    caracItems.push({ label: 'Porte', value: animal.porte || 'Não informado' });
  }
  if (selectedSet.has('dataNascimento')) {
    const age = calculateAge(animal.dataNascimento);
    const formattedDate = animal.dataNascimento ? formatDateToPtBr(animal.dataNascimento) : 'Não informada';
    caracItems.push({
      label: 'Data de Nascimento / Idade',
      value: animal.dataNascimento ? `${formattedDate} (${age})` : 'Não informada',
    });
  }
  if (selectedSet.has('peso')) {
    caracItems.push({ label: 'Peso Inicial', value: `${animal.peso.toFixed(1)} kg` });
  }
  if (selectedSet.has('pesoAt')) {
    caracItems.push({
      label: 'Peso Atual',
      value: animal.pesoAt != null ? `${animal.pesoAt.toFixed(1)} kg` : 'Não registrado',
    });
  }
  if (caracItems.length > 0) {
    sections.push({ title: 'Características Físicas', items: caracItems });
  }

  // Saúde
  const saudeItems: PrintSectionItem[] = [];
  if (selectedSet.has('castrado')) {
    saudeItems.push({ label: 'Castrado', value: animal.castrado ? 'Sim' : 'Não' });
  }
  if (selectedSet.has('vacinado')) {
    saudeItems.push({ label: 'Vacinado', value: animal.vacinado ? 'Sim' : 'Não' });
  }
  if (selectedSet.has('obs')) {
    saudeItems.push({
      label: 'Observações de Saúde',
      value: animal.obs?.trim() || 'Nenhuma observação registrada',
      fullWidth: true,
    });
  }
  if (saudeItems.length > 0) {
    sections.push({ title: 'Saúde & Cuidados', items: saudeItems });
  }

  // Localização
  const locItems: PrintSectionItem[] = [];
  if (selectedSet.has('local')) {
    locItems.push({
      label: 'Localidade de Resgate',
      value: animal.local || 'Não informada',
      fullWidth: true,
    });
  }
  if (locItems.length > 0) {
    sections.push({ title: 'Origem & Localização', items: locItems });
  }

  // Adoção & Tutor
  const adocaoItems: PrintSectionItem[] = [];
  if (selectedSet.has('status')) {
    adocaoItems.push({ label: 'Status Atual', value: animal.status || 'Acolhimento' });
  }
  if (selectedSet.has('tutor')) {
    if (tutor) {
      adocaoItems.push({ label: 'Tutor Responsável', value: tutor.nome });
      adocaoItems.push({ label: 'CPF do Tutor', value: tutor.cpf });
      adocaoItems.push({ label: 'Telefone', value: tutor.telefone });
      adocaoItems.push({ label: 'E-mail', value: tutor.email });
      adocaoItems.push({ label: 'Endereço', value: tutor.endereco, fullWidth: true });
    } else {
      adocaoItems.push({
        label: 'Tutor Responsável',
        value: 'Nenhum tutor vinculado (Disponível para adoção)',
        fullWidth: true,
      });
    }
  }
  if (adocaoItems.length > 0) {
    sections.push({ title: 'Situação de Adoção & Tutor', items: adocaoItems });
  }

  return sections;
}
