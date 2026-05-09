import { useQuery } from '@tanstack/react-query';

import { getAnimals } from '@/services/animal.service';

export function useAnimals() {
  return useQuery({
    queryKey: ['animals'],
    queryFn: getAnimals,
  });
}
