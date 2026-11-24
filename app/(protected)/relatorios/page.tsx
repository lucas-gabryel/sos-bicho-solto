'use client';

import { CalendarRange, Gift, PawPrint, Users } from 'lucide-react';
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
import type { EspecieAnimalRelatorio, TipoRelatorio } from '@/services/relatorio.service';
import { RelatorioCard } from './_components/relatorio-card';

const TODOS = 'todos';

export default function RelatoriosPage() {
  const router = useRouter();
  const { data: currentUser, isLoading: isCurrentUserLoading } = useCurrentUser();
  const gerarRelatorio = useGerarRelatorio();

  const [preset, setPreset] = useState<PresetPeriodo | null>('mes-atual');
  const [periodo, setPeriodo] = useState(() => calcularPeriodo('mes-atual'));
  const [especie, setEspecie] = useState<string>(TODOS);

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

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
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

          <div className="flex flex-wrap items-center gap-2">
            <Label htmlFor="relatorio-de" className="text-[12px] text-muted-foreground">
              De
            </Label>
            <Input
              id="relatorio-de"
              type="date"
              className="w-40"
              value={periodo.de}
              onChange={(e) => alterarData('de', e.target.value)}
            />
            <Label htmlFor="relatorio-ate" className="ml-1 text-[12px] text-muted-foreground">
              Até
            </Label>
            <Input
              id="relatorio-ate"
              type="date"
              className="w-40"
              value={periodo.ate}
              onChange={(e) => alterarData('ate', e.target.value)}
            />
          </div>
        </div>

        {periodoInvalido ? (
          <p className="mt-3 text-[12px] text-destructive">A data inicial não pode ser maior que a data final.</p>
        ) : null}
      </section>

      <div className="grid gap-3.5 lg:grid-cols-3">
        <RelatorioCard
          titulo="Animais"
          descricao="Trajetória dos animais resgatados: do resgate à adoção, transferência ou óbito."
          conteudo={[
            'Entradas, adoções, devoluções, transferências e óbitos',
            'Evolução no período e situação atual em gráficos',
            'Cobertura de castração e vacinação',
            'Animais há mais de 90 dias aguardando adoção',
          ]}
          icon={PawPrint}
          color="orange"
          gerando={gerando('animais')}
          desabilitado={periodoInvalido || gerarRelatorio.isPending}
          onGerar={() => gerar('animais')}
        >
          <Select value={especie} onValueChange={setEspecie}>
            <SelectTrigger className="col-span-2 w-full text-[13px]" aria-label="Espécie">
              <SelectValue placeholder="Espécie" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value={TODOS}>Todas espécies</SelectItem>
              <SelectItem value="CAO">Cães</SelectItem>
              <SelectItem value="GATO">Gatos</SelectItem>
            </SelectContent>
          </Select>
        </RelatorioCard>

        <RelatorioCard
          titulo="Acolhedores"
          descricao="Tutores e adotantes: onde estão os animais adotados e quem aguarda para adotar."
          conteudo={[
            'Perfil dos acolhedores e tempo de guarda',
            'Cadastros, adoções e devoluções do período',
            'Onde está cada animal adotado',
            'Fila de espera e adotantes com devolução',
          ]}
          icon={Users}
          color="blue"
          gerando={gerando('acolhedores')}
          desabilitado={periodoInvalido || gerarRelatorio.isPending}
          onGerar={() => gerar('acolhedores')}
        />

        <RelatorioCard
          titulo="Doações"
          descricao="Arrecadação, doadores e estoque, para a prestação de contas à sociedade."
          conteudo={[
            'Arrecadação em dinheiro e itens no período',
            'Principais doadores e doações por tipo',
            'Itens recebidos e movimentação do estoque',
            'Saldo atual e itens zerados',
          ]}
          icon={Gift}
          color="green"
          gerando={gerando('doacoes')}
          desabilitado={periodoInvalido || gerarRelatorio.isPending}
          onGerar={() => gerar('doacoes')}
        />
      </div>
    </div>
  );
}
