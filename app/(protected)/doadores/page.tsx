'use client';

import { HeartHandshake, LoaderCircle, Plus, Search } from 'lucide-react';
import { useDeferredValue, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { useCreateDoador, useUpdateDoador } from '@/hooks/use-doador-mutation';
import { useDoadores } from '@/hooks/use-doadores';
import type { Doador, DoadorFormValues } from '@/types/doador';
import { DoadorCard, DoadorCardSkeleton } from './_components/doador-card';
import { DoadorFormModal } from './_components/doador-form-modal';

const PAGE_SIZE = 9;

type ModalState =
  | { open: false; mode: 'create'; doador: null }
  | { open: true; mode: 'create'; doador: null }
  | { open: true; mode: 'edit'; doador: Doador };

const initialModalState: ModalState = {
  open: false,
  mode: 'create',
  doador: null,
};

export default function DoadoresPage() {
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);
  const [page, setPage] = useState(1);
  const [modalState, setModalState] = useState<ModalState>(initialModalState);

  const { data, isLoading, isFetching } = useDoadores({
    page,
    limit: PAGE_SIZE,
    busca: deferredSearch.trim() || undefined,
  });

  const createDoador = useCreateDoador();
  const updateDoador = useUpdateDoador();

  const doadores = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 0;

  const openCreateModal = () => {
    setModalState({ open: true, mode: 'create', doador: null });
  };

  const openEditModal = (doador: Doador) => {
    setModalState({ open: true, mode: 'edit', doador });
  };

  const closeModal = () => {
    setModalState(initialModalState);
  };

  const handleSubmit = async (values: DoadorFormValues) => {
    if (modalState.mode === 'create') {
      await createDoador.mutateAsync(values);
      return;
    }

    await updateDoador.mutateAsync({ id: modalState.doador.id, values });
  };

  const isPending = createDoador.isPending || updateDoador.isPending;

  return (
    <>
      <div className="p-4 md:p-7">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-[22px] font-semibold text-foreground">Doadores</h1>
            <p className="mt-0.5 text-[13px] text-muted-foreground">
              Cadastro e acompanhamento de pessoas e entidades colaboradoras da ONG
            </p>
          </div>

          <Button variant="primary" size="default" onClick={openCreateModal}>
            <Plus className="size-4" />
            Cadastrar Doador
          </Button>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          <div className="relative min-w-45 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, razão social ou CPF/CNPJ..."
              className="pl-9 text-[13px]"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-3.5">
            {Array.from({ length: PAGE_SIZE }).map((_, index) => (
              <DoadorCardSkeleton key={index} />
            ))}
          </div>
        ) : doadores.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-[14px] border border-dashed border-border py-16 text-muted-foreground">
            <HeartHandshake className="size-10 opacity-30" />
            <p className="text-sm font-medium">Nenhum doador encontrado</p>
            {deferredSearch.trim() ? (
              <p className="text-xs text-muted-foreground/80">
                Nenhum resultado corresponde à busca &quot;{deferredSearch}&quot;.
              </p>
            ) : null}
          </div>
        ) : (
          <>
            <div
              className={`grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-3.5 ${
                isFetching ? 'opacity-60 transition-opacity' : 'transition-opacity'
              }`}
            >
              {doadores.map((doador) => (
                <DoadorCard key={doador.id} doador={doador} onEdit={openEditModal} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-6">
                <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
              </div>
            )}
          </>
        )}
      </div>

      {modalState.open ? (
        <DoadorFormModal
          open={modalState.open}
          mode={modalState.mode}
          doador={modalState.doador}
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
          Salvando doador...
        </div>
      ) : null}
    </>
  );
}
