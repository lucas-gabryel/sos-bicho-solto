export type UserRole = 'admin' | 'protetor';

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface StoredUser extends SystemUser {
  passwordHash: string;
}

export type CurrentUser = SystemUser;

export interface CreateUserInput {
  name: string;
  email: string;
  role: UserRole;
  password: string;
}

export interface CreateUserFormValues extends CreateUserInput {
  confirmPassword: string;
}
