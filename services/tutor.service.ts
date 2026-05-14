import { normalizeTutorValues } from '@/lib/tutor';
import type { Tutor, TutorFormValues } from '@/types/tutor';

const MOCK_DELAY = 500;

let tutorsDb: Tutor[] = [
  {
    id: 'TUT-001',
    nome: 'Ana Clara Santos',
    cpf: '390.533.447-05',
    telefone: '(82) 99912-3456',
    email: 'ana.clara@email.com',
    endereco: 'Rua Pedro Oliveira, 145 - Centro, Arapiraca/AL',
    dataNascimento: '1992-03-15',
    animaisAdotadosIds: ['06.05.2026.2'],
  },
  {
    id: 'TUT-002',
    nome: 'Carlos Henrique Lima',
    cpf: '168.995.350-09',
    telefone: '(82) 98877-1020',
    email: 'carlos.lima@email.com',
    endereco: 'Av. Fernandes Lima, 820 - Farol, Maceio/AL',
    dataNascimento: '1988-11-02',
    animaisAdotadosIds: ['20.04.2026.1'],
  },
];

function wait(delay = MOCK_DELAY) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

function cloneTutor(tutor: Tutor): Tutor {
  return {
    ...tutor,
    animaisAdotadosIds: [...tutor.animaisAdotadosIds],
  };
}

function getNextTutorId() {
  const lastId = tutorsDb.reduce((max, tutor) => {
    const currentId = Number(tutor.id.replace('TUT-', ''));

    return Number.isNaN(currentId) ? max : Math.max(max, currentId);
  }, 0);

  return `TUT-${String(lastId + 1).padStart(3, '0')}`;
}

export async function getTutors(): Promise<Tutor[]> {
  await wait();

  return tutorsDb.map(cloneTutor);
}

export async function getTutorById(id: string): Promise<Tutor | null> {
  await wait();

  const tutor = tutorsDb.find((item) => item.id === id);

  return tutor ? cloneTutor(tutor) : null;
}

export async function createTutor(values: TutorFormValues): Promise<Tutor> {
  await wait();

  const newTutor: Tutor = {
    id: getNextTutorId(),
    ...normalizeTutorValues(values),
    animaisAdotadosIds: [],
  };

  tutorsDb = [newTutor, ...tutorsDb];

  return cloneTutor(newTutor);
}

export async function updateTutor(id: string, values: TutorFormValues): Promise<Tutor> {
  await wait();

  let updatedTutor: Tutor | null = null;

  tutorsDb = tutorsDb.map((tutor) => {
    if (tutor.id !== id) {
      return tutor;
    }

    updatedTutor = {
      ...tutor,
      ...normalizeTutorValues(values),
    };

    return updatedTutor;
  });

  if (!updatedTutor) {
    throw new Error('Tutor não encontrado.');
  }

  return cloneTutor(updatedTutor);
}

export async function linkAnimalToTutor(tutorId: string, animalId: string): Promise<Tutor> {
  await wait();

  let updatedTutor: Tutor | null = null;

  tutorsDb = tutorsDb.map((tutor) => {
    if (tutor.id !== tutorId) {
      return tutor;
    }

    updatedTutor = {
      ...tutor,
      animaisAdotadosIds: tutor.animaisAdotadosIds.includes(animalId)
        ? [...tutor.animaisAdotadosIds]
        : [...tutor.animaisAdotadosIds, animalId],
    };

    return updatedTutor;
  });

  if (!updatedTutor) {
    throw new Error('Tutor não encontrado.');
  }

  return cloneTutor(updatedTutor);
}

export async function deleteTutor(id: string): Promise<void> {
  await wait();

  const exists = tutorsDb.some((tutor) => tutor.id === id);

  if (!exists) {
    throw new Error('Tutor não encontrado.');
  }

  tutorsDb = tutorsDb.filter((tutor) => tutor.id !== id);
}
