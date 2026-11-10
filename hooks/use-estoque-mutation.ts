import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { estoqueKeys } from '@/hooks/use-estoque';
import { registrarMovimentacao } from '@/services/estoque.service';
import type { RegistrarMovimentacaoFormValues } from '@/types/estoque';

export function useRegistrarMovimentacaoEstoque() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: RegistrarMovimentacaoFormValues) =>
      registrarMovimentacao(values),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: estoqueKeys.all });
      toast.success(
        data.tipo === 'SAIDA'
          ? 'Saída de estoque registrada com sucesso!'
          : 'Movimentação de estoque registrada com sucesso!',
      );
    },
    onError: (error: Error) => {
      toast.error(
        error.message || 'Erro ao registrar movimentação no estoque. Tente novamente.',
      );
    },
  });
}
