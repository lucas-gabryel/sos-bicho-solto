export type AnimalStatus = 'Adotado' | 'Acolhimento';
export type AnimalEsp = 'Cão' | 'Gato';
export type AnimalSexo = 'Macho' | 'Fêmea';

export interface Animal {
  id: string;
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

export async function getAnimals(): Promise<Animal[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  return [
    {
      id: '06.05.2026.1',
      nome: 'Rex',
      esp: 'Cão',
      raca: 'SRD',
      sexo: 'Macho',
      cor: 'Caramelo',
      peso: 7.2,
      pesoAt: 8.1,
      local: 'Centro, Arapiraca/AL',
      obs: 'Em tratamento de verminose, recuperação bem-sucedida.',
      status: 'Acolhimento',
      data: '06/05/2026',
    },
    {
      id: '06.05.2026.2',
      nome: 'Mia',
      esp: 'Gato',
      raca: 'Siamês',
      sexo: 'Fêmea',
      cor: 'Creme',
      peso: 2.8,
      pesoAt: 3.2,
      local: 'Bom Jesus, Maceió/AL',
      obs: 'Saudável, totalmente vacinada.',
      status: 'Adotado',
      data: '06/05/2026',
    },
    {
      id: '29.04.2026.1',
      nome: 'Thor',
      esp: 'Cão',
      raca: 'Labrador',
      sexo: 'Macho',
      cor: 'Dourado',
      peso: 12.5,
      pesoAt: 13.0,
      local: 'Pajuçara, Maceió/AL',
      obs: 'Fratura curada, apto para adoção.',
      status: 'Acolhimento',
      data: '29/04/2026',
    },
    {
      id: '29.04.2026.2',
      nome: 'Luna',
      esp: 'Gato',
      raca: 'SRD',
      sexo: 'Fêmea',
      cor: 'Preto',
      peso: 1.9,
      pesoAt: 2.1,
      local: 'Benedito Bentes, Maceió/AL',
      obs: 'Filhote, aproximadamente 3 meses.',
      status: 'Acolhimento',
      data: '29/04/2026',
    },
    {
      id: '20.04.2026.1',
      nome: 'Mel',
      esp: 'Cão',
      raca: 'Poodle',
      sexo: 'Macho',
      cor: 'Branco',
      peso: 4.1,
      pesoAt: 4.4,
      local: 'Farol, Maceió/AL',
      obs: 'Abandono sem traumas aparentes.',
      status: 'Adotado',
      data: '20/04/2026',
    },
  ];
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
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Generate mock ID with today's date and sequence
  const today = new Date();
  const dateStr = `${String(today.getDate()).padStart(2, '0')}.${String(today.getMonth() + 1).padStart(2, '0')}.${today.getFullYear()}`;
  const sequence = Math.floor(Math.random() * 1000);
  const id = `${dateStr}.${sequence}`;

  // Format date for display
  const data_str = today.toLocaleDateString('pt-BR');

  return {
    id,
    ...data,
    pesoAt: data.pesoAt || data.peso,
    data: data_str,
  };
}

export interface UpdateAnimalPayload extends CreateAnimalPayload {
  id: string;
}

export async function updateAnimal(data: UpdateAnimalPayload): Promise<Animal> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    id: data.id,
    nome: data.nome,
    esp: data.esp,
    raca: data.raca,
    sexo: data.sexo,
    cor: data.cor,
    peso: data.peso,
    pesoAt: data.pesoAt || data.peso,
    local: data.local,
    obs: data.obs,
    status: data.status,
    data: new Date().toLocaleDateString('pt-BR'),
  };
}
