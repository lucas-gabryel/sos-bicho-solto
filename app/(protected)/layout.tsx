import { Sidebar } from '@/components/sidebar';

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="md:ml-60">{children}</main>
    </div>
  );
}
