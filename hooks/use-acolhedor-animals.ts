import { useQuery } from '@tanstack/react-query';

import { acolhedorKeys } from '@/hooks/use-acolhedores';
import { getAnimalsByTutor } from '@/services/animal.service';

export function useAcolhedorAnimals(acolhedorId: string) {
  return useQuery({
    queryKey: acolhedorKeys.animals(acolhedorId),
    queryFn: () => getAnimalsByTutor(acolhedorId),
    enabled: Boolean(acolhedorId),
  });
}
