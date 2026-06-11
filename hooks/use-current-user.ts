import { useQuery } from '@tanstack/react-query';

import { getCurrentUser } from '@/services/user.service';

export const currentUserKeys = {
  current: ['current-user'] as const,
};

export function useCurrentUser() {
  return useQuery({
    queryKey: currentUserKeys.current,
    queryFn: getCurrentUser,
  });
}
