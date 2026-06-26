import { useMutation, useQueryClient } from '@tanstack/react-query';

import { dashboardStatsKeys } from '@/hooks/use-dashboard-stats';
import { deleteAnimal } from '@/services/animal.service';

export function useDeleteAnimal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAnimal,
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['animals'] });
      queryClient.invalidateQueries({ queryKey: dashboardStatsKeys.all });
      queryClient.removeQueries({ queryKey: ['animal', id] });
    },
  });
}
