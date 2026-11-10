import { keepPreviousData, useQuery } from '@tanstack/react-query';
import {
  getMovimentacoes,
  getResumoSaldos,
  type ListMovimentacoesParams,
} from '@/services/estoque.service';

export const estoqueKeys = {
  all: ['estoque'] as const,
  saldos: () => [...estoqueKeys.all, 'saldos'] as const,
  movimentacoes: () => [...estoqueKeys.all, 'movimentacoes'] as const,
  movimentacoesList: (params: ListMovimentacoesParams = {}) =>
    [...estoqueKeys.movimentacoes(), params] as const,
};

export function useResumoSaldos() {
  return useQuery({
    queryKey: estoqueKeys.saldos(),
    queryFn: () => getResumoSaldos(),
  });
}

export function useMovimentacoesEstoque(params: ListMovimentacoesParams = {}) {
  return useQuery({
    queryKey: estoqueKeys.movimentacoesList(params),
    queryFn: () => getMovimentacoes(params),
    placeholderData: keepPreviousData,
  });
}
