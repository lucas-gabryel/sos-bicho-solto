'use client';

import { AlertTriangle, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface DeleteConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (password: string) => Promise<void> | void;
  title: string;
  description: string;
  isLoading?: boolean;
}

export function DeleteConfirmationModal({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  isLoading = false,
}: DeleteConfirmationModalProps) {
  const [password, setPassword] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    if (!password) {
      return;
    }

    setIsDeleting(true);
    try {
      await onConfirm(password);
      onOpenChange(false);
      setPassword('');
    } catch {
      // Erro exibido pelo toast global.
    } finally {
      setIsDeleting(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setPassword('');
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="rounded-2xl sm:max-w-100">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-destructive/10 text-destructive">
              <AlertTriangle className="size-4.5" />
            </div>
            <div className="text-left">
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription className="mt-1">{description}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <p className="text-sm leading-relaxed text-muted-foreground">
          Revalide sua senha de administrador para prosseguir.{' '}
          <strong className="font-semibold text-foreground">Esta ação não pode ser desfeita.</strong>
        </p>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-[13px]">
            Senha do administrador <span className="text-destructive">*</span>
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isDeleting || isLoading}
            className="h-9 text-sm"
          />
        </div>

        <div className="mt-1 flex justify-end gap-2 border-t border-border pt-4">
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isDeleting || isLoading}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!password || isDeleting || isLoading}
          >
            <Trash2 className="size-4" />
            {isDeleting || isLoading ? 'Excluindo...' : 'Excluir definitivamente'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
