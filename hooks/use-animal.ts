import { useQuery } from '@tanstack/react-query';

import { getAnimals } from '@/services/animal.service';

export function useAnimal(id?: string) {
  return useQuery({
    queryKey: ['animal', id],
    queryFn: async () => {
      if (!id) return undefined;
      const animals = await getAnimals();
      return animals.find((a) => a.id === id);
    },
    enabled: !!id,
  });
}
