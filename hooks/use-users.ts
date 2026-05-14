import { useQuery } from '@tanstack/react-query';

import { getUsers } from '@/services/user.service';

export const userKeys = {
  all: ['users'] as const,
};

interface UseUsersOptions {
  enabled?: boolean;
}

export function useUsers({ enabled = true }: UseUsersOptions = {}) {
  return useQuery({
    queryKey: userKeys.all,
    queryFn: getUsers,
    enabled,
  });
}
