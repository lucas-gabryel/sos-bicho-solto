import { useMutation, useQueryClient } from '@tanstack/react-query';

import { doadorKeys } from '@/hooks/use-doadores';
import {
  createDoador,
  deleteDoador,
  type DeleteDoadorInput,
  updateDoador,
  type UpdateDoadorInput,
} from '@/services/doador.service';
import type { DoadorFormValues } from '@/types/doador';

export type UpdateDoadorMutationParams =
  | { id: string; values: DoadorFormValues }
  | UpdateDoadorInput;

export function useCreateDoador() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: DoadorFormValues) => createDoador(values),
    onSuccess: (createdDoador) => {
      queryClient.invalidateQueries({ queryKey: doadorKeys.all });
      queryClient.setQueryData(doadorKeys.detail(createdDoador.id), createdDoador);
    },
  });
}

export function useUpdateDoador() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: UpdateDoadorMutationParams) => {
      if ('values' in params) {
        return updateDoador(params.id, params.values);
      }
      return updateDoador(params);
    },
    onSuccess: (updatedDoador) => {
      queryClient.invalidateQueries({ queryKey: doadorKeys.all });
      queryClient.setQueryData(doadorKeys.detail(updatedDoador.id), updatedDoador);
    },
  });
}

export function useDeleteDoador() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: string | DeleteDoadorInput) => deleteDoador(input),
    onSuccess: (_, input) => {
      const id = typeof input === 'string' ? input : input.id;
      queryClient.invalidateQueries({ queryKey: doadorKeys.all });
      queryClient.removeQueries({ queryKey: doadorKeys.detail(id) });
    },
  });
}
