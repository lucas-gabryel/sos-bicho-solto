'use client';

import { FileText, Loader2, Printer, Square } from 'lucide-react';
import { useRef, useState } from 'react';
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
  ANIMAL_LIST_PRINT_COLUMNS,
  DEFAULT_ANIMAL_LIST_COLUMNS,
  type AnimalListPrintFilterSummary,
} from '@/lib/print-animals-list';
import { cn } from '@/lib/utils';
import { getAllAnimals, type Animal } from '@/services/animal.service';
import { AnimalsListPrintDocument } from './animals-list-print-document';

interface PrintAnimalsListModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentFilters?: AnimalListPrintFilterSummary;
  currentPageAnimals?: Animal[];
}

export function PrintAnimalsListModal({
  open,
  onOpenChange,
  currentFilters,
  currentPageAnimals,
}: PrintAnimalsListModalProps) {
  const [selectedColumns, setSelectedColumns] = useState<string[]>(DEFAULT_ANIMAL_LIST_COLUMNS);
  const [scope, setScope] = useState<'all' | 'filtered' | 'page'>('all');
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [animalsToPrint, setAnimalsToPrint] = useState<Animal[]>([]);

  const printContentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printContentRef,
    documentTitle: `Listagem_Animais_SOS_Bicho_Solto_${new Date().toISOString().slice(0, 10)}`,
    onAfterPrint: () => {
      onOpenChange(false);
    },
  });

  const totalColumns = ANIMAL_LIST_PRINT_COLUMNS.length;
  const selectedCount = selectedColumns.length;
  const isAllSelected = selectedCount === totalColumns;
  const isNoneSelected = selectedCount === 0;

  const toggleColumn = (id: string) => {
    setSelectedColumns((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleSelectAll = () => {
    setSelectedColumns(ANIMAL_LIST_PRINT_COLUMNS.map((c) => c.id));
  };

  const handleDeselectAll = () => {
    setSelectedColumns([]);
  };

  const onConfirmPrint = async () => {
    if (selectedColumns.length === 0) return;

    setIsLoadingData(true);
    try {
      let data: Animal[] = [];

      if (scope === 'page' && currentPageAnimals) {
        data = currentPageAnimals;
      } else if (scope === 'filtered') {
        data = await getAllAnimals({
          busca: currentFilters?.busca?.trim() || undefined,
          especie: currentFilters?.especie,
          status: currentFilters?.status,
        });
      } else {
        // scope === 'all'
        data = await getAllAnimals({});
      }

      setAnimalsToPrint(data);

      // Pequeno timeout para renderização no offscreen container antes do react-to-print
      setTimeout(() => {
        handlePrint();
        setIsLoadingData(false);
      }, 250);
    } catch (err) {
      console.error('Erro ao carregar dados dos animais para impressão:', err);
      setIsLoadingData(false);
    }
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
                <DialogTitle className="text-lg font-bold">
                  Imprimir / Exportar Listagem de Animais
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Gere um arquivo PDF formatado para impressão com os registros de animais.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Seleção do Escopo */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Escopo dos Registros
              </label>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                <label
                  className={cn(
                    'flex cursor-pointer flex-col gap-1 rounded-lg border p-3 text-xs transition-colors',
                    scope === 'all'
                      ? 'border-orange-500 bg-orange-50/50 dark:border-orange-400 dark:bg-orange-950/20'
                      : 'border-border bg-card hover:bg-muted/50',
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">Todos</span>
                    <input
                      type="radio"
                      name="animal-scope"
                      value="all"
                      checked={scope === 'all'}
                      onChange={() => setScope('all')}
                      className="accent-orange-600"
                    />
                  </div>
                  <span className="text-[11px] text-muted-foreground">
                    Todos os animais ativos do sistema
                  </span>
                </label>

                <label
                  className={cn(
                    'flex cursor-pointer flex-col gap-1 rounded-lg border p-3 text-xs transition-colors',
                    scope === 'filtered'
                      ? 'border-orange-500 bg-orange-50/50 dark:border-orange-400 dark:bg-orange-950/20'
                      : 'border-border bg-card hover:bg-muted/50',
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">Com Filtros</span>
                    <input
                      type="radio"
                      name="animal-scope"
                      value="filtered"
                      checked={scope === 'filtered'}
                      onChange={() => setScope('filtered')}
                      className="accent-orange-600"
                    />
                  </div>
                  <span className="text-[11px] text-muted-foreground">
                    Apenas os animais que atendem aos filtros atuais
                  </span>
                </label>

                <label
                  className={cn(
                    'flex cursor-pointer flex-col gap-1 rounded-lg border p-3 text-xs transition-colors',
                    scope === 'page'
                      ? 'border-orange-500 bg-orange-50/50 dark:border-orange-400 dark:bg-orange-950/20'
                      : 'border-border bg-card hover:bg-muted/50',
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">Página Atual</span>
                    <input
                      type="radio"
                      name="animal-scope"
                      value="page"
                      checked={scope === 'page'}
                      onChange={() => setScope('page')}
                      className="accent-orange-600"
                    />
                  </div>
                  <span className="text-[11px] text-muted-foreground">
                    Apenas os exibidos nesta página ({currentPageAnimals?.length || 0})
                  </span>
                </label>
              </div>
            </div>

            {/* Seleção de Colunas */}
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-muted/40 p-2.5 text-xs">
              <div className="flex items-center gap-1.5 font-medium text-foreground">
                <FileText className="size-4 text-muted-foreground" />
                <span>
                  {selectedCount} de {totalColumns} {selectedCount === 1 ? 'coluna' : 'colunas'} selecionadas
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  aria-pressed={isAllSelected}
                  className={cn(
                    'h-7 px-2.5 text-xs transition-colors',
                    isAllSelected
                      ? 'font-semibold text-orange-600 hover:bg-orange-500/10 disabled:opacity-100 dark:text-orange-400'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  )}
                  onClick={handleSelectAll}
                  disabled={isAllSelected}
                >
                  <Square className="size-3.5" />
                  Marcar todas
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  aria-pressed={isNoneSelected}
                  className={cn(
                    'h-7 px-2.5 text-xs transition-colors',
                    isNoneSelected
                      ? 'font-semibold text-orange-600 hover:bg-orange-500/10 disabled:opacity-100 dark:text-orange-400'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  )}
                  onClick={handleDeselectAll}
                  disabled={isNoneSelected}
                >
                  <Square className="size-3.5" />
                  Desmarcar todas
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <p className="border-b border-border pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Colunas da Tabela
              </p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {ANIMAL_LIST_PRINT_COLUMNS.map((column) => {
                  const isChecked = selectedColumns.includes(column.id);
                  return (
                    <label
                      key={column.id}
                      className="flex cursor-pointer select-none items-center gap-2.5 rounded-md border border-border/60 bg-card p-2 text-xs font-medium text-foreground transition-colors hover:bg-muted/50"
                    >
                      <input
                        type="checkbox"
                        className="size-4 rounded border-input accent-orange-600"
                        checked={isChecked}
                        onChange={() => toggleColumn(column.id)}
                      />
                      <span className="flex-1 truncate">{column.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoadingData}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={onConfirmPrint}
              disabled={selectedCount === 0 || isLoadingData}
            >
              {isLoadingData ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Preparando dados...
                </>
              ) : (
                <>
                  <Printer className="size-4" />
                  Gerar PDF ({selectedCount} colunas)
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Container invisível fora da tela para o react-to-print */}
      {open && (
        <div
          style={{
            position: 'absolute',
            left: '-9999px',
            top: 0,
            width: '297mm',
            overflow: 'hidden',
          }}
          aria-hidden="true"
        >
          <AnimalsListPrintDocument
            ref={printContentRef}
            animals={animalsToPrint}
            selectedColumnIds={selectedColumns}
            filters={scope === 'filtered' ? currentFilters : undefined}
          />
        </div>
      )}
    </>
  );
}
