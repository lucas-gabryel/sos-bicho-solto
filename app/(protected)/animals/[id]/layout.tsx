import { type Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Detalhe do animal',
};

export default function AnimalDetailLayout({ children }: { children: React.ReactNode }) {
  return children;
}
