import { type Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Doações',
};

export default function DoacoesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
