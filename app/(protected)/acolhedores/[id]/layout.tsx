import { type Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Detalhe do acolhedor',
};

export default function AcolhedorDetailLayout({ children }: { children: React.ReactNode }) {
  return children;
}
