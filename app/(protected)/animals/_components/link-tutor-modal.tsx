'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod/v3';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateTutor } from '@/hooks/use-create-tutor';
import { useLinkAnimalToTutor } from '@/hooks/use-link-animal-to-tutor';
import { useTutors } from '@/hooks/use-tutors';
import { formatCpf, formatPhone, getTutorInitials, isValidCpf, onlyDigits } from '@/lib/tutor';
import type { TutorFormValues } from '@/types/tutor';

const tutorSchema = z.object({
  nome: z.string().trim().min(1, 'Nome obrigatório'),
  cpf: z
    .string()
    .min(1, 'CPF obrigatório')
    .refine((value) => onlyDigits(value).length === 11 && isValidCpf(value), 'CPF inválido'),
  telefone: z
    .string()
    .min(1, 'Telefone obrigatório')
    .refine((value) => {
      const digits = onlyDigits(value);
      return digits.length === 10 || digits.length === 11;
    }, 'Telefone inválido'),
  email: z.string().trim().min(1, 'E-mail obrigatório').email('E-mail inválido'),
  endereco: z.string().trim().min(1, 'Endereço obrigatório'),
  dataNascimento: z
    .string()
    .min(1, 'Data de nascimento obrigatória')
    .refine((value) => {
      const date = new Date(`${value}T00:00:00`);
      return !Number.isNaN(date.getTime()) && date <= new Date();
    }, 'Data de nascimento inválida'),
});

const defaultValues: TutorFormValues = {
  nome: '',
  cpf: '',
  telefone: '',
  email: '',
  endereco: '',
  dataNascimento: '',
};

type Tab = 'select' | 'create';

interface LinkTutorModalProps {
  open: boolean;
  animalId: string;
  animalName: string;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function LinkTutorModal({ open, animalId, animalName, onOpenChange, onSuccess }: LinkTutorModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>('select');
  const [search, setSearch] = useState('');
  const [selectedTutorId, setSelectedTutorId] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { data: tutors = [], isLoading: isLoadingTutors } = useTutors();
  const linkMutation = useLinkAnimalToTutor();
  const createTutor = useCreateTutor();

  const isPending = linkMutation.isPending || createTutor.isPending;

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<TutorFormValues>({
    resolver: zodResolver(tutorSchema),
    defaultValues,
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

  useEffect(() => {
    if (!open) {
      setActiveTab('select');
      setSearch('');
      setSelectedTutorId(null);
      setSubmitError(null);
      reset(defaultValues);
    }
  }, [open, reset]);

  const filteredTutors = tutors.filter(
    (tutor) =>
      tutor.nome.toLowerCase().includes(search.toLowerCase()) ||
      tutor.cpf.includes(search) ||
      tutor.email.toLowerCase().includes(search.toLowerCase()),
  );

  const handleConfirmLink = async () => {
    if (!selectedTutorId) return;
    setSubmitError(null);
    try {
      await linkMutation.mutateAsync({ tutorId: selectedTutorId, animalId });
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Não foi possível vincular o tutor.');
    }
  };

  const handleCreateAndLink = handleSubmit(async (values) => {
    setSubmitError(null);
    try {
      const newTutor = await createTutor.mutateAsync(values);
      await linkMutation.mutateAsync({ tutorId: newTutor.id, animalId });
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Não foi possível cadastrar e vincular o tutor.');
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
        aria-labelledby="link-tutor-title"
        className="relative z-10 flex w-full max-w-2xl flex-col overflow-hidden rounded-[18px] border border-border bg-card shadow-2xl"
      >
        <div className="flex items-start justify-between border-b border-border px-5 py-4">
          <div>
            <h2 id="link-tutor-title" className="text-lg font-semibold text-foreground">
              Vincular tutor
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Selecione ou cadastre um tutor para vincular a <strong className="text-foreground">{animalName}</strong>.
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
              {tab === 'select' ? 'Selecionar existente' : 'Cadastrar novo'}
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
              {isLoadingTutors ? (
                <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
                  Carregando tutores...
                </div>
              ) : filteredTutors.length === 0 ? (
                <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
                  {search ? 'Nenhum tutor encontrado para esta busca.' : 'Nenhum tutor cadastrado.'}
                </div>
              ) : (
                <ul>
                  {filteredTutors.map((tutor, index) => {
                    const isSelected = selectedTutorId === tutor.id;
                    return (
                      <li key={tutor.id}>
                        <button
                          type="button"
                          onClick={() => setSelectedTutorId(isSelected ? null : tutor.id)}
                          className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${
                            index !== filteredTutors.length - 1 ? 'border-b border-border' : ''
                          } ${isSelected ? 'bg-primary/10' : 'hover:bg-muted/50'}`}
                        >
                          <div
                            className={`flex size-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${
                              isSelected
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400'
                            }`}
                          >
                            {isSelected ? <Check className="size-4" /> : getTutorInitials(tutor.nome)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-foreground">{tutor.nome}</p>
                            <p className="truncate text-[12px] text-muted-foreground">
                              {tutor.cpf} · {tutor.email}
                            </p>
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {submitError && (
              <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {submitError}
              </div>
            )}

            <div className="flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
                Cancelar
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={handleConfirmLink}
                disabled={!selectedTutorId || isPending}
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
                    placeholder="Digite o nome do tutor"
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
                    placeholder="tutor@email.com"
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

            {submitError && (
              <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {submitError}
              </div>
            )}

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
