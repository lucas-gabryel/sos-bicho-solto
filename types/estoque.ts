import { TipoDoacao } from './doacao';

export type TipoMovimentacaoEstoque = 'ENTRADA' | 'SAIDA' | 'AJUSTE';

export const TIPO_MOVIMENTACAO_LABELS: Record<TipoMovimentacaoEstoque, string> = {
  ENTRADA: 'Entrada',
  SAIDA: 'Saída / Consumo',
  AJUSTE: 'Ajuste de Saldo',
};

export interface MovimentacaoEstoque {
  id: string;
  tipo: TipoMovimentacaoEstoque;
  tipoItem: TipoDoacao;
  descricaoItem: string;
  quantidade: number;
  unidadeMedida: string;
  motivo: string;
  dataMovimento: string;
  doacaoId?: string | null;
  registradoPorId?: string | null;
  registradoPorNome?: string | null;
  criadoEm: string;
}

export interface ItemSaldoEstoque {
  chave: string;
  tipoItem: TipoDoacao;
  descricaoItem: string;
  unidadeMedida: string;
  totalEntradas: number;
  totalSaidas: number;
  saldoAtual: number;
  status: 'ADEQUADO' | 'BAIXO' | 'ZERADO';
  ultimaMovimentacaoEm: string;
}

export interface ResumoEstoqueResponse {
  itens: ItemSaldoEstoque[];
  totalItensDiferentes: number;
  totalItensZerados: number;
  totalItensBaixos: number;
}

export interface RegistrarMovimentacaoFormValues {
  tipo: TipoMovimentacaoEstoque;
  tipoItem: TipoDoacao;
  descricaoItem: string;
  quantidade: number | string;
  unidadeMedida: string;
  motivo: string;
  doacaoId?: string;
}
