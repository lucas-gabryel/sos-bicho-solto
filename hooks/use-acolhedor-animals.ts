import { useQuery } from '@tanstack/react-query';

import { getAnimalsByTutor } from '@/services/animal.service';

export function useAcolhedorAnimals(acolhedorId: string) {
  return useQuery({
    queryKey: ['acolhedor-animals', acolhedorId],
    queryFn: () => getAnimalsByTutor(acolhedorId),
    enabled: Boolean(acolhedorId),
  });
}
