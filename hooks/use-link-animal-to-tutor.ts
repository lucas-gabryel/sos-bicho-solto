import { useMutation, useQueryClient } from '@tanstack/react-query';

import { dashboardStatsKeys } from '@/hooks/use-dashboard-stats';
import { tutorKeys } from '@/hooks/use-tutors';
import { linkAnimalToTutor } from '@/services/tutor.service';

export function useLinkAnimalToTutor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tutorId, animalId }: { tutorId: string; animalId: string }) =>
      linkAnimalToTutor(tutorId, animalId),
    onSuccess: (updatedTutor, { animalId }) => {
      queryClient.setQueryData(tutorKeys.detail(updatedTutor.id), updatedTutor);
      queryClient.invalidateQueries({ queryKey: tutorKeys.all });
      queryClient.invalidateQueries({ queryKey: ['tutor-animals'] });
      queryClient.invalidateQueries({ queryKey: ['animals'] });
      queryClient.invalidateQueries({ queryKey: ['animal', animalId] });
      queryClient.invalidateQueries({ queryKey: dashboardStatsKeys.all });
    },
  });
}
