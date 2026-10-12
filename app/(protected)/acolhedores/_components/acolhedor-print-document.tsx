'use client';

import React from 'react';

import { getAcolhedorPrintSections } from '@/lib/print-acolhedor';
import type { Animal } from '@/services/animal.service';
import type { Acolhedor } from '@/types/acolhedor';

interface AcolhedorPrintDocumentProps {
  acolhedor: Acolhedor;
  animais?: Animal[];
  selectedFieldIds: string[];
  emissionDate?: string;
}

export const AcolhedorPrintDocument = React.forwardRef<HTMLDivElement, AcolhedorPrintDocumentProps>(
  ({ acolhedor, animais, selectedFieldIds, emissionDate }, ref) => {
    const sections = getAcolhedorPrintSections(acolhedor, animais, selectedFieldIds);
    const date = emissionDate || new Date().toLocaleString('pt-BR');
    const hasTermo = selectedFieldIds.includes('termo');
    const isAdotante = acolhedor.situacao === 'ADOTANTE';
    const totalAnimais = animais ? animais.length : acolhedor.totalAnimaisAdotados;

    return (
      <div
        ref={ref}
        className="acolhedor-print-container bg-white p-8 text-neutral-900"
        style={{
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          width: '100%',
          maxWidth: '210mm',
          margin: '0 auto',
          boxSizing: 'border-box',
          backgroundColor: '#ffffff',
          color: '#111827',
        }}
      >
        <style type="text/css" media="print">
          {`
            @page {
              size: A4;
              margin: 15mm;
            }
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
              background: #ffffff !important;
            }
            .acolhedor-print-container {
              padding: 0 !important;
              margin: 0 !important;
            }
          `}
        </style>

        {/* Header */}
        <div className="flex items-start justify-between border-b-2 border-orange-600 pb-3">
          <div>
            <h1 className="text-xl font-extrabold uppercase tracking-tight text-orange-600">
              SOS Bicho Solto
            </h1>
            <p className="mt-0.5 text-xs text-neutral-500">
              Sistema de Gestão de Animais Resgatados
            </p>
          </div>
          <div className="text-right">
            <span className="inline-block rounded-md border border-neutral-300 bg-neutral-100 px-2.5 py-1 font-mono text-xs font-bold text-neutral-800">
              {acolhedor.codigo ? `#${acolhedor.codigo}` : 'CADASTRO'}
            </span>
          </div>
        </div>

        {/* Highlight Card */}
        <div className="my-4 flex items-center justify-between rounded-lg border border-orange-200 bg-orange-50/80 p-3.5">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-orange-700">
              {isAdotante ? 'Ficha de Adotante' : 'Ficha de Tutor'}
            </span>
            <h2 className="text-base font-bold text-neutral-900">
              {acolhedor.nome}
            </h2>
            <p className="font-mono text-xs text-neutral-600">
              CPF: {acolhedor.cpf}
            </p>
          </div>
          <div className="text-right">
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                isAdotante
                  ? 'bg-green-100 text-green-800'
                  : 'bg-blue-100 text-blue-800'
              }`}
            >
              {isAdotante ? 'Adotante' : 'Tutor'}
            </span>
            <p className="mt-1 text-[11px] font-medium text-neutral-500">
              {totalAnimais} {totalAnimais === 1 ? 'animal vinculado' : 'animais vinculados'}
            </p>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          {sections.map((section) => (
            <div key={section.title} className="break-inside-avoid">
              <h3 className="mb-2 border-b border-neutral-200 pb-1 text-[11px] font-bold uppercase tracking-wider text-neutral-600">
                {section.title}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {section.items.map((item) => (
                  <div
                    key={`${section.title}-${item.label}`}
                    className={`rounded-md border border-neutral-100 bg-neutral-50 p-2 ${
                      item.fullWidth ? 'col-span-2' : ''
                    }`}
                  >
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                      {item.label}
                    </div>
                    <div className="text-xs font-semibold text-neutral-900 break-words">
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Signature Area when Termo is Selected */}
        {hasTermo && (
          <div className="mt-8 border-t border-dashed border-neutral-300 pt-6 break-inside-avoid">
            <p className="mb-8 text-center text-xs font-medium text-neutral-600">
              Declaro estar ciente e de acordo com todas as informações constantes neste termo.
            </p>
            <div className="grid grid-cols-2 gap-8 text-center">
              <div>
                <div className="mx-auto w-4/5 border-t border-neutral-800 pt-1.5" />
                <p className="text-xs font-bold text-neutral-800">{acolhedor.nome}</p>
                <p className="text-[10px] text-neutral-500">
                  {isAdotante ? 'Assinatura do Adotante' : 'Assinatura do Tutor'} (CPF: {acolhedor.cpf})
                </p>
              </div>
              <div>
                <div className="mx-auto w-4/5 border-t border-neutral-800 pt-1.5" />
                <p className="text-xs font-bold text-neutral-800">SOS Bicho Solto</p>
                <p className="text-[10px] text-neutral-500">Responsável pelo Acolhimento / Entrega</p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 flex items-center justify-between border-t border-neutral-200 pt-3 text-[10px] text-neutral-400 break-inside-avoid">
          <span>SOS Bicho Solto — Documento gerado eletronicamente</span>
          <span>Emissão: {date}</span>
        </div>
      </div>
    );
  },
);

AcolhedorPrintDocument.displayName = 'AcolhedorPrintDocument';
