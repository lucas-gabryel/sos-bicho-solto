'use client';

import { useState } from 'react';
import { LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { ItemSaldoEstoque, RegistrarMovimentacaoFormValues, TipoMovimentacaoEstoque } from '@/types/estoque';

interface RegistrarMovimentacaoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemPreSelecionado?: ItemSaldoEstoque | null;
  tipoMovimentoPadrao?: TipoMovimentacaoEstoque;
  isPending: boolean;
  onSubmit: (values: RegistrarMovimentacaoFormValues) => Promise<void>;
}

export function RegistrarMovimentacaoModal({
  open,
  onOpenChange,
  itemPreSelecionado,
  tipoMovimentoPadrao = 'SAIDA',
  isPending,
  onSubmit,
}: RegistrarMovimentacaoModalProps) {
  const [tipo, setTipo] = useState<TipoMovimentacaoEstoque>(tipoMovimentoPadrao);
  const [tipoItem, setTipoItem] = useState(itemPreSelecionado?.tipoItem || 'RACAO');
  const [descricaoItem, setDescricaoItem] = useState(itemPreSelecionado?.descricaoItem || '');
  const [quantidade, setQuantidade] = useState('');
  const [unidadeMedida, setUnidadeMedida] = useState(itemPreSelecionado?.unidadeMedida || 'KG');
  const [motivo, setMotivo] = useState('');
  const [erro, setErro] = useState<string | null>(null);

  // Sincroniza quando o modal abre com item selecionado
  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen && itemPreSelecionado) {
      setTipo(tipoMovimentoPadrao);
      setTipoItem(itemPreSelecionado.tipoItem);
      setDescricaoItem(itemPreSelecionado.descricaoItem);
      setUnidadeMedida(itemPreSelecionado.unidadeMedida);
      setQuantidade('');
      setMotivo('');
      setErro(null);
    } else if (isOpen) {
      setTipo(tipoMovimentoPadrao);
      setQuantidade('');
      setMotivo('');
      setErro(null);
    }
    onOpenChange(isOpen);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);

    const qtdNum = parseFloat(quantidade.replace(',', '.'));
    if (!qtdNum || qtdNum <= 0) {
      setErro('A quantidade deve ser um número maior que zero.');
      return;
    }

    if (!descricaoItem.trim()) {
      setErro('A descrição do item é obrigatória.');
      return;
    }

    if (!unidadeMedida.trim()) {
      setErro('A unidade de medida é obrigatória.');
      return;
    }

    if (!motivo.trim()) {
      setErro('O motivo da movimentação é obrigatório.');
      return;
    }

    if (tipo === 'SAIDA' && itemPreSelecionado && qtdNum > itemPreSelecionado.saldoAtual) {
      setErro(
        `Quantidade (${qtdNum} ${itemPreSelecionado.unidadeMedida}) excede o saldo atual em estoque (${itemPreSelecionado.saldoAtual} ${itemPreSelecionado.unidadeMedida}).`,
      );
      return;
    }

    try {
      await onSubmit({
        tipo,
        tipoItem,
        descricaoItem,
        quantidade: qtdNum,
        unidadeMedida,
        motivo,
      });
      onOpenChange(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErro(err.message);
      } else {
        setErro('Erro inesperado ao registrar movimentação.');
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {tipo === 'SAIDA' ? 'Registrar Consumo / Saída' : 'Registrar Movimentação de Estoque'}
          </DialogTitle>
          <DialogDescription>
            {itemPreSelecionado
              ? `Item selecionado: ${itemPreSelecionado.descricaoItem} (Saldo atual: ${itemPreSelecionado.saldoAtual} ${itemPreSelecionado.unidadeMedida})`
              : 'Informe os dados da movimentação física para atualizar o saldo.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {erro && (
            <div className="rounded-md bg-destructive/15 p-2.5 text-xs font-medium text-destructive">
              {erro}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Tipo de Movimento</Label>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                value={tipo}
                onChange={(e) => setTipo(e.target.value as TipoMovimentacaoEstoque)}
                disabled={Boolean(itemPreSelecionado)}
              >
                <option value="SAIDA">Saída / Consumo</option>
                <option value="ENTRADA">Entrada Direta</option>
                <option value="AJUSTE">Ajuste de Balanço</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Categoria</Label>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                value={tipoItem}
                onChange={(e) => setTipoItem(e.target.value as any)}
                disabled={Boolean(itemPreSelecionado)}
              >
                <option value="RACAO">Ração</option>
                <option value="MEDICAMENTO">Medicamento</option>
                <option value="PRODUTO_LIMPEZA">Produto de Limpeza</option>
                <option value="OUTRO">Outro</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Descrição do Item</Label>
            <Input
              value={descricaoItem}
              onChange={(e) => setDescricaoItem(e.target.value)}
              placeholder="Ex: Ração Golden Cães Adultos 15kg"
              disabled={Boolean(itemPreSelecionado)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Quantidade</Label>
              <Input
                type="number"
                step="0.01"
                min="0.01"
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
                placeholder="Ex: 2.5"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Unidade de Medida</Label>
              <Input
                value={unidadeMedida}
                onChange={(e) => setUnidadeMedida(e.target.value)}
                placeholder="Ex: KG, PCT, CX"
                disabled={Boolean(itemPreSelecionado)}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Motivo / Finalidade</Label>
            <Input
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder={
                tipo === 'SAIDA'
                  ? 'Ex: Alimentação diária do gatil, tratamento animal X'
                  : 'Ex: Correção de contagem física'
              }
              required
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={isPending}>
              {isPending && <LoaderCircle className="mr-2 size-3.5 animate-spin" />}
              Salvar Movimentação
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
