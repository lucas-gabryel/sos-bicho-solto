import {
  apiRequest,
  fetchAllPages,
  LIST_LIMIT,
  resolveAssetUrl,
  type RespostaPaginada,
} from '@/lib/api';
import {
  type AnimalStatus,
  type EventoAnimal,
  MOTIVO_SAIDA_LABELS,
  type MotivoSaidaAnimal,
  type StatusAnimal,
  TIPO_EVENTO_LABELS,
  type TipoEventoAnimal,
} from '@/types/animal';

export {
  type AnimalStatus,
  type EventoAnimal,
  MOTIVO_SAIDA_LABELS,
  type MotivoSaidaAnimal,
  type StatusAnimal,
  TIPO_EVENTO_LABELS,
  type TipoEventoAnimal,
};

export type AnimalEsp = 'Cão' | 'Gato';
export type AnimalSexo = 'Macho' | 'Fêmea';
export type AnimalPorte = 'Pequeno' | 'Médio' | 'Grande';

export interface Animal {
  id: string;
  numeroRegistro: string;
  nome: string;
  esp: AnimalEsp;
  raca: string;
  sexo: AnimalSexo;
  porte?: AnimalPorte;
  cor: string;
  peso: number;
  pesoAt?: number;
  castrado: boolean;
  vacinado: boolean;
  dataNascimento?: string;
  local: string;
  obs?: string;
  status: AnimalStatus;
  statusApi: StatusAnimal;
  tutorId?: string;
  data: string;
  foto?: string;
  eventos?: EventoAnimal[];
}

type EspecieApi = 'CAO' | 'GATO';
type SexoApi = 'MACHO' | 'FEMEA';
type PorteApi = 'PEQUENO' | 'MEDIO' | 'GRANDE';

export interface AnimalApi {
  id: string;
  numeroRegistro: string;
  nome: string;
  especie: EspecieApi;
  raca: string;
  sexo: SexoApi;
  porte?: PorteApi | null;
  cor: string;
  pesoInicial: number;
  pesoAtual?: number | null;
  dataNascimento?: string | null;
  castrado: boolean;
  vacinado: boolean;
  localResgate: string;
  observacoes?: string | null;
  status: StatusAnimal;
  tutorId?: string | null;
  criadoEm: string;
  modificadoEm: string;
  fotos?: { id: string; url: string; principal: boolean }[];
  eventos?: EventoAnimal[];
}

const PLACEHOLDER_PHOTO_URL = 'https://placedog.net/640/480';

function especieToEsp(especie: EspecieApi): AnimalEsp {
  return especie === 'CAO' ? 'Cão' : 'Gato';
}

function espToEspecie(esp: AnimalEsp): EspecieApi {
  return esp === 'Cão' ? 'CAO' : 'GATO';
}

function sexoToFront(sexo: SexoApi): AnimalSexo {
  return sexo === 'MACHO' ? 'Macho' : 'Fêmea';
}

function sexoToApi(sexo: AnimalSexo): SexoApi {
  return sexo === 'Macho' ? 'MACHO' : 'FEMEA';
}

const PORTE_TO_FRONT: Record<PorteApi, AnimalPorte> = {
  PEQUENO: 'Pequeno',
  MEDIO: 'Médio',
  GRANDE: 'Grande',
};

const PORTE_TO_API: Record<AnimalPorte, PorteApi> = {
  Pequeno: 'PEQUENO',
  Médio: 'MEDIO',
  Grande: 'GRANDE',
};

const STATUS_TO_FRONT: Record<StatusAnimal, AnimalStatus> = {
  ACOLHIMENTO: 'Acolhimento',
  ADOTADO: 'Adotado',
  TRANSFERIDO: 'Transferido',
  OBITO: 'Óbito',
};

const STATUS_TO_API: Record<AnimalStatus, StatusAnimal> = {
  Acolhimento: 'ACOLHIMENTO',
  Adotado: 'ADOTADO',
  Transferido: 'TRANSFERIDO',
  Óbito: 'OBITO',
};

