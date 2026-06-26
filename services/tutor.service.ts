import { apiRequest, LIST_LIMIT, type RespostaPaginada } from '@/lib/api';
import { formatCpf, normalizeTutorValues } from '@/lib/tutor';
import type { AnimalApi } from '@/services/animal.service';
import type { Tutor, TutorFormValues } from '@/types/tutor';

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
}

function toDateOnly(value: string): string {
  if (!value) {
    return '';
  }

  return new Date(value).toISOString().slice(0, 10);
}

function mapTutor(tutor: TutorApi, animaisAdotadosIds: string[] = []): Tutor {
  return {
    id: tutor.id,
    codigo: tutor.codigo,
    nome: tutor.nome,
    cpf: formatCpf(tutor.cpf),
    telefone: tutor.telefone,
    email: tutor.email,
    endereco: tutor.endereco,
    dataNascimento: toDateOnly(tutor.dataNascimento),
    animaisAdotadosIds,
    totalAnimaisAdotados: tutor.totalAnimaisAdotados ?? animaisAdotadosIds.length,
  };
}

export interface ListTutorsParams {
  page?: number;
  limit?: number;
  busca?: string;
}

export async function getTutors(params: ListTutorsParams = {}): Promise<RespostaPaginada<Tutor>> {
  const { data, meta } = await apiRequest<RespostaPaginada<TutorApi>>('/tutores', {
    query: { page: params.page, limit: params.limit, busca: params.busca },
  });

  return { data: data.map((tutor) => mapTutor(tutor)), meta };
}

export async function getTutorById(id: string): Promise<Tutor | null> {
  const tutor = await apiRequest<TutorApi>(`/tutores/${id}`);

  const { data: animais } = await apiRequest<RespostaPaginada<AnimalApi>>(`/tutores/${id}/animais`, {
    query: { limit: LIST_LIMIT },
  });

  return mapTutor(
    tutor,
    animais.map((animal) => animal.id),
  );
}

export async function createTutor(values: TutorFormValues): Promise<Tutor> {
  const normalized = normalizeTutorValues(values);

  const tutor = await apiRequest<TutorApi>('/tutores', {
    method: 'POST',
    body: {
      nome: normalized.nome,
      cpf: normalized.cpf,
      telefone: normalized.telefone,
      email: normalized.email,
      endereco: normalized.endereco,
      dataNascimento: normalized.dataNascimento,
    },
  });

  return mapTutor(tutor);
}

export async function updateTutor(id: string, values: TutorFormValues): Promise<Tutor> {
  const normalized = normalizeTutorValues(values);

  const tutor = await apiRequest<TutorApi>(`/tutores/${id}`, {
    method: 'PATCH',
    body: {
      nome: normalized.nome,
      cpf: normalized.cpf,
      telefone: normalized.telefone,
      email: normalized.email,
      endereco: normalized.endereco,
      dataNascimento: normalized.dataNascimento,
    },
  });

  return mapTutor(tutor);
}

export interface DeleteTutorInput {
  id: string;
  senhaAdmin: string;
}

export async function deleteTutor({ id, senhaAdmin }: DeleteTutorInput): Promise<void> {
  await apiRequest<{ ok: true }>(`/tutores/${id}`, {
    method: 'DELETE',
    body: { senhaAdmin },
  });
}

// Vincula um animal a um tutor registrando uma adoção (POST /adocoes):
// o back marca o animal como ADOTADO e seta tutorId. Retorna o tutor atualizado
// (com animaisAdotadosIds recarregado) para o cache do React Query.
export async function linkAnimalToTutor(tutorId: string, animalId: string): Promise<Tutor> {
  await apiRequest('/adocoes', {
    method: 'POST',
    body: { tutorId, animalId },
  });

  const tutor = await getTutorById(tutorId);

  if (!tutor) {
    throw new Error('Tutor não encontrado.');
  }

  return tutor;
}
