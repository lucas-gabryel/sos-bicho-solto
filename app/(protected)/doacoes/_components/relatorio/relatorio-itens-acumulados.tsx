'use client';

import { Package } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { ItemAgrupadoRelatorio, TipoDoacao } from '@/types/doacao';
import { formatQuantity, TIPO_BADGES } from './relatorio-constants';

interface RelatorioItensAcumuladosProps {
  itensAgrupados?: ItemAgrupadoRelatorio[];
  tipoFiltro?: TipoDoacao | '';
  isLoading: boolean;
}

export function RelatorioItensAcumulados({
  itensAgrupados,
  tipoFiltro,
  isLoading,
}: RelatorioItensAcumuladosProps) {
  const itens = itensAgrupados ?? [];

  return (
    <div className="rounded-[14px] border border-border bg-card p-5 shadow-2xs">
      <div className="mb-3">
        <h2 className="text-sm font-semibold text-foreground">Soma Acumulada por Tipo de Item</h2>
        <p className="text-[11px] text-muted-foreground">
          Total de quantidades agrupadas por categoria e unidade de medida
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-lg border border-border p-3.5">
              <Skeleton className="mb-2 h-4 w-24" />
              <Skeleton className="h-6 w-16" />
            </div>
          ))}
        </div>
      ) : itens.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-8 text-center text-xs text-muted-foreground">
          <Package className="mb-1.5 size-7 opacity-35" />
          <p className="font-medium">
            {tipoFiltro === 'DINHEIRO'
              ? 'Filtro exclusivo de dinheiro selecionado (nenhum item físico aplicável).'
              : 'Nenhum item físico registrado no período filtrado.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {itens.map((item, idx) => {
            const config = TIPO_BADGES[item.tipo] ?? TIPO_BADGES.OUTRO;
            const Icon = config.icon;
            return (
              <div
                key={`${item.tipo}-${item.unidadeMedida ?? 'default'}-${idx}`}
                className="flex items-center gap-3.5 rounded-lg border border-border/80 bg-muted/20 p-3.5 transition-colors hover:bg-muted/40"
              >
                <div
                  className={cn(
                    'flex size-9 shrink-0 items-center justify-center rounded-md',
                    config.bg,
                    config.text,
                  )}
                >
                  <Icon className="size-4.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-muted-foreground">{item.tipoLabel}</p>
                  <p className="text-base font-semibold text-foreground">
                    {formatQuantity(item.quantidadeTotal, item.unidadeMedida)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
