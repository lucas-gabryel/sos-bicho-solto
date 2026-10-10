import { useMutation, useQueryClient } from '@tanstack/react-query';

import { acolhedorKeys } from '@/hooks/use-acolhedores';
import { dashboardStatsKeys } from '@/hooks/use-dashboard-stats';
import { linkAnimalToAcolhedor } from '@/services/acolhedor.service';

export function useLinkAnimalToAcolhedor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ acolhedorId, animalId }: { acolhedorId: string; animalId: string }) =>
      linkAnimalToAcolhedor(acolhedorId, animalId),
    onSuccess: (_, { animalId }) => {
      queryClient.invalidateQueries({ queryKey: acolhedorKeys.all });
      queryClient.invalidateQueries({ queryKey: ['animals'] });
      queryClient.invalidateQueries({ queryKey: ['animal', animalId] });
      queryClient.invalidateQueries({ queryKey: dashboardStatsKeys.all });
    },
  });
}
