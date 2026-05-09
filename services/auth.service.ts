export interface LoginCredentials {
  email: string;
  password: string;
}

export async function login(_credentials: LoginCredentials): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 500));
}
