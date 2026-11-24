import { useMutation, useQueryClient } from '@tanstack/react-query';

import { acolhedorKeys } from '@/hooks/use-acolhedores';
import { dashboardStatsKeys } from '@/hooks/use-dashboard-stats';
import {
  type Animal,
  createAnimal,
  type CreateAnimalPayload,
  createEventoAnimal,
  type CreateEventoAnimalPayload,
  updateAnimal,
  type UpdateAnimalPayload,
} from '@/services/animal.service';

export function useCreateAnimal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateAnimalPayload) => {
      return createAnimal(data);
    },
    onSuccess: (createdAnimal) => {
      queryClient.setQueryData(['animal', createdAnimal.id], createdAnimal);
      queryClient.invalidateQueries({ queryKey: ['animals'] });
      queryClient.invalidateQueries({ queryKey: dashboardStatsKeys.all });
    },
  });
}

export function useUpdateAnimal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateAnimalPayload) => {
      return updateAnimal(data);
    },
    onSuccess: (updatedAnimal, variables) => {
      queryClient.setQueryData(['animal', updatedAnimal.id], updatedAnimal);
      queryClient.invalidateQueries({ queryKey: ['animal', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['animals'] });
      queryClient.invalidateQueries({ queryKey: dashboardStatsKeys.all });
      queryClient.invalidateQueries({ queryKey: acolhedorKeys.all });
    },
  });
}

export function useCreateEventoAnimal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateEventoAnimalPayload) => {
      return createEventoAnimal(payload);
    },
    onSuccess: (novoEvento, variables) => {
      queryClient.setQueryData<Animal | undefined>(
        ['animal', variables.animalId],
        (prev) => {
          if (!prev) {
            return prev;
          }

          const currentEventos = prev.eventos ?? [];
          const exists = currentEventos.some((ev) => ev.id === novoEvento.id);

          return {
            ...prev,
            eventos: exists ? currentEventos : [novoEvento, ...currentEventos],
          };
        },
      );

      queryClient.invalidateQueries({ queryKey: ['animal', variables.animalId] });
      queryClient.invalidateQueries({ queryKey: ['animals'] });
      queryClient.invalidateQueries({ queryKey: dashboardStatsKeys.all });
      queryClient.invalidateQueries({ queryKey: acolhedorKeys.all });
    },
  });
}
