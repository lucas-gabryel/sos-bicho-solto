import { apiRequest } from '@/lib/api';

export interface DashboardStats {
  totalAnimais: number;
  emAcolhimento: number;
  adotados: number;
  tutores: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  return apiRequest<DashboardStats>('/dashboard/resumo');
}
