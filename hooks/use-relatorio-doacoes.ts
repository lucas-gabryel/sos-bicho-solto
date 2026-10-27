import { getRelatorioDoacoes } from '@/services/doacao.service';
import type { RelatorioDoacoesFilterParams } from '@/types/doacao';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

export const relatorioDoacaoKeys = {
  all: ['relatorio-doacoes'] as const,
  list: (params: RelatorioDoacoesFilterParams = {}) => [...relatorioDoacaoKeys.all, params] as const,
};

export function useRelatorioDoacoes(params: RelatorioDoacoesFilterParams = {}) {
  return useQuery({
    queryKey: relatorioDoacaoKeys.list(params),
    queryFn: () => getRelatorioDoacoes(params),
    placeholderData: keepPreviousData,
  });
}
