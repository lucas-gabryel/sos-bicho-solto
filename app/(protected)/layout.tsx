import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { Sidebar } from '@/components/sidebar';
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

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="md:ml-60">{children}</main>
    </div>
  );
}
