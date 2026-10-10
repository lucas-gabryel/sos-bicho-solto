'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import { SituacaoBadge } from '@/components/situacao-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateAcolhedor } from '@/hooks/use-create-acolhedor';
import { useLinkAnimalToAcolhedor } from '@/hooks/use-link-animal-to-acolhedor';
import { useAcolhedores } from '@/hooks/use-acolhedores';
import { formatCpf, formatPhone, getAcolhedorInitials } from '@/lib/acolhedor';
import { acolhedorSchema, defaultAcolhedorFormValues } from '@/lib/validations/acolhedor';
import type { AcolhedorFormValues } from '@/types/acolhedor';

type Tab = 'select' | 'create';

interface LinkAcolhedorModalProps {
  open: boolean;
  animalId: string;
  animalName: string;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function LinkAcolhedorModal({ open, animalId, animalName, onOpenChange, onSuccess }: LinkAcolhedorModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>('select');
  const [search, setSearch] = useState('');
  const [selectedAcolhedorId, setSelectedAcolhedorId] = useState<string | null>(null);

  const { data: acolhedoresPage, isLoading: isLoadingAcolhedores } = useAcolhedores({
    limit: 20,
    busca: search.trim() || undefined,
  });
  const linkMutation = useLinkAnimalToAcolhedor();
  const createAcolhedor = useCreateAcolhedor();

  const isPending = linkMutation.isPending || createAcolhedor.isPending;

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AcolhedorFormValues>({
    resolver: zodResolver(acolhedorSchema),
    defaultValues: defaultAcolhedorFormValues,
  });

  const cpfValue = useWatch({ control, name: 'cpf' }) ?? '';
  const phoneValue = useWatch({ control, name: 'telefone' }) ?? '';

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isPending) {
        onOpenChange(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, isPending, onOpenChange]);

  const filteredAcolhedores = acolhedoresPage?.data ?? [];

  const handleConfirmLink = async () => {
    if (!selectedAcolhedorId) return;
    try {
      await linkMutation.mutateAsync({ acolhedorId: selectedAcolhedorId, animalId });
      onOpenChange(false);
      onSuccess?.();
    } catch {
      // Erro exibido pelo toast global.
    }
  };

