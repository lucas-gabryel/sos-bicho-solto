import { apiRequest, LIST_LIMIT, type RespostaPaginada } from '@/lib/api';

export type AnimalStatus = 'Adotado' | 'Acolhimento';
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
  tutorId?: string;
  data: string;
  foto?: string;
}

type EspecieApi = 'CAO' | 'GATO';
type SexoApi = 'MACHO' | 'FEMEA';
type PorteApi = 'PEQUENO' | 'MEDIO' | 'GRANDE';
type StatusApi = 'ACOLHIMENTO' | 'ADOTADO';

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
  status: StatusApi;
  tutorId?: string | null;
  criadoEm: string;
  modificadoEm: string;
  fotos?: { id: string; url: string; principal: boolean }[];
}

// A API exige ao menos 1 foto (URL válida) no cadastro de animal. Enquanto não há
// upload de arquivo, o front envia a URL informada ou esta imagem padrão.
// Ver lacunas.md (upload de fotos).
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

function statusToFront(status: StatusApi): AnimalStatus {
  return status === 'ADOTADO' ? 'Adotado' : 'Acolhimento';
}

function statusToApi(status: AnimalStatus): StatusApi {
  return status === 'Adotado' ? 'ADOTADO' : 'ACOLHIMENTO';
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
    tutorId: animal.tutorId ?? undefined,
    data: formatRegistrationDate(animal.criadoEm),
    foto: fotoPrincipal?.url,
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
  // `status` não é enviado: a API sempre cria como ACOLHIMENTO (muda via adoção).
  // `pesoAt` não é aceito no cadastro (só registrado na edição).
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
}

export async function updateAnimal(data: UpdateAnimalPayload): Promise<Animal> {
  // A API não permite alterar `status` na edição (muda via adoção/devolução).
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
