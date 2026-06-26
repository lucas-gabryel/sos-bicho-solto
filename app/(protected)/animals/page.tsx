'use client';

import { LoaderCircle, Plus, Search } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAnimals } from '@/hooks/use-animals';
import type { AnimalEsp, AnimalStatus } from '@/services/animal.service';
import { AnimalCard } from './_components/animal-card';
import { AnimalFormModal } from './_components/animal-form-modal';

const PAGE_SIZE = 12;

export default function AnimalsPage() {
  const [search, setSearch] = useState('');
  const [species, setSpecies] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, isFetching } = useAnimals({
    page,
    limit: PAGE_SIZE,
    busca: search.trim() || undefined,
    especie: species === 'all' ? undefined : (species as AnimalEsp),
    status: statusFilter === 'all' ? undefined : (statusFilter as AnimalStatus),
  });

  const animals = data?.data ?? [];
  const totalPages = data?.meta.totalPages ?? 0;

  const updateFilter = (apply: () => void) => {
    apply();
    setPage(1);
  };

  return (
    <div className="p-4 md:p-7">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-semibold text-foreground">Animais</h1>
          <p className="mt-0.5 text-[13px] text-muted-foreground">Gerenciamento de animais resgatados</p>
        </div>
        <Button variant="primary" size="default" onClick={() => setIsModalOpen(true)}>
          <Plus className="size-4" />
          Registrar animal
        </Button>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative min-w-45 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nº de registro ou nome..."
            className="pl-9 text-[13px]"
            value={search}
            onChange={(e) => updateFilter(() => setSearch(e.target.value))}
          />
        </div>

        <Select value={species} onValueChange={(value) => updateFilter(() => setSpecies(value))}>
          <SelectTrigger className="w-40 text-[13px]">
            <SelectValue placeholder="Todas espécies" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value="all">Todas espécies</SelectItem>
            <SelectItem value="Cão">Cão</SelectItem>
            <SelectItem value="Gato">Gato</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={(value) => updateFilter(() => setStatusFilter(value))}>
          <SelectTrigger className="w-40 text-[13px]">
            <SelectValue placeholder="Todos status" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value="all">Todos status</SelectItem>
            <SelectItem value="Acolhimento">Em acolhimento</SelectItem>
            <SelectItem value="Adotado">Adotado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
          <LoaderCircle className="size-4 animate-spin" />
          Carregando animais...
        </div>
      ) : animals.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-16 text-muted-foreground">
          <Search className="size-10 opacity-30" />
          <p className="text-sm">Nenhum animal encontrado</p>
        </div>
      ) : (
        <div className={isFetching ? 'opacity-60 transition-opacity' : 'transition-opacity'}>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3.5">
            {animals.map((animal) => (
              <AnimalCard key={animal.id} animal={animal} />
            ))}
          </div>
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}

      <AnimalFormModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
}
