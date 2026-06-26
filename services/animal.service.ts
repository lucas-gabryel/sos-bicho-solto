import { apiRequest, LIST_LIMIT, type RespostaPaginada } from '@/lib/api';

export type AnimalStatus = 'Adotado' | 'Acolhimento';
export type AnimalEsp = 'Cão' | 'Gato';
export type AnimalSexo = 'Macho' | 'Fêmea';

export interface Animal {
  id: string;
  numeroRegistro: string;
  nome: string;
  esp: AnimalEsp;
  raca: string;
  sexo: AnimalSexo;
  cor: string;
  peso: number;
  pesoAt?: number;
  local: string;
  obs?: string;
  status: AnimalStatus;
  data: string;
}

type EspecieApi = 'CAO' | 'GATO';
type SexoApi = 'MACHO' | 'FEMEA';
type StatusApi = 'ACOLHIMENTO' | 'ADOTADO';

export interface AnimalApi {
  id: string;
  numeroRegistro: string;
  nome: string;
  especie: EspecieApi;
  raca: string;
  sexo: SexoApi;
  porte?: string | null;
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

// A API exige ao menos 1 foto (URL válida) no cadastro de animal, mas o front
// ainda não coleta/realiza upload de imagem. Enviamos um placeholder por enquanto.
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

function statusToFront(status: StatusApi): AnimalStatus {
  return status === 'ADOTADO' ? 'Adotado' : 'Acolhimento';
}

function formatRegistrationDate(value: string): string {
  return new Date(value).toLocaleDateString('pt-BR');
}

function mapAnimal(animal: AnimalApi): Animal {
  return {
    id: animal.id,
    numeroRegistro: animal.numeroRegistro,
    nome: animal.nome,
    esp: especieToEsp(animal.especie),
    raca: animal.raca,
    sexo: sexoToFront(animal.sexo),
    cor: animal.cor,
    peso: Number(animal.pesoInicial),
    pesoAt: animal.pesoAtual != null ? Number(animal.pesoAtual) : undefined,
    local: animal.localResgate,
    obs: animal.observacoes ?? undefined,
    status: statusToFront(animal.status),
    data: formatRegistrationDate(animal.criadoEm),
  };
}

export async function getAnimals(): Promise<Animal[]> {
  const { data } = await apiRequest<RespostaPaginada<AnimalApi>>('/animais', {
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
  cor: string;
  peso: number;
  pesoAt?: number;
  local: string;
  obs?: string;
  status: AnimalStatus;
}

export async function createAnimal(data: CreateAnimalPayload): Promise<Animal> {
  // `status` e `pesoAt` não são aceitos no cadastro (a API sempre cria como
  // ACOLHIMENTO e só registra peso atual na edição). Ver lacunas.md.
  const animal = await apiRequest<AnimalApi>('/animais', {
    method: 'POST',
    body: {
      nome: data.nome,
      especie: espToEspecie(data.esp),
      raca: data.raca,
      sexo: sexoToApi(data.sexo),
      cor: data.cor,
      pesoInicial: data.peso,
      localResgate: data.local,
      observacoes: data.obs || undefined,
      fotos: [{ url: PLACEHOLDER_PHOTO_URL, principal: true }],
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
      cor: data.cor,
      pesoInicial: data.peso,
      pesoAtual: data.pesoAt ?? undefined,
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