export function statusToFront(status: StatusAnimal): AnimalStatus {
  return STATUS_TO_FRONT[status] ?? 'Acolhimento';
}

export function statusToApi(status: AnimalStatus): StatusAnimal {
  return STATUS_TO_API[status] ?? 'ACOLHIMENTO';
}

function toDateOnly(value?: string | null): string | undefined {
  if (!value) {
    return undefined;
  }

  return new Date(value).toISOString().slice(0, 10);
}

function formatRegistrationDate(value: string): string {
  return new Date(value).toLocaleDateString('pt-BR');
}

export function mapEventoAnimal(evento: EventoAnimal): EventoAnimal {
  return {
    ...evento,
    documentoUrl: resolveAssetUrl(evento.documentoUrl),
  };
}

function mapAnimal(animal: AnimalApi): Animal {
  const fotoPrincipal = animal.fotos?.find((foto) => foto.principal) ?? animal.fotos?.[0];

  return {
    id: animal.id,
    numeroRegistro: animal.numeroRegistro,
    nome: animal.nome,
    esp: especieToEsp(animal.especie),
    raca: animal.raca,
    sexo: sexoToFront(animal.sexo),
    porte: animal.porte ? PORTE_TO_FRONT[animal.porte] : undefined,
    cor: animal.cor,
    peso: Number(animal.pesoInicial),
    pesoAt: animal.pesoAtual != null ? Number(animal.pesoAtual) : undefined,
    castrado: animal.castrado,
    vacinado: animal.vacinado,
    dataNascimento: toDateOnly(animal.dataNascimento),
    local: animal.localResgate,
    obs: animal.observacoes ?? undefined,
    status: statusToFront(animal.status),
    statusApi: animal.status,
    tutorId: animal.tutorId ?? undefined,
    data: formatRegistrationDate(animal.criadoEm),
    foto: resolveAssetUrl(fotoPrincipal?.url) ?? undefined,
    eventos: animal.eventos ? animal.eventos.map(mapEventoAnimal) : undefined,
  };
}

export interface ListAnimalsParams {
  page?: number;
  limit?: number;
  busca?: string;
  especie?: AnimalEsp;
  status?: AnimalStatus;
}

export async function getAnimals(params: ListAnimalsParams = {}): Promise<RespostaPaginada<Animal>> {
  const { data, meta } = await apiRequest<RespostaPaginada<AnimalApi>>('/animais', {
    query: {
      page: params.page,
      limit: params.limit,
      busca: params.busca,
      especie: params.especie ? espToEspecie(params.especie) : undefined,
      status: params.status ? statusToApi(params.status) : undefined,
    },
  });

  return { data: data.map(mapAnimal), meta };
}

export async function getRecentAnimals(limit = 5): Promise<Animal[]> {
  const { data } = await apiRequest<RespostaPaginada<AnimalApi>>('/animais', {
    query: { page: 1, limit },
  });

  return data.map(mapAnimal);
}

export async function getAnimalsByTutor(tutorId: string): Promise<Animal[]> {
  const { data } = await apiRequest<RespostaPaginada<AnimalApi>>(`/tutores/${tutorId}/animais`, {
    query: { limit: LIST_LIMIT },
  });

  return data.map(mapAnimal);
}

export async function getAnimalById(id: string): Promise<Animal> {
  const animal = await apiRequest<AnimalApi>(`/animais/${id}`);

  return mapAnimal(animal);
}

export async function getAnimalEventos(
  animalId: string,
  tipo?: TipoEventoAnimal,
): Promise<EventoAnimal[]> {
  const response = await apiRequest<EventoAnimal[] | RespostaPaginada<EventoAnimal>>(
    `/animais/${animalId}/eventos`,
    {
      query: { tipo },
    },
  );

  const list = Array.isArray(response) ? response : (response.data ?? []);
  return list.map(mapEventoAnimal);
}

