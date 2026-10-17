import { keepPreviousData, useQuery } from '@tanstack/react-query';

import {
  getDoadorById,
  getDoadores,
  type ListDoadoresParams,
} from '@/services/doador.service';

export const doadorKeys = {
  all: ['doadores'] as const,
  lists: () => [...doadorKeys.all, 'list'] as const,
  list: (params: ListDoadoresParams = {}) => [...doadorKeys.lists(), params] as const,
  details: () => [...doadorKeys.all, 'detail'] as const,
  detail: (id: string) => [...doadorKeys.details(), id] as const,
};

export function useDoadores(params: ListDoadoresParams = {}) {
  return useQuery({
    queryKey: doadorKeys.list(params),
    queryFn: () => getDoadores(params),
    placeholderData: keepPreviousData,
  });
}

export function useDoador(id: string) {
  return useQuery({
    queryKey: doadorKeys.detail(id),
    queryFn: () => getDoadorById(id),
    enabled: Boolean(id),
  });
}
