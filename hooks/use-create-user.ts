import { useMutation, useQueryClient } from '@tanstack/react-query';

import { userKeys } from '@/hooks/use-users';
import { createUser } from '@/services/user.service';

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}
