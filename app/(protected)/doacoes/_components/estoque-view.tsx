'use client';

import { useState } from 'react';
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  MinusCircle,
  PackageCheck,
  PackageOpen,
  Plus,
  RefreshCw,
  Search,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useRegistrarMovimentacaoEstoque } from '@/hooks/use-estoque-mutation';
import { useMovimentacoesEstoque, useResumoSaldos } from '@/hooks/use-estoque';
import { TIPO_DOACAO_LABELS } from '@/types/doacao';
import type {
  ItemSaldoEstoque,
  RegistrarMovimentacaoFormValues,
  TipoMovimentacaoEstoque,
} from '@/types/estoque';
import { RegistrarMovimentacaoModal } from './registrar-movimentacao-modal';

export function EstoqueView() {
  const [buscaItem, setBuscaItem] = useState('');
  const [paginaMov, setPaginaMov] = useState(1);
  const [filtroTipoMov, setFiltroTipoMov] = useState<TipoMovimentacaoEstoque | ''>('');
  const [modalOpen, setModalOpen] = useState(false);
  const [itemSelecionado, setItemSelecionado] = useState<ItemSaldoEstoque | null>(null);
  const [tipoModal, setTipoModal] = useState<TipoMovimentacaoEstoque>('SAIDA');

  const { data: resumo, isLoading: loadingResumo, refetch: refetchResumo } = useResumoSaldos();
  const {
    data: movimentacoesData,
    isLoading: loadingMovs,
    refetch: refetchMovs,
  } = useMovimentacoesEstoque({
    page: paginaMov,
    limit: 8,
    tipo: filtroTipoMov || undefined,
  });

  const registrarMut = useRegistrarMovimentacaoEstoque();

  const handleOpenRegistrar = (
    item?: ItemSaldoEstoque,
    tipo: TipoMovimentacaoEstoque = 'SAIDA',
  ) => {
    setItemSelecionado(item || null);
    setTipoModal(tipo);
    setModalOpen(true);
  };

  const handleSalvarMovimentacao = async (values: RegistrarMovimentacaoFormValues) => {
    await registrarMut.mutateAsync(values);
    refetchResumo();
    refetchMovs();
  };

  const itensFiltrados = (resumo?.itens || []).filter((item) =>
    item.descricaoItem.toLowerCase().includes(buscaItem.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* Cards de Resumo e Prevenção de Desabastecimento */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Total de Itens Catalogados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-foreground">
                {resumo?.totalItensDiferentes ?? 0}
              </span>
              <PackageCheck className="size-5 text-muted-foreground" />
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Insumos distintos em circulação
            </p>
          </CardContent>
        </Card>

        <Card className={resumo?.totalItensZerados ? 'border-destructive/40 bg-destructive/5' : ''}>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Itens Esgotados / Zerados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-destructive">
                {resumo?.totalItensZerados ?? 0}
              </span>
              <MinusCircle className="size-5 text-destructive" />
            </div>
            <p className="mt-1 text-[11px] text-destructive/80 font-medium">
              Alerta de desabastecimento crítico
            </p>
          </CardContent>
        </Card>

        <Card className={resumo?.totalItensBaixos ? 'border-amber-500/40 bg-amber-500/5' : ''}>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Estoque Baixo (Atenção)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {resumo?.totalItensBaixos ?? 0}
              </span>
              <AlertTriangle className="size-5 text-amber-500" />
            </div>
            <p className="mt-1 text-[11px] text-amber-600/80 dark:text-amber-400 font-medium">
              Abaixo de 15% ou menos de 5 un/kg
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Ações Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 pt-1">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start text-xs font-normal"
              onClick={() => handleOpenRegistrar(undefined, 'SAIDA')}
            >
              <ArrowDownRight className="mr-1.5 size-3.5 text-destructive" />
              Dar Baixa em Consumo
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start text-xs font-normal"
              onClick={() => handleOpenRegistrar(undefined, 'AJUSTE')}
            >
              <RefreshCw className="mr-1.5 size-3.5 text-blue-500" />
              Ajuste / Inventário Físico
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Saldo Atual */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4 border-b border-border pb-4">
          <div>
            <CardTitle className="text-base font-semibold">Saldo Atual de Insumos</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Consolidação das entradas recebidas, consumos e saldo disponível em tempo real
            </p>
          </div>
          <div className="relative w-64">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar insumo..."
              value={buscaItem}
              onChange={(e) => setBuscaItem(e.target.value)}
              className="h-8 pl-8 text-xs"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item / Descrição</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead className="text-right">Total Recebido</TableHead>
                <TableHead className="text-right">Total Consumido</TableHead>
                <TableHead className="text-right">Saldo Atual</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingResumo ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-28 text-center text-xs text-muted-foreground">
                    Carregando saldo de estoque...
                  </TableCell>
                </TableRow>
              ) : itensFiltrados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-28 text-center text-xs text-muted-foreground">
                    Nenhum item encontrado no estoque.
                  </TableCell>
                </TableRow>
              ) : (
                itensFiltrados.map((item) => (
                  <TableRow key={item.chave}>
                    <TableCell className="font-medium text-foreground">
                      {item.descricaoItem}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {TIPO_DOACAO_LABELS[item.tipoItem] || item.tipoItem}
                    </TableCell>
                    <TableCell className="text-right text-xs">
                      {item.totalEntradas} {item.unidadeMedida}
                    </TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground">
                      {item.totalSaidas} {item.unidadeMedida}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-foreground">
                      {item.saldoAtual} {item.unidadeMedida}
                    </TableCell>
                    <TableCell className="text-center">
                      {item.status === 'ZERADO' && (
                        <Badge variant="destructive" className="text-[10px]">
                          Zerado
                        </Badge>
                      )}
                      {item.status === 'BAIXO' && (
                        <span className="inline-flex items-center rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:text-amber-400">
                          Estoque Baixo
                        </span>
                      )}
                      {item.status === 'ADEQUADO' && (
                        <span className="inline-flex items-center rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
                          Adequado
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs"
                        disabled={item.saldoAtual <= 0}
                        onClick={() => handleOpenRegistrar(item, 'SAIDA')}
                      >
                        <ArrowDownRight className="mr-1 size-3 text-destructive" />
                        Baixa
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Histórico Recente de Movimentações */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b border-border pb-4">
          <div>
            <CardTitle className="text-base font-semibold">Histórico de Movimentações</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Registro auditável de cada entrada, saída e ajuste realizado no sistema
            </p>
          </div>
          <select
            value={filtroTipoMov}
            onChange={(e) => {
              setFiltroTipoMov(e.target.value as TipoMovimentacaoEstoque | '');
              setPaginaMov(1);
            }}
            className="flex h-8 rounded-md border border-input bg-transparent px-2 text-xs shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="">Todas as movimentações</option>
            <option value="ENTRADA">Apenas Entradas</option>
            <option value="SAIDA">Apenas Saídas / Consumo</option>
            <option value="AJUSTE">Apenas Ajustes</option>
          </select>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data / Hora</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Item</TableHead>
                <TableHead className="text-right">Quantidade</TableHead>
                <TableHead>Motivo / Observação</TableHead>
                <TableHead>Registrado Por</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingMovs ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-xs text-muted-foreground">
                    Carregando histórico...
                  </TableCell>
                </TableRow>
              ) : (movimentacoesData?.data || []).length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-xs text-muted-foreground">
                    Nenhuma movimentação registrada no período.
                  </TableCell>
                </TableRow>
              ) : (
                movimentacoesData?.data.map((mov) => (
                  <TableRow key={mov.id}>
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(mov.dataMovimento).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </TableCell>
                    <TableCell>
                      {mov.tipo === 'ENTRADA' && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
                          <ArrowUpRight className="size-3" /> Entrada
                        </span>
                      )}
                      {mov.tipo === 'SAIDA' && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-rose-500/10 px-1.5 py-0.5 text-[11px] font-medium text-rose-700 dark:text-rose-400">
                          <ArrowDownRight className="size-3" /> Saída
                        </span>
                      )}
                      {mov.tipo === 'AJUSTE' && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-blue-500/10 px-1.5 py-0.5 text-[11px] font-medium text-blue-700 dark:text-blue-400">
                          <RefreshCw className="size-3" /> Ajuste
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs font-medium text-foreground">
                      {mov.descricaoItem}
                    </TableCell>
                    <TableCell className="text-right text-xs font-semibold">
                      {mov.quantidade} {mov.unidadeMedida}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-xs truncate">
                      {mov.motivo}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {mov.registradoPorNome || 'Sistema / Usuário'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {(movimentacoesData?.meta?.totalPages || 0) > 1 && (
            <div className="p-4 border-t border-border">
              <Pagination
                page={paginaMov}
                totalPages={movimentacoesData?.meta?.totalPages || 1}
                onPageChange={setPaginaMov}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <RegistrarMovimentacaoModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        itemPreSelecionado={itemSelecionado}
        tipoMovimentoPadrao={tipoModal}
        isPending={registrarMut.isPending}
        onSubmit={handleSalvarMovimentacao}
      />
    </div>
  );
}
