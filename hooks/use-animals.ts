import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { getAnimals, getRecentAnimals, type ListAnimalsParams } from '@/services/animal.service';

export const animalKeys = {
  all: ['animals'] as const,
  list: (params: ListAnimalsParams) => ['animals', 'list', params] as const,
  recent: (limit: number) => ['animals', 'recent', limit] as const,
};

export function useAnimals(params: ListAnimalsParams = {}) {
  return useQuery({
    queryKey: animalKeys.list(params),
    queryFn: () => getAnimals(params),
    placeholderData: keepPreviousData,
  });
}

export function useRecentAnimals(limit = 5) {
  return useQuery({
    queryKey: animalKeys.recent(limit),
    queryFn: () => getRecentAnimals(limit),
  });
}
