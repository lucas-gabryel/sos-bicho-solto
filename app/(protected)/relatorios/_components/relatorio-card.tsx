import { Check, FileDown, LoaderCircle, type LucideIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface RelatorioCardProps {
  titulo: string;
  descricao: string;
  conteudo: string[];
  icon: LucideIcon;
  color: 'orange' | 'blue' | 'green';
  gerando: boolean;
  desabilitado: boolean;
  onGerar: () => void;
  children?: React.ReactNode;
}

const colorMap = {
  orange: 'bg-orange-100 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400',
  blue: 'bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400',
  green: 'bg-green-100 text-green-600 dark:bg-green-950/40 dark:text-green-400',
};

export function RelatorioCard({
  titulo,
  descricao,
  conteudo,
  icon: Icon,
  color,
  gerando,
  desabilitado,
  onGerar,
  children,
}: RelatorioCardProps) {
  return (
    <div className="flex flex-col rounded-[14px] border border-border bg-card p-5">
      <div className={cn('mb-3.5 flex size-9 items-center justify-center rounded-[10px]', colorMap[color])}>
        <Icon className="size-4.5" />
      </div>
      <h2 className="text-[15px] font-semibold text-foreground">{titulo}</h2>
      <p className="mt-1 text-[13px] text-muted-foreground">{descricao}</p>

      <ul className="mt-4 space-y-1.5">
        {conteudo.map((item) => (
          <li key={item} className="flex gap-2 text-[12.5px] text-foreground/80">
            <Check className="mt-0.5 size-3.5 shrink-0 text-orange-600 dark:text-orange-400" />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      {children ? <div className="mt-4 grid grid-cols-2 gap-2">{children}</div> : null}

      <div className="mt-auto pt-5">
        <Button variant="primary" className="w-full" onClick={onGerar} disabled={desabilitado || gerando}>
          {gerando ? <LoaderCircle className="animate-spin" /> : <FileDown />}
          {gerando ? 'Gerando PDF...' : 'Gerar PDF'}
        </Button>
      </div>
    </div>
  );
}
