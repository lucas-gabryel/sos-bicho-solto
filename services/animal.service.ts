export type AnimalStatus = 'Adotado' | 'Acolhimento';

export interface Animal {
  id: string;
  nome: string;
  esp: string;
  local: string;
  status: AnimalStatus;
}

export async function getAnimals(): Promise<Animal[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  return [
    { id: '06.05.2026.1', nome: 'Rex', esp: 'Cão', local: 'Centro, Arapiraca/AL', status: 'Acolhimento' },
    { id: '06.05.2026.2', nome: 'Mia', esp: 'Gato', local: 'Bom Jesus, Maceió/AL', status: 'Adotado' },
    { id: '29.04.2026.1', nome: 'Thor', esp: 'Cão', local: 'Pajuçara, Maceió/AL', status: 'Acolhimento' },
    { id: '29.04.2026.2', nome: 'Luna', esp: 'Gato', local: 'Benedito Bentes, Maceió/AL', status: 'Acolhimento' },
    { id: '20.04.2026.1', nome: 'Mel', esp: 'Cão', local: 'Farol, Maceió/AL', status: 'Adotado' },
  ];
}
