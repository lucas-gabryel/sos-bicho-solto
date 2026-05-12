import { useMutation, useQueryClient } from '@tanstack/react-query';

import { dashboardStatsKeys } from '@/hooks/use-dashboard-stats';
import { createTutor } from '@/services/tutor.service';
import { tutorKeys } from '@/hooks/use-tutors';

export function useCreateTutor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTutor,
    onSuccess: (createdTutor) => {
      queryClient.invalidateQueries({ queryKey: tutorKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardStatsKeys.all });
      queryClient.setQueryData(tutorKeys.detail(createdTutor.id), createdTutor);
    },
  });
}
