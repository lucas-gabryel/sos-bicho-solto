'use client';

import { useEffect } from 'react';

import { useCurrentUser } from '@/hooks/use-current-user';
import { useRouter } from 'next/navigation';

export function AdminOnly({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: currentUser, isLoading } = useCurrentUser();

  useEffect(() => {
    if (!isLoading && currentUser && currentUser.role !== 'admin') {
      router.replace('/dashboard');
    }
  }, [currentUser, isLoading, router]);

  if (isLoading || !currentUser || currentUser.role !== 'admin') {
    return (
      <div className="flex min-h-[70vh] items-center justify-center p-6">
        <div className="rounded-full border border-border bg-card px-4 py-2 text-sm text-foreground shadow-sm">
          Verificando permissao...
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
