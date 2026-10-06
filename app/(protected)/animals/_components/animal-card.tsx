'use client';

import { Mars, Printer, Venus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { Animal } from '@/services/animal.service';
import { PrintAnimalModal } from './print-animal-modal';

const CAT_FALLBACK_IMAGE = process.env.NEXT_PUBLIC_FALLBACK_CAT_IMAGE_URL || 'https://cataas.com/cat?width=500&height=500';
const DOG_FALLBACK_IMAGE = process.env.NEXT_PUBLIC_FALLBACK_DOG_IMAGE_URL || 'https://placedog.net/500/500';

export function AnimalCard({
  animal,
  onPrint,
}: {
  animal: Animal;
  onPrint?: (animal: Animal) => void;
}) {
  const adopted = animal.status === 'Adotado';
  const fallbackSrc = animal.esp === 'Gato' ? CAT_FALLBACK_IMAGE : DOG_FALLBACK_IMAGE;
  const [imageError, setImageError] = useState(false);
  const [isPrintOpen, setIsPrintOpen] = useState(false);
  const imageSrc = !imageError && animal.foto ? animal.foto : fallbackSrc;

  return (
    <div className="group relative">
      <Link
        href={`/animals/${animal.id}`}
        className="block rounded-[14px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Card className="cursor-pointer gap-0 rounded-[14px] border border-border py-0 ring-0 transition-all duration-150 hover:-translate-y-0.75 hover:border-foreground/20 hover:shadow-md">
          <div className="relative flex h-30 items-center justify-center overflow-hidden rounded-t-[13px] bg-muted/50">
            <Image
              src={imageSrc}
              alt={animal.nome}
              fill
              sizes="220px"
              className="object-cover"
              unoptimized
              onError={() => setImageError(true)}
            />
          </div>
          <div className="p-3.25">
            <p className="mb-0.5 font-mono text-[10px] text-muted-foreground/60">{animal.numeroRegistro}</p>
            <p className="mb-1.5 truncate text-sm font-semibold text-foreground">
              {animal.nome} · {animal.raca}
            </p>
            <div className="mb-2 flex flex-wrap items-center gap-1.5 text-[12px] text-muted-foreground">
              {animal.sexo === 'Macho' ? <Mars className="size-3 shrink-0" /> : <Venus className="size-3 shrink-0" />}
              <span>{animal.sexo}</span>
              <span className="text-muted-foreground/30">·</span>
              <span>{animal.cor}</span>
              <span className="text-muted-foreground/30">·</span>
              <span>{(animal.pesoAt ?? animal.peso).toFixed(1)}kg</span>
            </div>
            <div className="flex items-center justify-between">
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
          </div>
        </Card>
      </Link>

      <button
        type="button"
        aria-label={`Imprimir ficha de ${animal.nome}`}
        title={`Imprimir ficha de ${animal.nome}`}
        className="absolute right-2 top-2 z-10 flex size-7 items-center justify-center rounded-full bg-background/85 text-foreground/80 shadow-xs backdrop-blur-xs transition hover:bg-background hover:text-orange-600 dark:bg-background/90"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (onPrint) {
            onPrint(animal);
          } else {
            setIsPrintOpen(true);
          }
        }}
      >
        <Printer className="size-3.5" />
      </button>

      {!onPrint && isPrintOpen && (
        <PrintAnimalModal
          open={isPrintOpen}
          onOpenChange={setIsPrintOpen}
          animal={animal}
        />
      )}
    </div>
  );
}

export function AnimalCardSkeleton() {
  return (
    <Card className="gap-0 rounded-[14px] border border-border py-0 ring-0">
      <Skeleton className="h-30 rounded-none" />
      <div className="p-3.25">
        <Skeleton className="mb-1.5 h-2.5 w-14" />
        <Skeleton className="mb-2.5 h-3.5 w-32" />
        <Skeleton className="mb-2.5 h-3 w-40" />
        <Skeleton className="h-5 w-24 rounded-full" />
      </div>
    </Card>
  );
}
