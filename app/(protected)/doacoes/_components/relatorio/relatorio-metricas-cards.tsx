'use client';

import { CircleDollarSign, HeartHandshake, Package } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { ResumoRelatorio } from '@/types/doacao';

interface RelatorioMetricasCardsProps {
  resumo?: ResumoRelatorio;
  isLoading: boolean;
}

export function RelatorioMetricasCards({ resumo, isLoading }: RelatorioMetricasCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
      {/* Total em Dinheiro */}
      <div className="relative overflow-hidden rounded-[14px] border border-border bg-card p-5 shadow-2xs">
        <div className="pointer-events-none absolute -bottom-4 -right-4 size-20 rounded-full bg-emerald-500 opacity-[0.07]" />
        <div className="mb-3.5 flex size-9 items-center justify-center rounded-[10px] bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
          <CircleDollarSign className="size-4.5" />
        </div>
        <p className="mb-1 text-xs text-muted-foreground">Total Recebido em Dinheiro</p>
        {isLoading ? (
          <Skeleton className="h-7 w-28" />
        ) : (
          <p className="text-[26px] font-semibold leading-none text-emerald-600 dark:text-emerald-400">
            {resumo?.totalDinheiroFormatado ?? 'R$ 0,00'}
          </p>
        )}
        <p className="mt-1.5 text-[11px] text-muted-foreground/70">
          somatório financeiro no período filtrado
        </p>
      </div>

      {/* Total de Registros */}
      <div className="relative overflow-hidden rounded-[14px] border border-border bg-card p-5 shadow-2xs">
        <div className="pointer-events-none absolute -bottom-4 -right-4 size-20 rounded-full bg-orange-500 opacity-[0.07]" />
        <div className="mb-3.5 flex size-9 items-center justify-center rounded-[10px] bg-orange-100 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400">
          <HeartHandshake className="size-4.5" />
        </div>
        <p className="mb-1 text-xs text-muted-foreground">Total de Registros Encontrados</p>
        {isLoading ? (
          <Skeleton className="h-7 w-16" />
        ) : (
          <p className="text-[26px] font-semibold leading-none text-foreground">
            {resumo?.totalRegistros ?? 0}
          </p>
        )}
        <p className="mt-1.5 text-[11px] text-muted-foreground/70">
          doações correspondentes aos filtros aplicados
        </p>
      </div>

      {/* Total de Categorias de Itens */}
      <div className="relative overflow-hidden rounded-[14px] border border-border bg-card p-5 shadow-2xs">
        <div className="pointer-events-none absolute -bottom-4 -right-4 size-20 rounded-full bg-blue-500 opacity-[0.07]" />
        <div className="mb-3.5 flex size-9 items-center justify-center rounded-[10px] bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
          <Package className="size-4.5" />
        </div>
        <p className="mb-1 text-xs text-muted-foreground">Categorias de Itens Físicos</p>
        {isLoading ? (
          <Skeleton className="h-7 w-16" />
        ) : (
          <p className="text-[26px] font-semibold leading-none text-foreground">
            {resumo?.itensAgrupados?.length ?? 0}
          </p>
        )}
        <p className="mt-1.5 text-[11px] text-muted-foreground/70">
          grupos distintos com quantidade acumulada
        </p>
      </div>
    </div>
  );
}
