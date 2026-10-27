export type TipoDoacao = 'DINHEIRO' | 'RACAO' | 'MEDICAMENTO' | 'PRODUTO_LIMPEZA' | 'OUTRO';

export const TIPO_DOACAO_LABELS: Record<TipoDoacao, string> = {
  DINHEIRO: 'Dinheiro',
  RACAO: 'Ração',
  MEDICAMENTO: 'Medicamentos',
  PRODUTO_LIMPEZA: 'Produtos de Limpeza',
  OUTRO: 'Outros',
};

export interface DoadorVinculado {
  id: string;
  nome: string;
  cpfCnpj: string;
}

export interface RegistradorVinculado {
  id: string;
  nome: string;
}

export interface Doacao {
  id: string;
  tipo: TipoDoacao;
  valor?: number | null;
  quantidade?: number | null;
  unidadeMedida?: string | null;
  descricao?: string | null;
  dataRecebimento: string;
  doadorId?: string | null;
  anonima: boolean;
  doador?: DoadorVinculado | null;
  registradoPor?: RegistradorVinculado | null;
  criadoEm: string;
  modificadoEm: string;
}

export interface DoacaoFormValues {
  tipo: TipoDoacao;
  anonima: boolean;
  doadorId?: string;
  valor?: number | string;
  quantidade?: number | string;
  unidadeMedida?: string;
  descricao?: string;
  dataRecebimento: string;
}

export interface RelatorioDoacoesFilterParams {
  dataInicio?: string;
  dataFim?: string;
  tipo?: TipoDoacao | '';
}

export interface ItemAgrupadoRelatorio {
  tipo: TipoDoacao;
  tipoLabel: string;
  quantidadeTotal: number;
  unidadeMedida?: string | null;
}

export interface ResumoRelatorio {
  totalDinheiro: number;
  totalDinheiroFormatado: string;
  itensAgrupados: ItemAgrupadoRelatorio[];
  totalRegistros: number;
}

export interface FiltrosRelatorio {
  dataInicio?: string | null;
  dataFim?: string | null;
  tipo?: TipoDoacao | null;
}

export interface RelatorioDoacoesResponse {
  resumo: ResumoRelatorio;
  filtros: FiltrosRelatorio;
  doacoes: Doacao[];
  geradoEm: string;
}
