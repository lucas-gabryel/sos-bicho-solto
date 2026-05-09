export interface DashboardStats {
  totalAnimais: number;
  emAcolhimento: number;
  adotados: number;
  tutores: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  return {
    totalAnimais: 5,
    emAcolhimento: 3,
    adotados: 2,
    tutores: 2,
  };
}
