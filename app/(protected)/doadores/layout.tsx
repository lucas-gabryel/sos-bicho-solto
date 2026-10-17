import { type Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Doadores',
};

export default function DoadoresLayout({ children }: { children: React.ReactNode }) {
  return children;
}
