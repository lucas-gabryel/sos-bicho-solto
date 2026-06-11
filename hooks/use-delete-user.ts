import { useMutation, useQueryClient } from '@tanstack/react-query';

import { userKeys } from '@/hooks/use-users';
import { deleteUser } from '@/services/user.service';

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}
