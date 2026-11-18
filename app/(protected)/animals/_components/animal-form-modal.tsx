'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  Check,
  Clock,
  LoaderCircle,
  Paperclip,
  PawPrint,
  Plus,
  X,
} from 'lucide-react';
import { type FormEvent, type ReactNode, useEffect, useRef, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAnimal } from '@/hooks/use-animal';
import {
  useCreateAnimal,
  useCreateEventoAnimal,
  useUpdateAnimal,
} from '@/hooks/use-animal-mutation';
import {
  createAnimalSchema,
  type CreateAnimalFormData,
} from '@/lib/validations/animal';
import { type Animal } from '@/services/animal.service';
import type { MotivoSaidaAnimal, TipoEventoAnimal } from '@/types/animal';

import { AnimalTimeline } from './animal-timeline';

const MAX_DOCUMENT_BYTES = 10 * 1024 * 1024; // 10 MB

function getCurrentLocalDateTime(): string {
  const now = new Date();
  const offsetMs = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - offsetMs).toISOString().slice(0, 16);
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

interface AnimalFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  animal?: Animal;
  initialSection?: 'dados' | 'timeline';
}

function FormSection({ children }: { children: ReactNode }) {
  return (
    <p className="col-span-full mt-1 border-b border-border pb-1.5 text-[11px] font-semibold tracking-[0.06em] text-muted-foreground uppercase">
      {children}
    </p>
  );
}

