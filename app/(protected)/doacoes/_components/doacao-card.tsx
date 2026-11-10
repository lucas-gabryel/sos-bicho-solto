import {
  Calendar,
  CircleDollarSign,
  HeartHandshake,
  Package,
  Pill,
  Sparkles,
  User,
  UserX,
} from 'lucide-react';
import Link from 'next/link';

import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { Doacao, TipoDoacao } from '@/types/doacao';
import { TIPO_DOACAO_LABELS } from '@/types/doacao';

function formatCurrency(value?: number | null) {
  if (value === undefined || value === null) return '--';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

function formatDate(dateStr: string) {
  if (!dateStr) return '--';
  const [year, month, day] = dateStr.slice(0, 10).split('-');
  if (!year || !month || !day) return dateStr;
  return `${day}/${month}/${year}`;
}

const TIPO_CONFIG: Record<
  TipoDoacao,
  { icon: typeof CircleDollarSign; bg: string; text: string; label: string }
> = {
  DINHEIRO: {
    icon: CircleDollarSign,
    bg: 'bg-emerald-100 dark:bg-emerald-950/40',
    text: 'text-emerald-700 dark:text-emerald-400',
    label: TIPO_DOACAO_LABELS.DINHEIRO,
  },
  RACAO: {
    icon: Package,
    bg: 'bg-amber-100 dark:bg-amber-950/40',
    text: 'text-amber-700 dark:text-amber-400',
    label: TIPO_DOACAO_LABELS.RACAO,
  },
  MEDICAMENTO: {
    icon: Pill,
    bg: 'bg-blue-100 dark:bg-blue-950/40',
    text: 'text-blue-700 dark:text-blue-400',
    label: TIPO_DOACAO_LABELS.MEDICAMENTO,
  },
  PRODUTO_LIMPEZA: {
    icon: Sparkles,
    bg: 'bg-cyan-100 dark:bg-cyan-950/40',
    text: 'text-cyan-700 dark:text-cyan-400',
    label: TIPO_DOACAO_LABELS.PRODUTO_LIMPEZA,
  },
  OUTRO: {
    icon: HeartHandshake,
    bg: 'bg-purple-100 dark:bg-purple-950/40',
    text: 'text-purple-700 dark:text-purple-400',
    label: TIPO_DOACAO_LABELS.OUTRO,
  },
};

export function DoacaoCard({ doacao }: { doacao: Doacao }) {
  const config = TIPO_CONFIG[doacao.tipo] ?? TIPO_CONFIG.OUTRO;
  const Icon = config.icon;

  const isDinheiro = doacao.tipo === 'DINHEIRO';
  const mainHighlight = isDinheiro
    ? formatCurrency(doacao.valor)
    : `${doacao.quantidade ?? 0} ${doacao.unidadeMedida ?? 'un'}`;

  return (
    <Card className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 transition-shadow hover:shadow-md">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${config.bg} ${config.text}`}>
              <Icon className="size-5" />
            </div>
            <div>
              <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ${config.bg} ${config.text}`}>
                {config.label}
              </span>
              <p className="mt-1 text-lg font-bold text-foreground">{mainHighlight}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="size-3.5" />
            <span>{formatDate(doacao.dataRecebimento)}</span>
          </div>
        </div>

        {doacao.descricao && (
          <p className="mt-3 text-xs text-muted-foreground line-clamp-2">
            {doacao.descricao}
          </p>
        )}
      </div>

      <div className="mt-4 border-t border-border pt-3.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Origem:</span>
          {doacao.anonima || !doacao.doador ? (
            <span className="inline-flex items-center gap-1 rounded bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
              <UserX className="size-3" />
              Doação anônima
            </span>
          ) : (
            <Link
              href={`/doadores/${doacao.doador.id}`}
              className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
              title={`Ver doador ${doacao.doador.nome}`}
            >
              <User className="size-3" />
              <span className="max-w-36 truncate">{doacao.doador.nome}</span>
            </Link>
          )}
        </div>
      </div>
    </Card>
  );
}

export function DoacaoCardSkeleton() {
  return (
    <Card className="rounded-2xl border border-border p-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="size-10 rounded-xl" />
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-5 w-28" />
          </div>
        </div>
        <Skeleton className="h-4 w-20" />
      </div>
      <Skeleton className="mt-4 h-3 w-full" />
      <div className="mt-4 border-t border-border pt-3 flex justify-between">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-24" />
      </div>
    </Card>
  );
}
