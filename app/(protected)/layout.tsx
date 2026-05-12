import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { ProtectedShell } from '@/components/protected-shell';
import { SESSION_COOKIE_NAME } from '@/lib/session';

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();

  if (!cookieStore.has(SESSION_COOKIE_NAME)) {
    redirect('/login');
  }

  return <ProtectedShell>{children}</ProtectedShell>;
}