export function AnimalFormModal({
  open,
  onOpenChange,
  animal,
  initialSection = 'dados',
}: AnimalFormModalProps) {
  const createMutation = useCreateAnimal();
  const updateMutation = useUpdateAnimal();
  const createEventoMutation = useCreateEventoAnimal();

  const isEditing = !!animal;
  const mutation = isEditing ? updateMutation : createMutation;

  const { data: detailedAnimal } = useAnimal(
    isEditing && open ? animal.id : undefined,
  );
  const currentAnimal = detailedAnimal ?? animal;
  const eventos = currentAnimal?.eventos ?? [];

  const timelineSectionRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Estado do formulário incremental de novo evento
  const [eventoDescricao, setEventoDescricao] = useState('');
  const [eventoData, setEventoData] = useState<string>(() =>
    getCurrentLocalDateTime(),
  );
  const [eventoTipo, setEventoTipo] = useState<TipoEventoAnimal>('MEDICO');
  const [eventoMotivoSaida, setEventoMotivoSaida] =
    useState<Exclude<MotivoSaidaAnimal, 'ADOCAO'>>('TRANSFERENCIA');
  const [eventoDocumento, setEventoDocumento] = useState<File | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [eventoError, setEventoError] = useState<string | null>(null);

  const form = useForm<CreateAnimalFormData>({
    resolver: zodResolver(createAnimalSchema),
    mode: 'onSubmit',
    defaultValues: animal
      ? {
          nome: animal.nome,
          esp: animal.esp,
          raca: animal.raca,
          sexo: animal.sexo,
          porte: animal.porte,
          cor: animal.cor,
          peso: animal.peso,
          pesoAt: animal.pesoAt,
          castrado: animal.castrado,
          vacinado: animal.vacinado,
          dataNascimento: animal.dataNascimento ?? '',
          local: animal.local,
          obs: animal.obs || '',
          fotoUrl: '',
          status: animal.status,
          motivoSaidaDescricao: '',
        }
      : {
          nome: '',
          esp: undefined,
          raca: '',
          sexo: undefined,
          porte: undefined,
          cor: '',
          peso: undefined,
          pesoAt: undefined,
          castrado: false,
          vacinado: false,
          dataNascimento: '',
          local: '',
          obs: '',
          fotoUrl: '',
          status: undefined,
          motivoSaidaDescricao: '',
        },
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    form.reset(
      animal
        ? {
            nome: animal.nome,
            esp: animal.esp,
            raca: animal.raca,
            sexo: animal.sexo,
            porte: animal.porte,
            cor: animal.cor,
            peso: animal.peso,
            pesoAt: animal.pesoAt,
            castrado: animal.castrado,
            vacinado: animal.vacinado,
            dataNascimento: animal.dataNascimento ?? '',
            local: animal.local,
            obs: animal.obs || '',
            fotoUrl: '',
            status: animal.status,
            motivoSaidaDescricao: '',
          }
        : {
            nome: '',
            esp: undefined,
            raca: '',
            sexo: undefined,
            porte: undefined,
            cor: '',
            peso: undefined,
            pesoAt: undefined,
            castrado: false,
            vacinado: false,
            dataNascimento: '',
            local: '',
            obs: '',
            fotoUrl: '',
            status: undefined,
            motivoSaidaDescricao: '',
          },
    );
  }, [open, animal, form]);

  useEffect(() => {
    if (!open || !isEditing || initialSection !== 'timeline') {
      return;
    }

    const timer = window.setTimeout(() => {
      timelineSectionRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 120);

    return () => window.clearTimeout(timer);
  }, [open, isEditing, initialSection]);

  const watchedStatus = useWatch({ control: form.control, name: 'status' });
  const baseStatus = currentAnimal?.status ?? animal?.status;
  const isAdopted = baseStatus === 'Adotado';
  const statusChanged =
    isEditing && !isAdopted && watchedStatus && watchedStatus !== baseStatus;

  function clearEventoFields() {
    setEventoDescricao('');
    setEventoData(getCurrentLocalDateTime());
    setEventoTipo('MEDICO');
    setEventoMotivoSaida('TRANSFERENCIA');
    setEventoDocumento(null);
    setFileInputKey((k) => k + 1);
    setEventoError(null);
  }

  function onSubmit(data: CreateAnimalFormData) {
    const payload = {
      nome: data.nome,
      esp: data.esp,
      raca: data.raca,
      sexo: data.sexo,
      porte: data.porte,
      cor: data.cor,
      peso: data.peso,
      pesoAt: data.pesoAt != null ? Number(data.pesoAt) : undefined,
      castrado: data.castrado,
      vacinado: data.vacinado,
      dataNascimento: data.dataNascimento || undefined,
      local: data.local,
      obs: data.obs,
      fotoUrl: data.fotoUrl || undefined,
    };

    const onSuccess = () => {
      toast.success(
        isEditing
          ? 'Dados do animal atualizados!'
          : 'Animal registrado com sucesso!',
      );
      form.reset();
      clearEventoFields();
      onOpenChange(false);
    };

    if (isEditing && animal) {
      updateMutation.mutate(
        {
          id: animal.id,
          ...payload,
          status:
            !isAdopted && data.status && data.status !== baseStatus
              ? data.status
              : undefined,
          motivoSaidaDescricao:
            !isAdopted && data.status && data.status !== baseStatus
              ? data.motivoSaidaDescricao
              : undefined,
        },
        { onSuccess },
      );
    } else {
      createMutation.mutate(payload, { onSuccess });
    }
  }

  async function handleAddEvento(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!animal) return;

    const trimmedDesc = eventoDescricao.trim();
    if (!trimmedDesc) {
      setEventoError('A descrição do evento é obrigatória.');
      return;
    }

    if (eventoTipo === 'SAIDA' && !eventoMotivoSaida) {
      setEventoError('Selecione o motivo da saída (Transferência ou Óbito).');
      return;
    }

    if (eventoDocumento && eventoDocumento.size > MAX_DOCUMENT_BYTES) {
      setEventoError('O documento comprobatório deve ter no máximo 10 MB.');
      return;
    }

    setEventoError(null);

    try {
      await createEventoMutation.mutateAsync({
        animalId: animal.id,
        descricao: trimmedDesc,
        data: eventoData || undefined,
        tipo: eventoTipo,
        motivoSaida: eventoTipo === 'SAIDA' ? eventoMotivoSaida : undefined,
        documento: eventoDocumento,
      });

      toast.success('Evento adicionado à linha do tempo!');
      clearEventoFields();
    } catch {
      // Erro tratado globalmente pelo MutationCache (toast)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      form.reset();
      clearEventoFields();
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className={`max-h-[92vh] overflow-y-auto rounded-2xl ${
          isEditing ? 'sm:max-w-2xl' : 'sm:max-w-155'
        }`}
      >
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-orange-100 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400">
              <PawPrint className="size-4.5" />
            </div>
            <div className="text-left">
              <DialogTitle>
                {isEditing ? `Editar animal — ${animal.nome}` : 'Registrar animal'}
              </DialogTitle>
              <DialogDescription>
                {isEditing
                  ? 'Atualize o prontuário ou insira eventos e comprovantes na linha do tempo.'
                  : 'Preencha todos os campos obrigatórios.'}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={(event) => void form.handleSubmit(onSubmit)(event)}
            className="grid grid-cols-1 gap-4 md:grid-cols-2"
          >
            <FormSection>Dados do animal</FormSection>

            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Nome do animal *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Rex, Mimi, Bolinha" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="esp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Espécie *</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="h-9 w-full">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Cão">Cão</SelectItem>
                      <SelectItem value="Gato">Gato</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="raca"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Raça *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: SRD, Labrador" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sexo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sexo *</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="h-9 w-full">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Macho">Macho</SelectItem>
                      <SelectItem value="Fêmea">Fêmea</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cor *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Caramelo, Preto e branco" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="porte"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Porte</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="h-9 w-full">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Pequeno">Pequeno</SelectItem>
                      <SelectItem value="Médio">Médio</SelectItem>
                      <SelectItem value="Grande">Grande</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="peso"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Peso inicial (kg) *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0.0"
                      step="0.1"
                      min="0"
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pesoAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Peso atual (kg)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Opcional"
                      step="0.1"
                      min="0"
                      {...field}
                      value={field.value ?? ''}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === '' ? undefined : e.target.value,
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dataNascimento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de nascimento</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isEditing && !isAdopted && (
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Situação atual</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="h-9 w-full">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Acolhimento">Em acolhimento</SelectItem>
                        <SelectItem value="Transferido">Transferido</SelectItem>
                        <SelectItem value="Óbito">Óbito</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {statusChanged && (
              <FormField
                control={form.control}
                name="motivoSaidaDescricao"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Observação sobre mudança de situação</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Descreva o motivo ou destino (registrado automaticamente no histórico)..."
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="flex flex-wrap items-center gap-6 md:col-span-2">
              <FormField
                control={form.control}
                name="castrado"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-2 space-y-0">
                    <FormControl>
                      <input
                        type="checkbox"
                        className="size-4 rounded border-input accent-orange-600"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">Castrado</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="vacinado"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-2 space-y-0">
                    <FormControl>
                      <input
                        type="checkbox"
                        className="size-4 rounded border-input accent-orange-600"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">Vacinado</FormLabel>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="local"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Localidade de resgate *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Centro, Arapiraca/AL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="obs"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Observações de saúde</FormLabel>
                  <FormControl>
                    <textarea
                      placeholder="Estado de saúde, vacinas, tratamentos..."
                      className="flex min-h-20 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm shadow-xs transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
                      {...field}
                    />
                  </FormControl>
                  {isEditing && (
                    <p className="text-[11px] text-muted-foreground">
                      Alterações de peso atual, vacinação, castração ou observações geram automaticamente um registro médico no histórico ao salvar.
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {!isEditing && (
              <FormField
                control={form.control}
                name="fotoUrl"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>URL da foto</FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="https://exemplo.com/foto.jpg"
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <p className="text-xs text-muted-foreground">
                      Se vazio, uma imagem padrão é usada.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <DialogFooter className="mt-1 border-t border-border pt-4 md:col-span-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={mutation.isPending}
              >
                {isEditing ? 'Fechar' : 'Cancelar'}
              </Button>
              <Button type="submit" variant="primary" disabled={mutation.isPending}>
                <Check className="size-4" />
                {mutation.isPending
                  ? 'Salvando...'
                  : isEditing
                    ? 'Salvar alterações'
                    : 'Salvar registro'}
              </Button>
            </DialogFooter>
          </form>
        </Form>

        {isEditing && animal && (
          <div
            ref={timelineSectionRef}
            className="mt-2 space-y-5 border-t border-border pt-5"
          >
            <div className="flex items-center justify-between gap-2">
              <div>
                <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Clock className="size-4 text-orange-600 dark:text-orange-400" />
                  Linha do Tempo / Adicionar Evento
                </h3>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Adicione registros médicos, entradas, saídas ou documentos comprobatórios de forma incremental.
                </p>
              </div>
              <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                {eventos.length} {eventos.length === 1 ? 'evento' : 'eventos'}
              </span>
            </div>

            <form
              onSubmit={handleAddEvento}
              className="space-y-3.5 rounded-xl border border-border bg-muted/30 p-4"
            >
              <p className="text-xs font-semibold tracking-[0.04em] text-foreground uppercase">
                Novo registro na linha do tempo
              </p>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="evento-tipo" className="text-xs">
                    Categoria do evento
                  </Label>
                  <Select
                    value={eventoTipo}
                    onValueChange={(value) =>
                      setEventoTipo(value as TipoEventoAnimal)
                    }
                  >
                    <SelectTrigger id="evento-tipo" className="h-9 w-full bg-card">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MEDICO">Médico / Saúde</SelectItem>
                      <SelectItem value="ENTRADA">Entrada / Retorno</SelectItem>
                      <SelectItem value="SAIDA">
                        Saída (Transferência / Óbito)
                      </SelectItem>
                      <SelectItem value="OUTRO">Outro registro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="evento-data" className="text-xs">
                    Data e hora do evento
                  </Label>
                  <Input
                    id="evento-data"
                    type="datetime-local"
                    value={eventoData}
                    onChange={(e) => setEventoData(e.target.value)}
                    className="bg-card"
                  />
                </div>

                {eventoTipo === 'SAIDA' && (
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="evento-motivo-saida" className="text-xs">
                      Motivo da saída *
                    </Label>
                    <Select
                      value={eventoMotivoSaida}
                      onValueChange={(value) =>
                        setEventoMotivoSaida(
                          value as Exclude<MotivoSaidaAnimal, 'ADOCAO'>,
                        )
                      }
                    >
                      <SelectTrigger
                        id="evento-motivo-saida"
                        className="h-9 w-full bg-card"
                      >
                        <SelectValue placeholder="Selecione o motivo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TRANSFERENCIA">Transferência</SelectItem>
                        <SelectItem value="OBITO">Óbito</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-[11px] text-muted-foreground">
                      Nota: Adoções devem ser registradas através do vínculo de acolhedor no prontuário.
                    </p>
                  </div>
                )}

                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="evento-descricao" className="text-xs">
                    Descrição do evento <span className="text-destructive">*</span>
                  </Label>
                  <textarea
                    id="evento-descricao"
                    rows={3}
                    value={eventoDescricao}
                    onChange={(e) => {
                      setEventoDescricao(e.target.value);
                      if (eventoError) setEventoError(null);
                    }}
                    placeholder="Descreva o atendimento médico, vacina aplicada, exame realizado, transferência ou observação..."
                    className="flex min-h-20 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm shadow-xs transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="evento-documento" className="text-xs">
                    Documento comprobatório (opcional — imagem, PDF, DOC/DOCX até 10 MB)
                  </Label>
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      key={fileInputKey}
                      ref={fileInputRef}
                      id="evento-documento"
                      type="file"
                      accept="image/*,.pdf,.doc,.docx"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0] ?? null;
                        if (file && file.size > MAX_DOCUMENT_BYTES) {
                          setEventoError(
                            'O documento comprobatório deve ter no máximo 10 MB.',
                          );
                          setFileInputKey((k) => k + 1);
                          return;
                        }
                        setEventoError(null);
                        setEventoDocumento(file);
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={createEventoMutation.isPending}
                      className="bg-card"
                    >
                      <Paperclip className="size-3.5" />
                      {eventoDocumento ? 'Trocar arquivo' : 'Anexar comprovante'}
                    </Button>

                    {eventoDocumento && (
                      <div className="inline-flex max-w-full items-center gap-2 rounded-lg border border-border bg-card px-2.5 py-1 text-xs">
                        <span className="max-w-52 truncate font-medium text-foreground">
                          {eventoDocumento.name}
                        </span>
                        <span className="text-muted-foreground">
                          ({formatFileSize(eventoDocumento.size)})
                        </span>
                        <button
                          type="button"
                          aria-label="Remover arquivo anexado"
                          onClick={() => {
                            setEventoDocumento(null);
                            setFileInputKey((k) => k + 1);
                          }}
                          className="rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-destructive"
                        >
                          <X className="size-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {eventoError && (
                <p className="text-xs font-medium text-destructive">
                  {eventoError}
                </p>
              )}

              <div className="flex justify-end pt-1">
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={createEventoMutation.isPending}
                >
                  {createEventoMutation.isPending ? (
                    <>
                      <LoaderCircle className="size-3.5 animate-spin" />
                      Adicionando evento...
                    </>
                  ) : (
                    <>
                      <Plus className="size-3.5" />
                      Adicionar evento
                    </>
                  )}
                </Button>
              </div>
            </form>

            <div className="space-y-2.5">
              <p className="text-[11px] font-semibold tracking-[0.06em] text-muted-foreground uppercase">
                Histórico registrado ({eventos.length})
              </p>
              <div className="max-h-80 overflow-y-auto pr-1">
                <AnimalTimeline eventos={eventos} compact />
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
