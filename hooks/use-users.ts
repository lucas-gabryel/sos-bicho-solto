import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { getUsers, type ListUsersParams } from '@/services/user.service';

export const userKeys = {
  all: ['users'] as const,
  list: (params: ListUsersParams) => ['users', 'list', params] as const,
};

interface UseUsersOptions extends ListUsersParams {
  enabled?: boolean;
}

export function useUsers({ enabled = true, ...params }: UseUsersOptions = {}) {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => getUsers(params),
    enabled,
    placeholderData: keepPreviousData,
  });
}
