'use client';

import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge } from './status-badge';

export interface RecentAnimal {
  id: string;
  numeroRegistro: string;
  nome: string;
  esp: string;
  local: string;
  status: 'Adotado' | 'Acolhimento';
}

export function RecentTable({ animals, isLoading = false }: { animals: RecentAnimal[]; isLoading?: boolean }) {
  const router = useRouter();

  return (
    <Table className="border-collapse">
      <TableHeader>
        <TableRow className="border-b border-border bg-muted/40 hover:bg-muted/40">
          {['Nº Registro', 'Nome', 'Espécie', 'Localidade', 'Status', ''].map((h, i) => (
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
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i} className="border-b border-border">
                <TableCell className="px-5 py-3">
                  <Skeleton className="h-3 w-20" />
                </TableCell>
                <TableCell className="px-5 py-3">
                  <Skeleton className="h-3.5 w-28" />
                </TableCell>
                <TableCell className="px-5 py-3">
                  <Skeleton className="h-3.5 w-16" />
                </TableCell>
                <TableCell className="px-5 py-3">
                  <Skeleton className="h-3 w-32" />
                </TableCell>
                <TableCell className="px-5 py-3">
                  <Skeleton className="h-5 w-24 rounded-full" />
                </TableCell>
                <TableCell className="px-5 py-3">
                  <Skeleton className="size-7 rounded-md" />
                </TableCell>
              </TableRow>
            ))
          : animals.map((animal) => (
          <TableRow
            key={animal.id}
            onClick={() => router.push(`/animals/${animal.id}`)}
            className="cursor-pointer border-b border-border hover:bg-orange-50/60 dark:hover:bg-orange-950/10"
          >
            <TableCell className="px-5 py-3">
              <span className="font-mono text-[11px] text-muted-foreground">{animal.numeroRegistro}</span>
            </TableCell>
            <TableCell className="px-5 py-3 text-[13px] font-medium text-foreground">{animal.nome}</TableCell>
            <TableCell className="px-5 py-3 text-[13px] text-foreground">{animal.esp}</TableCell>
            <TableCell className="px-5 py-3 text-[12px] text-muted-foreground">{animal.local}</TableCell>
            <TableCell className="px-5 py-3">
              <StatusBadge status={animal.status} />
            </TableCell>
            <TableCell className="px-5 py-3">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/animals/${animal.id}`);
                }}
              >
                <ArrowRight className="size-3.5" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
