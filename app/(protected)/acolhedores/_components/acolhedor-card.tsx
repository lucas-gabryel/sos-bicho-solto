'use client';

import { ChevronRight, Mail, PawPrint, Phone, Printer } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { SituacaoBadge } from '@/components/situacao-badge';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { Acolhedor } from '@/types/acolhedor';
import { PrintAcolhedorModal } from './print-acolhedor-modal';

interface AcolhedorCardProps {
  acolhedor: Acolhedor;
  onPrint?: (acolhedor: Acolhedor) => void;
}

export function AcolhedorCard({ acolhedor, onPrint }: AcolhedorCardProps) {
  const [isPrintOpen, setIsPrintOpen] = useState(false);
  const adoptedCount = acolhedor.totalAnimaisAdotados;

  return (
    <div className="group relative">
      <Link href={`/acolhedores/${acolhedor.id}`} className="block">
        <Card className="gap-0 rounded-[14px] border border-border p-0 ring-0 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md">
          <div className="p-4.5 pr-10">
            <div className="mb-2.75 flex items-center gap-2.75">
              <div className="flex size-10.5 shrink-0 items-center justify-center rounded-full bg-orange-100 text-[17px] font-bold text-orange-700 dark:bg-orange-950/40 dark:text-orange-400">
                {acolhedor.nome.charAt(0)}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">{acolhedor.nome}</p>
                <p className="truncate font-mono text-[11px] text-muted-foreground/70">{acolhedor.cpf}</p>
              </div>

              <SituacaoBadge situacao={acolhedor.situacao} />
              <ChevronRight className="size-3 shrink-0 text-muted-foreground/70" />
            </div>

            <div className="flex flex-col gap-1 text-[12px] text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Mail className="size-3.5 shrink-0 text-muted-foreground/70" />
                <span className="truncate">{acolhedor.email}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <Phone className="size-3.5 shrink-0 text-muted-foreground/70" />
                <span>{acolhedor.telefone}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 border-t border-border bg-muted/40 px-4.5 py-3 text-[12px] font-medium text-muted-foreground">
            <PawPrint className="size-3.5 shrink-0 text-orange-600 dark:text-orange-400" />
            <span>
              {adoptedCount} {adoptedCount === 1 ? 'animal adotado' : 'animais adotados'}
            </span>
          </div>
        </Card>
      </Link>

      <button
        type="button"
        aria-label={`Imprimir ficha de ${acolhedor.nome}`}
        title={`Imprimir ficha de ${acolhedor.nome}`}
        className="absolute right-2.5 top-2.5 z-10 flex size-7 items-center justify-center rounded-full bg-background/85 text-foreground/80 shadow-xs backdrop-blur-xs transition hover:bg-background hover:text-orange-600 dark:bg-background/90"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (onPrint) {
            onPrint(acolhedor);
          } else {
            setIsPrintOpen(true);
          }
        }}
      >
        <Printer className="size-3.5" />
      </button>

      {!onPrint && isPrintOpen && (
        <PrintAcolhedorModal
          open={isPrintOpen}
          onOpenChange={setIsPrintOpen}
          acolhedor={acolhedor}
        />
      )}
    </div>
  );
}

export function AcolhedorCardSkeleton() {
  return (
    <Card className="gap-0 rounded-[14px] border border-border p-0 ring-0">
      <div className="p-4.5">
        <div className="mb-2.75 flex items-center gap-2.75">
          <Skeleton className="size-10.5 shrink-0 rounded-full" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3.5 w-32" />
            <Skeleton className="h-2.5 w-24" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-3 w-28" />
        </div>
      </div>

      <div className="border-t border-border bg-muted/40 px-4.5 py-3">
        <Skeleton className="h-3.5 w-36" />
      </div>
    </Card>
  );
}
