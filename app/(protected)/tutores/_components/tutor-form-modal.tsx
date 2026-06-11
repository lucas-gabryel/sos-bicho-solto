'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod/v3';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatCpf, formatPhone, isValidCpf, onlyDigits } from '@/lib/tutor';
import type { Tutor, TutorFormValues } from '@/types/tutor';

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

interface TutorFormModalProps {
  open: boolean;
  mode: 'create' | 'edit';
  tutor: Tutor | null;
  isPending?: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: TutorFormValues) => Promise<void>;
}

export function TutorFormModal({
  open,
  mode,
  tutor,
  isPending = false,
  onOpenChange,
  onSubmit,
}: TutorFormModalProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);

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

  useEffect(() => {
    if (!open) {
      return;
    }

    reset(
      tutor
        ? {
            nome: tutor.nome,
            cpf: tutor.cpf,
            telefone: tutor.telefone,
            email: tutor.email,
            endereco: tutor.endereco,
            dataNascimento: tutor.dataNascimento,
          }
        : defaultValues,
    );
  }, [open, tutor, reset]);

  useEffect(() => {
    if (!open) {
      return;
    }

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

  const cpfValue = useWatch({ control, name: 'cpf' }) ?? '';
  const phoneValue = useWatch({ control, name: 'telefone' }) ?? '';

  const submit = handleSubmit(async (values) => {
    try {
      setSubmitError(null);
      await onSubmit(values);
      onOpenChange(false);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Não foi possível salvar o tutor.');
    }
  });

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Fechar modal"
        onClick={() => !isPending && onOpenChange(false)}
        className="absolute inset-0 bg-black/45 backdrop-blur-sm"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="tutor-form-title"
        className="relative z-10 w-full max-w-2xl overflow-hidden rounded-[18px] border border-border bg-card shadow-2xl"
      >
        <div className="flex items-start justify-between border-b border-border px-5 py-4">
          <div>
            <h2 id="tutor-form-title" className="text-lg font-semibold text-foreground">
              {mode === 'create' ? 'Cadastrar tutor' : 'Editar tutor'}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Preencha os dados obrigatórios para salvar o tutor no sistema.
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

        <form onSubmit={submit} noValidate className="flex flex-col gap-5 px-5 py-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <Label htmlFor="nome">Nome completo</Label>
              <Input id="nome" placeholder="Digite o nome do tutor" aria-invalid={!!errors.nome} {...register('nome')} />
              {errors.nome ? <p className="text-xs text-destructive">{errors.nome.message}</p> : null}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
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
              {errors.cpf ? <p className="text-xs text-destructive">{errors.cpf.message}</p> : null}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
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
              {errors.telefone ? <p className="text-xs text-destructive">{errors.telefone.message}</p> : null}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="tutor@email.com"
                autoComplete="email"
                aria-invalid={!!errors.email}
                {...register('email')}
              />
              {errors.email ? <p className="text-xs text-destructive">{errors.email.message}</p> : null}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="dataNascimento">Data de nascimento</Label>
              <Input
                id="dataNascimento"
                type="date"
                aria-invalid={!!errors.dataNascimento}
                {...register('dataNascimento')}
              />
              {errors.dataNascimento ? (
                <p className="text-xs text-destructive">{errors.dataNascimento.message}</p>
              ) : null}
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-2">
              <Label htmlFor="endereco">Endereço</Label>
              <Input
                id="endereco"
                placeholder="Rua, número, bairro, cidade e estado"
                aria-invalid={!!errors.endereco}
                {...register('endereco')}
              />
              {errors.endereco ? <p className="text-xs text-destructive">{errors.endereco.message}</p> : null}
            </div>
          </div>

          {submitError ? (
            <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {submitError}
            </div>
          ) : null}

          <div className="flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={isPending}>
              {isPending ? 'Salvando...' : mode === 'create' ? 'Cadastrar tutor' : 'Salvar alterações'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
