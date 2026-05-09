'use client';

import { ArrowRight, Heart, Home, PawPrint, Users } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { useAnimals } from '@/hooks/use-animals';
import { useDashboardStats } from '@/hooks/use-dashboard-stats';
import { MetricCard } from './_components/metric-card';
import { RecentTable } from './_components/recent-table';

export default function DashboardPage() {
  const { data: animals = [] } = useAnimals();
  const { data: stats } = useDashboardStats();

  const today = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  const todayFormatted = today.charAt(0).toUpperCase() + today.slice(1);

  return (
    <div className="p-4 md:p-7">
      <div className="mb-6">
        <h1 className="text-[22px] font-semibold text-foreground">Dashboard</h1>
        <p className="mt-0.5 text-[13px] text-muted-foreground">{todayFormatted}</p>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3.5 md:grid-cols-4">
        <MetricCard
          label="Total de Animais"
          value={stats?.totalAnimais ?? 0}
          sub="registros no sistema"
          icon={PawPrint}
          color="orange"
          href="/animais"
        />
        <MetricCard
          label="Em Acolhimento"
          value={stats?.emAcolhimento ?? 0}
          sub="aguardando adoção"
          icon={Home}
          color="blue"
          href="/animais"
        />
        <MetricCard
          label="Adotados"
          value={stats?.adotados ?? 0}
          sub="com tutor vinculado"
          icon={Heart}
          color="green"
          href="/adocoes"
        />
        <MetricCard
          label="Tutores"
          value={stats?.tutores ?? 0}
          sub="cadastrados no sistema"
          icon={Users}
          color="purple"
          href="/tutores"
        />
      </div>

      <div className="overflow-hidden rounded-[14px] border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-5 py-[15px]">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Registros recentes</h2>
            <p className="mt-0.5 text-[11px] text-muted-foreground">Últimos 5 animais cadastrados</p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/animais">
              <ArrowRight className="size-3.5" />
              Ver todos
            </Link>
          </Button>
        </div>
        <RecentTable animals={animals} />
      </div>
    </div>
  );
}
