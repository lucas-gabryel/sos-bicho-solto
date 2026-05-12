import { useQuery } from '@tanstack/react-query';

import { getDashboardStats } from '@/services/dashboard.service';

export const dashboardStatsKeys = {
  all: ['dashboard-stats'] as const,
};

export function useDashboardStats() {
  return useQuery({
    queryKey: dashboardStatsKeys.all,
    queryFn: getDashboardStats,
  });
}
