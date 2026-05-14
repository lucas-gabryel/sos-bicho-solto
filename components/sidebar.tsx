'use client';

import { Button } from '@/components/ui/button';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useLogout } from '@/hooks/use-logout';
import { getRoleLabel } from '@/lib/user';
import { cn } from '@/lib/utils';
import { HeartHandshake, LayoutDashboard, LogOut, Menu, Moon, PawPrint, Sun, UserCog, Users, X } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const NAV_GROUPS = [
  {
    section: 'Principal',
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/animals', label: 'Animais', icon: PawPrint },
    ],
  },
  {
    section: 'Gestao',
    items: [
      { href: '/tutores', label: 'Tutores', icon: Users },
      { href: '/adocoes', label: 'Historico de Adocoes', icon: HeartHandshake },
      { href: '/usuarios', label: 'Usuarios do Sistema', icon: UserCog, adminOnly: true },
    ],
  },
] as const;

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/animals': 'Animais',
  '/tutores': 'Tutores',
  '/adocoes': 'Historico de Adocoes',
  '/usuarios': 'Usuarios do Sistema',
};

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const { data: user } = useCurrentUser();
  const logout = useLogout();
  const { resolvedTheme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  const pageTitle =
    Object.entries(PAGE_TITLES).find(([key]) => pathname === key || pathname.startsWith(`${key}/`))?.[1] ?? '';

  const toggleTheme = () => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  const closeMobile = () => setMobileOpen(false);

  const handleLogout = async () => {
    closeMobile();
    await logout.mutateAsync();
    router.replace('/login');
  };

  const initials = user?.name
    ?.split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <>
      <header className="sticky top-0 z-40 flex items-center gap-3 border-b border-border bg-card px-4 py-3 md:hidden">
        <Button variant="ghost" size="icon" onClick={() => setMobileOpen(true)} aria-label="Abrir menu">
          <Menu />
        </Button>
        <span className="flex-1 text-[15px] font-semibold text-foreground">{pageTitle || 'SOS Bicho Solto'}</span>
        <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Alternar tema">
          <Sun className="hidden dark:block" />
          <Moon className="dark:hidden" />
        </Button>
      </header>

      <div
        onClick={closeMobile}
        className={cn(
          'fixed inset-0 z-40 bg-black/45 backdrop-blur-sm transition-opacity duration-300 md:hidden',
          mobileOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
        )}
        aria-hidden
      />

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-60 flex-col border-r border-border bg-card transition-transform duration-300 ease-in-out',
          'max-md:-translate-x-full',
          mobileOpen && 'max-md:translate-x-0',
        )}
      >
        <div className="flex items-center justify-between border-b border-border px-3.5 py-4.5">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-linear-to-br from-orange-600 to-orange-800 text-white shadow-sm">
              <PawPrint className="size-4.25" />
            </div>
            <div>
              <p className="text-sm font-semibold leading-tight text-foreground">SOS Bicho Solto</p>
              <p className="text-[11px] text-muted-foreground">Modulo interno</p>
            </div>
          </div>
          <Button variant="ghost" size="icon-sm" onClick={closeMobile} className="md:hidden" aria-label="Fechar menu">
            <X />
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-2.5">
          {NAV_GROUPS.map((group) => {
            const visibleItems = group.items.filter((item) => !('adminOnly' in item && item.adminOnly) || user?.role === 'admin');

            if (visibleItems.length === 0) {
              return null;
            }

            return (
              <div key={group.section} className="mb-1">
                <p className="mb-1 px-2.5 pt-2.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground/60">
                  {group.section}
                </p>
                {visibleItems.map(({ href, label, icon: Icon }) => {
                  const active = isActive(href);
                  return (
                    <Button
                      key={href}
                      asChild
                      variant="sidebar"
                      className={cn(
                        'relative mb-0.5',
                        active && 'bg-orange-50 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400',
                      )}
                    >
                      <Link href={href} onClick={closeMobile}>
                        {active ? (
                          <span className="absolute left-0 top-1/2 h-4.5 w-0.75 -translate-y-1/2 rounded-r bg-orange-600 dark:bg-orange-400" />
                        ) : null}
                        <Icon
                          className={cn(
                            'size-3.75 shrink-0',
                            active ? 'text-orange-600 dark:text-orange-400' : 'group-hover/button:text-foreground',
                          )}
                        />
                        <span>{label}</span>
                      </Link>
                    </Button>
                  );
                })}
              </div>
            );
          })}
        </nav>

        <div className="border-t border-border px-2 py-2.5">
          <div className="mb-0.5 flex items-center gap-2.5 rounded-[10px] px-2.5 py-2">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-semibold text-orange-700 dark:bg-orange-950/40 dark:text-orange-400">
              {initials ?? '--'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium text-foreground">{user?.name ?? '--'}</p>
              <p className="text-[11px] text-muted-foreground">{user ? getRoleLabel(user.role) : '--'}</p>
            </div>
          </div>

          <Button variant="sidebar" onClick={toggleTheme}>
            <Sun className="hidden size-3.75 dark:block" />
            <Moon className="size-3.75 dark:hidden" />
            <span className="dark:hidden">Modo escuro</span>
            <span className="hidden dark:block">Modo claro</span>
          </Button>

          <Button
            variant="sidebar"
            onClick={handleLogout}
            disabled={logout.isPending}
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="size-3.75" />
            <span>{logout.isPending ? 'Saindo...' : 'Sair do sistema'}</span>
          </Button>
        </div>
      </aside>
    </>
  );
}
