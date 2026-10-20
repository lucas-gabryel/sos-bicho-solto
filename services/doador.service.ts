import { apiRequest, type RespostaPaginada } from '@/lib/api';
import { formatCpfCnpj } from '@/lib/documentos';
import type { Doador, DoadorFormValues } from '@/types/doador';

export interface DoadorApi {
  id: string;
  codigo?: number;
  nome: string;
  cpfCnpj?: string;
  cpf_cnpj?: string;
  documento?: string;
  cpf?: string;
  cnpj?: string;
  telefone: string;
  email: string;
  endereco: string;
  criadoEm?: string;
  modificadoEm?: string;
  createdAt?: string;
  updatedAt?: string;
}

export function mapDoador(api: DoadorApi): Doador {
  const doc = api.cpfCnpj ?? api.cpf_cnpj ?? api.documento ?? api.cpf ?? api.cnpj ?? '';

  return {
    id: api.id,
    codigo: api.codigo,
    nome: api.nome,
    cpfCnpj: formatCpfCnpj(doc),
    telefone: api.telefone,
    email: api.email,
    endereco: api.endereco,
    criadoEm: api.criadoEm ?? api.createdAt,
    modificadoEm: api.modificadoEm ?? api.updatedAt,
  };
}

export function normalizeDoadorValues(values: DoadorFormValues): DoadorFormValues {
  return {
    nome: values.nome.trim(),
    cpfCnpj: formatCpfCnpj(values.cpfCnpj),
    telefone: values.telefone.trim(),
    email: values.email.trim().toLowerCase(),
    endereco: values.endereco.trim(),
  };
}

function toRequestBody(values: DoadorFormValues) {
  const normalized = normalizeDoadorValues(values);

  return {
    nome: normalized.nome,
    cpfCnpj: normalized.cpfCnpj,
    telefone: normalized.telefone,
    email: normalized.email,
    endereco: normalized.endereco,
  };
}

export interface ListDoadoresParams {
  page?: number;
  limit?: number;
  busca?: string;
}

export async function getDoadores(params: ListDoadoresParams = {}): Promise<RespostaPaginada<Doador>> {
  const response = await apiRequest<RespostaPaginada<DoadorApi> | DoadorApi[]>('/doadores', {
    query: {
      page: params.page,
      limit: params.limit,
      busca: params.busca,
    },
  });

  if (Array.isArray(response)) {
    return {
      data: response.map(mapDoador),
      meta: {
        page: params.page ?? 1,
        limit: params.limit ?? response.length,
        total: response.length,
        totalPages: 1,
      },
    };
  }

  return {
    data: (response.data ?? []).map(mapDoador),
    meta: response.meta ?? {
      page: params.page ?? 1,
      limit: params.limit ?? (response.data?.length || 0),
      total: response.data?.length || 0,
      totalPages: 1,
    },
  };
}

export async function getDoadorById(id: string): Promise<Doador> {
  const doador = await apiRequest<DoadorApi>(`/doadores/${id}`);

  return mapDoador(doador);
}

export async function createDoador(values: DoadorFormValues): Promise<Doador> {
  const doador = await apiRequest<DoadorApi>('/doadores', {
    method: 'POST',
    body: toRequestBody(values),
  });

  return mapDoador(doador);
}

export interface UpdateDoadorInput extends DoadorFormValues {
  id: string;
}

export async function updateDoador(id: string, values: DoadorFormValues): Promise<Doador>;
export async function updateDoador(input: UpdateDoadorInput): Promise<Doador>;
export async function updateDoador(
  idOrInput: string | UpdateDoadorInput,
  maybeValues?: DoadorFormValues
): Promise<Doador> {
  const id = typeof idOrInput === 'string' ? idOrInput : idOrInput.id;
  const values = typeof idOrInput === 'string' ? maybeValues! : idOrInput;

  const doador = await apiRequest<DoadorApi>(`/doadores/${id}`, {
    method: 'PATCH',
    body: toRequestBody(values),
  });

  return mapDoador(doador);
}

export interface DeleteDoadorInput {
  id: string;
  senhaAdmin?: string;
}

export async function deleteDoador(idOrInput: string | DeleteDoadorInput): Promise<void> {
  const id = typeof idOrInput === 'string' ? idOrInput : idOrInput.id;
  const senhaAdmin = typeof idOrInput === 'string' ? undefined : idOrInput.senhaAdmin;

  await apiRequest<{ ok: true } | void>(`/doadores/${id}`, {
    method: 'DELETE',
    body: senhaAdmin ? { senhaAdmin } : undefined,
  });
}