  const handleCreateAndLink = handleSubmit(async (values) => {
    try {
      const newAcolhedor = await createAcolhedor.mutateAsync(values);
      await linkMutation.mutateAsync({ acolhedorId: newAcolhedor.id, animalId });
      onOpenChange(false);
      onSuccess?.();
    } catch {
      // Erro exibido pelo toast global.
    }
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Fechar modal"
        onClick={() => !isPending && onOpenChange(false)}
        className="absolute inset-0 bg-black/45 backdrop-blur-sm"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="link-acolhedor-title"
        className="relative z-10 flex w-full max-w-2xl flex-col overflow-hidden rounded-[18px] border border-border bg-card shadow-2xl"
      >
        <div className="flex items-start justify-between border-b border-border px-5 py-4">
          <div>
            <h2 id="link-acolhedor-title" className="text-lg font-semibold text-foreground">
              Vincular acolhedor
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Selecione um acolhedor ou cadastre um adotante para vincular a <strong className="text-foreground">{animalName}</strong>.
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
            aria-label="Fechar"
          >
            <X className="size-4" />
          </Button>
        </div>

        <div className="flex border-b border-border">
          {(['select', 'create'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-5 py-3 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'border-b-2 border-primary text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab === 'select' ? 'Selecionar existente' : 'Cadastrar adotante'}
            </button>
          ))}
        </div>

        {activeTab === 'select' && (
          <div className="flex flex-col gap-4 px-5 py-5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, CPF ou e-mail"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="max-h-72 overflow-y-auto rounded-[14px] border border-border">
              {isLoadingAcolhedores ? (
                <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
                  Carregando acolhedores...
                </div>
              ) : filteredAcolhedores.length === 0 ? (
                <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
                  {search ? 'Nenhum acolhedor encontrado para esta busca.' : 'Nenhum acolhedor cadastrado.'}
                </div>
              ) : (
                <ul>
                  {filteredAcolhedores.map((acolhedor, index) => {
                    const isSelected = selectedAcolhedorId === acolhedor.id;
                    return (
                      <li key={acolhedor.id}>
                        <button
                          type="button"
                          onClick={() => setSelectedAcolhedorId(isSelected ? null : acolhedor.id)}
                          className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${
                            index !== filteredAcolhedores.length - 1 ? 'border-b border-border' : ''
                          } ${isSelected ? 'bg-primary/10' : 'hover:bg-muted/50'}`}
                        >
                          <div
                            className={`flex size-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${
                              isSelected
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400'
                            }`}
                          >
                            {isSelected ? <Check className="size-4" /> : getAcolhedorInitials(acolhedor.nome)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-foreground">{acolhedor.nome}</p>
                            <p className="truncate text-[12px] text-muted-foreground">
                              {acolhedor.cpf} · {acolhedor.email}
                            </p>
                          </div>
                          <SituacaoBadge situacao={acolhedor.situacao} />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
                Cancelar
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={handleConfirmLink}
                disabled={!selectedAcolhedorId || isPending}
              >
                {linkMutation.isPending ? 'Vinculando...' : 'Confirmar vinculação'}
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'create' && (
          <form onSubmit={handleCreateAndLink} noValidate className="flex flex-col gap-5 px-5 py-5">
            <div className="max-h-[55vh] overflow-y-auto pr-1">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <Label htmlFor="link-nome">Nome completo</Label>
                  <Input
                    id="link-nome"
                    placeholder="Digite o nome completo"
                    aria-invalid={!!errors.nome}
                    {...register('nome')}
                  />
                  {errors.nome && <p className="text-xs text-destructive">{errors.nome.message}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="link-cpf">CPF</Label>
                  <Input
                    id="link-cpf"
                    placeholder="000.000.000-00"
                    inputMode="numeric"
                    value={cpfValue}
                    aria-invalid={!!errors.cpf}
                    onChange={(event) =>
                      setValue('cpf', formatCpf(event.target.value), {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                  />
                  {errors.cpf && <p className="text-xs text-destructive">{errors.cpf.message}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="link-telefone">Telefone</Label>
                  <Input
                    id="link-telefone"
                    placeholder="(82) 99999-9999"
                    inputMode="tel"
                    value={phoneValue}
                    aria-invalid={!!errors.telefone}
                    onChange={(event) =>
                      setValue('telefone', formatPhone(event.target.value), {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                  />
                  {errors.telefone && <p className="text-xs text-destructive">{errors.telefone.message}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="link-email">E-mail</Label>
                  <Input
                    id="link-email"
                    type="email"
                    placeholder="nome@email.com"
                    autoComplete="email"
                    aria-invalid={!!errors.email}
                    {...register('email')}
                  />
                  {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="link-dataNascimento">Data de nascimento</Label>
                  <Input
                    id="link-dataNascimento"
                    type="date"
                    aria-invalid={!!errors.dataNascimento}
                    {...register('dataNascimento')}
                  />
                  {errors.dataNascimento && <p className="text-xs text-destructive">{errors.dataNascimento.message}</p>}
                </div>

                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <Label htmlFor="link-endereco">Endereço</Label>
                  <Input
                    id="link-endereco"
                    placeholder="Rua, número, bairro, cidade e estado"
                    aria-invalid={!!errors.endereco}
                    {...register('endereco')}
                  />
                  {errors.endereco && <p className="text-xs text-destructive">{errors.endereco.message}</p>}
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
                Cancelar
              </Button>
              <Button type="submit" variant="primary" disabled={isPending}>
                {isPending ? 'Salvando...' : 'Cadastrar e vincular'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
