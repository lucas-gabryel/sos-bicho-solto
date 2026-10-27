'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Search, UserCheck, UserX, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDoadores } from '@/hooks/use-doadores';
import { defaultDoacaoFormValues, doacaoSchema } from '@/lib/validations/doacao';
import type { DoacaoFormValues, TipoDoacao } from '@/types/doacao';
import { TIPO_DOACAO_LABELS } from '@/types/doacao';
import type { Doador } from '@/types/doador';

export interface DoacaoFormModalProps {
  open: boolean;
  preSelectedDoador?: Doador | null;
  isPending?: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: DoacaoFormValues) => Promise<void>;
}

export function DoacaoFormModal({
  open,
  preSelectedDoador,
  isPending = false,
  onOpenChange,
  onSubmit,
}: DoacaoFormModalProps) {
  const [doadorSearch, setDoadorSearch] = useState('');
  const [pickedDoador, setPickedDoador] = useState<Doador | null>(null);

  const { data: doadoresPage, isLoading: isLoadingDoadores } = useDoadores({
    limit: 10,
    busca: doadorSearch.trim() || undefined,
  });

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<DoacaoFormValues>({
    resolver: zodResolver(doacaoSchema),
    defaultValues: defaultDoacaoFormValues,
  });

  const tipo = useWatch({ control, name: 'tipo' }) as TipoDoacao;
  const isAnonima = useWatch({ control, name: 'anonima' });
  const doadorId = useWatch({ control, name: 'doadorId' });

  useEffect(() => {
    if (!open) return;

    reset(
      preSelectedDoador
        ? {
            ...defaultDoacaoFormValues,
            anonima: false,
            doadorId: preSelectedDoador.id,
          }
        : defaultDoacaoFormValues,
    );
  }, [open, preSelectedDoador, reset]);

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

  const doadoresList = doadoresPage?.data ?? [];

  const selectedDoador =
    preSelectedDoador?.id === doadorId
      ? preSelectedDoador
      : pickedDoador?.id === doadorId
        ? pickedDoador
        : (doadoresList.find((d) => d.id === doadorId) ?? null);

  const handleSelectDoador = (doador: Doador) => {
    setPickedDoador(doador);
    setValue('doadorId', doador.id, { shouldValidate: true, shouldDirty: true });
  };

  const handleClearDoador = () => {
    setPickedDoador(null);
    setValue('doadorId', '', { shouldValidate: true, shouldDirty: true });
  };

  const submit = handleSubmit(async (values) => {
    try {
      await onSubmit(values);
      onOpenChange(false);
    } catch {
      // Erro gerenciado pela mutation e sonner toast
    }
  });

  if (!open) return null;

  const isDinheiro = tipo === 'DINHEIRO';

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
        aria-labelledby="doacao-form-title"
        className="relative z-10 flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-[18px] border border-border bg-card shadow-2xl"
      >
        <div className="flex items-start justify-between border-b border-border px-5 py-4">
          <div>
            <h2 id="doacao-form-title" className="text-lg font-semibold text-foreground">
              Registrar doação
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Cadastre o recebimento de doações em dinheiro, ração, medicamentos ou materiais.
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

        <form onSubmit={submit} noValidate className="flex flex-1 flex-col overflow-y-auto px-5 py-5">
          <div className="space-y-5">
            {/* 1. Modalidade de doador: Cadastrado vs Anônimo */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Vínculo de Doador
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setValue('anonima', false, { shouldValidate: true });
                  }}
                  className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-xs font-medium transition-all ${
                    !isAnonima
                      ? 'border-primary bg-primary/10 text-primary shadow-xs'
                      : 'border-border bg-card text-muted-foreground hover:bg-muted/50'
                  }`}
                >
                  <UserCheck className="size-4" />
                  Doador cadastrado
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setValue('anonima', true, { shouldValidate: true });
                    handleClearDoador();
                  }}
                  className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-xs font-medium transition-all ${
                    isAnonima
                      ? 'border-primary bg-primary/10 text-primary shadow-xs'
                      : 'border-border bg-card text-muted-foreground hover:bg-muted/50'
                  }`}
                >
                  <UserX className="size-4" />
                  Doação anônima
                </button>
              </div>

              {!isAnonima ? (
                <div className="mt-3 space-y-2">
                  {selectedDoador ? (
                    <div className="flex items-center justify-between rounded-xl border border-primary/30 bg-primary/5 p-3">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{selectedDoador.nome}</p>
                        <p className="text-xs text-muted-foreground">{selectedDoador.cpfCnpj} · {selectedDoador.email}</p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleClearDoador}
                        className="h-8 text-xs text-destructive hover:bg-destructive/10"
                      >
                        Trocar
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="relative">
                        <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder="Buscar doador por nome, CPF ou CNPJ..."
                          value={doadorSearch}
                          onChange={(e) => setDoadorSearch(e.target.value)}
                          className="pl-9 text-xs"
                        />
                      </div>

                      <div className="max-h-40 overflow-y-auto rounded-xl border border-border bg-background p-1">
                        {isLoadingDoadores ? (
                          <p className="p-3 text-center text-xs text-muted-foreground">Buscando doadores...</p>
                        ) : doadoresList.length === 0 ? (
                          <p className="p-3 text-center text-xs text-muted-foreground">
                            {doadorSearch ? 'Nenhum doador encontrado.' : 'Digite para buscar um doador.'}
                          </p>
                        ) : (
                          <ul className="space-y-1">
                            {doadoresList.map((doador) => (
                              <li key={doador.id}>
                                <button
                                  type="button"
                                  onClick={() => handleSelectDoador(doador)}
                                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs transition-colors hover:bg-muted"
                                >
                                  <div>
                                    <p className="font-medium text-foreground">{doador.nome}</p>
                                    <p className="text-[11px] text-muted-foreground">{doador.cpfCnpj}</p>
                                  </div>
                                  <Check className="size-3.5 text-primary opacity-0 group-hover:opacity-100" />
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  )}
                  {errors.doadorId && (
                    <p className="text-xs text-destructive">{errors.doadorId.message}</p>
                  )}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-border bg-muted/30 p-3 text-center">
                  <p className="text-xs text-muted-foreground">
                    Esta doação será registrada como anônima, sem nenhum doador atrelado.
                  </p>
                </div>
              )}
            </div>

            {/* 2. Informações da doação */}
            <div className="space-y-4">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Dados da Doação
              </Label>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="tipo-doacao">Tipo de doação *</Label>
                  <select
                    id="tipo-doacao"
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    {...register('tipo')}
                  >
                    <option value="DINHEIRO">{TIPO_DOACAO_LABELS.DINHEIRO}</option>
                    <option value="RACAO">{TIPO_DOACAO_LABELS.RACAO}</option>
                    <option value="MEDICAMENTO">{TIPO_DOACAO_LABELS.MEDICAMENTO}</option>
                    <option value="PRODUTO_LIMPEZA">{TIPO_DOACAO_LABELS.PRODUTO_LIMPEZA}</option>
                    <option value="OUTRO">{TIPO_DOACAO_LABELS.OUTRO}</option>
                  </select>
                  {errors.tipo && <p className="text-xs text-destructive">{errors.tipo.message}</p>}
                </div>

                {isDinheiro ? (
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="valor-doacao">Valor em dinheiro (R$) *</Label>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        R$
                      </span>
                      <Input
                        id="valor-doacao"
                        type="number"
                        step="0.01"
                        min="0.01"
                        placeholder="0,00"
                        className="pl-9"
                        {...register('valor')}
                      />
                    </div>
                    {errors.valor && <p className="text-xs text-destructive">{errors.valor.message}</p>}
                  </div>
                ) : (
                  <>
                    <div className="space-y-1.5">
                      <Label htmlFor="quantidade-doacao">Quantidade *</Label>
                      <Input
                        id="quantidade-doacao"
                        type="number"
                        step="0.1"
                        min="0.01"
                        placeholder="Ex: 10"
                        {...register('quantidade')}
                      />
                      {errors.quantidade && (
                        <p className="text-xs text-destructive">{errors.quantidade.message}</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="unidade-doacao">Unidade de medida</Label>
                      <Input
                        id="unidade-doacao"
                        placeholder="Ex: kg, pacotes, caixas, un"
                        {...register('unidadeMedida')}
                      />
                      {errors.unidadeMedida && (
                        <p className="text-xs text-destructive">{errors.unidadeMedida.message}</p>
                      )}
                    </div>
                  </>
                )}

                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="data-recebimento">Data de recebimento *</Label>
                  <Input
                    id="data-recebimento"
                    type="date"
                    {...register('dataRecebimento')}
                  />
                  {errors.dataRecebimento && (
                    <p className="text-xs text-destructive">{errors.dataRecebimento.message}</p>
                  )}
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="descricao-doacao">Descrição / Detalhes (opcional)</Label>
                  <Input
                    id="descricao-doacao"
                    placeholder="Ex: Ração para cães idosos sabor frango, Dipirona 50ml, etc."
                    {...register('descricao')}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={isPending}>
              {isPending ? 'Registrando...' : 'Registrar doação'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
