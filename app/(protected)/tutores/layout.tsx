import { type Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tutores',
};

export default function TutoresLayout({ children }: { children: React.ReactNode }) {
  return children;
}
