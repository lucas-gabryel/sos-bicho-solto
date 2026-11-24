import { apiRequest, type RespostaPaginada } from '@/lib/api';
import { parseNumericInput } from '@/lib/utils';
import type {
  DirecaoDoacao,
  Doacao,
  DoacaoFormValues,
  RelatorioDoacoesData,
  TipoDoacao,
} from '@/types/doacao';

export interface ListDoacoesParams {
  page?: number;
  limit?: number;
  busca?: string;
  tipo?: TipoDoacao;
  direcao?: DirecaoDoacao;
  doadorId?: string;
}

export interface RelatorioDoacoesParams {
  dataInicio?: string;
  dataFim?: string;
  tipo?: TipoDoacao;
  direcao?: DirecaoDoacao;
}

export async function getDoacoes(params: ListDoacoesParams = {}): Promise<RespostaPaginada<Doacao>> {
  return apiRequest<RespostaPaginada<Doacao>>('/doacoes', {
    query: {
      page: params.page,
      limit: params.limit,
      busca: params.busca,
      tipo: params.tipo,
      direcao: params.direcao,
      doadorId: params.doadorId,
    },
  });
}

export async function getDoacaoById(id: string): Promise<Doacao> {
  return apiRequest<Doacao>(`/doacoes/${id}`);
}

export async function uploadDocumentoDoacao(
  file: File,
): Promise<{ documentoUrl: string; documentoNome: string; documentoTipo: string }> {
  const formData = new FormData();
  formData.append('documento', file);

  return apiRequest<{ documentoUrl: string; documentoNome: string; documentoTipo: string }>(
    '/doacoes/upload-documento',
    {
      method: 'POST',
      body: formData,
    },
  );
}

export async function createDoacao(values: DoacaoFormValues): Promise<Doacao> {
  const isDinheiro = values.tipo === 'DINHEIRO';
  const isRecebida = values.direcao === 'RECEBIDA';

  const body = {
    tipo: values.tipo,
    direcao: values.direcao,
    beneficiario: !isRecebida ? values.beneficiario?.trim() || undefined : undefined,
    anonima: isRecebida ? values.anonima : false,
    doadorId: isRecebida && !values.anonima ? values.doadorId || undefined : undefined,
    valor: isDinheiro ? parseNumericInput(values.valor) : undefined,
    quantidade: !isDinheiro ? parseNumericInput(values.quantidade) : undefined,
    unidadeMedida: !isDinheiro && values.unidadeMedida ? values.unidadeMedida.trim() : undefined,
    descricao: values.descricao ? values.descricao.trim() : undefined,
    dataRecebimento: values.dataRecebimento,
    documentoUrl: values.documentoUrl || undefined,
    documentoNome: values.documentoNome || undefined,
    documentoTipo: values.documentoTipo || undefined,
  };

  return apiRequest<Doacao>('/doacoes', {
    method: 'POST',
    body,
  });
}

export async function getRelatorioDoacoes(params: RelatorioDoacoesParams = {}): Promise<RelatorioDoacoesData> {
  return apiRequest<RelatorioDoacoesData>('/doacoes/relatorio', {
    query: {
      dataInicio: params.dataInicio,
      dataFim: params.dataFim,
      tipo: params.tipo,
      direcao: params.direcao,
    },
  });
}
