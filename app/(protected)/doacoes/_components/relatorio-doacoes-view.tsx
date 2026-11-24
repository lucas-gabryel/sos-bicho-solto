'use client';

import {
  ArrowDownLeft,
  ArrowUpRight,
  Download,
  FileSpreadsheet,
  FileText,
  Filter,
  Loader2,
  Paperclip,
  Printer,
  RefreshCw,
  Search,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getAuthToken } from '@/lib/auth-token';
import { formatDateToPtBr } from '@/lib/date';
import { getRelatorioDoacoes } from '@/services/doacao.service';
import type { DirecaoDoacao, RelatorioDoacoesData, TipoDoacao } from '@/types/doacao';
import { DIRECAO_DOACAO_LABELS, TIPO_DOACAO_LABELS } from '@/types/doacao';

export function RelatorioDoacoesView() {
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [tipo, setTipo] = useState<TipoDoacao | 'all'>('all');
  const [direcao, setDirecao] = useState<DirecaoDoacao | 'all'>('all');
  const [filtroTexto, setFiltroTexto] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [relatorioData, setRelatorioData] = useState<RelatorioDoacoesData | null>(null);

  const carregarRelatorio = async () => {
    setIsLoading(true);
    try {
      const data = await getRelatorioDoacoes({
        dataInicio: dataInicio || undefined,
        dataFim: dataFim || undefined,
        tipo: tipo !== 'all' ? tipo : undefined,
        direcao: direcao !== 'all' ? direcao : undefined,
      });
      setRelatorioData(data);
    } catch (err: any) {
      toast.error(err?.message || 'Erro ao carregar dados do relatório.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    carregarRelatorio();
  }, [tipo, direcao]);

  const handleDownloadPdf = async () => {
    try {
      setIsDownloadingPdf(true);
      const params = new URLSearchParams();
      if (dataInicio) params.append('dataInicio', dataInicio);
      if (dataFim) params.append('dataFim', dataFim);
      if (tipo !== 'all') params.append('tipo', tipo);
      if (direcao !== 'all') params.append('direcao', direcao);

      const apiUrl = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000').replace(/\/$/, '');
      const token = getAuthToken();

      const response = await fetch(`${apiUrl}/doacoes/relatorio/pdf?${params.toString()}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) {
        throw new Error('Falha ao baixar arquivo PDF do relatório.');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `relatorio-doacoes-${new Date().toISOString().slice(0, 10)}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Relatório PDF exportado com sucesso!');
    } catch (err: any) {
      toast.error(err?.message || 'Erro ao exportar PDF.');
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const itensFiltrados = (relatorioData?.itens ?? []).filter((item) => {
    if (!filtroTexto.trim()) return true;
    const term = filtroTexto.toLowerCase();
    return (
      item.descricao?.toLowerCase().includes(term) ||
      item.beneficiario?.toLowerCase().includes(term) ||
      item.doador?.nome?.toLowerCase().includes(term) ||
      item.doador?.cpfCnpj?.includes(term)
    );
  });

  const resumo = relatorioData?.resumo;

  return (
    <div className="space-y-6">
      {/* Barra de Filtros */}
      <div className="rounded-xl border border-border bg-card p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="size-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Filtros do Relatório Histórico</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={carregarRelatorio}
              disabled={isLoading}
              className="text-xs"
            >
              <RefreshCw className={`mr-1.5 size-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleDownloadPdf}
              disabled={isDownloadingPdf || !relatorioData}
              className="text-xs"
            >
              {isDownloadingPdf ? (
                <>
                  <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                  Gerando PDF...
                </>
              ) : (
                <>
                  <Download className="mr-1.5 size-3.5" />
                  Exportar PDF Oficial
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <label className="text-[11px] font-medium text-muted-foreground">Modalidade</label>
            <Select value={direcao} onValueChange={(val: any) => setDirecao(val)}>
              <SelectTrigger className="mt-1 text-xs">
                <SelectValue placeholder="Todas modalidades" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas modalidades</SelectItem>
                <SelectItem value="RECEBIDA">Doações Recebidas</SelectItem>
                <SelectItem value="REALIZADA">Doações Feitas (ONG)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-[11px] font-medium text-muted-foreground">Tipo de Item</label>
            <Select value={tipo} onValueChange={(val: any) => setTipo(val)}>
              <SelectTrigger className="mt-1 text-xs">
                <SelectValue placeholder="Todos os tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                {(Object.keys(TIPO_DOACAO_LABELS) as TipoDoacao[]).map((t) => (
                  <SelectItem key={t} value={t}>
                    {TIPO_DOACAO_LABELS[t]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-[11px] font-medium text-muted-foreground">Data Inicial</label>
            <Input
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className="mt-1 text-xs"
            />
          </div>

          <div>
            <label className="text-[11px] font-medium text-muted-foreground">Data Final</label>
            <Input
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              className="mt-1 text-xs"
            />
          </div>
        </div>
      </div>

      {/* Cards de Métricas e Totais Consolidados */}
      {resumo && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium">Total de Registros</span>
              <FileSpreadsheet className="size-4" />
            </div>
            <p className="mt-2 text-2xl font-bold text-foreground">{resumo.totalRegistros}</p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              {resumo.totalRecebidas} recebidas • {resumo.totalRealizadas} feitas
            </p>
          </div>

          <div className="rounded-xl border border-emerald-500/20 bg-emerald-50/30 p-4 shadow-xs dark:bg-emerald-950/10">
            <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-400">
              <span className="text-xs font-medium">Dinheiro Recebido</span>
              <ArrowDownLeft className="size-4" />
            </div>
            <p className="mt-2 text-2xl font-bold text-emerald-700 dark:text-emerald-400">
              {resumo.totalDinheiroFormatado}
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">Entradas financeiras confirmadas</p>
          </div>

          <div className="rounded-xl border border-blue-500/20 bg-blue-50/30 p-4 shadow-xs dark:bg-blue-950/10">
            <div className="flex items-center justify-between text-blue-700 dark:text-blue-400">
              <span className="text-xs font-medium">Doações Financeiras Feitas</span>
              <ArrowUpRight className="size-4" />
            </div>
            <p className="mt-2 text-2xl font-bold text-blue-700 dark:text-blue-400">
              {resumo.totalDinheiroRealizadoFormatado}
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">Auxílios e repasses da ONG</p>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium">Insumos & Materiais</span>
              <FileText className="size-4" />
            </div>
            <p className="mt-2 text-xl font-bold text-foreground">
              {resumo.itensAgrupados.length + resumo.itensRealizadosAgrupados.length} categorias
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">Rações, medicamentos e outros</p>
          </div>
        </div>
      )}

      {/* Tabela Descritiva e Histórica */}
      <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Histórico Descritivo e Textual</h3>
            <p className="text-xs text-muted-foreground">
              Relação detalhada de cada doação com datas, itens, descrições e comprovantes.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Filtrar por texto, pessoa ou descrição..."
              value={filtroTexto}
              onChange={(e) => setFiltroTexto(e.target.value)}
              className="pl-8 text-xs"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center p-12 text-muted-foreground">
            <Loader2 className="mr-2 size-5 animate-spin" />
            <span className="text-xs">Carregando histórico do relatório...</span>
          </div>
        ) : itensFiltrados.length === 0 ? (
          <div className="p-12 text-center text-xs text-muted-foreground">
            Nenhuma doação encontrada para os filtros aplicados.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/40 text-[11px] font-semibold text-muted-foreground uppercase">
                <tr>
                  <th className="py-2.5 px-3">Data</th>
                  <th className="py-2.5 px-3">Modalidade</th>
                  <th className="py-2.5 px-3">Tipo / Recurso</th>
                  <th className="py-2.5 px-3">Origem / Destino</th>
                  <th className="py-2.5 px-3">Descrição Textual</th>
                  <th className="py-2.5 px-3 text-right">Valor / Qtd</th>
                  <th className="py-2.5 px-3 text-center">Comprovante</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {itensFiltrados.map((d) => {
                  const isRecebida = d.direcao === 'RECEBIDA';
                  return (
                    <tr key={d.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-3 whitespace-nowrap font-medium text-foreground">
                        {formatDateToPtBr(d.dataRecebimento)}
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            isRecebida
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                              : 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400'
                          }`}
                        >
                          {isRecebida ? (
                            <ArrowDownLeft className="size-3" />
                          ) : (
                            <ArrowUpRight className="size-3" />
                          )}
                          {isRecebida ? 'Recebida' : 'Feita pela ONG'}
                        </span>
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap font-medium">
                        {TIPO_DOACAO_LABELS[d.tipo]}
                      </td>

                      <td className="py-3 px-3">
                        {isRecebida ? (
                          d.anonima ? (
                            <span className="text-muted-foreground italic">Doação Anônima</span>
                          ) : (
                            <div>
                              <p className="font-medium text-foreground">{d.doador?.nome || '-'}</p>
                              <p className="text-[10px] text-muted-foreground">{d.doador?.cpfCnpj}</p>
                            </div>
                          )
                        ) : (
                          <span className="font-medium text-foreground">
                            {d.beneficiario || 'Beneficiário Geral da ONG'}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-3 text-muted-foreground max-w-xs">
                        <p className="line-clamp-2">{d.descricao || '-'}</p>
                      </td>

                      <td className="py-3 px-3 text-right whitespace-nowrap font-semibold">
                        {d.tipo === 'DINHEIRO' ? (
                          <span
                            className={
                              isRecebida
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-blue-600 dark:text-blue-400'
                            }
                          >
                            {new Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            }).format(d.valor || 0)}
                          </span>
                        ) : (
                          <span>
                            {d.quantidade} {d.unidadeMedida || 'un'}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        {d.documentoUrl ? (
                          <a
                            href={d.documentoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2 py-1 text-[11px] font-medium text-primary hover:bg-muted"
                            title={d.documentoNome || 'Ver comprovante'}
                          >
                            <Paperclip className="size-3" />
                            <span>Ver Anexo</span>
                          </a>
                        ) : (
                          <span className="text-muted-foreground text-[10px]">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

