import { useQuery } from '@tanstack/react-query';

import { getAnimalsByTutor } from '@/services/animal.service';

export function useTutorAnimals(tutorId: string) {
  return useQuery({
    queryKey: ['tutor-animals', tutorId],
    queryFn: () => getAnimalsByTutor(tutorId),
    enabled: Boolean(tutorId),
  });
}
