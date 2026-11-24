import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { AnimalStatus } from '@/types/animal';

const STATUS_STYLES: Record<
  AnimalStatus,
  { badge: string; dot: string; label: string }
> = {
  Acolhimento: {
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400',
    dot: 'bg-blue-600 dark:bg-blue-400',
    label: 'Acolhimento',
  },
  Adotado: {
    badge: 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400',
    dot: 'bg-green-600 dark:bg-green-400',
    label: 'Adotado',
  },
  Transferido: {
    badge: 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400',
    dot: 'bg-amber-600 dark:bg-amber-400',
    label: 'Transferido',
  },
  Óbito: {
    badge: 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    dot: 'bg-slate-600 dark:bg-slate-400',
    label: 'Óbito',
  },
};

interface AnimalStatusBadgeProps {
  status: AnimalStatus;
  size?: 'sm' | 'md';
  className?: string;
}

export function AnimalStatusBadge({
  status,
  size = 'sm',
  className,
}: AnimalStatusBadgeProps) {
  const style = STATUS_STYLES[status] ?? STATUS_STYLES.Acolhimento;

  return (
    <Badge
      className={cn(
        'h-auto gap-1.5 rounded-full border-transparent font-semibold',
        size === 'md' ? 'px-3 py-1 text-xs' : 'px-2.5 py-0.5 text-[11px]',
        style.badge,
        className,
      )}
    >
      <span
        className={cn(
          'rounded-full',
          size === 'md' ? 'size-2' : 'size-1.5',
          style.dot,
        )}
      />
      {style.label}
    </Badge>
  );
}
