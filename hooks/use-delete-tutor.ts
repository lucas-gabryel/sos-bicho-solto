import { useMutation, useQueryClient } from '@tanstack/react-query';

import { dashboardStatsKeys } from '@/hooks/use-dashboard-stats';
import { deleteTutor } from '@/services/tutor.service';
import { tutorKeys } from '@/hooks/use-tutors';

export function useDeleteTutor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTutor,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: tutorKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardStatsKeys.all });
      queryClient.removeQueries({ queryKey: tutorKeys.detail(id) });
    },
  });
}
