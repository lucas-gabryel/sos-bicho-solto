import { useMutation, useQueryClient } from '@tanstack/react-query';

import { acolhedorKeys } from '@/hooks/use-acolhedores';
import { dashboardStatsKeys } from '@/hooks/use-dashboard-stats';
import { linkAnimalToAcolhedor } from '@/services/acolhedor.service';

export function useLinkAnimalToAcolhedor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ acolhedorId, animalId }: { acolhedorId: string; animalId: string }) =>
      linkAnimalToAcolhedor(acolhedorId, animalId),
    onSuccess: (updatedAcolhedor, { animalId }) => {
      queryClient.setQueryData(acolhedorKeys.detail(updatedAcolhedor.id), updatedAcolhedor);
      queryClient.invalidateQueries({ queryKey: acolhedorKeys.all });
      queryClient.invalidateQueries({ queryKey: ['acolhedor-animals'] });
      queryClient.invalidateQueries({ queryKey: ['animals'] });
      queryClient.invalidateQueries({ queryKey: ['animal', animalId] });
      queryClient.invalidateQueries({ queryKey: dashboardStatsKeys.all });
    },
  });
}
