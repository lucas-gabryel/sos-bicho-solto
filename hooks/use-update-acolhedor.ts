import { useMutation, useQueryClient } from '@tanstack/react-query';

import { acolhedorKeys } from '@/hooks/use-acolhedores';
import { dashboardStatsKeys } from '@/hooks/use-dashboard-stats';
import { updateAcolhedor } from '@/services/acolhedor.service';
import type { AcolhedorFormValues } from '@/types/acolhedor';

interface UpdateAcolhedorInput {
  id: string;
  values: AcolhedorFormValues;
}

export function useUpdateAcolhedor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, values }: UpdateAcolhedorInput) => updateAcolhedor(id, values),
    onSuccess: (updatedAcolhedor) => {
      queryClient.invalidateQueries({ queryKey: acolhedorKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardStatsKeys.all });
      queryClient.setQueryData(acolhedorKeys.detail(updatedAcolhedor.id), updatedAcolhedor);
    },
  });
}
