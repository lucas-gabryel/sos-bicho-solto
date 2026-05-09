'use client';

import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { StatusBadge } from './status-badge';

export interface RecentAnimal {
  id: string;
  nome: string;
  esp: string;
  local: string;
  status: 'Adotado' | 'Acolhimento';
}

function speciesEmoji(esp: string) {
  return esp === 'Cão' ? '🐶' : '🐱';
}

export function RecentTable({ animals }: { animals: RecentAnimal[] }) {
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
        {animals.map((animal) => (
          <TableRow
            key={animal.id}
            onClick={() => router.push(`/animals/${animal.id}`)}
            className="cursor-pointer border-b border-border hover:bg-orange-50/60 dark:hover:bg-orange-950/10"
          >
            <TableCell className="px-5 py-3">
              <span className="font-mono text-[11px] text-muted-foreground">{animal.id}</span>
            </TableCell>
            <TableCell className="px-5 py-3 text-[13px] font-medium text-foreground">
              {animal.nome}
            </TableCell>
            <TableCell className="px-5 py-3 text-[13px] text-foreground">
              {speciesEmoji(animal.esp)} {animal.esp}
            </TableCell>
            <TableCell className="px-5 py-3 text-[12px] text-muted-foreground">
              {animal.local}
            </TableCell>
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
