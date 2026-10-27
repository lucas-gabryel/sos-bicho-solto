'use client';

import {
  FileSpreadsheet,
  Gift,
  HeartHandshake,
  LoaderCircle,
  Plus,
  Search,
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Suspense, useDeferredValue, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { useCreateDoacao } from '@/hooks/use-doacao-mutation';
import { useDoacoes } from '@/hooks/use-doacoes';
import { cn } from '@/lib/utils';
import type { DoacaoFormValues, TipoDoacao } from '@/types/doacao';
import { TIPO_DOACAO_LABELS } from '@/types/doacao';
import { DoacaoCard, DoacaoCardSkeleton } from './_components/doacao-card';
import { DoacaoFormModal } from './_components/doacao-form-modal';
import { RelatorioDoacoesView } from './_components/relatorio-doacoes-view';

const PAGE_SIZE = 9;

function DoacoesContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') === 'relatorio' ? 'relatorio' : 'todas';
  const [activeTab, setActiveTab] = useState<'todas' | 'relatorio'>(initialTab);

  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);
  const [tipoFilter, setTipoFilter] = useState<TipoDoacao | ''>('');
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, isFetching } = useDoacoes({
    page,
    limit: PAGE_SIZE,
    busca: deferredSearch.trim() || undefined,
    tipo: tipoFilter || undefined,
  });

  const createDoacao = useCreateDoacao();

  const doacoes = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 0;

  const handleSubmit = async (values: DoacaoFormValues) => {
    await createDoacao.mutateAsync(values);
  };

  return (
    <>
      <div className="p-4 md:p-7">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-[22px] font-semibold text-foreground">Doações</h1>
            <p className="mt-0.5 text-[13px] text-muted-foreground">
              Acompanhamento, relatórios consolidados e registro de doações financeiras e materiais
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Segmented Control / Tabs */}
            <div
              role="tablist"
              aria-label="Visualização de doações"
              className="inline-flex rounded-lg border border-border bg-muted/40 p-0.5"
            >
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'todas'}
                onClick={() => setActiveTab('todas')}
                className={cn(
                  'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                  activeTab === 'todas'
                    ? 'bg-card text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <Gift className="size-3.5" />
                <span>Todas as Doações</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'relatorio'}
                onClick={() => setActiveTab('relatorio')}
                className={cn(
                  'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                  activeTab === 'relatorio'
                    ? 'bg-card text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <FileSpreadsheet className="size-3.5" />
                <span>Relatório Consolidado</span>
              </button>
            </div>

            {activeTab === 'todas' && (
              <Button variant="primary" size="default" onClick={() => setIsModalOpen(true)}>
                <Plus className="size-4" />
                Registrar Doação
              </Button>
            )}
          </div>
        </div>

        {activeTab === 'relatorio' ? (
          <RelatorioDoacoesView />
        ) : (
          <>
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <div className="relative min-w-52 flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar por descrição ou doador..."
                  className="pl-9 text-[13px]"
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setPage(1);
                  }}
                />
              </div>

              <select
                className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                value={tipoFilter}
                onChange={(e) => {
                  setTipoFilter(e.target.value as TipoDoacao | '');
                  setPage(1);
                }}
              >
                <option value="">Todos os tipos</option>
                <option value="DINHEIRO">{TIPO_DOACAO_LABELS.DINHEIRO}</option>
                <option value="RACAO">{TIPO_DOACAO_LABELS.RACAO}</option>
                <option value="MEDICAMENTO">{TIPO_DOACAO_LABELS.MEDICAMENTO}</option>
                <option value="PRODUTO_LIMPEZA">{TIPO_DOACAO_LABELS.PRODUTO_LIMPEZA}</option>
                <option value="OUTRO">{TIPO_DOACAO_LABELS.OUTRO}</option>
              </select>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-3.5">
                {Array.from({ length: PAGE_SIZE }).map((_, index) => (
                  <DoacaoCardSkeleton key={index} />
                ))}
              </div>
            ) : doacoes.length === 0 ? (
              <div className="flex flex-col items-center gap-2 rounded-[14px] border border-dashed border-border py-16 text-muted-foreground">
                <HeartHandshake className="size-10 opacity-30" />
                <p className="text-sm font-medium">Nenhuma doação encontrada</p>
                {deferredSearch.trim() || tipoFilter ? (
                  <p className="text-xs text-muted-foreground/80">
                    Tente ajustar os filtros ou a busca para encontrar registros.
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground/80">
                    Clique no botão &quot;Registrar Doação&quot; acima para cadastrar a primeira doação.
                  </p>
                )}
              </div>
            ) : (
              <>
                <div
                  className={`grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-3.5 ${
                    isFetching ? 'opacity-60 transition-opacity' : 'transition-opacity'
                  }`}
                >
                  {doacoes.map((doacao) => (
                    <DoacaoCard key={doacao.id} doacao={doacao} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="mt-6">
                    <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      <DoacaoFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        isPending={createDoacao.isPending}
        onSubmit={handleSubmit}
      />

      {createDoacao.isPending && (
        <div className="pointer-events-none fixed bottom-4 right-4 z-60 flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-sm text-foreground shadow-lg">
          <LoaderCircle className="size-4 animate-spin" />
          Registrando doação...
        </div>
      )}
    </>
  );
}

export default function DoacoesPage() {
  return (
    <Suspense fallback={<div className="p-7">Carregando módulo de doações...</div>}>
      <DoacoesContent />
    </Suspense>
  );
}
