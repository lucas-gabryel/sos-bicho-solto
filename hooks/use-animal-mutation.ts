import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  createAnimal,
  updateAnimal,
  type CreateAnimalPayload,
  type UpdateAnimalPayload,
} from '@/services/animal.service';

export function useCreateAnimal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateAnimalPayload) => {
      return createAnimal(data);
    },
    onSuccess: () => {
      // Invalidate and refetch animals list
      queryClient.invalidateQueries({ queryKey: ['animals'] });
    },
  });
}

export function useUpdateAnimal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateAnimalPayload) => {
      return updateAnimal(data);
    },
    onSuccess: () => {
      // Invalidate and refetch animals list
      queryClient.invalidateQueries({ queryKey: ['animals'] });
    },
  });
}
