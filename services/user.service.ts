import { hash } from 'bcryptjs';

import { clearClientSession, startClientSession } from '@/lib/session';
import type { CreateUserInput, CurrentUser, StoredUser, SystemUser, UserRole } from '@/types/user';

const MOCK_DELAY = 300;
const USERS_STORAGE_KEY = 'sos-bicho-solto:users';
const CURRENT_USER_ID_STORAGE_KEY = 'sos-bicho-solto:current-user-id';

const seedUsers: StoredUser[] = [
  {
    id: 'USR-001',
    name: 'Malba Vinicius',
    email: 'admin@sosbichosolto.com',
    role: 'admin',
    createdAt: '2026-05-01',
    passwordHash: '$2b$10$YNPkDxFd5Ab0BzASeheOiuAWQqLU2QjCh.wkz6plg./d7buhhJlp.',
  },
  {
    id: 'USR-002',
    name: 'Paula Freitas',
    email: 'protetor@sosbichosolto.com',
    role: 'protetor',
    createdAt: '2026-05-02',
    passwordHash: '$2b$10$5cBaZ0.bT.VJfDt7vpraxujfUCOuRuTDu/ANfNmiaFwCKJB5QMMC2',
  },
];

function wait(delay = MOCK_DELAY) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

function isBrowser() {
  return typeof window !== 'undefined';
}

function cloneStoredUser(user: StoredUser): StoredUser {
  return { ...user };
}

function cloneSeedUsers() {
  return seedUsers.map(cloneStoredUser);
}

function sanitizeUser(user: StoredUser): SystemUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
}

function readUsersFromStorage(): StoredUser[] {
  if (!isBrowser()) {
    return cloneSeedUsers();
  }

  const storedUsers = window.localStorage.getItem(USERS_STORAGE_KEY);

  if (!storedUsers) {
    const initialUsers = cloneSeedUsers();
    window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(initialUsers));
    return initialUsers;
  }

  try {
    const parsedUsers = JSON.parse(storedUsers) as StoredUser[];

    if (!Array.isArray(parsedUsers) || parsedUsers.length === 0) {
      throw new Error('Invalid users payload');
    }

    return parsedUsers.map(cloneStoredUser);
  } catch {
    const fallbackUsers = cloneSeedUsers();
    window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(fallbackUsers));
    return fallbackUsers;
  }
}

function writeUsersToStorage(users: StoredUser[]) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

function readCurrentUserId() {
  if (!isBrowser()) {
    return null;
  }

  return window.localStorage.getItem(CURRENT_USER_ID_STORAGE_KEY);
}

function writeCurrentUserId(userId: string | null) {
  if (!isBrowser()) {
    return;
  }

  if (userId) {
    window.localStorage.setItem(CURRENT_USER_ID_STORAGE_KEY, userId);
    return;
  }

  window.localStorage.removeItem(CURRENT_USER_ID_STORAGE_KEY);
}

function getNextUserId(users: StoredUser[]) {
  const lastId = users.reduce((max, user) => {
    const currentId = Number(user.id.replace('USR-', ''));

    return Number.isNaN(currentId) ? max : Math.max(max, currentId);
  }, 0);

  return `USR-${String(lastId + 1).padStart(3, '0')}`;
}

function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function getCurrentStoredUserSync(): StoredUser | null {
  const users = readUsersFromStorage();
  const currentUserId = readCurrentUserId();

  if (!currentUserId) {
    return null;
  }

  const currentUser = users.find((user) => user.id === currentUserId);

  if (!currentUser) {
    setCurrentUserSession(null);
    return null;
  }

  return cloneStoredUser(currentUser);
}

function ensureAdminAccess() {
  const currentUser = getCurrentStoredUserSync();

  if (!currentUser || currentUser.role !== 'admin') {
    throw new Error('Acesso restrito a administradores.');
  }
}

export function getStoredUserByEmail(email: string): StoredUser | null {
  const normalizedEmail = normalizeEmail(email);
  const users = readUsersFromStorage();
  const user = users.find((item) => item.email === normalizedEmail);

  return user ? cloneStoredUser(user) : null;
}

export function setCurrentUserSession(userId: string | null) {
  writeCurrentUserId(userId);

  if (userId) {
    startClientSession();
    return;
  }

  clearClientSession();
}

export function getRoleLabel(role: UserRole) {
  return role === 'admin' ? 'Administrador' : 'Protetor';
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  await wait();

  const currentUser = getCurrentStoredUserSync();

  return currentUser ? sanitizeUser(currentUser) : null;
}

export async function getUsers(): Promise<SystemUser[]> {
  await wait();
  ensureAdminAccess();

  return readUsersFromStorage().map(sanitizeUser);
}

export async function createUser(input: CreateUserInput): Promise<SystemUser> {
  await wait();
  ensureAdminAccess();

  const users = readUsersFromStorage();
  const normalizedEmail = normalizeEmail(input.email);

  if (users.some((user) => user.email === normalizedEmail)) {
    throw new Error('Ja existe um usuario com este e-mail.');
  }

  const passwordHash = await hash(input.password, 10);

  const newUser: StoredUser = {
    id: getNextUserId(users),
    name: input.name.trim(),
    email: normalizedEmail,
    role: input.role,
    createdAt: getTodayDate(),
    passwordHash,
  };

  writeUsersToStorage([newUser, ...users]);

  return sanitizeUser(newUser);
}

export async function deleteUser(userId: string): Promise<void> {
  await wait();
  ensureAdminAccess();

  const users = readUsersFromStorage();
  const userExists = users.some((user) => user.id === userId);

  if (!userExists) {
    throw new Error('Usuario nao encontrado.');
  }

  if (readCurrentUserId() === userId) {
    throw new Error('Nao e permitido excluir o proprio usuario com a sessao aberta.');
  }

  writeUsersToStorage(users.filter((user) => user.id !== userId));
}

export async function logout(): Promise<void> {
  await wait(150);
  setCurrentUserSession(null);
}
