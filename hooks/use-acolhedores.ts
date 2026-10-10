import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { getAcolhedores, type ListAcolhedoresParams } from '@/services/acolhedor.service';

export const acolhedorKeys = {
  all: ['acolhedores'] as const,
  list: (params: ListAcolhedoresParams) => ['acolhedores', 'list', params] as const,
  detail: (id: string) => ['acolhedores', id] as const,
  animals: (id: string) => ['acolhedores', id, 'animals'] as const,
};

export function useAcolhedores(params: ListAcolhedoresParams = {}) {
  return useQuery({
    queryKey: acolhedorKeys.list(params),
    queryFn: () => getAcolhedores(params),
    placeholderData: keepPreviousData,
  });
}
