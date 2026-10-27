'use client';

import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { useRelatorioDoacoes } from '@/hooks/use-relatorio-doacoes';
import { downloadRelatorioDoacoesPdf } from '@/services/doacao.service';
import type { RelatorioDoacoesFilterParams, TipoDoacao } from '@/types/doacao';
import { RelatorioDoacoesTable } from './relatorio/relatorio-doacoes-table';
import { RelatorioFiltros } from './relatorio/relatorio-filtros';
import { RelatorioItensAcumulados } from './relatorio/relatorio-itens-acumulados';
import { RelatorioMetricasCards } from './relatorio/relatorio-metricas-cards';

export function RelatorioDoacoesView() {
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [tipo, setTipo] = useState<TipoDoacao | ''>('');

  const [appliedFilters, setAppliedFilters] = useState<RelatorioDoacoesFilterParams>({
    dataInicio: '',
    dataFim: '',
    tipo: '',
  });

  const [isExportingPdf, setIsExportingPdf] = useState(false);

  const dateError = useMemo(() => {
    if (dataInicio && dataFim && dataInicio > dataFim) {
      return 'A data inicial não pode ser posterior à data final.';
    }
    return null;
  }, [dataInicio, dataFim]);

  const { data, isLoading, isFetching, error, refetch } = useRelatorioDoacoes(appliedFilters);

  const handleApplyFilters = () => {
    if (dateError) {
      toast.error(dateError);
      return;
    }
    setAppliedFilters({
      dataInicio: dataInicio || undefined,
      dataFim: dataFim || undefined,
      tipo: tipo || undefined,
    });
  };

  const handleClearFilters = () => {
    setDataInicio('');
    setDataFim('');
    setTipo('');
    setAppliedFilters({
      dataInicio: '',
      dataFim: '',
      tipo: '',
    });
  };

  const handleExportPdf = async () => {
    try {
      setIsExportingPdf(true);
      const blob = await downloadRelatorioDoacoesPdf(appliedFilters);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const dataHoje = new Date().toISOString().slice(0, 10);
      link.download = `relatorio-doacoes-${dataHoje}.pdf`;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      toast.success('Relatório PDF exportado com sucesso!');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha ao exportar PDF.';
      toast.error(msg);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const resumo = data?.resumo;
  const doacoes = data?.doacoes ?? [];

  return (
    <div className="space-y-6">
      <RelatorioFiltros
        dataInicio={dataInicio}
        setDataInicio={setDataInicio}
        dataFim={dataFim}
        setDataFim={setDataFim}
        tipo={tipo}
        setTipo={setTipo}
        dateError={dateError}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
        onExportPdf={handleExportPdf}
        isFetching={isFetching}
        isLoading={isLoading}
        isExportingPdf={isExportingPdf}
      />

      <RelatorioMetricasCards resumo={resumo} isLoading={isLoading} />

      <RelatorioItensAcumulados
        itensAgrupados={resumo?.itensAgrupados}
        tipoFiltro={appliedFilters.tipo}
        isLoading={isLoading}
      />

      <RelatorioDoacoesTable
        doacoes={doacoes}
        isLoading={isLoading}
        error={error}
        onRefetch={refetch}
      />
    </div>
  );
}
