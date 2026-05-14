'use client';

import { ArrowLeft, CalendarDays, LoaderCircle, Mail, MapPin, PencilLine, Phone, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAnimals } from '@/hooks/use-animals';
import { useDeleteTutor } from '@/hooks/use-delete-tutor';
import { useTutor } from '@/hooks/use-tutor';
import { useUpdateTutor } from '@/hooks/use-update-tutor';
import { formatDateToPtBr, getAge, getTutorInitials } from '@/lib/tutor';
import type { TutorFormValues } from '@/types/tutor';
import { AdoptedAnimalCard } from '../_components/adopted-animal-card';
import { DeleteConfirmationModal } from '../../animals/_components/delete-confirmation-modal';
import { TutorFormModal } from '../_components/tutor-form-modal';

function TutorDetailPageContent() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const tutorId = typeof params.id === 'string' ? params.id : '';

  const { data: tutor, isLoading: isTutorLoading } = useTutor(tutorId);
  const { data: animals = [], isLoading: isAnimalsLoading } = useAnimals();
  const updateTutor = useUpdateTutor();
  const deleteTutor = useDeleteTutor();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  if (isTutorLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center p-6">
        <div className="flex items-center gap-3 rounded-full border border-border bg-card px-4 py-2 text-sm text-foreground shadow-sm">
          <LoaderCircle className="size-4 animate-spin" />
          Carregando tutor...
        </div>
      </div>
    );
  }

  if (!tutor) {
    return (
      <div className="p-4 md:p-7">
        <Card className="rounded-[16px] border border-border py-0 ring-0">
          <CardHeader className="border-b border-border px-5 py-5">
            <CardTitle>Tutor não encontrado</CardTitle>
            <CardDescription>
              O registro solicitado não existe mais ou não foi encontrado na base mockada.
            </CardDescription>
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
  const adoptedAnimals = animals.filter((animal) => tutor.animaisAdotadosIds.includes(animal.id));

  const handleUpdateTutor = async (values: TutorFormValues) => {
    await updateTutor.mutateAsync({
      id: tutor.id,
      values,
    });
  };

  const handleConfirmDelete = async () => {
    await deleteTutor.mutateAsync(tutor.id);
    router.push('/tutores');
  };

  return (
    <>
      <div className="p-4 md:p-7">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <div>
            <Button asChild variant="ghost" size="sm" className="mb-2 px-0 hover:bg-transparent">
              <Link href="/tutores">
                <ArrowLeft className="size-3.5" />
                Voltar para tutores
              </Link>
            </Button>

            <h1 className="text-[22px] font-semibold text-foreground">{tutor.nome}</h1>
            <p className="mt-0.5 text-[13px] text-muted-foreground">
              {tutor.id} · CPF {tutor.cpf}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" onClick={() => setIsEditModalOpen(true)} disabled={updateTutor.isPending}>
              <PencilLine className="size-4" />
              Editar tutor
            </Button>

            <Button variant="destructive" onClick={() => setIsDeleteModalOpen(true)} disabled={deleteTutor.isPending}>
              <Trash2 className="size-4" />
              {deleteTutor.isPending ? 'Excluindo...' : 'Excluir tutor'}
            </Button>
          </div>
        </div>

        <div className="mb-6 grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]">
          <Card className="rounded-[16px] border border-border py-0 ring-0">
            <CardHeader className="border-b border-border px-5 py-5">
              <div className="flex items-center gap-3">
                <div className="flex size-14 items-center justify-center rounded-[16px] bg-orange-100 text-base font-semibold text-orange-700 dark:bg-orange-950/40 dark:text-orange-400">
                  {getTutorInitials(tutor.nome)}
                </div>
                <div>
                  <CardTitle>{tutor.nome}</CardTitle>
                  <CardDescription>Dados completos do tutor e canais de contato registrados</CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="grid gap-4 px-5 py-5 md:grid-cols-2">
              <div className="rounded-[14px] border border-border bg-muted/30 p-4">
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
                  Contato
                </p>
                <div className="space-y-3 text-sm text-foreground">
                  <div className="flex items-center gap-2">
                    <Mail className="size-4 text-muted-foreground" />
                    <span>{tutor.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="size-4 text-muted-foreground" />
                    <span>{tutor.telefone}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-[14px] border border-border bg-muted/30 p-4">
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
                  Identificação
                </p>
                <div className="space-y-3 text-sm text-foreground">
                  <p>CPF {tutor.cpf}</p>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="size-4 text-muted-foreground" />
                    <span>
                      {formatDateToPtBr(tutor.dataNascimento)}
                      {age !== null ? ` · ${age} anos` : ''}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-[14px] border border-border bg-muted/30 p-4 md:col-span-2">
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
                  Endereço
                </p>
                <div className="flex items-start gap-2 text-sm text-foreground">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <span>{tutor.endereco}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[16px] border border-border py-0 ring-0">
            <CardHeader className="border-b border-border px-5 py-5">
              <CardTitle>Resumo</CardTitle>
              <CardDescription>Visão rápida do histórico de adoções ligado a este tutor</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 px-5 py-5">
              <div className="rounded-[14px] border border-border bg-card p-4">
                <p className="text-[12px] text-muted-foreground">Animais adotados</p>
                <p className="mt-1 text-3xl font-semibold text-foreground">{adoptedAnimals.length}</p>
              </div>

              <div className="rounded-[14px] border border-border bg-card p-4">
                <p className="text-[12px] text-muted-foreground">Nascimento</p>
                <p className="mt-1 text-sm font-medium text-foreground">
                  {formatDateToPtBr(tutor.dataNascimento)}
                </p>
              </div>

              <div className="rounded-[14px] border border-border bg-card p-4">
                <p className="text-[12px] text-muted-foreground">Status do cadastro</p>
                <Badge className="mt-2 gap-1.5 rounded-full border-transparent bg-green-100 px-2.5 py-0.5 text-[11px] font-semibold text-green-700 dark:bg-green-950/40 dark:text-green-400">
                  Ativo na base mockada
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Animais adotados</h2>
            <p className="mt-0.5 text-[13px] text-muted-foreground">
              Relação de animais vinculados ao tutor neste mock
            </p>
          </div>

          <Badge variant="outline" className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold">
            {adoptedAnimals.length} {adoptedAnimals.length === 1 ? 'registro' : 'registros'}
          </Badge>
        </div>

        {isAnimalsLoading ? (
          <div className="flex items-center gap-3 rounded-[14px] border border-border bg-card px-4 py-4 text-sm text-foreground">
            <LoaderCircle className="size-4 animate-spin" />
            Carregando animais adotados...
          </div>
        ) : adoptedAnimals.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-[14px] border border-dashed border-border py-16 text-muted-foreground">
            <CalendarDays className="size-10 opacity-30" />
            <p className="text-sm">Nenhum animal adotado foi vinculado a este tutor</p>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-3.5">
            {adoptedAnimals.map((animal) => (
              <AdoptedAnimalCard key={animal.id} animal={animal} />
            ))}
          </div>
        )}
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
        description={`Deseja excluir o tutor ${tutor.nome}? Essa ação remove apenas o cadastro mockado.`}
        isLoading={deleteTutor.isPending}
      />
    </>
  );
}

export default function TutorDetailPage() {
  return <TutorDetailPageContent />;
}
