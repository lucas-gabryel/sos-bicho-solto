'use client';

import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

const FIVE_MINUTES = 5 * 60 * 1000;

function getErrorMessage(error: unknown) {
  return error instanceof Error && error.message ? error.message : 'Ocorreu um erro inesperado. Tente novamente.';
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (error) => toast.error(getErrorMessage(error)),
        }),
        mutationCache: new MutationCache({
          onError: (error) => toast.error(getErrorMessage(error)),
        }),
        defaultOptions: {
          queries: {
            staleTime: FIVE_MINUTES,
            gcTime: 2 * FIVE_MINUTES,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
  );

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
