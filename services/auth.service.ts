import { compare } from 'bcryptjs';

import type { CurrentUser } from '@/types/user';
import { getStoredUserByEmail, logout as clearCurrentSession, setCurrentUserSession } from '@/services/user.service';

export interface LoginCredentials {
  email: string;
  password: string;
}

function wait(delay = 300) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

export async function login(credentials: LoginCredentials): Promise<CurrentUser> {
  await wait(500);

  const user = getStoredUserByEmail(credentials.email);

  if (!user) {
    throw new Error('E-mail ou senha invalidos.');
  }

  const isValidPassword = await compare(credentials.password, user.passwordHash);

  if (!isValidPassword) {
    throw new Error('E-mail ou senha invalidos.');
  }

  setCurrentUserSession(user.id);

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
}

export async function logout(): Promise<void> {
  await clearCurrentSession();
}
