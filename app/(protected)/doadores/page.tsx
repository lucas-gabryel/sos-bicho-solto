'use client';

import { HeartHandshake, Plus, Search } from 'lucide-react';
import { useDeferredValue, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { useDoadores } from '@/hooks/use-doadores';
import type { Doador } from '@/types/doador';
import { DoadorCard, DoadorCardSkeleton } from './_components/doador-card';

const PAGE_SIZE = 9;

export default function DoadoresPage() {
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching } = useDoadores({
    page,
    limit: PAGE_SIZE,
    busca: deferredSearch.trim() || undefined,
  });

  const doadores = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 0;

  const handleCadastrarDoador = () => {
    // Será acoplado ao modal de cadastro na Task subsequente
  };

  const handleEditDoador = (doador: Doador) => {
    void doador;
  };

  return (
    <div className="p-4 md:p-7">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-semibold text-foreground">Doadores</h1>
          <p className="mt-0.5 text-[13px] text-muted-foreground">
            Cadastro e acompanhamento de pessoas e entidades colaboradoras da ONG
          </p>
        </div>

        <Button variant="primary" size="default" onClick={handleCadastrarDoador}>
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
              <DoadorCard key={doador.id} doador={doador} onEdit={handleEditDoador} />
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
  );
}
