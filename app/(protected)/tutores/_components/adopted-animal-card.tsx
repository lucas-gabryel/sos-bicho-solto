import { Heart, MapPin, PawPrint } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import type { Animal } from '@/services/animal.service';

function speciesEmoji(species: string) {
  return species === 'Gato' ? '🐱' : '🐶';
}

export function AdoptedAnimalCard({ animal }: { animal: Animal }) {
  return (
    <Card className="gap-0 rounded-[14px] border border-border py-0 ring-0">
      <div className="flex h-28 items-center justify-center bg-muted/40 text-[44px]">
        {speciesEmoji(animal.esp)}
      </div>

      <CardContent className="p-4">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] text-muted-foreground/70">{animal.id}</p>
            <p className="mt-1 text-sm font-semibold text-foreground">
              {animal.nome} · {animal.raca}
            </p>
          </div>

          <Badge className="gap-1.5 rounded-full border-transparent bg-green-100 px-2.5 py-0.5 text-[11px] font-semibold text-green-700 dark:bg-green-950/40 dark:text-green-400">
            <Heart className="size-3" />
            Adotado
          </Badge>
        </div>

        <div className="space-y-2 text-[13px] text-muted-foreground">
          <div className="flex items-center gap-2">
            <PawPrint className="size-3.5 shrink-0" />
            <span>
              {animal.esp} · {animal.sexo} · {animal.cor}
            </span>
          </div>

          <div className="flex items-start gap-2">
            <MapPin className="mt-0.5 size-3.5 shrink-0" />
            <span>{animal.local}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
