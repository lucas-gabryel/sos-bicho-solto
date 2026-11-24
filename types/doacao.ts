export type TipoDoacao =
  | 'DINHEIRO'
  | 'RACAO'
  | 'MEDICAMENTO'
  | 'PRODUTO_LIMPEZA'
  | 'OUTRO';

export type DirecaoDoacao = 'RECEBIDA' | 'REALIZADA';

export const TIPO_DOACAO_LABELS: Record<TipoDoacao, string> = {
  DINHEIRO: 'Dinheiro',
  RACAO: 'Ração',
  MEDICAMENTO: 'Medicamentos',
  PRODUTO_LIMPEZA: 'Produtos de Limpeza',
  OUTRO: 'Outros',
};

export const DIRECAO_DOACAO_LABELS: Record<DirecaoDoacao, string> = {
  RECEBIDA: 'Doação Recebida',
  REALIZADA: 'Doação Feita pela ONG',
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
  direcao: DirecaoDoacao;
  beneficiario?: string | null;
  valor?: number | null;
  quantidade?: number | null;
  unidadeMedida?: string | null;
  descricao?: string | null;
  dataRecebimento: string;
  doadorId?: string | null;
  anonima: boolean;
  documentoUrl?: string | null;
  documentoNome?: string | null;
  documentoTipo?: string | null;
  doador?: DoadorVinculado | null;
  registradoPor?: RegistradorVinculado | null;
  criadoEm: string;
  modificadoEm: string;
}

export interface DoacaoFormValues {
  direcao: DirecaoDoacao;
  tipo: TipoDoacao;
  anonima: boolean;
  doadorId?: string;
  beneficiario?: string;
  valor?: number | string;
  quantidade?: number | string;
  unidadeMedida?: string;
  descricao?: string;
  dataRecebimento: string;
  documentoUrl?: string;
  documentoNome?: string;
  documentoTipo?: string;
}

export interface ItemAgrupadoRelatorio {
  tipo: TipoDoacao;
  tipoLabel: string;
  quantidadeTotal: number;
  unidadeMedida?: string | null;
}

export interface RelatorioDoacoesResumo {
  totalDinheiro: number;
  totalDinheiroFormatado: string;
  totalDinheiroRealizado: number;
  totalDinheiroRealizadoFormatado: string;
  itensAgrupados: ItemAgrupadoRelatorio[];
  itensRealizadosAgrupados: ItemAgrupadoRelatorio[];
  totalRegistros: number;
  totalRecebidas: number;
  totalRealizadas: number;
}

export interface RelatorioDoacoesData {
  resumo: RelatorioDoacoesResumo;
  filtros: {
    dataInicio?: string | null;
    dataFim?: string | null;
    tipo?: TipoDoacao | null;
    direcao?: DirecaoDoacao | null;
  };
  dataGeracao: string;
  itens: Doacao[];
}
