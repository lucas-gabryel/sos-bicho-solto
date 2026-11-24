'use client';

import {
  Boxes,
  FileText,
  Gift,
  HeartHandshake,
  LoaderCircle,
  Plus,
  Search,
} from 'lucide-react';
import { useState, useDeferredValue } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateDoacao } from '@/hooks/use-doacao-mutation';
import { useDoacoes } from '@/hooks/use-doacoes';
import { cn } from '@/lib/utils';
import type { DirecaoDoacao, DoacaoFormValues, TipoDoacao } from '@/types/doacao';
import { TIPO_DOACAO_LABELS } from '@/types/doacao';
import { DoacaoCard, DoacaoCardSkeleton } from './_components/doacao-card';
import { DoacaoFormModal } from './_components/doacao-form-modal';
import { EstoqueView } from './_components/estoque-view';
import { RelatorioDoacoesView } from './_components/relatorio-doacoes-view';

const PAGE_SIZE = 9;

export default function DoacoesPage() {
  const [activeTab, setActiveTab] = useState<'doacoes' | 'relatorio' | 'estoque'>('doacoes');
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);
  const [tipoFilter, setTipoFilter] = useState<TipoDoacao | ''>('');
  const [direcaoFilter, setDirecaoFilter] = useState<DirecaoDoacao | ''>('');
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, isFetching } = useDoacoes({
    page,
    limit: PAGE_SIZE,
    busca: deferredSearch.trim() || undefined,
    tipo: tipoFilter || undefined,
    direcao: direcaoFilter || undefined,
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
            <h1 className="text-[22px] font-semibold text-foreground">
              {activeTab === 'doacoes'
                ? 'Doações'
                : activeTab === 'relatorio'
                  ? 'Relatório de Doações'
                  : 'Estoque e Consumo'}
            </h1>
            <p className="mt-0.5 text-[13px] text-muted-foreground">
              {activeTab === 'doacoes'
                ? 'Acompanhamento e registro de doações financeiras e materiais (recebidas e feitas pela ONG)'
                : activeTab === 'relatorio'
                  ? 'Histórico descritivo, métricas consolidadas e exportação oficial em PDF'
                  : 'Controle de saldo, consumo e prevenção de desabastecimento de insumos'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Abas de Navegação Principal */}
            <div
              role="tablist"
              aria-label="Visualização do módulo"
              className="inline-flex rounded-lg border border-border bg-muted/40 p-0.5"
            >
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'doacoes'}
                onClick={() => setActiveTab('doacoes')}
                className={cn(
                  'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                  activeTab === 'doacoes'
                    ? 'bg-card text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <Gift className="size-3.5" />
                <span>Doações</span>
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
                <FileText className="size-3.5" />
                <span>Gerar Relatório</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'estoque'}
                onClick={() => setActiveTab('estoque')}
                className={cn(
                  'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                  activeTab === 'estoque'
                    ? 'bg-card text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <Boxes className="size-3.5" />
                <span>Estoque</span>
              </button>
            </div>

            <Button variant="primary" size="default" onClick={() => setIsModalOpen(true)}>
              <Plus className="size-4" />
              Registrar Doação
            </Button>
          </div>
        </div>

        {activeTab === 'estoque' ? (
          <EstoqueView />
        ) : activeTab === 'relatorio' ? (
          <RelatorioDoacoesView />
        ) : (
          <>
            <div className="mb-5 flex flex-wrap items-center gap-2.5">
              <div className="relative min-w-56 flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar por descrição, beneficiário ou doador..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="pl-9 text-[13px]"
                />
              </div>

              {/* Filtro por Modalidade (Select limpo) */}
              <Select
                value={direcaoFilter || 'all'}
                onValueChange={(val) => {
                  setDirecaoFilter(val === 'all' ? '' : (val as DirecaoDoacao));
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-44 text-[13px]">
                  <SelectValue placeholder="Todas modalidades" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="all">Todas modalidades</SelectItem>
                  <SelectItem value="RECEBIDA">Doações Recebidas</SelectItem>
                  <SelectItem value="REALIZADA">Doações Feitas (ONG)</SelectItem>
                </SelectContent>
              </Select>

              {/* Filtro por Tipo de Item (Select limpo) */}
              <Select
                value={tipoFilter || 'all'}
                onValueChange={(val) => {
                  setTipoFilter(val === 'all' ? '' : (val as TipoDoacao));
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-44 text-[13px]">
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  {(Object.keys(TIPO_DOACAO_LABELS) as TipoDoacao[]).map((t) => (
                    <SelectItem key={t} value={t}>
                      {TIPO_DOACAO_LABELS[t]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <DoacaoCardSkeleton key={i} />
                ))}
              </div>
            ) : doacoes.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border p-12 text-center">
                <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <Gift className="size-6" />
                </div>
                <h3 className="mt-3 text-sm font-semibold text-foreground">Nenhuma doação encontrada</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {search || tipoFilter || direcaoFilter
                    ? 'Tente ajustar os filtros de busca.'
                    : 'Comece registrando uma doação recebida ou feita pela ONG.'}
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  className="mt-4"
                  onClick={() => setIsModalOpen(true)}
                >
                  <Plus className="mr-1.5 size-4" />
                  Registrar Doação
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {doacoes.map((d) => (
                    <DoacaoCard key={d.id} doacao={d} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="mt-6 flex justify-center">
                    <Pagination
                      page={page}
                      totalPages={totalPages}
                      onPageChange={setPage}
                    />
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
        onSubmit={handleSubmit}
        isPending={createDoacao.isPending}
      />
    </>
  );
}
