'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Check, PawPrint } from 'lucide-react';
import { type ReactNode } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateAnimal, useUpdateAnimal } from '@/hooks/use-animal-mutation';
import { createAnimalSchema, type CreateAnimalFormData } from '@/lib/validations/animal';
import { type Animal } from '@/services/animal.service';

interface AnimalFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  animal?: Animal;
}

function FormSection({ children }: { children: ReactNode }) {
  return (
    <p className="col-span-full mt-1 border-b border-border pb-1.5 text-[11px] font-semibold tracking-[0.06em] text-muted-foreground uppercase">
      {children}
    </p>
  );
}

export function AnimalFormModal({ open, onOpenChange, animal }: AnimalFormModalProps) {
  const createMutation = useCreateAnimal();
  const updateMutation = useUpdateAnimal();

  const isEditing = !!animal;
  const mutation = isEditing ? updateMutation : createMutation;

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
        },
  });

  function onSubmit(data: CreateAnimalFormData) {
    const payload = {
      nome: data.nome,
      esp: data.esp,
      raca: data.raca,
      sexo: data.sexo,
      porte: data.porte,
      cor: data.cor,
      peso: data.peso,
      pesoAt: data.pesoAt ? Number(data.pesoAt) : undefined,
      castrado: data.castrado,
      vacinado: data.vacinado,
      dataNascimento: data.dataNascimento || undefined,
      local: data.local,
      obs: data.obs,
      fotoUrl: data.fotoUrl || undefined,
    };

    const onSuccess = () => {
      form.reset();
      onOpenChange(false);
    };

    if (isEditing && animal) {
      updateMutation.mutate({ id: animal.id, ...payload }, { onSuccess });
    } else {
      createMutation.mutate(payload, { onSuccess });
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      form.reset();
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto rounded-2xl sm:max-w-155">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-orange-100 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400">
              <PawPrint className="size-4.5" />
            </div>
            <div className="text-left">
              <DialogTitle>{isEditing ? 'Editar animal' : 'Registrar animal'}</DialogTitle>
              <DialogDescription>
                {isEditing ? 'Altere os dados e salve as alterações.' : 'Preencha todos os campos obrigatórios.'}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                    <Input type="number" placeholder="0.0" step="0.1" min="0" {...field} value={field.value ?? ''} />
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
                      className="flex min-h-24 w-full rounded-lg border border-input bg-card px-3 py-1 text-sm shadow-xs transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
                      {...field}
                    />
                  </FormControl>
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
                    <p className="text-xs text-muted-foreground">Se vazio, uma imagem padrão é usada.</p>
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
                Cancelar
              </Button>
              <Button type="submit" variant="primary" disabled={mutation.isPending}>
                <Check className="size-4" />
                {mutation.isPending ? 'Salvando...' : isEditing ? 'Salvar alterações' : 'Salvar registro'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
