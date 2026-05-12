'use client';

import { useEffect } from 'react';

import { Sidebar } from '@/components/sidebar';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useRouter } from 'next/navigation';

export function ProtectedShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: currentUser, isLoading } = useCurrentUser();

  useEffect(() => {
    if (!isLoading && !currentUser) {
      router.replace('/login');
    }
  }, [currentUser, isLoading, router]);

  if (isLoading || !currentUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="rounded-full border border-border bg-card px-4 py-2 text-sm text-foreground shadow-sm">
          Carregando sessao...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="md:ml-60">{children}</main>
    </div>
  );
}
