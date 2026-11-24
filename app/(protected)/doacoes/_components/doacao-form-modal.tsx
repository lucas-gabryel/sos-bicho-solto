'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Check,
  FileCheck,
  FileText,
  Loader2,
  Paperclip,
  Search,
  Upload,
  UserCheck,
  UserX,
  X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDoadores } from '@/hooks/use-doadores';
import { defaultDoacaoFormValues, doacaoSchema } from '@/lib/validations/doacao';
import { uploadDocumentoDoacao } from '@/services/doacao.service';
import type { DirecaoDoacao, DoacaoFormValues, TipoDoacao } from '@/types/doacao';
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
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [pickedDoador, setPickedDoador] = useState<Doador | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Debounce de 300ms para busca de doador durante digitação
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(doadorSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [doadorSearch]);

  const { data: doadoresPage, isLoading: isLoadingDoadores } = useDoadores(
    {
      limit: 10,
      busca: debouncedSearch.trim() || undefined,
    },
    { enabled: open },
  );

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

  const direcao = (useWatch({ control, name: 'direcao' }) || 'RECEBIDA') as DirecaoDoacao;
  const tipo = useWatch({ control, name: 'tipo' }) as TipoDoacao;
  const isAnonima = useWatch({ control, name: 'anonima' });
  const doadorId = useWatch({ control, name: 'doadorId' });
  const documentoUrl = useWatch({ control, name: 'documentoUrl' });
  const documentoNome = useWatch({ control, name: 'documentoNome' });

  useEffect(() => {
    if (!open) return;

    reset(
      preSelectedDoador
        ? {
            ...defaultDoacaoFormValues,
            direcao: 'RECEBIDA',
            anonima: false,
            doadorId: preSelectedDoador.id,
          }
        : defaultDoacaoFormValues,
    );
  }, [open, preSelectedDoador, reset]);

  const doadoresList = doadoresPage?.data ?? [];

  const selectedDoador =
    preSelectedDoador?.id === doadorId
      ? preSelectedDoador
      : pickedDoador?.id === doadorId
        ? pickedDoador
        : (doadoresList.find((d) => d.id === doadorId) ?? null);

  const handleSelectDoador = (doador: Doador) => {
    setPickedDoador(doador);
    setValue('doadorId', doador.id, { shouldValidate: true });
    setDoadorSearch('');
  };

  const handleClearDoador = () => {
    setPickedDoador(null);
    setValue('doadorId', '', { shouldValidate: true });
    setDoadorSearch('');
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('O arquivo deve ter no máximo 10 MB.');
      return;
    }

    try {
      setIsUploading(true);
      const res = await uploadDocumentoDoacao(file);
      setValue('documentoUrl', res.documentoUrl);
      setValue('documentoNome', res.documentoNome);
      setValue('documentoTipo', res.documentoTipo);
      toast.success('Documento comprobatório anexado com sucesso!');
    } catch (err: any) {
      toast.error(err?.message || 'Falha ao fazer upload do documento.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveFile = () => {
    setValue('documentoUrl', '');
    setValue('documentoNome', '');
    setValue('documentoTipo', '');
  };

  const handleFormSubmit = async (values: DoacaoFormValues) => {
    try {
      await onSubmit(values);
      onOpenChange(false);
    } catch {
      // Erro gerenciado pela mutation pai
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Registrar Doação</DialogTitle>
          <DialogDescription>
            Lance uma doação recebida pela ONG ou registre uma doação/auxílio realizado pela instituição.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Seletor: Recebida vs Realizada */}
          <div>
            <Label className="text-xs font-semibold text-muted-foreground">MODALIDADE DA DOAÇÃO</Label>
            <div className="mt-1.5 grid grid-cols-2 gap-2 rounded-lg border border-border bg-muted/40 p-1">
              <button
                type="button"
                onClick={() => {
                  setValue('direcao', 'RECEBIDA');
                  setValue('anonima', false);
                }}
                className={`flex items-center justify-center gap-2 rounded-md py-2 text-xs font-semibold transition-all ${
                  direcao === 'RECEBIDA'
                    ? 'bg-card text-foreground shadow-xs border border-border/80'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <ArrowDownLeft className="size-4 text-emerald-600 dark:text-emerald-400" />
                <span>Receber Doação</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setValue('direcao', 'REALIZADA');
                  setValue('anonima', false);
                  setValue('doadorId', '');
                }}
                className={`flex items-center justify-center gap-2 rounded-md py-2 text-xs font-semibold transition-all ${
                  direcao === 'REALIZADA'
                    ? 'bg-card text-foreground shadow-xs border border-border/80'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <ArrowUpRight className="size-4 text-blue-600 dark:text-blue-400" />
                <span>Fazer Doação (ONG)</span>
              </button>
            </div>
          </div>

          {/* Doador ou Beneficiário */}
          {direcao === 'RECEBIDA' ? (
            <div className="space-y-3 rounded-lg border border-border bg-card p-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold">Identificação do Doador</Label>
                <label className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground">
                  <input
                    type="checkbox"
                    className="accent-primary"
                    {...register('anonima', {
                      onChange: (e) => {
                        if (e.target.checked) {
                          handleClearDoador();
                        }
                      },
                    })}
                  />
                  <span>Doação Anônima</span>
                </label>
              </div>

              {!isAnonima && (
                <div className="space-y-2">
                      {selectedDoador ? (
                    <div className="flex items-center justify-between rounded-md border border-emerald-500/30 bg-emerald-50/50 p-2 text-xs dark:bg-emerald-950/20">
                      <div className="flex items-center gap-2">
                        <UserCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
                        <div>
                          <p className="font-medium text-foreground">{selectedDoador.nome}</p>
                          <p className="text-[11px] text-muted-foreground">Doc: {selectedDoador.cpfCnpj}</p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleClearDoador}
                        className="h-7 text-xs text-muted-foreground hover:text-destructive"
                      >
                        Trocar
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <div className="relative">
                        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder="Buscar doador por nome ou CPF/CNPJ..."
                          value={doadorSearch}
                          onChange={(e) => setDoadorSearch(e.target.value)}
                          className="pl-8 text-xs"
                        />
                      </div>

                      {isLoadingDoadores ? (
                        <p className="p-2 text-center text-xs text-muted-foreground">Buscando doadores...</p>
                      ) : doadoresList.length > 0 ? (
                        <div className="max-h-36 overflow-y-auto rounded-md border border-border bg-card text-xs">
                          {doadoresList.map((d) => (
                            <button
                              key={d.id}
                              type="button"
                              onClick={() => handleSelectDoador(d)}
                              className="flex w-full items-center justify-between p-2 text-left hover:bg-muted/60"
                            >
                              <div>
                                <p className="font-medium">{d.nome}</p>
                                <p className="text-[10px] text-muted-foreground">{d.cpfCnpj}</p>
                              </div>
                              <Check className="size-3 text-muted-foreground" />
                            </button>
                          ))}
                        </div>
                      ) : debouncedSearch ? (
                        <p className="p-2 text-center text-xs text-muted-foreground">Nenhum doador encontrado.</p>
                      ) : null}
                    </div>
                  )}

                  {errors.doadorId && (
                    <p className="text-xs text-destructive">{errors.doadorId.message}</p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-1.5 rounded-lg border border-border bg-card p-3">
              <Label htmlFor="beneficiario" className="text-xs font-semibold">
                Destinatário / Beneficiário (Opcional)
              </Label>
              <Input
                id="beneficiario"
                placeholder="Ex: Família acolhedora João, Protetor parceiro, etc."
                className="text-xs"
                {...register('beneficiario')}
              />
            </div>
          )}

          {/* Tipo de Doação */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Tipo do Item / Recurso</Label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {(Object.keys(TIPO_DOACAO_LABELS) as TipoDoacao[]).map((t) => (
                <label
                  key={t}
                  className={`flex cursor-pointer items-center justify-between rounded-lg border p-2.5 text-xs transition-colors ${
                    tipo === t
                      ? 'border-primary bg-primary/5 font-semibold text-primary'
                      : 'border-border bg-card hover:bg-muted/40'
                  }`}
                >
                  <span>{TIPO_DOACAO_LABELS[t]}</span>
                  <input
                    type="radio"
                    value={t}
                    className="accent-primary"
                    {...register('tipo')}
                  />
                </label>
              ))}
            </div>
            {errors.tipo && <p className="text-xs text-destructive">{errors.tipo.message}</p>}
          </div>

          {/* Valor ou Quantidade */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {tipo === 'DINHEIRO' ? (
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="valor" className="text-xs font-semibold">
                  Valor em Dinheiro (R$) *
                </Label>
                <Input
                  id="valor"
                  type="text"
                  placeholder="Ex: 150,00"
                  className="text-xs"
                  {...register('valor')}
                />
                {errors.valor && <p className="text-xs text-destructive">{errors.valor.message}</p>}
              </div>
            ) : (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="quantidade" className="text-xs font-semibold">
                    Quantidade *
                  </Label>
                  <Input
                    id="quantidade"
                    type="text"
                    placeholder="Ex: 15"
                    className="text-xs"
                    {...register('quantidade')}
                  />
                  {errors.quantidade && (
                    <p className="text-xs text-destructive">{errors.quantidade.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="unidadeMedida" className="text-xs font-semibold">
                    Unidade de Medida
                  </Label>
                  <Input
                    id="unidadeMedida"
                    type="text"
                    placeholder="Ex: kg, sacos, caixas, unidades"
                    className="text-xs"
                    {...register('unidadeMedida')}
                  />
                </div>
              </>
            )}
          </div>

          {/* Descrição e Data */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="dataRecebimento" className="text-xs font-semibold">
                {direcao === 'RECEBIDA' ? 'Data de Recebimento *' : 'Data da Doação Realizada *'}
              </Label>
              <Input
                id="dataRecebimento"
                type="date"
                className="text-xs"
                {...register('dataRecebimento')}
              />
              {errors.dataRecebimento && (
                <p className="text-xs text-destructive">{errors.dataRecebimento.message}</p>
              )}
            </div>

            <div className="space-y-1.5 sm:col-span-1">
              <Label htmlFor="descricao" className="text-xs font-semibold">
                {direcao === 'RECEBIDA' ? 'Descrição / Observação' : 'Descrição da Doação Realizada *'}
              </Label>
              <Input
                id="descricao"
                placeholder={
                  direcao === 'RECEBIDA'
                    ? 'Ex: Ração Golden filhote 15kg'
                    : 'Ex: Entrega de ração e remédios para acolhedor'
                }
                className="text-xs"
                {...register('descricao')}
              />
              {errors.descricao && (
                <p className="text-xs text-destructive">{errors.descricao.message}</p>
              )}
            </div>
          </div>

          {/* Documento Comprobatório (Imagem / PDF) */}
          <div className="space-y-2 rounded-lg border border-dashed border-border p-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-1.5 text-xs font-semibold">
                <Paperclip className="size-3.5 text-primary" />
                <span>Documento Comprobatório (Imagem ou PDF)</span>
              </Label>
              {isUploading && (
                <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Loader2 className="size-3 animate-spin" /> Enviando...
                </span>
              )}
            </div>

            {documentoUrl ? (
              <div className="flex items-center justify-between rounded-md border border-border bg-muted/40 p-2 text-xs">
                <div className="flex items-center gap-2 overflow-hidden">
                  <FileCheck className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <span className="truncate font-medium">{documentoNome || 'Comprovante anexado'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={documentoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-primary underline"
                  >
                    Ver
                  </a>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveFile}
                    className="size-6 p-0 text-muted-foreground hover:text-destructive"
                  >
                    <X className="size-3.5" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="comprovante-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isUploading}
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs"
                >
                  <Upload className="mr-1.5 size-3.5" />
                  Selecionar Comprovante
                </Button>
                <span className="text-[11px] text-muted-foreground">
                  JPG, PNG ou PDF (máximo 10 MB)
                </span>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="default"
              onClick={() => onOpenChange(false)}
              disabled={isPending || isUploading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="default"
              disabled={isPending || isUploading}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar Doação'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
