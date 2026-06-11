'use client';

import { LoaderCircle, Plus, Search, Users } from 'lucide-react';
import { useDeferredValue, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCreateTutor } from '@/hooks/use-create-tutor';
import { useTutors } from '@/hooks/use-tutors';
import { useUpdateTutor } from '@/hooks/use-update-tutor';
import type { Tutor, TutorFormValues } from '@/types/tutor';
import { TutorCard } from './_components/tutor-card';
import { TutorFormModal } from './_components/tutor-form-modal';

type ModalState =
  | { open: false; mode: 'create'; tutor: null }
  | { open: true; mode: 'create'; tutor: null }
  | { open: true; mode: 'edit'; tutor: Tutor };

const initialModalState: ModalState = {
  open: false,
  mode: 'create',
  tutor: null,
};

function TutorsPageContent() {
  const { data: tutors = [], isLoading } = useTutors();
  const createTutor = useCreateTutor();
  const updateTutor = useUpdateTutor();

  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);
  const [modalState, setModalState] = useState<ModalState>(initialModalState);

  const filteredTutors = tutors.filter((tutor) => {
    const query = deferredSearch.trim().toLowerCase();

    if (!query) {
      return true;
    }

    return [tutor.nome, tutor.cpf, tutor.telefone, tutor.email, tutor.endereco].join(' ').toLowerCase().includes(query);
  });

  const openCreateModal = () => {
    setModalState({
      open: true,
      mode: 'create',
      tutor: null,
    });
  };

  const openEditModal = (tutor: Tutor) => {
    setModalState({
      open: true,
      mode: 'edit',
      tutor,
    });
  };

  const closeModal = () => {
    setModalState(initialModalState);
  };

  const handleSubmit = async (values: TutorFormValues) => {
    if (modalState.mode === 'create') {
      await createTutor.mutateAsync(values);
      return;
    }

    await updateTutor.mutateAsync({
      id: modalState.tutor.id,
      values,
    });
  };

  const isPending = createTutor.isPending || updateTutor.isPending;

  return (
    <>
      <div className="p-4 md:p-7">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-[22px] font-semibold text-foreground">Tutores</h1>
            <p className="mt-0.5 text-[13px] text-muted-foreground">
              Cadastro e acompanhamento de responsáveis por adoções
            </p>
          </div>

          <Button variant="primary" size="default" onClick={openCreateModal}>
            <Plus className="size-4" />
            Cadastrar tutor
          </Button>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          <div className="relative min-w-45 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, CPF, telefone, e-mail ou endereço..."
              className="pl-9 text-[13px]"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3.5">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-64 animate-pulse rounded-[14px] border border-border bg-card/60" />
            ))}
          </div>
        ) : filteredTutors.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-[14px] border border-dashed border-border py-16 text-muted-foreground">
            <Users className="size-10 opacity-30" />
            <p className="text-sm">Nenhum tutor encontrado</p>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-3.5">
            {filteredTutors.map((tutor) => (
              <TutorCard key={tutor.id} tutor={tutor} onEdit={openEditModal} />
            ))}
          </div>
        )}
      </div>

      {modalState.open ? (
        <TutorFormModal
          open={modalState.open}
          mode={modalState.mode}
          tutor={modalState.tutor}
          isPending={isPending}
          onOpenChange={(open) => {
            if (!open) {
              closeModal();
            }
          }}
          onSubmit={handleSubmit}
        />
      ) : null}

      {isPending ? (
        <div className="pointer-events-none fixed bottom-4 right-4 z-60 flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-sm text-foreground shadow-lg">
          <LoaderCircle className="size-4 animate-spin" />
          Salvando tutor...
        </div>
      ) : null}
    </>
  );
}

export default function TutorsPage() {
  return <TutorsPageContent />;
}
