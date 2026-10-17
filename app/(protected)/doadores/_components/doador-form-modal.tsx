'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatCpfCnpj, formatPhone } from '@/lib/documentos';
import { defaultDoadorFormValues, doadorSchema } from '@/lib/validations/doador';
import type { Doador, DoadorFormValues } from '@/types/doador';

export interface DoadorFormModalProps {
  open: boolean;
  mode: 'create' | 'edit';
  doador: Doador | null;
  isPending?: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: DoadorFormValues) => Promise<void>;
}

export function DoadorFormModal({
  open,
  mode,
  doador,
  isPending = false,
  onOpenChange,
  onSubmit,
}: DoadorFormModalProps) {
  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<DoadorFormValues>({
    resolver: zodResolver(doadorSchema),
    defaultValues: defaultDoadorFormValues,
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    reset(
      doador
        ? {
            nome: doador.nome,
            cpfCnpj: doador.cpfCnpj,
            telefone: doador.telefone,
            email: doador.email,
            endereco: doador.endereco,
          }
        : defaultDoadorFormValues,
    );
  }, [open, doador, reset]);

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

  const cpfCnpjValue = useWatch({ control, name: 'cpfCnpj' }) ?? '';
  const phoneValue = useWatch({ control, name: 'telefone' }) ?? '';

  const submit = handleSubmit(async (values) => {
    try {
      await onSubmit(values);
      onOpenChange(false);
    } catch {
      // Erro exibido pelo toast global.
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
        aria-labelledby="doador-form-title"
        className="relative z-10 w-full max-w-2xl overflow-hidden rounded-[18px] border border-border bg-card shadow-2xl"
      >
        <div className="flex items-start justify-between border-b border-border px-5 py-4">
          <div>
            <h2 id="doador-form-title" className="text-lg font-semibold text-foreground">
              {mode === 'create' ? 'Cadastrar doador' : 'Editar doador'}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {mode === 'create'
                ? 'Preencha os dados essenciais para cadastrar um novo doador ou entidade colaboradora.'
                : 'Atualize os dados cadastrais do doador selecionado.'}
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
              <Label htmlFor="nome">
                Nome ou Razão Social <span className="text-destructive">*</span>
              </Label>
              <Input
                id="nome"
                placeholder="Digite o nome completo ou razão social"
                aria-invalid={!!errors.nome}
                {...register('nome')}
              />
              {errors.nome ? <p className="text-xs text-destructive">{errors.nome.message}</p> : null}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="cpfCnpj">
                CPF ou CNPJ <span className="text-destructive">*</span>
              </Label>
              <Input
                id="cpfCnpj"
                placeholder="000.000.000-00 ou 00.000.000/0000-00"
                inputMode="numeric"
                value={cpfCnpjValue}
                aria-invalid={!!errors.cpfCnpj}
                onChange={(event) =>
                  setValue('cpfCnpj', formatCpfCnpj(event.target.value), {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
              />
              {errors.cpfCnpj ? <p className="text-xs text-destructive">{errors.cpfCnpj.message}</p> : null}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="telefone">
                Telefone <span className="text-destructive">*</span>
              </Label>
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

            <div className="flex flex-col gap-1.5 md:col-span-2">
              <Label htmlFor="email">
                E-mail <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="contato@exemplo.com"
                autoComplete="email"
                aria-invalid={!!errors.email}
                {...register('email')}
              />
              {errors.email ? <p className="text-xs text-destructive">{errors.email.message}</p> : null}
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-2">
              <Label htmlFor="endereco">
                Endereço <span className="text-destructive">*</span>
              </Label>
              <Input
                id="endereco"
                placeholder="Rua, número, bairro, cidade e estado"
                aria-invalid={!!errors.endereco}
                {...register('endereco')}
              />
              {errors.endereco ? <p className="text-xs text-destructive">{errors.endereco.message}</p> : null}
            </div>
          </div>

          <div className="flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={isPending}>
              {isPending
                ? 'Salvando...'
                : mode === 'create'
                  ? 'Cadastrar doador'
                  : 'Salvar alterações'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
