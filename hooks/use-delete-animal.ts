import { useMutation, useQueryClient } from '@tanstack/react-query';

import { acolhedorKeys } from '@/hooks/use-acolhedores';
import { dashboardStatsKeys } from '@/hooks/use-dashboard-stats';
import { deleteAnimal } from '@/services/animal.service';

export function useDeleteAnimal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAnimal,
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['animals'] });
      // A situação do acolhedor (Tutor/Adotante) depende dos animais ativos vinculados.
      queryClient.invalidateQueries({ queryKey: acolhedorKeys.all });
      queryClient.invalidateQueries({ queryKey: ['acolhedor-animals'] });
      queryClient.invalidateQueries({ queryKey: dashboardStatsKeys.all });
      queryClient.removeQueries({ queryKey: ['animal', id] });
    },
  });
}
