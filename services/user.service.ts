export interface CurrentUser {
  name: string;
  role: 'Administrador' | 'Protetor';
}

export async function getCurrentUser(): Promise<CurrentUser> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  return {
    name: 'Malba Vinicius',
    role: 'Administrador',
  };
}
