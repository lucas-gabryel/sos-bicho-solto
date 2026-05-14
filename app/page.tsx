import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { SESSION_COOKIE_NAME } from '@/lib/session';

export default async function HomePage() {
  const cookieStore = await cookies();

  redirect(cookieStore.has(SESSION_COOKIE_NAME) ? '/dashboard' : '/login');
}
