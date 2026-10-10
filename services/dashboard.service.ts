import { apiRequest } from '@/lib/api';

export interface DashboardStats {
  totalAnimais: number;
  emAcolhimento: number;
  adotados: number;
  acolhedores: number;
  tutores: number;
  adotantes: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  return apiRequest<DashboardStats>('/dashboard/resumo');
}
