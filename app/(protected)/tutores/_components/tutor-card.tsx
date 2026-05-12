'use client';

import { CalendarDays, Mail, MapPin, PawPrint, PencilLine, Phone, UserRound } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { formatDateToPtBr, getAge, getTutorInitials } from '@/lib/tutor';
import type { Tutor } from '@/types/tutor';

interface TutorCardProps {
  tutor: Tutor;
  onEdit: (tutor: Tutor) => void;
}

export function TutorCard({ tutor, onEdit }: TutorCardProps) {
  const age = getAge(tutor.dataNascimento);
  const adoptedCount = tutor.animaisAdotadosIds.length;

  return (
    <Card className="gap-0 rounded-[14px] border border-border py-0 ring-0 transition-all duration-150 hover:-translate-y-[3px] hover:border-foreground/20 hover:shadow-md">
      <CardContent className="p-4">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-[14px] bg-orange-100 text-sm font-semibold text-orange-700 dark:bg-orange-950/40 dark:text-orange-400">
              {getTutorInitials(tutor.nome)}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">{tutor.nome}</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                {tutor.id} · CPF {tutor.cpf}
              </p>
            </div>
          </div>

          <Badge
            className="gap-1.5 rounded-full border-transparent bg-orange-100 px-2.5 py-0.5 text-[11px] font-semibold text-orange-700 dark:bg-orange-950/40 dark:text-orange-400"
          >
            <PawPrint className="size-3" />
            {adoptedCount} {adoptedCount === 1 ? 'adocao' : 'adocoes'}
          </Badge>
        </div>

        <div className="space-y-2.5 text-[13px] text-muted-foreground">
          <div className="flex items-center gap-2">
            <Mail className="size-3.5 shrink-0" />
            <span className="truncate">{tutor.email}</span>
          </div>

          <div className="flex items-center gap-2">
            <Phone className="size-3.5 shrink-0" />
            <span>{tutor.telefone}</span>
          </div>

          <div className="flex items-center gap-2">
            <CalendarDays className="size-3.5 shrink-0" />
            <span>
              {formatDateToPtBr(tutor.dataNascimento)}
              {age !== null ? ` · ${age} anos` : ''}
            </span>
          </div>

          <div className="flex items-start gap-2">
            <MapPin className="mt-0.5 size-3.5 shrink-0" />
            <span className="line-clamp-2">{tutor.endereco}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="justify-between gap-2 border-t border-border bg-muted/40 px-4 py-3">
        <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
          <UserRound className="size-3.5" />
          <span>Responsavel por adocoes registradas</span>
        </div>

        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => onEdit(tutor)}>
            <PencilLine className="size-3.5" />
            Editar
          </Button>

          <Button asChild variant="primary" size="sm">
            <Link href={`/tutores/${tutor.id}`}>Detalhes</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