export interface CreateEventoAnimalPayload {
  animalId: string;
  descricao: string;
  data?: string;
  tipo?: TipoEventoAnimal;
  motivoSaida?: Exclude<MotivoSaidaAnimal, 'ADOCAO'>;
  documento?: File | null;
}

export async function createEventoAnimal(
  payload: CreateEventoAnimalPayload,
): Promise<EventoAnimal> {
  const formData = new FormData();
  formData.append('descricao', payload.descricao.trim());

  if (payload.data) {
    formData.append('data', new Date(payload.data).toISOString());
  }

  if (payload.tipo) {
    formData.append('tipo', payload.tipo);
  }

  if (payload.tipo === 'SAIDA' && payload.motivoSaida) {
    formData.append('motivoSaida', payload.motivoSaida);
  }

  if (payload.documento) {
    formData.append('documento', payload.documento);
  }

  const evento = await apiRequest<EventoAnimal>(`/animais/${payload.animalId}/eventos`, {
    method: 'POST',
    body: formData,
  });

  return mapEventoAnimal(evento);
}

export interface CreateAnimalPayload {
  nome: string;
  esp: AnimalEsp;
  raca: string;
  sexo: AnimalSexo;
  porte?: AnimalPorte;
  cor: string;
  peso: number;
  pesoAt?: number;
  castrado: boolean;
  vacinado: boolean;
  dataNascimento?: string;
  local: string;
  obs?: string;
  fotoUrl?: string;
}

export async function createAnimal(data: CreateAnimalPayload): Promise<Animal> {
  const animal = await apiRequest<AnimalApi>('/animais', {
    method: 'POST',
    body: {
      nome: data.nome,
      especie: espToEspecie(data.esp),
      raca: data.raca,
      sexo: sexoToApi(data.sexo),
      porte: data.porte ? PORTE_TO_API[data.porte] : undefined,
      cor: data.cor,
      pesoInicial: data.peso,
      castrado: data.castrado,
      vacinado: data.vacinado,
      dataNascimento: data.dataNascimento || undefined,
      localResgate: data.local,
      observacoes: data.obs || undefined,
      fotos: [{ url: data.fotoUrl?.trim() || PLACEHOLDER_PHOTO_URL, principal: true }],
    },
  });

  return mapAnimal(animal);
}

export interface UpdateAnimalPayload extends CreateAnimalPayload {
  id: string;
  status?: AnimalStatus;
  motivoSaidaDescricao?: string;
}

export async function updateAnimal(data: UpdateAnimalPayload): Promise<Animal> {
  const animal = await apiRequest<AnimalApi>(`/animais/${data.id}`, {
    method: 'PATCH',
    body: {
      nome: data.nome,
      especie: espToEspecie(data.esp),
      raca: data.raca,
      sexo: sexoToApi(data.sexo),
      porte: data.porte ? PORTE_TO_API[data.porte] : undefined,
      cor: data.cor,
      pesoInicial: data.peso,
      pesoAtual: data.pesoAt ?? undefined,
      castrado: data.castrado,
      vacinado: data.vacinado,
      dataNascimento: data.dataNascimento || undefined,
      localResgate: data.local,
      observacoes: data.obs || undefined,
      status: data.status ? statusToApi(data.status) : undefined,
      motivoSaidaDescricao: data.motivoSaidaDescricao?.trim() || undefined,
    },
  });

  return mapAnimal(animal);
}

export interface DeleteAnimalInput {
  id: string;
  senhaAdmin: string;
}

export async function deleteAnimal({ id, senhaAdmin }: DeleteAnimalInput): Promise<void> {
  await apiRequest<{ ok: true }>(`/animais/${id}`, {
    method: 'DELETE',
    body: { senhaAdmin },
  });
}

export async function getAllAnimals(
  params: Omit<ListAnimalsParams, 'page' | 'limit'> = {},
): Promise<Animal[]> {
  return fetchAllPages(
    ({ page, limit }) => getAnimals({ ...params, page, limit }),
    LIST_LIMIT,
  );
}
