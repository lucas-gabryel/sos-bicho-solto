import { getTutors } from '@/services/tutor.service';

export interface DashboardStats {
  totalAnimais: number;
  emAcolhimento: number;
  adotados: number;
  tutores: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const tutors = await getTutors();

  return {
    totalAnimais: 5,
    emAcolhimento: 3,
    adotados: 2,
    tutores: tutors.length,
  };
}
