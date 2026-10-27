import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { doacaoKeys } from '@/hooks/use-doacoes';
import { createDoacao } from '@/services/doacao.service';
import type { DoacaoFormValues } from '@/types/doacao';

export function useCreateDoacao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: DoacaoFormValues) => createDoacao(values),
    onSuccess: (createdDoacao) => {
      queryClient.invalidateQueries({ queryKey: doacaoKeys.all });
      queryClient.setQueryData(doacaoKeys.detail(createdDoacao.id), createdDoacao);
      toast.success('Doação registrada com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao registrar doação. Tente novamente.');
    },
  });
}
