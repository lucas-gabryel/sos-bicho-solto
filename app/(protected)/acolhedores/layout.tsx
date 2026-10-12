import { type Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Acolhedores',
};

export default function AcolhedoresLayout({ children }: { children: React.ReactNode }) {
  return children;
}
