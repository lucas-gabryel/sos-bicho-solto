import { type Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Animais',
};

export default function AnimalsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
