import { useQuery } from '@tanstack/react-query';

import { getCurrentUser } from '@/services/user.service';

export function useCurrentUser() {
  return useQuery({
    queryKey: ['current-user'],
    queryFn: getCurrentUser,
  });
}
