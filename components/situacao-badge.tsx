import { Badge } from '@/components/ui/badge';
import { SITUACAO_LABELS } from '@/lib/acolhedor';
import { cn } from '@/lib/utils';
import type { SituacaoAcolhedor } from '@/types/acolhedor';

const SITUACAO_STYLES: Record<SituacaoAcolhedor, string> = {
  TUTOR: 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400',
  ADOTANTE: 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400',
};

interface SituacaoBadgeProps {
  situacao: SituacaoAcolhedor;
  className?: string;
}

export function SituacaoBadge({ situacao, className }: SituacaoBadgeProps) {
  return (
    <Badge
      className={cn(
        'h-auto rounded-full border-transparent px-2.5 py-0.5 text-[11px] font-semibold',
        SITUACAO_STYLES[situacao],
        className,
      )}
    >
      {SITUACAO_LABELS[situacao]}
    </Badge>
  );
}
