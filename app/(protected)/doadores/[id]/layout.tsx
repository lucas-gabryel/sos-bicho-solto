import { type Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Detalhe do doador',
};

export default function DoadorDetailLayout({ children }: { children: React.ReactNode }) {
  return children;
}
