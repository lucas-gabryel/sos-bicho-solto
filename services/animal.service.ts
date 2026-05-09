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
    { id: '06.05.2026.1', nome: 'Rex', esp: 'Cão', raca: 'SRD', sexo: 'Macho', cor: 'Caramelo', peso: 7.2, pesoAt: 8.1, local: 'Centro, Arapiraca/AL', obs: 'Em tratamento de verminose, recuperação bem-sucedida.', status: 'Acolhimento', data: '06/05/2026' },
    { id: '06.05.2026.2', nome: 'Mia', esp: 'Gato', raca: 'Siamês', sexo: 'Fêmea', cor: 'Creme', peso: 2.8, pesoAt: 3.2, local: 'Bom Jesus, Maceió/AL', obs: 'Saudável, totalmente vacinada.', status: 'Adotado', data: '06/05/2026' },
    { id: '29.04.2026.1', nome: 'Thor', esp: 'Cão', raca: 'Labrador', sexo: 'Macho', cor: 'Dourado', peso: 12.5, pesoAt: 13.0, local: 'Pajuçara, Maceió/AL', obs: 'Fratura curada, apto para adoção.', status: 'Acolhimento', data: '29/04/2026' },
    { id: '29.04.2026.2', nome: 'Luna', esp: 'Gato', raca: 'SRD', sexo: 'Fêmea', cor: 'Preto', peso: 1.9, pesoAt: 2.1, local: 'Benedito Bentes, Maceió/AL', obs: 'Filhote, aproximadamente 3 meses.', status: 'Acolhimento', data: '29/04/2026' },
    { id: '20.04.2026.1', nome: 'Mel', esp: 'Cão', raca: 'Poodle', sexo: 'Macho', cor: 'Branco', peso: 4.1, pesoAt: 4.4, local: 'Farol, Maceió/AL', obs: 'Abandono sem traumas aparentes.', status: 'Adotado', data: '20/04/2026' },
  ];
}
