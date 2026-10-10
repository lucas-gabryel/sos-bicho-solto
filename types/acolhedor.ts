export type SituacaoAcolhedor = 'ADOTANTE' | 'TUTOR';

export interface Acolhedor {
  id: string;
  codigo: number;
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  endereco: string;
  dataNascimento: string;
  totalAnimaisAdotados: number;
  situacao: SituacaoAcolhedor;
}

export interface AcolhedorFormValues {
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  endereco: string;
  dataNascimento: string;
}
