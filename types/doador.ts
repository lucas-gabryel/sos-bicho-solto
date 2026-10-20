export interface Doador {
  id: string;
  codigo?: number;
  nome: string;
  cpfCnpj: string;
  telefone: string;
  email: string;
  endereco: string;
  criadoEm?: string;
  modificadoEm?: string;
}

export interface DoadorFormValues {
  nome: string;
  cpfCnpj: string;
  telefone: string;
  email: string;
  endereco: string;
}
