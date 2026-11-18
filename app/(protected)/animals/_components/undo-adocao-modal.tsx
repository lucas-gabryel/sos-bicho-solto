'use client';

import { AlertTriangle, Undo2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useUndoAdocao } from '@/hooks/use-undo-adocao';

interface UndoAdocaoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  animalId: string;
  animalName: string;
  tutorName?: string;
}

export function UndoAdocaoModal({ open, onOpenChange, animalId, animalName, tutorName }: UndoAdocaoModalProps) {
  const undoAdocao = useUndoAdocao();
  const [observacoes, setObservacoes] = useState('');

  const handleOpenChange = (newOpen: boolean) => {
    if (undoAdocao.isPending) {
      return;
    }
    if (!newOpen) {
      setObservacoes('');
    }
    onOpenChange(newOpen);
  };

  const handleConfirm = async () => {
    try {
      await undoAdocao.mutateAsync({ animalId, observacoes: observacoes.trim() });
      setObservacoes('');
      onOpenChange(false);
    } catch {
      // Erro exibido pelo toast global.
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="rounded-2xl sm:max-w-100">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
              <AlertTriangle className="size-4.5" />
            </div>
            <div className="text-left">
              <DialogTitle>Desfazer adoção</DialogTitle>
              <DialogDescription className="mt-1">
                Confirma a devolução de {animalName}
                {tutorName ? ` por ${tutorName}` : ''}?
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <p className="text-sm leading-relaxed text-muted-foreground">
          O animal voltará a ficar disponível para adoção e o vínculo com o tutor será encerrado.
        </p>

        <div className="space-y-2">
          <Label htmlFor="observacoes-devolucao" className="text-[13px]">
            Motivo da devolução
          </Label>
          <textarea
            id="observacoes-devolucao"
            placeholder="Ex.: tutor mudou de cidade (opcional)"
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            disabled={undoAdocao.isPending}
            className="flex min-h-20 w-full rounded-lg border border-input bg-card px-3 py-1 text-sm shadow-xs transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div className="mt-1 flex justify-end gap-2 border-t border-border pt-4">
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={undoAdocao.isPending}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={undoAdocao.isPending}>
            <Undo2 className="size-4" />
            {undoAdocao.isPending ? 'Desfazendo...' : 'Confirmar devolução'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
