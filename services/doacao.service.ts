import { apiRequest, type RespostaPaginada } from '@/lib/api';
import { parseNumericInput } from '@/lib/utils';
import type { Doacao, DoacaoFormValues, TipoDoacao } from '@/types/doacao';

export interface ListDoacoesParams {
  page?: number;
  limit?: number;
  busca?: string;
  tipo?: TipoDoacao;
  doadorId?: string;
}

export async function getDoacoes(params: ListDoacoesParams = {}): Promise<RespostaPaginada<Doacao>> {
  return apiRequest<RespostaPaginada<Doacao>>('/doacoes', {
    query: {
      page: params.page,
      limit: params.limit,
      busca: params.busca,
      tipo: params.tipo,
      doadorId: params.doadorId,
    },
  });
}

export async function getDoacaoById(id: string): Promise<Doacao> {
  return apiRequest<Doacao>(`/doacoes/${id}`);
}

export async function createDoacao(values: DoacaoFormValues): Promise<Doacao> {
  const isDinheiro = values.tipo === 'DINHEIRO';
  const body = {
    tipo: values.tipo,
    anonima: values.anonima,
    doadorId: values.anonima ? undefined : values.doadorId || undefined,
    valor: isDinheiro ? parseNumericInput(values.valor) : undefined,
    quantidade: !isDinheiro ? parseNumericInput(values.quantidade) : undefined,
    unidadeMedida: !isDinheiro && values.unidadeMedida ? values.unidadeMedida.trim() : undefined,
    descricao: values.descricao ? values.descricao.trim() : undefined,
    dataRecebimento: values.dataRecebimento,
  };

  return apiRequest<Doacao>('/doacoes', {
    method: 'POST',
    body,
  });
}
