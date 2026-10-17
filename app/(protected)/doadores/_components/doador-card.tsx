'use client';

import { Building2, Mail, MapPin, Phone, User } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { onlyDigits } from '@/lib/utils';
import type { Doador } from '@/types/doador';

interface DoadorCardProps {
  doador: Doador;
  onEdit?: (doador: Doador) => void;
}

export function DoadorCard({ doador, onEdit }: DoadorCardProps) {
  const digitsCount = onlyDigits(doador.cpfCnpj).length;
  const isPessoaJuridica = digitsCount === 14;

  const initial = doador.nome.trim().charAt(0).toUpperCase() || 'D';

  return (
    <Card
      onClick={() => onEdit?.(doador)}
      className="group relative gap-0 rounded-[14px] border border-border p-0 ring-0 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="p-4.5">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex size-10.5 shrink-0 items-center justify-center rounded-full bg-orange-100 text-[17px] font-bold text-orange-700 dark:bg-orange-950/40 dark:text-orange-400">
            {initial}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="truncate text-sm font-semibold text-foreground" title={doador.nome}>
                {doador.nome}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <p className="truncate font-mono text-[11px] text-muted-foreground/80">
                {doador.cpfCnpj}
              </p>
              <span className="inline-flex items-center gap-1 rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                {isPessoaJuridica ? (
                  <>
                    <Building2 className="size-2.5" />
                    PJ
                  </>
                ) : (
                  <>
                    <User className="size-2.5" />
                    PF
                  </>
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1 text-[12px] text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Mail className="size-3.5 shrink-0 text-muted-foreground/70" />
            <span className="truncate" title={doador.email}>
              {doador.email}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Phone className="size-3.5 shrink-0 text-muted-foreground/70" />
            <span>{doador.telefone}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 border-t border-border bg-muted/40 px-4.5 py-3 text-[12px] font-medium text-muted-foreground">
        <MapPin className="size-3.5 shrink-0 text-orange-600 dark:text-orange-400" />
        <span className="truncate" title={doador.endereco}>
          {doador.endereco || 'Endereço não informado'}
        </span>
      </div>
    </Card>
  );
}

export function DoadorCardSkeleton() {
  return (
    <Card className="gap-0 rounded-[14px] border border-border p-0 ring-0">
      <div className="p-4.5">
        <div className="mb-3 flex items-center gap-3">
          <Skeleton className="size-10.5 shrink-0 rounded-full" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
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
