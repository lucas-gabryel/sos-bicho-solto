'use client';

import { Plus, Search } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAnimals } from '@/hooks/use-animals';
import { AnimalCard } from './_components/animal-card';

export default function AnimalsPage() {
  const { data: animals = [] } = useAnimals();
  const [search, setSearch] = useState('');
  const [species, setSpecies] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = animals
    .filter((a) => species === 'all' || a.esp === species)
    .filter((a) => statusFilter === 'all' || a.status === statusFilter)
    .filter((a) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        a.id.toLowerCase().includes(q) ||
        a.nome.toLowerCase().includes(q) ||
        a.raca.toLowerCase().includes(q) ||
        a.local.toLowerCase().includes(q)
      );
    });

  return (
    <div className="p-4 md:p-7">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-semibold text-foreground">Animais</h1>
          <p className="mt-0.5 text-[13px] text-muted-foreground">Gerenciamento de animais resgatados</p>
        </div>
        <Button variant="primary" size="default">
          <Plus className="size-4" />
          Registrar animal
        </Button>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative min-w-45 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por ID, nome, raça ou localidade..."
            className="pl-9 text-[13px]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Select value={species} onValueChange={setSpecies}>
          <SelectTrigger className="w-40 text-[13px]">
            <SelectValue placeholder="Todas espécies" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value="all">Todas espécies</SelectItem>
            <SelectItem value="Cão">Cão</SelectItem>
            <SelectItem value="Gato">Gato</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
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

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-16 text-muted-foreground">
          <Search className="size-10 opacity-30" />
          <p className="text-sm">Nenhum animal encontrado</p>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3.5">
          {filtered.map((animal) => (
            <AnimalCard key={animal.id} animal={animal} />
          ))}
        </div>
      )}
    </div>
  );
}
