'use client';

import { CheckSquare, FileText, Printer, Square } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';

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
  ANIMAL_PRINT_FIELDS,
  CATEGORY_LABELS,
  DEFAULT_SELECTED_FIELDS,
} from '@/lib/print-animal';
import type { Animal } from '@/services/animal.service';
import type { Tutor } from '@/types/tutor';
import { AnimalPrintDocument } from './animal-print-document';

interface PrintAnimalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  animal: Animal;
  tutor?: Tutor | null;
}

export function PrintAnimalModal({ open, onOpenChange, animal, tutor }: PrintAnimalModalProps) {
  const [selectedFields, setSelectedFields] = useState<string[]>(DEFAULT_SELECTED_FIELDS);
  const printContentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printContentRef,
    documentTitle: `Prontuario_${animal.numeroRegistro || animal.nome || 'Animal'}`,
    onAfterPrint: () => {
      onOpenChange(false);
    },
  });

  const categories = useMemo(() => {
    const map = new Map<string, typeof ANIMAL_PRINT_FIELDS>();
    for (const field of ANIMAL_PRINT_FIELDS) {
      const current = map.get(field.category) ?? [];
      current.push(field);
      map.set(field.category, current);
    }
    return Array.from(map.entries()).map(([cat, fields]) => ({
      categoryKey: cat as keyof typeof CATEGORY_LABELS,
      label: CATEGORY_LABELS[cat as keyof typeof CATEGORY_LABELS] || cat,
      fields,
    }));
  }, []);

  const totalFields = ANIMAL_PRINT_FIELDS.length;
  const selectedCount = selectedFields.length;
  const isAllSelected = selectedCount === totalFields;
  const isNoneSelected = selectedCount === 0;

  const toggleField = (id: string) => {
    setSelectedFields((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleSelectAll = () => {
    setSelectedFields(ANIMAL_PRINT_FIELDS.map((f) => f.id));
  };

  const handleDeselectAll = () => {
    setSelectedFields([]);
  };

  const onConfirmPrint = () => {
    if (selectedFields.length === 0) return;
    handlePrint();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2 text-foreground">
              <div className="flex size-9 items-center justify-center rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400">
                <Printer className="size-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold">Imprimir Registro do Animal</DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Selecione as informações de <strong className="text-foreground">{animal.nome}</strong> que deseja incluir na impressão.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-muted/40 p-2.5 text-xs">
              <div className="flex items-center gap-1.5 font-medium text-foreground">
                <FileText className="size-4 text-muted-foreground" />
                <span>
                  {selectedCount} de {totalFields} campo{totalFields > 1 ? 's' : ''} selecionado{selectedCount !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={handleSelectAll}
                  disabled={isAllSelected}
                >
                  <CheckSquare className="size-3.5" />
                  Marcar todos
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={handleDeselectAll}
                  disabled={isNoneSelected}
                >
                  <Square className="size-3.5" />
                  Desmarcar todos
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {categories.map(({ categoryKey, label, fields }) => (
                <div key={categoryKey} className="space-y-2">
                  <p className="border-b border-border pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {label}
                  </p>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {fields.map((field) => {
                      const isChecked = selectedFields.includes(field.id);
                      return (
                        <label
                          key={field.id}
                          className="flex cursor-pointer select-none items-center gap-2.5 rounded-md border border-border/60 bg-card p-2 text-xs font-medium text-foreground transition-colors hover:bg-muted/50"
                        >
                          <input
                            type="checkbox"
                            className="size-4 rounded border-input accent-orange-600"
                            checked={isChecked}
                            onChange={() => toggleField(field.id)}
                          />
                          <span className="flex-1 truncate">{field.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={onConfirmPrint}
              disabled={selectedCount === 0}
            >
              <Printer className="size-4" />
              Imprimir ({selectedCount})
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Offscreen print document container for react-to-print */}
      <div
        style={{
          position: 'absolute',
          left: '-9999px',
          top: 0,
          width: '210mm',
          overflow: 'hidden',
        }}
        aria-hidden="true"
      >
        <AnimalPrintDocument
          ref={printContentRef}
          animal={animal}
          tutor={tutor}
          selectedFieldIds={selectedFields}
        />
      </div>
    </>
  );
}
