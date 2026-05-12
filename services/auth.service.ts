export interface LoginCredentials {
  email: string;
  password: string;
}

export async function login(credentials: LoginCredentials): Promise<void> {
  void credentials;
  await new Promise((resolve) => setTimeout(resolve, 500));
}
