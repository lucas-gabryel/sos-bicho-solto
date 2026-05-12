'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
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

export function AnimalFormModal({ open, onOpenChange, animal }: AnimalFormModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const createMutation = useCreateAnimal();
  const updateMutation = useUpdateAnimal();

  const isEditing = !!animal;
  const mutation = isEditing ? updateMutation : createMutation;

  const form = useForm<CreateAnimalFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createAnimalSchema) as any,
    defaultValues: animal
      ? {
          nome: animal.nome,
          esp: animal.esp,
          raca: animal.raca,
          sexo: animal.sexo,
          cor: animal.cor,
          peso: animal.peso,
          pesoAt: animal.pesoAt,
          local: animal.local,
          obs: animal.obs || '',
          status: animal.status,
        }
      : {
          nome: '',
          esp: undefined,
          raca: '',
          sexo: undefined,
          cor: '',
          peso: undefined,
          pesoAt: undefined,
          local: '',
          obs: '',
          status: undefined,
        },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function onSubmit(data: any) {
    try {
      if (isEditing && animal) {
        await updateMutation.mutateAsync({
          id: animal.id,
          nome: data.nome,
          esp: data.esp,
          raca: data.raca,
          sexo: data.sexo,
          cor: data.cor,
          peso: data.peso,
          pesoAt: data.pesoAt ? Number(data.pesoAt) : undefined,
          local: data.local,
          obs: data.obs,
          status: data.status,
        });
      } else {
        await createMutation.mutateAsync({
          nome: data.nome,
          esp: data.esp,
          raca: data.raca,
          sexo: data.sexo,
          cor: data.cor,
          peso: data.peso,
          pesoAt: data.pesoAt ? Number(data.pesoAt) : undefined,
          local: data.local,
          obs: data.obs,
          status: data.status,
        });
      }

      // Reset form and close modal
      form.reset();
      setSelectedFile(null);
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      form.reset();
      setSelectedFile(null);
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Animal' : 'Registrar Novo Animal'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Atualize as informações do animal resgatado.' : 'Preencha os dados do animal resgatado.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Nome */}
            <FormField
              control={form.control}
              name="nome"
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>Nome *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Rex" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Espécie */}
            <FormField
              control={form.control}
              name="esp"
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>Espécie *</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a espécie" />
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

            {/* Raça */}
            <FormField
              control={form.control}
              name="raca"
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>Raça *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: SRD, Labrador" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Sexo */}
            <FormField
              control={form.control}
              name="sexo"
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>Sexo *</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o sexo" />
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

            {/* Cor */}
            <FormField
              control={form.control}
              name="cor"
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>Cor *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Caramelo, Preto" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Peso */}
            <FormField
              control={form.control}
              name="peso"
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>Peso (kg) *</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Ex: 7.5" step="0.1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Peso Atual */}
            <FormField
              control={form.control}
              name="pesoAt"
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>Peso Atual (kg)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Ex: 8.1" step="0.1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Localização */}
            <FormField
              control={form.control}
              name="local"
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>Localização *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Centro, Arapiraca/AL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Observações */}
            <FormField
              control={form.control}
              name="obs"
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <textarea
                      placeholder="Descreva o estado de saúde, traumas, vacinas, etc."
                      className="min-h-24 rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-950 placeholder:text-neutral-500 focus:border-neutral-950 focus:outline-none focus:ring-1 focus:ring-neutral-950"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status */}
            <FormField
              control={form.control}
              name="status"
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>Status *</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Acolhimento">Em Acolhimento</SelectItem>
                      <SelectItem value="Adotado">Adotado</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Foto */}
            <FormItem>
              <FormLabel>Foto</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setSelectedFile(file);
                    }
                  }}
                />
              </FormControl>
              {selectedFile && <p className="text-xs text-neutral-500">Arquivo selecionado: {selectedFile.name}</p>}
            </FormItem>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={mutation.isPending}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? 'Salvando...' : isEditing ? 'Atualizar' : 'Registrar'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
