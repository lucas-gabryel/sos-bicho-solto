import { useMutation, useQueryClient } from '@tanstack/react-query';

import { acolhedorKeys } from '@/hooks/use-acolhedores';
import { dashboardStatsKeys } from '@/hooks/use-dashboard-stats';
import { createAcolhedor } from '@/services/acolhedor.service';

export function useCreateAcolhedor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAcolhedor,
    onSuccess: (createdAcolhedor) => {
      queryClient.invalidateQueries({ queryKey: acolhedorKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardStatsKeys.all });
      queryClient.setQueryData(acolhedorKeys.detail(createdAcolhedor.id), createdAcolhedor);
    },
  });
}
