'use client';

import React from 'react';

import {
  ACOLHEDOR_LIST_PRINT_COLUMNS,
  type AcolhedorListPrintFilterSummary,
} from '@/lib/print-acolhedores-list';
import type { Acolhedor } from '@/types/acolhedor';

interface AcolhedoresListPrintDocumentProps {
  acolhedores: Acolhedor[];
  selectedColumnIds: string[];
  filters?: AcolhedorListPrintFilterSummary;
  emissionDate?: string;
}

export const AcolhedoresListPrintDocument = React.forwardRef<
  HTMLDivElement,
  AcolhedoresListPrintDocumentProps
>(({ acolhedores, selectedColumnIds, filters, emissionDate }, ref) => {
  const date = emissionDate || new Date().toLocaleString('pt-BR');
  const visibleColumns = ACOLHEDOR_LIST_PRINT_COLUMNS.filter((col) =>
    selectedColumnIds.includes(col.id),
  );

  const total = acolhedores.length;
  const totalAdotantes = acolhedores.filter((a) => a.situacao === 'ADOTANTE').length;
  const totalTutores = acolhedores.filter((a) => a.situacao === 'TUTOR').length;
  const totalAnimaisVinculados = acolhedores.reduce(
    (acc, a) => acc + (a.totalAnimaisAdotados ?? 0),
    0,
  );

  const filterBadges: string[] = [];
  if (filters?.busca) filterBadges.push(`Busca: "${filters.busca}"`);
  if (filters?.situacao) {
    filterBadges.push(`Situação: ${filters.situacao === 'ADOTANTE' ? 'Adotantes' : 'Tutores'}`);
  }

  return (
    <div
      ref={ref}
      className="acolhedores-list-print-container bg-white p-6 text-neutral-900"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        width: '100%',
        maxWidth: '297mm', // A4 landscape
        margin: '0 auto',
        boxSizing: 'border-box',
        backgroundColor: '#ffffff',
        color: '#111827',
      }}
    >
      <style type="text/css" media="print">
        {`
          @page {
            size: A4 landscape;
            margin: 10mm;
          }
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            background: #ffffff !important;
          }
          .acolhedores-list-print-container {
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
          }
          table {
            page-break-inside: auto;
          }
          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }
          thead {
            display: table-header-group;
          }
          tfoot {
            display: table-footer-group;
          }
        `}
      </style>

      {/* Header */}
      <div className="flex items-start justify-between border-b-2 border-orange-600 pb-2">
        <div>
          <h1 className="text-lg font-black uppercase tracking-tight text-orange-600">
            SOS Bicho Solto
          </h1>
          <p className="text-[11px] font-medium text-neutral-500">
            Sistema de Gestão de Animais Resgatados — Relatório Geral de Acolhedores (Adotantes e Tutores)
          </p>
        </div>
        <div className="text-right">
          <span className="inline-block rounded border border-neutral-300 bg-neutral-100 px-2 py-0.5 font-mono text-[11px] font-bold text-neutral-800">
            {total} {total === 1 ? 'registro' : 'registros'}
          </span>
          <p className="mt-0.5 text-[10px] text-neutral-500">Emissão: {date}</p>
        </div>
      </div>

      {/* Resumo e Filtros */}
      <div className="my-2.5 flex flex-wrap items-center justify-between gap-2 rounded-md border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-[11px]">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-semibold text-neutral-700">Resumo:</span>
          <span>
            <strong>Total:</strong> {total}
          </span>
          <span>•</span>
          <span>
            <strong>Adotantes:</strong> {totalAdotantes}
          </span>
          <span>•</span>
          <span>
            <strong>Tutores:</strong> {totalTutores}
          </span>
          <span>•</span>
          <span>
            <strong>Total Animais Vinculados:</strong> {totalAnimaisVinculados}
          </span>
        </div>

        {filterBadges.length > 0 && (
          <div className="flex flex-wrap items-center gap-1 text-[10px] text-neutral-600">
            <span className="font-semibold">Filtros:</span>
            {filterBadges.map((badge, idx) => (
              <span
                key={idx}
                className="rounded border border-neutral-300 bg-white px-1.5 py-0.5"
              >
                {badge}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Table */}
      <table className="w-full border-collapse text-[10px]">
        <thead>
          <tr className="border-b-2 border-neutral-400 bg-neutral-100">
            <th className="p-1.5 text-center font-bold text-neutral-700 w-8">#</th>
            {visibleColumns.map((col) => (
              <th
                key={col.id}
                className={`p-1.5 font-bold uppercase tracking-wider text-neutral-700 ${
                  col.align === 'center'
                    ? 'text-center'
                    : col.align === 'right'
                      ? 'text-right'
                      : 'text-left'
                }`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {acolhedores.length === 0 ? (
            <tr>
              <td
                colSpan={visibleColumns.length + 1}
                className="p-6 text-center text-xs text-neutral-500 italic"
              >
                Nenhum registro encontrado para os critérios selecionados.
              </td>
            </tr>
          ) : (
            acolhedores.map((acolhedor, index) => {
              const isEven = index % 2 === 0;
              return (
                <tr
                  key={acolhedor.id || index}
                  className={`border-b border-neutral-200 ${
                    isEven ? 'bg-white' : 'bg-neutral-50/60'
                  }`}
                >
                  <td className="p-1.5 text-center font-mono text-neutral-400">
                    {index + 1}
                  </td>
                  {visibleColumns.map((col) => {
                    const value = col.render(acolhedor);
                    const isSituacao = col.id === 'situacao';

                    return (
                      <td
                        key={col.id}
                        className={`p-1.5 align-middle ${
                          col.align === 'center'
                            ? 'text-center'
                            : col.align === 'right'
                              ? 'text-right'
                              : 'text-left'
                        }`}
                      >
                        {isSituacao ? (
                          <span
                            className={`inline-block rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${
                              acolhedor.situacao === 'ADOTANTE'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {value}
                          </span>
                        ) : col.id === 'codigo' ? (
                          <span className="font-mono font-semibold text-neutral-900">
                            {value}
                          </span>
                        ) : col.id === 'cpf' ? (
                          <span className="font-mono text-neutral-800">{value}</span>
                        ) : (
                          <span className="text-neutral-800">{value}</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between border-t border-neutral-300 pt-2 text-[9px] text-neutral-400">
        <span>SOS Bicho Solto — Documento gerado eletronicamente para fins de controle e arquivo</span>
        <span>Página gerada via sistema web</span>
      </div>
    </div>
  );
});

AcolhedoresListPrintDocument.displayName = 'AcolhedoresListPrintDocument';
