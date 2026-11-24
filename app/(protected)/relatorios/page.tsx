'use client';

import { CalendarRange, HeartHandshake, PawPrint, UserSearch } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useGerarRelatorio } from '@/hooks/use-gerar-relatorio';
import { calcularPeriodo, PRESETS_PERIODO, type PresetPeriodo } from '@/lib/periodo';
import { cn } from '@/lib/utils';
import type { EspecieAnimalRelatorio, StatusAnimalRelatorio, TipoRelatorio } from '@/services/relatorio.service';
import { RelatorioCard } from './_components/relatorio-card';

const TODOS = 'todos';

export default function RelatoriosPage() {
  const router = useRouter();
  const { data: currentUser, isLoading: isCurrentUserLoading } = useCurrentUser();
  const gerarRelatorio = useGerarRelatorio();

  const [preset, setPreset] = useState<PresetPeriodo | null>('mes-atual');
  const [periodo, setPeriodo] = useState(() => calcularPeriodo('mes-atual'));
  const [especie, setEspecie] = useState<string>(TODOS);
  const [status, setStatus] = useState<string>(TODOS);

  useEffect(() => {
    if (isCurrentUserLoading) {
      return;
    }

    if (!currentUser) {
      router.replace('/login');
      return;
    }

    if (currentUser.role !== 'admin') {
      router.replace('/dashboard');
    }
  }, [currentUser, isCurrentUserLoading, router]);

  const periodoInvalido = Boolean(periodo.de && periodo.ate && periodo.de > periodo.ate);

  const selecionarPreset = (id: PresetPeriodo) => {
    setPreset(id);
    setPeriodo(calcularPeriodo(id));
  };

  const alterarData = (campo: 'de' | 'ate', valor: string) => {
    setPreset(null);
    setPeriodo((atual) => ({ ...atual, [campo]: valor }));
  };

  const gerar = (tipo: TipoRelatorio) => {
    gerarRelatorio.mutate({
      tipo,
      filtros: {
        de: periodo.de || undefined,
        ate: periodo.ate || undefined,
        especie: especie === TODOS ? undefined : (especie as EspecieAnimalRelatorio),
        status: status === TODOS ? undefined : (status as StatusAnimalRelatorio),
      },
    });
  };

  const gerando = (tipo: TipoRelatorio) => gerarRelatorio.isPending && gerarRelatorio.variables?.tipo === tipo;

  if (currentUser?.role !== 'admin') {
    return null;
  }

  return (
    <div className="p-4 md:p-7">
      <div className="mb-6">
        <h1 className="text-[22px] font-semibold text-foreground">Relatórios</h1>
        <p className="mt-0.5 text-[13px] text-muted-foreground">
          Relatórios históricos em PDF para apoiar a gestão da ONG e a prestação de contas à sociedade.
        </p>
      </div>

      <section className="mb-5 rounded-[14px] border border-border bg-card p-5">
        <div className="mb-3 flex items-center gap-2">
          <CalendarRange className="size-4 text-orange-600 dark:text-orange-400" />
          <h2 className="text-[14px] font-semibold text-foreground">Período analisado</h2>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {PRESETS_PERIODO.map(({ id, label }) => (
            <Button
              key={id}
              variant="outline"
              size="sm"
              onClick={() => selecionarPreset(id)}
              className={cn(
                preset === id &&
                  'border-orange-300 bg-orange-50 text-orange-700 dark:border-orange-900 dark:bg-orange-950/30 dark:text-orange-400',
              )}
            >
              {label}
            </Button>
          ))}
        </div>

        <div className="flex flex-wrap items-end gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="relatorio-de" className="text-[12px]">
              De
            </Label>
            <Input
              id="relatorio-de"
              type="date"
              className="w-44"
              value={periodo.de}
              onChange={(e) => alterarData('de', e.target.value)}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="relatorio-ate" className="text-[12px]">
              Até
            </Label>
            <Input
              id="relatorio-ate"
              type="date"
              className="w-44"
              value={periodo.ate}
              onChange={(e) => alterarData('ate', e.target.value)}
            />
          </div>
        </div>

        {periodoInvalido ? (
          <p className="mt-2 text-[12px] text-destructive">A data inicial não pode ser maior que a data final.</p>
        ) : (
          <p className="mt-3 text-[12px] text-muted-foreground">
            O período define as movimentações contabilizadas (entradas, adoções, devoluções, cadastros) e quais fichas
            entram no relatório. A situação atual é sempre a da data de emissão. Deixe as datas em branco para usar todo
            o histórico.
          </p>
        )}
      </section>

      <div className="grid gap-3.5 lg:grid-cols-3">
        <RelatorioCard
          titulo="Animais"
          descricao="Trajetória dos animais resgatados: do resgate à adoção, transferência ou óbito."
          conteudo={[
            'Entradas, adoções, devoluções, transferências e óbitos',
            'Tempo médio até a adoção e taxa de devolução',
            'Cobertura de castração e vacinação',
            'Animais há mais de 90 dias aguardando adoção',
            'Ficha de cada animal com linha do tempo completa',
          ]}
          icon={PawPrint}
          color="orange"
          gerando={gerando('animais')}
          desabilitado={periodoInvalido || gerarRelatorio.isPending}
          onGerar={() => gerar('animais')}
        >
          <Select value={especie} onValueChange={setEspecie}>
            <SelectTrigger className="w-full text-[13px]" aria-label="Espécie">
              <SelectValue placeholder="Espécie" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value={TODOS}>Todas espécies</SelectItem>
              <SelectItem value="CAO">Cães</SelectItem>
              <SelectItem value="GATO">Gatos</SelectItem>
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full text-[13px]" aria-label="Situação">
              <SelectValue placeholder="Situação" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value={TODOS}>Todas situações</SelectItem>
              <SelectItem value="ACOLHIMENTO">Em acolhimento</SelectItem>
              <SelectItem value="ADOTADO">Adotados</SelectItem>
              <SelectItem value="TRANSFERIDO">Transferidos</SelectItem>
              <SelectItem value="OBITO">Óbitos</SelectItem>
            </SelectContent>
          </Select>
        </RelatorioCard>

        <RelatorioCard
          titulo="Adotantes"
          descricao="Acolhedores cadastrados que ainda não têm animal vinculado."
          conteudo={[
            'Fila de espera pela primeira adoção',
            'Novos cadastros no período',
            'Adotantes com histórico de devolução',
            'Ficha de cada adotante com histórico de adoções',
          ]}
          icon={UserSearch}
          color="blue"
          gerando={gerando('adotantes')}
          desabilitado={periodoInvalido || gerarRelatorio.isPending}
          onGerar={() => gerar('adotantes')}
        />

        <RelatorioCard
          titulo="Tutores"
          descricao="Acolhedores com ao menos um animal vinculado."
          conteudo={[
            'Onde está cada animal adotado e há quanto tempo',
            'Tempo médio de guarda e guardas com mais de 1 ano',
            'Novos tutores, adoções e devoluções do período',
            'Ficha de cada tutor com histórico de adoções',
          ]}
          icon={HeartHandshake}
          color="green"
          gerando={gerando('tutores')}
          desabilitado={periodoInvalido || gerarRelatorio.isPending}
          onGerar={() => gerar('tutores')}
        />
      </div>

      <p className="mt-4 text-[12px] text-muted-foreground">
        Os relatórios exibem o CPF dos acolhedores mascarado. Situação dos acolhedores: tutores têm ao menos um animal
        vinculado; adotantes estão cadastrados sem animal vinculado.
      </p>
    </div>
  );
}
