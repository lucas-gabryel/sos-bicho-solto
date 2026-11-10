import { keepPreviousData, useQuery } from '@tanstack/react-query';
import {
  getDoacaoById,
  getDoacoes,
  type ListDoacoesParams,
} from '@/services/doacao.service';

export const doacaoKeys = {
  all: ['doacoes'] as const,
  lists: () => [...doacaoKeys.all, 'list'] as const,
  list: (params: ListDoacoesParams = {}) => [...doacaoKeys.lists(), params] as const,
  details: () => [...doacaoKeys.all, 'detail'] as const,
  detail: (id: string) => [...doacaoKeys.details(), id] as const,
};

export function useDoacoes(params: ListDoacoesParams = {}) {
  return useQuery({
    queryKey: doacaoKeys.list(params),
    queryFn: () => getDoacoes(params),
    placeholderData: keepPreviousData,
  });
}

export function useDoacao(id: string) {
  return useQuery({
    queryKey: doacaoKeys.detail(id),
    queryFn: () => getDoacaoById(id),
    enabled: Boolean(id),
  });
}
