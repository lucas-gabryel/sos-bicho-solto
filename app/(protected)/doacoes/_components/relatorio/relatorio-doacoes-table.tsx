'use client';

import { AlertCircle, Gift } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import type { Doacao } from '@/types/doacao';
import {
  formatCurrency,
  formatDate,
  formatQuantity,
  TIPO_BADGES,
} from './relatorio-constants';

interface RelatorioDoacoesTableProps {
  doacoes: Doacao[];
  isLoading: boolean;
  error: unknown;
  onRefetch: () => void;
}

export function RelatorioDoacoesTable({
  doacoes,
  isLoading,
  error,
  onRefetch,
}: RelatorioDoacoesTableProps) {
  return (
    <div className="overflow-hidden rounded-[14px] border border-border bg-card shadow-2xs">
      <div className="border-b border-border px-5 py-3.5">
        <h2 className="text-sm font-semibold text-foreground">Detalhamento das Doações</h2>
        <p className="mt-0.5 text-[11px] text-muted-foreground">
          {isLoading
            ? 'Carregando doações...'
            : `Exibindo todos os ${doacoes.length} registros correspondentes aos filtros`}
        </p>
      </div>

      {error ? (
        <div className="flex flex-col items-center justify-center py-12 text-center text-sm text-destructive">
          <AlertCircle className="mb-2 size-8" />
          <p className="font-medium">Erro ao carregar dados do relatório.</p>
          <Button variant="outline" size="sm" onClick={onRefetch} className="mt-3">
            Tentar novamente
          </Button>
        </div>
      ) : isLoading ? (
        <Table className="border-collapse">
          <TableHeader>
            <TableRow className="border-b border-border bg-muted/40">
              {['Data', 'Doador', 'Tipo', 'Descrição', 'Qtd / Unidade', 'Valor'].map((h, i) => (
                <TableHead
                  key={i}
                  className="px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground"
                >
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i} className="border-b border-border">
                <TableCell className="px-5 py-3"><Skeleton className="h-3.5 w-16" /></TableCell>
                <TableCell className="px-5 py-3"><Skeleton className="h-3.5 w-32" /></TableCell>
                <TableCell className="px-5 py-3"><Skeleton className="h-5 w-20 rounded-full" /></TableCell>
                <TableCell className="px-5 py-3"><Skeleton className="h-3.5 w-40" /></TableCell>
                <TableCell className="px-5 py-3"><Skeleton className="h-3.5 w-16" /></TableCell>
                <TableCell className="px-5 py-3"><Skeleton className="h-3.5 w-20" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : doacoes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
          <Gift className="mb-2 size-10 opacity-30" />
          <p className="text-sm font-medium">Nenhuma doação encontrada para os filtros selecionados.</p>
          <p className="mt-1 text-xs text-muted-foreground/80">
            Ajuste as datas ou o tipo de doação acima para visualizar outros períodos.
          </p>
        </div>
      ) : (
        <Table className="border-collapse">
          <TableHeader>
            <TableRow className="border-b border-border bg-muted/40 hover:bg-muted/40">
              <TableHead className="px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
                Data
              </TableHead>
              <TableHead className="px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
                Doador
              </TableHead>
              <TableHead className="px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
                Tipo
              </TableHead>
              <TableHead className="px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
                Descrição
              </TableHead>
              <TableHead className="px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
                Quantidade
              </TableHead>
              <TableHead className="px-5 py-2.5 text-right text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
                Valor (R$)
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {doacoes.map((doacao) => {
              const config = TIPO_BADGES[doacao.tipo] ?? TIPO_BADGES.OUTRO;
              return (
                <TableRow
                  key={doacao.id}
                  className="border-b border-border transition-colors hover:bg-muted/40"
                >
                  <TableCell className="px-5 py-3 text-[13px] font-medium text-foreground">
                    {formatDate(doacao.dataRecebimento)}
                  </TableCell>
                  <TableCell className="px-5 py-3 text-[13px]">
                    {doacao.anonima ? (
                      <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                        Anônimo
                      </span>
                    ) : (
                      <span className="font-medium text-foreground">
                        {doacao.doador?.nome || 'Anônimo'}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="px-5 py-3">
                    <Badge className={cn('text-[11px] font-medium', config.bg, config.text)}>
                      {config.label}
                    </Badge>
                  </TableCell>
                  <TableCell
                    className="max-w-xs truncate px-5 py-3 text-[12px] text-muted-foreground"
                    title={doacao.descricao ?? ''}
                  >
                    {doacao.descricao || '-'}
                  </TableCell>
                  <TableCell className="px-5 py-3 text-[13px] text-foreground">
                    {formatQuantity(doacao.quantidade, doacao.unidadeMedida)}
                  </TableCell>
                  <TableCell className="px-5 py-3 text-right text-[13px] font-semibold text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(doacao.valor)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
