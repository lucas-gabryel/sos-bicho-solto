import { apiRequest, type RespostaPaginada } from '@/lib/api';
import type { TipoDoacao } from '@/types/doacao';
import type {
  ItemSaldoEstoque,
  MovimentacaoEstoque,
  RegistrarMovimentacaoFormValues,
  ResumoEstoqueResponse,
  TipoMovimentacaoEstoque,
} from '@/types/estoque';

export interface ListMovimentacoesParams {
  page?: number;
  limit?: number;
  busca?: string;
  tipo?: TipoMovimentacaoEstoque;
  tipoItem?: TipoDoacao;
}

function parseNumber(value?: string | number): number | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  if (typeof value === 'number') return value;
  const parsed = parseFloat(String(value).replace(/\./g, '').replace(',', '.'));
  return Number.isNaN(parsed) ? undefined : parsed;
}

export async function getResumoSaldos(): Promise<ResumoEstoqueResponse> {
  return apiRequest<ResumoEstoqueResponse>('/estoque/saldos');
}

export async function getMovimentacoes(
  params: ListMovimentacoesParams = {},
): Promise<RespostaPaginada<MovimentacaoEstoque>> {
  return apiRequest<RespostaPaginada<MovimentacaoEstoque>>('/estoque/movimentacoes', {
    query: {
      page: params.page,
      limit: params.limit,
      busca: params.busca,
      tipo: params.tipo,
      tipoItem: params.tipoItem,
    },
  });
}

export async function registrarMovimentacao(
  values: RegistrarMovimentacaoFormValues,
): Promise<MovimentacaoEstoque> {
  const parsedQtd = parseNumber(values.quantidade);
  const body = {
    tipo: values.tipo,
    tipoItem: values.tipoItem,
    descricaoItem: values.descricaoItem.trim(),
    quantidade: parsedQtd,
    unidadeMedida: values.unidadeMedida.trim().toUpperCase(),
    motivo: values.motivo.trim(),
    doacaoId: values.doacaoId || undefined,
  };

  return apiRequest<MovimentacaoEstoque>('/estoque/movimentacoes', {
    method: 'POST',
    body,
  });
}
