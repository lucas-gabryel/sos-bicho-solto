export type StatusAnimal = 'ACOLHIMENTO' | 'ADOTADO' | 'TRANSFERIDO' | 'OBITO';
export type AnimalStatus = 'Acolhimento' | 'Adotado' | 'Transferido' | 'Óbito';

export type TipoEventoAnimal = 'ENTRADA' | 'SAIDA' | 'MEDICO' | 'FOTO' | 'OUTRO';
export type MotivoSaidaAnimal = 'ADOCAO' | 'TRANSFERENCIA' | 'OBITO';

export const TIPO_EVENTO_LABELS: Record<TipoEventoAnimal, string> = {
  ENTRADA: 'Entrada',
  SAIDA: 'Saída',
  MEDICO: 'Médico',
  FOTO: 'Foto',
  OUTRO: 'Outro',
};

export const MOTIVO_SAIDA_LABELS: Record<MotivoSaidaAnimal, string> = {
  ADOCAO: 'Adoção',
  TRANSFERENCIA: 'Transferência',
  OBITO: 'Óbito',
};

export interface EventoAnimal {
  id: string;
  animalId: string;
  tipo: TipoEventoAnimal;
  motivoSaida: MotivoSaidaAnimal | null;
  descricao: string;
  data: string; // ISO date-time
  dataEvento: string; // mesmo valor de `data`
  documentoUrl: string | null;
  documentoNome: string | null;
  documentoTipo: string | null; // ex.: 'application/pdf', 'image/png'
  automatico: boolean;
  criadoEm: string;
  criadoPor: {
    id: string;
    nome: string;
    email: string;
  } | null;
}
