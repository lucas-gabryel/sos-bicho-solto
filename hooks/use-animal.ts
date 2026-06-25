import { useQuery } from '@tanstack/react-query';

import { getAnimalById } from '@/services/animal.service';

export function useAnimal(id?: string) {
  return useQuery({
    queryKey: ['animal', id],
    queryFn: () => getAnimalById(id as string),
    enabled: !!id,
  });
}
