export interface LoginCredentials {
  email: string;
  password: string;
}

export async function login(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 500));
}
