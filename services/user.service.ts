import { apiRequest, ApiError, type RespostaPaginada } from '@/lib/api';
import { setAuthToken } from '@/lib/auth-token';
import { clearClientSession } from '@/lib/session';
import type { CreateUserInput, CurrentUser, SystemUser, UserRole } from '@/types/user';

type PerfilApi = 'ADMIN' | 'PROTETOR';

export interface UsuarioApi {
  id: string;
  codigo: number;
  nome: string;
  email: string;
  perfil: PerfilApi;
  ativo?: boolean;
  criadoEm?: string;
  modificadoEm?: string;
}

export function perfilToRole(perfil: PerfilApi): UserRole {
  return perfil === 'ADMIN' ? 'admin' : 'protetor';
}

export function roleToPerfil(role: UserRole): PerfilApi {
  return role === 'admin' ? 'ADMIN' : 'PROTETOR';
}

function toDateOnly(value?: string): string {
  if (!value) {
    return '';
  }

  return new Date(value).toISOString().slice(0, 10);
}

export function mapUsuarioToCurrentUser(usuario: UsuarioApi): CurrentUser {
  return {
    id: usuario.id,
    name: usuario.nome,
    email: usuario.email,
    role: perfilToRole(usuario.perfil),
    createdAt: toDateOnly(usuario.criadoEm),
  };
}

function mapUsuarioToSystemUser(usuario: UsuarioApi): SystemUser {
  return mapUsuarioToCurrentUser(usuario);
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  try {
    const usuario = await apiRequest<UsuarioApi>('/auth/me');

    return mapUsuarioToCurrentUser(usuario);
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      setAuthToken(null);
      clearClientSession();
      return null;
    }

    throw error;
  }
}

export interface ListUsersParams {
  page?: number;
  limit?: number;
  busca?: string;
}

export async function getUsers(params: ListUsersParams = {}): Promise<RespostaPaginada<SystemUser>> {
  const { data, meta } = await apiRequest<RespostaPaginada<UsuarioApi>>('/usuarios', {
    query: { page: params.page, limit: params.limit, busca: params.busca },
  });

  return { data: data.map(mapUsuarioToSystemUser), meta };
}

export async function createUser(input: CreateUserInput): Promise<SystemUser> {
  const usuario = await apiRequest<UsuarioApi>('/usuarios', {
    method: 'POST',
    body: {
      nome: input.name.trim(),
      email: input.email.trim().toLowerCase(),
      senha: input.password,
      perfil: roleToPerfil(input.role),
    },
  });

  return mapUsuarioToSystemUser(usuario);
}

export interface DeleteUserInput {
  id: string;
  senhaAdmin: string;
}

export async function deleteUser({ id, senhaAdmin }: DeleteUserInput): Promise<void> {
  await apiRequest<{ ok: true }>(`/usuarios/${id}`, {
    method: 'DELETE',
    body: { senhaAdmin },
  });
}
