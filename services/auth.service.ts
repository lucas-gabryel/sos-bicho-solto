import { apiRequest } from '@/lib/api';
import { setAuthToken } from '@/lib/auth-token';
import { clearClientSession, startClientSession } from '@/lib/session';
import { mapUsuarioToCurrentUser, type UsuarioApi } from '@/services/user.service';
import type { CurrentUser } from '@/types/user';

export interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
  usuario: UsuarioApi;
}

export async function login(credentials: LoginCredentials): Promise<CurrentUser> {
  const { access_token, usuario } = await apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    auth: false,
    body: {
      email: credentials.email.trim().toLowerCase(),
      senha: credentials.password,
    },
  });

  setAuthToken(access_token);
  startClientSession();

  return mapUsuarioToCurrentUser(usuario);
}

export async function logout(): Promise<void> {
  try {
    await apiRequest<{ ok: true }>('/auth/logout', { method: 'POST' });
  } catch {
    // Ignora falhas de rede no logout — a sessão local é limpa de qualquer forma.
  }

  setAuthToken(null);
  clearClientSession();
}
