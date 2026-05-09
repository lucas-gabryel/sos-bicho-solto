import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'Adotado' | 'Acolhimento';
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const adopted = status === 'Adotado';

  return (
    <Badge
      className={cn(
        'h-auto gap-1.5 rounded-full border-transparent px-2.5 py-0.5 text-[11px] font-semibold',
        adopted
          ? 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400'
          : 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400',
        className,
      )}
    >
      <span
        className={cn(
          'size-1.5 rounded-full',
          adopted ? 'bg-green-600 dark:bg-green-400' : 'bg-blue-600 dark:bg-blue-400',
        )}
      />
      {adopted ? 'Adotado' : 'Acolhimento'}
    </Badge>
  );
}
