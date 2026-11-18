import { useMutation, useQueryClient } from '@tanstack/react-query';

import { acolhedorKeys } from '@/hooks/use-acolhedores';
import { animalKeys } from '@/hooks/use-animals';
import { dashboardStatsKeys } from '@/hooks/use-dashboard-stats';
import { undoAdocao } from '@/services/adocao.service';

export function useUndoAdocao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: undoAdocao,
    onSuccess: (_, { animalId }) => {
      // A situação do acolhedor (Tutor/Adotante) é derivada dos animais adotados vinculados.
      queryClient.invalidateQueries({ queryKey: acolhedorKeys.all });
      queryClient.invalidateQueries({ queryKey: animalKeys.all });
      queryClient.invalidateQueries({ queryKey: ['animal', animalId] });
      queryClient.invalidateQueries({ queryKey: dashboardStatsKeys.all });
    },
  });
}
