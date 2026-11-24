import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { baixarRelatorio, type FiltrosRelatorio, type TipoRelatorio } from '@/services/relatorio.service';

export function useGerarRelatorio() {
  return useMutation({
    mutationFn: ({ tipo, filtros }: { tipo: TipoRelatorio; filtros: FiltrosRelatorio }) =>
      baixarRelatorio(tipo, filtros),
    onSuccess: () => {
      toast.success('Relatório gerado com sucesso!');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Não foi possível gerar o relatório.');
    },
  });
}
