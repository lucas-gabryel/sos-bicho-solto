import { useQuery } from '@tanstack/react-query';

import { acolhedorKeys } from '@/hooks/use-acolhedores';
import { getAcolhedorById } from '@/services/acolhedor.service';

export function useAcolhedor(id: string) {
  return useQuery({
    queryKey: acolhedorKeys.detail(id),
    queryFn: () => getAcolhedorById(id),
    enabled: Boolean(id),
  });
}
