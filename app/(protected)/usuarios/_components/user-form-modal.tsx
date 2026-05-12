'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createUserSchema, defaultCreateUserFormValues } from '@/lib/user-form';
import type { CreateUserFormValues } from '@/types/user';

interface UserFormModalProps {
  open: boolean;
  isPending?: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: CreateUserFormValues) => Promise<void>;
}

export function UserFormModal({
  open,
  isPending = false,
  onOpenChange,
  onSubmit,
}: UserFormModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: defaultCreateUserFormValues,
  });

  const submit = handleSubmit(async (values) => {
    try {
      setSubmitError(null);
      await onSubmit(values);
      onOpenChange(false);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Nao foi possivel criar o usuario.');
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

      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-[18px] border border-border bg-card shadow-2xl">
        <div className="border-b border-border px-5 py-4">
          <h2 className="text-lg font-semibold text-foreground">Criar novo usuario</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Defina o perfil, o e-mail e uma senha segura para acesso ao sistema.
          </p>
        </div>

        <form onSubmit={submit} noValidate className="flex flex-col gap-5 px-5 py-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <Label htmlFor="name">Nome completo</Label>
              <Input id="name" aria-invalid={!!errors.name} {...register('name')} />
              {errors.name ? <p className="text-xs text-destructive">{errors.name.message}</p> : null}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" autoComplete="email" aria-invalid={!!errors.email} {...register('email')} />
              {errors.email ? <p className="text-xs text-destructive">{errors.email.message}</p> : null}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="role">Perfil</Label>
              <Controller
                control={control}
                name="role"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="role" aria-invalid={!!errors.role}>
                      <SelectValue placeholder="Selecione um perfil" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="admin">Administrador</SelectItem>
                      <SelectItem value="protetor">Protetor</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.role ? <p className="text-xs text-destructive">{errors.role.message}</p> : null}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className="pr-9"
                  aria-invalid={!!errors.password}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {errors.password ? <p className="text-xs text-destructive">{errors.password.message}</p> : null}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="confirmPassword">Confirmar senha</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className="pr-9"
                  aria-invalid={!!errors.confirmPassword}
                  {...register('confirmPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((value) => !value)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={showConfirmPassword ? 'Ocultar confirmacao de senha' : 'Mostrar confirmacao de senha'}
                >
                  {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {errors.confirmPassword ? (
                <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
              ) : null}
            </div>
          </div>

          <div className="rounded-[14px] border border-border bg-muted/30 px-3.5 py-3 text-[12px] text-muted-foreground">
            A senha deve ter entre 8 e 15 caracteres, com ao menos uma letra maiuscula e um caractere especial.
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
              {isPending ? 'Salvando...' : 'Criar usuario'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
