export interface Tutor {
  id: string;
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  endereco: string;
  dataNascimento: string;
  animaisAdotadosIds: string[];
  totalAnimaisAdotados: number;
}

export interface TutorFormValues {
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  endereco: string;
  dataNascimento: string;
}
