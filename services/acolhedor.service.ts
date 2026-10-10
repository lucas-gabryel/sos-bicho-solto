import { apiRequest, type RespostaPaginada } from '@/lib/api';
import { formatCpf, normalizeAcolhedorValues } from '@/lib/acolhedor';
import type { Acolhedor, AcolhedorFormValues, SituacaoAcolhedor } from '@/types/acolhedor';

// A API ainda expõe o recurso como "tutores"; este service é o único ponto que conhece esse contrato.
interface TutorApi {
  id: string;
  codigo: number;
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  endereco: string;
  dataNascimento: string;
  criadoEm: string;
  modificadoEm: string;
  totalAnimaisAdotados: number;
  situacao: SituacaoAcolhedor;
}

function toDateOnly(value: string): string {
  if (!value) {
    return '';
  }

  return new Date(value).toISOString().slice(0, 10);
}

function mapAcolhedor(tutor: TutorApi): Acolhedor {
  return {
    id: tutor.id,
    codigo: tutor.codigo,
    nome: tutor.nome,
    cpf: formatCpf(tutor.cpf),
    telefone: tutor.telefone,
    email: tutor.email,
    endereco: tutor.endereco,
    dataNascimento: toDateOnly(tutor.dataNascimento),
    totalAnimaisAdotados: tutor.totalAnimaisAdotados,
    situacao: tutor.situacao,
  };
}

export interface ListAcolhedoresParams {
  page?: number;
  limit?: number;
  busca?: string;
  situacao?: SituacaoAcolhedor;
}

export async function getAcolhedores(params: ListAcolhedoresParams = {}): Promise<RespostaPaginada<Acolhedor>> {
  const { data, meta } = await apiRequest<RespostaPaginada<TutorApi>>('/tutores', {
    query: { page: params.page, limit: params.limit, busca: params.busca, situacao: params.situacao },
  });

  return { data: data.map((tutor) => mapAcolhedor(tutor)), meta };
}

export async function getAcolhedorById(id: string): Promise<Acolhedor> {
  const tutor = await apiRequest<TutorApi>(`/tutores/${id}`);

  return mapAcolhedor(tutor);
}

function toRequestBody(values: AcolhedorFormValues) {
  const normalized = normalizeAcolhedorValues(values);

  return {
    nome: normalized.nome,
    cpf: normalized.cpf,
    telefone: normalized.telefone,
    email: normalized.email,
    endereco: normalized.endereco,
    dataNascimento: normalized.dataNascimento,
  };
}

export async function createAcolhedor(values: AcolhedorFormValues): Promise<Acolhedor> {
  const tutor = await apiRequest<TutorApi>('/tutores', {
    method: 'POST',
    body: toRequestBody(values),
  });

  return mapAcolhedor(tutor);
}

export async function updateAcolhedor(id: string, values: AcolhedorFormValues): Promise<Acolhedor> {
  const tutor = await apiRequest<TutorApi>(`/tutores/${id}`, {
    method: 'PATCH',
    body: toRequestBody(values),
  });

  return mapAcolhedor(tutor);
}

export interface DeleteAcolhedorInput {
  id: string;
  senhaAdmin: string;
}

export async function deleteAcolhedor({ id, senhaAdmin }: DeleteAcolhedorInput): Promise<void> {
  await apiRequest<{ ok: true }>(`/tutores/${id}`, {
    method: 'DELETE',
    body: { senhaAdmin },
  });
}

export async function linkAnimalToAcolhedor(acolhedorId: string, animalId: string): Promise<void> {
  await apiRequest('/adocoes', {
    method: 'POST',
    body: { tutorId: acolhedorId, animalId },
  });
}
