import type { UserRole } from '@/types/user';

export function getRoleLabel(role: UserRole) {
  return role === 'admin' ? 'Administrador' : 'Protetor';
}
