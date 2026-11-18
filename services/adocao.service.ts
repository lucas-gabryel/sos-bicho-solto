import { apiRequest, type RespostaPaginada } from '@/lib/api';

interface AdocaoApi {
  id: string;
  animalId: string;
  tutorId: string;
  dataAdocao: string;
  devolvidoEm?: string | null;
}

async function getAdocaoAtivaByAnimal(animalId: string): Promise<AdocaoApi | undefined> {
  const { data } = await apiRequest<RespostaPaginada<AdocaoApi>>('/adocoes', {
    query: { animalId },
  });

  return data.find((adocao) => adocao.animalId === animalId && !adocao.devolvidoEm);
}

export interface UndoAdocaoInput {
  animalId: string;
  observacoes?: string;
}

export async function undoAdocao({ animalId, observacoes }: UndoAdocaoInput): Promise<void> {
  const adocao = await getAdocaoAtivaByAnimal(animalId);

  if (!adocao) {
    throw new Error('Nenhuma adoção ativa encontrada para este animal.');
  }

  await apiRequest(`/adocoes/${adocao.id}/devolucao`, {
    method: 'POST',
    body: { observacoes: observacoes || undefined },
  });
}
