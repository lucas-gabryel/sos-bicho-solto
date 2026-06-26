'use client';

import { ArrowLeft, ArrowRight, Edit2, Info, Link2, Mars, Trash2, Venus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAnimal } from '@/hooks/use-animal';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useDeleteAnimal } from '@/hooks/use-delete-animal';
import { useTutor } from '@/hooks/use-tutor';
import { formatDateToPtBr, getTutorInitials } from '@/lib/tutor';
import { cn } from '@/lib/utils';
import { AnimalFormModal } from '../_components/animal-form-modal';
import { DeleteConfirmationModal } from '../_components/delete-confirmation-modal';
import { LinkTutorModal } from '../_components/link-tutor-modal';

const CAT_FALLBACK_IMAGE = process.env.NEXT_PUBLIC_FALLBACK_CAT_IMAGE_URL || 'https://cataas.com/cat?width=500&height=500';
const DOG_FALLBACK_IMAGE = process.env.NEXT_PUBLIC_FALLBACK_DOG_IMAGE_URL || 'https://placedog.net/500/500';

export default function AnimalDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const animalId = params.id as string;

  const { data: animal, isLoading: isLoadingAnimal } = useAnimal(animalId);
  const { data: currentUser, isLoading: isLoadingUser } = useCurrentUser();
  const { data: tutor } = useTutor(animal?.tutorId ?? '');
  const deleteAnimal = useDeleteAnimal();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isLinkTutorOpen, setIsLinkTutorOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  const isProtector = currentUser?.role === 'protetor';
  const isLoading = isLoadingAnimal || isLoadingUser;

  const handleDelete = async (password: string) => {
    if (!animal) {
      return;
    }

    await deleteAnimal.mutateAsync({ id: animal.id, senhaAdmin: password });
    router.push('/animals');
  };

  if (isLoading) {
    return (
      <div className="p-4 md:p-7">
        <div className="mb-6 flex items-center gap-3">
          <Button variant="ghost" size="icon" disabled>
            <ArrowLeft className="size-5" />
          </Button>
          <Skeleton className="h-8 w-48" />
        </div>

        <Card className="space-y-6 rounded-2xl p-6">
          <div className="flex gap-5">
            <Skeleton className="size-22 rounded-2xl" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-56" />
              <Skeleton className="h-5 w-40" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-5 w-28" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  if (!animal) {
    return (
      <div className="p-4 md:p-7">
        <Link href="/animals">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="size-5" />
          </Button>
        </Link>
        <div className="mt-8 text-center">
          <p className="text-muted-foreground">Animal não encontrado</p>
        </div>
      </div>
    );
  }

  const adopted = animal.status === 'Adotado';
  const fallbackSrc = animal.esp === 'Gato' ? CAT_FALLBACK_IMAGE : DOG_FALLBACK_IMAGE;
  const imageSrc = !imageError && animal.foto ? animal.foto : fallbackSrc;

  return (
    <div className="p-4 md:p-7">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link href="/animals">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="size-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Prontuário <span className="text-muted-foreground">— {animal.nome}</span>
            </h1>
            <p className="text-sm text-muted-foreground">Detalhes e histórico do animal</p>
          </div>
        </div>

        {!isProtector && (
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-transparent bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:hover:bg-blue-950/60"
              onClick={() => setIsEditOpen(true)}
            >
              <Edit2 className="size-3.5" />
              Editar
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="border-transparent bg-green-100 text-green-700 hover:bg-green-200 disabled:opacity-50 dark:bg-green-950/40 dark:text-green-400 dark:hover:bg-green-950/60"
              disabled={adopted}
              onClick={() => !adopted && setIsLinkTutorOpen(true)}
            >
              <Link2 className="size-3.5" />
              Vincular tutor
            </Button>

            <Button variant="destructive" size="sm" onClick={() => setIsDeleteOpen(true)}>
              <Trash2 className="size-3.5" />
              Excluir
            </Button>
          </div>
        )}
      </div>

      <Card className="rounded-2xl p-6">
        <div className="flex flex-wrap items-start gap-5">
          <div className="relative size-22 shrink-0 overflow-hidden rounded-2xl border border-border bg-muted/50">
            <Image
              src={imageSrc}
              alt={animal.nome}
              fill
              sizes="88px"
              className="object-cover"
              unoptimized
              onError={() => setImageError(true)}
            />
          </div>

          <div className="min-w-0 flex-1">
            <span className="inline-block rounded-md bg-muted px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
              {animal.numeroRegistro}
            </span>
            <h2 className="mt-1.5 text-xl font-semibold text-foreground">
              {animal.nome} · {animal.raca} <span className="text-muted-foreground">({animal.esp})</span>
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge
                className={cn(
                  'h-auto gap-1.5 rounded-full border-transparent px-3 py-1 text-xs font-semibold',
                  adopted
                    ? 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400'
                    : 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400',
                )}
              >
                <span
                  className={cn(
                    'size-2 rounded-full',
                    adopted ? 'bg-green-600 dark:bg-green-400' : 'bg-blue-600 dark:bg-blue-400',
                  )}
                />
                {adopted ? 'Adotado' : 'Acolhimento'}
              </Badge>
              <Badge className="h-auto rounded-full border-transparent bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                Resgatado em {animal.data}
              </Badge>
            </div>
          </div>
        </div>

        <div className="my-5 h-px bg-border" />

        <SectionTitle>Informações gerais</SectionTitle>
        <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
          <InfoField label="Nome" value={animal.nome} />
          <InfoField label="Espécie" value={animal.esp} />
          <InfoField label="Raça" value={animal.raca} />
          <InfoField
            label="Sexo"
            value={
              <div className="flex items-center gap-2">
                {animal.sexo === 'Macho' ? (
                  <Mars className="size-4 text-blue-600" />
                ) : (
                  <Venus className="size-4 text-pink-600" />
                )}
                <span>{animal.sexo}</span>
              </div>
            }
          />
          <InfoField label="Cor" value={animal.cor} />
          {animal.porte && <InfoField label="Porte" value={animal.porte} />}
          <InfoField label="Peso inicial" value={`${animal.peso.toFixed(1)} kg`} />
          {animal.pesoAt != null && <InfoField label="Peso atual" value={`${animal.pesoAt.toFixed(1)} kg`} />}
          <InfoField label="Castrado" value={animal.castrado ? 'Sim' : 'Não'} />
          <InfoField label="Vacinado" value={animal.vacinado ? 'Sim' : 'Não'} />
          {animal.dataNascimento && (
            <InfoField label="Data de nascimento" value={formatDateToPtBr(animal.dataNascimento)} />
          )}
          <InfoField className="sm:col-span-2 lg:col-span-3" label="Localidade de resgate" value={animal.local} />
          {animal.obs && (
            <InfoField className="sm:col-span-2 lg:col-span-3" label="Observações de saúde" value={animal.obs} />
          )}
        </div>

        <SectionTitle className="mt-6">Vinculação de adoção</SectionTitle>
        {adopted && tutor ? (
          <Link
            href={`/tutores/${tutor.id}`}
            className="flex flex-wrap items-center gap-3 rounded-lg bg-green-50 px-4 py-3.5 transition-colors hover:bg-green-100 dark:bg-green-950/30 dark:hover:bg-green-950/50"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-green-600 text-sm font-bold text-white">
              {getTutorInitials(tutor.nome)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-green-700 dark:text-green-400">{tutor.nome}</p>
              <p className="truncate text-xs text-muted-foreground">
                {tutor.cpf} · {tutor.telefone}
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-700 dark:text-green-400">
              <ArrowRight className="size-4" />
              Ver tutor
            </span>
          </Link>
        ) : adopted ? (
          <div className="flex items-center gap-3 rounded-lg bg-muted/60 px-4 py-3.5 text-sm text-muted-foreground">
            <Info className="size-4 shrink-0 text-blue-600 dark:text-blue-400" />
            <span>Carregando dados do tutor...</span>
          </div>
        ) : (
          <div className="flex items-center gap-3 rounded-lg bg-muted/60 px-4 py-3.5 text-sm text-muted-foreground">
            <Info className="size-4 shrink-0 text-blue-600 dark:text-blue-400" />
            <span>Nenhum tutor vinculado. Este animal está disponível para adoção.</span>
          </div>
        )}
      </Card>

      <DeleteConfirmationModal
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={handleDelete}
        title="Excluir animal"
        description={`Tem certeza que deseja excluir ${animal.nome}? Esta ação não pode ser desfeita.`}
        isLoading={deleteAnimal.isPending}
      />

      <AnimalFormModal open={isEditOpen} onOpenChange={setIsEditOpen} animal={animal} />

      {isLinkTutorOpen && (
        <LinkTutorModal
          open={isLinkTutorOpen}
          animalId={animal.id}
          animalName={animal.nome}
          onOpenChange={setIsLinkTutorOpen}
        />
      )}
    </div>
  );
}

function SectionTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        'mb-3 text-[11px] font-semibold tracking-[0.06em] text-muted-foreground uppercase',
        className,
      )}
    >
      {children}
    </p>
  );
}

function InfoField({
  label,
  value,
  className,
}: {
  label: string;
  value: string | React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('space-y-1', className)}>
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <div className="text-sm font-medium text-foreground">{value}</div>
    </div>
  );
}
