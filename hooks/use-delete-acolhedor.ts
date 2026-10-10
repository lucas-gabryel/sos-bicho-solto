import { useMutation, useQueryClient } from '@tanstack/react-query';

import { acolhedorKeys } from '@/hooks/use-acolhedores';
import { dashboardStatsKeys } from '@/hooks/use-dashboard-stats';
import { deleteAcolhedor } from '@/services/acolhedor.service';

export function useDeleteAcolhedor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAcolhedor,
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: acolhedorKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardStatsKeys.all });
      queryClient.removeQueries({ queryKey: acolhedorKeys.detail(id) });
    },
  });
}
