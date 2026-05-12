import { useMutation, useQueryClient } from '@tanstack/react-query';

import { currentUserKeys } from '@/hooks/use-current-user';
import { logout } from '@/services/auth.service';

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(currentUserKeys.current, null);
    },
  });
}
