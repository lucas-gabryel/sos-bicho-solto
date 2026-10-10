'use client';

import { LoaderCircle, Plus, Search, Users } from 'lucide-react';
import { useDeferredValue, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { useCreateAcolhedor } from '@/hooks/use-create-acolhedor';
import { useAcolhedores } from '@/hooks/use-acolhedores';
import { useUpdateAcolhedor } from '@/hooks/use-update-acolhedor';
import { cn } from '@/lib/utils';
import type { Acolhedor, AcolhedorFormValues, SituacaoAcolhedor } from '@/types/acolhedor';
import { AcolhedorCard, AcolhedorCardSkeleton } from './_components/acolhedor-card';
import { AcolhedorFormModal } from './_components/acolhedor-form-modal';

const PAGE_SIZE = 9;

const SITUACAO_TABS: { value: SituacaoAcolhedor | undefined; label: string }[] = [
  { value: undefined, label: 'Todos' },
  { value: 'ADOTANTE', label: 'Adotantes' },
  { value: 'TUTOR', label: 'Tutores' },
];

type ModalState =
  | { open: false; mode: 'create'; acolhedor: null }
  | { open: true; mode: 'create'; acolhedor: null }
  | { open: true; mode: 'edit'; acolhedor: Acolhedor };

const initialModalState: ModalState = {
  open: false,
  mode: 'create',
  acolhedor: null,
};

function AcolhedoresPageContent() {
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);
  const [page, setPage] = useState(1);
  const [situacao, setSituacao] = useState<SituacaoAcolhedor | undefined>(undefined);
  const [modalState, setModalState] = useState<ModalState>(initialModalState);

  const { data, isLoading, isFetching } = useAcolhedores({
    page,
    limit: PAGE_SIZE,
    busca: deferredSearch.trim() || undefined,
    situacao,
  });

  const createAcolhedor = useCreateAcolhedor();
  const updateAcolhedor = useUpdateAcolhedor();

  const acolhedores = data?.data ?? [];
  const totalPages = data?.meta.totalPages ?? 0;

  const openCreateModal = () => {
    setModalState({ open: true, mode: 'create', acolhedor: null });
  };

  const closeModal = () => {
    setModalState(initialModalState);
  };

  const handleSubmit = async (values: AcolhedorFormValues) => {
    if (modalState.mode === 'create') {
      await createAcolhedor.mutateAsync(values);
      return;
    }

    await updateAcolhedor.mutateAsync({ id: modalState.acolhedor.id, values });
  };

  const isPending = createAcolhedor.isPending || updateAcolhedor.isPending;

  return (
    <>
      <div className="p-4 md:p-7">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-[22px] font-semibold text-foreground">Acolhedores</h1>
            <p className="mt-0.5 text-[13px] text-muted-foreground">
              Cadastro e acompanhamento de quem acolhe os animais
            </p>
          </div>

          <Button variant="primary" size="default" onClick={openCreateModal}>
            <Plus className="size-4" />
            Cadastrar adotante
          </Button>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          <div className="relative min-w-45 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou CPF..."
              className="pl-9 text-[13px]"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
            />
          </div>

          <div
            role="tablist"
            aria-label="Filtrar por situação"
            className="inline-flex rounded-lg border border-border bg-muted/40 p-0.5"
          >
            {SITUACAO_TABS.map((tab) => {
              const isActive = situacao === tab.value;

              return (
                <button
                  key={tab.label}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => {
                    setSituacao(tab.value);
                    setPage(1);
                  }}
                  className={cn(
                    'rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors',
                    isActive ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-3.5">
            {Array.from({ length: PAGE_SIZE }).map((_, index) => (
              <AcolhedorCardSkeleton key={index} />
            ))}
          </div>
        ) : acolhedores.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-[14px] border border-dashed border-border py-16 text-muted-foreground">
            <Users className="size-10 opacity-30" />
            <p className="text-sm">Nenhum acolhedor encontrado</p>
          </div>
        ) : (
          <>
            <div
              className={`grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-3.5 ${
                isFetching ? 'opacity-60 transition-opacity' : 'transition-opacity'
              }`}
            >
              {acolhedores.map((acolhedor) => (
                <AcolhedorCard key={acolhedor.id} acolhedor={acolhedor} />
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
        <AcolhedorFormModal
          open={modalState.open}
          mode={modalState.mode}
          acolhedor={modalState.acolhedor}
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
          Salvando acolhedor...
        </div>
      ) : null}
    </>
  );
}

export default function AcolhedoresPage() {
  return <AcolhedoresPageContent />;
}
