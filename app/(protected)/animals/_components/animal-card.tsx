import Link from 'next/link';
import { Mars, Venus } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Animal } from '@/services/animal.service';

function speciesEmoji(esp: string) {
  return esp === 'Cão' ? '🐶' : '🐱';
}

export function AnimalCard({ animal }: { animal: Animal }) {
  const adopted = animal.status === 'Adotado';

  return (
    <Link href={`/animals/${animal.id}`} className="block">
      <Card className="cursor-pointer gap-0 rounded-[14px] border border-border py-0 ring-0 transition-all duration-150 hover:-translate-y-[3px] hover:border-foreground/20 hover:shadow-md">
        <div className="flex h-30 items-center justify-center bg-muted/50 text-[52px]">
          {speciesEmoji(animal.esp)}
        </div>
        <div className="p-3.25">
          <p className="mb-0.5 font-mono text-[10px] text-muted-foreground/60">{animal.id}</p>
          <p className="mb-1.5 truncate text-sm font-semibold text-foreground">
            {animal.nome} · {animal.raca}
          </p>
          <div className="mb-2 flex flex-wrap items-center gap-1.5 text-[12px] text-muted-foreground">
            {animal.sexo === 'Macho'
              ? <Mars className="size-3 shrink-0" />
              : <Venus className="size-3 shrink-0" />}
            <span>{animal.sexo}</span>
            <span className="text-muted-foreground/30">·</span>
            <span>{animal.cor}</span>
            <span className="text-muted-foreground/30">·</span>
            <span>{(animal.pesoAt ?? animal.peso).toFixed(1)}kg</span>
          </div>
          <Badge
            className={cn(
              'h-auto gap-1.5 rounded-full border-transparent px-2.5 py-0.5 text-[11px] font-semibold',
              adopted
                ? 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400'
                : 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400',
            )}
          >
            <span
              className={cn(
                'size-1.5 rounded-full',
                adopted ? 'bg-green-600 dark:bg-green-400' : 'bg-blue-600 dark:bg-blue-400',
              )}
            />
            {adopted ? 'Adotado' : 'Acolhimento'}
          </Badge>
        </div>
      </Card>
    </Link>
  );
}
