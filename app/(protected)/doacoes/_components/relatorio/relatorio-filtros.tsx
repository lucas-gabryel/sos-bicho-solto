'use client';

import { AlertCircle, Download, Filter, LoaderCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { TipoDoacao } from '@/types/doacao';
import { TIPO_DOACAO_LABELS } from '@/types/doacao';

interface RelatorioFiltrosProps {
  dataInicio: string;
  setDataInicio: (val: string) => void;
  dataFim: string;
  setDataFim: (val: string) => void;
  tipo: TipoDoacao | '';
  setTipo: (val: TipoDoacao | '') => void;
  dateError: string | null;
  onApply: () => void;
  onClear: () => void;
  onExportPdf: () => void;
  isFetching: boolean;
  isLoading: boolean;
  isExportingPdf: boolean;
}

export function RelatorioFiltros({
  dataInicio,
  setDataInicio,
  dataFim,
  setDataFim,
  tipo,
  setTipo,
  dateError,
  onApply,
  onClear,
  onExportPdf,
  isFetching,
  isLoading,
  isExportingPdf,
}: RelatorioFiltrosProps) {
  return (
    <div className="rounded-[14px] border border-border bg-card p-4 md:p-5 shadow-2xs">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Filter className="size-4 text-orange-600 dark:text-orange-400" />
          <h2 className="text-sm font-semibold text-foreground">Filtros do Relatório</h2>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={onExportPdf}
          disabled={isExportingPdf || isLoading}
          className="shadow-xs"
        >
          {isExportingPdf ? (
            <>
              <LoaderCircle className="size-3.5 animate-spin" />
              Gerando PDF...
            </>
          ) : (
            <>
              <Download className="size-3.5" />
              Exportar Relatório em PDF
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-foreground">Data inicial</label>
          <Input
            type="date"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
            className="text-xs"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-foreground">Data final</label>
          <Input
            type="date"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
            className="text-xs"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-foreground">Tipo de doação</label>
          <select
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
            value={tipo}
            onChange={(e) => setTipo(e.target.value as TipoDoacao | '')}
          >
            <option value="">Todos os tipos</option>
            <option value="DINHEIRO">{TIPO_DOACAO_LABELS.DINHEIRO}</option>
            <option value="RACAO">{TIPO_DOACAO_LABELS.RACAO}</option>
            <option value="MEDICAMENTO">{TIPO_DOACAO_LABELS.MEDICAMENTO}</option>
            <option value="PRODUTO_LIMPEZA">{TIPO_DOACAO_LABELS.PRODUTO_LIMPEZA}</option>
            <option value="OUTRO">{TIPO_DOACAO_LABELS.OUTRO}</option>
          </select>
        </div>

        <div className="flex items-end gap-2 pt-1 sm:pt-0">
          <Button
            type="button"
            variant="primary"
            size="default"
            onClick={onApply}
            disabled={Boolean(dateError) || isFetching}
            className="flex-1"
          >
            {isFetching ? (
              <LoaderCircle className="size-3.5 animate-spin" />
            ) : (
              <Filter className="size-3.5" />
            )}
            Aplicar Filtros
          </Button>
          <Button
            type="button"
            variant="outline"
            size="default"
            onClick={onClear}
            disabled={!dataInicio && !dataFim && !tipo}
            title="Limpar filtros"
          >
            <RotateCcw className="size-3.5" />
            Limpar
          </Button>
        </div>
      </div>

      {dateError && (
        <div className="mt-3.5 flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 p-2.5 text-xs text-destructive">
          <AlertCircle className="size-4 shrink-0" />
          <span>{dateError}</span>
        </div>
      )}
    </div>
  );
}
