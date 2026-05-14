import { useMutation, useQueryClient } from '@tanstack/react-query';

import { tutorKeys } from '@/hooks/use-tutors';
import { linkAnimalToTutor } from '@/services/tutor.service';

export function useLinkAnimalToTutor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tutorId, animalId }: { tutorId: string; animalId: string }) =>
      linkAnimalToTutor(tutorId, animalId),
    onSuccess: (updatedTutor) => {
      queryClient.invalidateQueries({ queryKey: tutorKeys.all });
      queryClient.setQueryData(tutorKeys.detail(updatedTutor.id), updatedTutor);
      queryClient.invalidateQueries({ queryKey: ['animals'] });
    },
  });
}
