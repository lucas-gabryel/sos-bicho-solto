import { useMutation, useQueryClient } from '@tanstack/react-query';

import { dashboardStatsKeys } from '@/hooks/use-dashboard-stats';
import { updateTutor } from '@/services/tutor.service';
import type { TutorFormValues } from '@/types/tutor';
import { tutorKeys } from '@/hooks/use-tutors';

interface UpdateTutorInput {
  id: string;
  values: TutorFormValues;
}

export function useUpdateTutor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, values }: UpdateTutorInput) => updateTutor(id, values),
    onSuccess: (updatedTutor) => {
      queryClient.invalidateQueries({ queryKey: tutorKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardStatsKeys.all });
      queryClient.setQueryData(tutorKeys.detail(updatedTutor.id), updatedTutor);
    },
  });
}
