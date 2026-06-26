'use client';

import { ArrowLeft, Info, PencilLine, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useDeleteTutor } from '@/hooks/use-delete-tutor';
import { useTutor } from '@/hooks/use-tutor';
import { useTutorAnimals } from '@/hooks/use-tutor-animals';
import { useUpdateTutor } from '@/hooks/use-update-tutor';
import { formatDateToPtBr, getAge } from '@/lib/tutor';
import { cn } from '@/lib/utils';
import type { TutorFormValues } from '@/types/tutor';
import { AnimalCard, AnimalCardSkeleton } from '../../animals/_components/animal-card';
import { DeleteConfirmationModal } from '../../animals/_components/delete-confirmation-modal';
import { TutorFormModal } from '../_components/tutor-form-modal';

function TutorDetailPageContent() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const tutorId = typeof params.id === 'string' ? params.id : '';

  const { data: currentUser } = useCurrentUser();
  const { data: tutor, isLoading: isTutorLoading } = useTutor(tutorId);
  const { data: adoptedAnimals = [], isLoading: isAnimalsLoading } = useTutorAnimals(tutorId);
  const updateTutor = useUpdateTutor();
  const deleteTutor = useDeleteTutor();

  const isAdmin = currentUser?.role === 'admin';

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  if (isTutorLoading) {
    return (
      <div className="p-4 md:p-7">
        <div className="mb-6 flex items-center gap-3">
          <Skeleton className="size-9 rounded-md" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-44" />
            <Skeleton className="h-4 w-56" />
          </div>
        </div>

        <Card className="rounded-2xl p-6">
          <div className="flex items-center gap-5">
            <Skeleton className="size-18 shrink-0 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>

          <div className="my-5 h-px bg-border" />

          <Skeleton className="mb-3 h-3 w-32" />
          <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-1.5">
                <Skeleton className="h-2.5 w-20" />
                <Skeleton className="h-4 w-28" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  if (!tutor) {
    return (
      <div className="p-4 md:p-7">
        <Card className="rounded-[16px] border border-border py-0 ring-0">
          <CardHeader className="border-b border-border px-5 py-5">
            <CardTitle>Tutor não encontrado</CardTitle>
            <CardDescription>O registro solicitado não existe mais ou não foi encontrado.</CardDescription>
          </CardHeader>
          <CardContent className="px-5 py-5">
            <Button asChild variant="primary">
              <Link href="/tutores">Voltar para tutores</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const age = getAge(tutor.dataNascimento);

  const handleUpdateTutor = async (values: TutorFormValues) => {
    await updateTutor.mutateAsync({
      id: tutor.id,
      values,
    });
  };

  const handleConfirmDelete = async (password: string) => {
    await deleteTutor.mutateAsync({ id: tutor.id, senhaAdmin: password });
    router.push('/tutores');
  };

  return (
    <>
      <div className="p-4 md:p-7">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link href="/tutores">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="size-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Detalhe do tutor</h1>
              <p className="text-sm text-muted-foreground">Informações completas</p>
            </div>
          </div>

          {isAdmin && (
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-transparent bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:hover:bg-blue-950/60"
                onClick={() => setIsEditModalOpen(true)}
                disabled={updateTutor.isPending}
              >
                <PencilLine className="size-3.5" />
                Editar
              </Button>

              <Button
                variant="destructive"
                size="sm"
                onClick={() => setIsDeleteModalOpen(true)}
                disabled={deleteTutor.isPending}
              >
                <Trash2 className="size-3.5" />
                {deleteTutor.isPending ? 'Excluindo...' : 'Excluir'}
              </Button>
            </div>
          )}
        </div>

        <Card className="rounded-2xl p-6">
          <div className="flex flex-wrap items-center gap-5">
            <div className="flex size-18 shrink-0 items-center justify-center rounded-full bg-orange-100 text-[28px] font-bold text-orange-700 dark:bg-orange-950/40 dark:text-orange-400">
              {tutor.nome.charAt(0)}
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-semibold text-foreground">{tutor.nome}</h2>
              <p className="mt-0.5 font-mono text-[13px] text-muted-foreground">{tutor.cpf}</p>
            </div>
          </div>

          <div className="my-5 h-px bg-border" />

          <SectionTitle>Dados pessoais</SectionTitle>
          <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
            <InfoField label="Nome completo" value={tutor.nome} />
            <InfoField label="CPF" value={<span className="font-mono">{tutor.cpf}</span>} />
            <InfoField
              label="Data de nascimento"
              value={`${formatDateToPtBr(tutor.dataNascimento)}${age !== null ? ` · ${age} anos` : ''}`}
            />
            <InfoField label="Telefone" value={tutor.telefone} />
            <InfoField label="E-mail" value={tutor.email} />
            <InfoField label="Endereço completo" value={tutor.endereco} />
          </div>

          <SectionTitle className="mt-6">Animais adotados ({adoptedAnimals.length})</SectionTitle>
          {isAnimalsLoading ? (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3.5">
              {Array.from({ length: 3 }).map((_, i) => (
                <AnimalCardSkeleton key={i} />
              ))}
            </div>
          ) : adoptedAnimals.length === 0 ? (
            <div className="flex items-center gap-3 rounded-lg bg-muted/60 px-4 py-3.5 text-sm text-muted-foreground">
              <Info className="size-4 shrink-0 text-blue-600 dark:text-blue-400" />
              <span>Nenhum animal adotado foi vinculado a este tutor.</span>
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3.5">
              {adoptedAnimals.map((animal) => (
                <AnimalCard key={animal.id} animal={animal} />
              ))}
            </div>
          )}
        </Card>
      </div>

      {isEditModalOpen ? (
        <TutorFormModal
          open={isEditModalOpen}
          mode="edit"
          tutor={tutor}
          isPending={updateTutor.isPending}
          onOpenChange={setIsEditModalOpen}
          onSubmit={handleUpdateTutor}
        />
      ) : null}

      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        onConfirm={handleConfirmDelete}
        title="Excluir tutor"
        description={`Deseja excluir o tutor ${tutor.nome}? Essa ação desativa o cadastro no sistema.`}
        isLoading={deleteTutor.isPending}
      />
    </>
  );
}

function SectionTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn('mb-3 text-[11px] font-semibold tracking-[0.06em] text-muted-foreground uppercase', className)}>
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

export default function TutorDetailPage() {
  return <TutorDetailPageContent />;
}
