import { AnimalStatusBadge } from '@/components/animal-status-badge';
import type { AnimalStatus } from '@/types/animal';

interface StatusBadgeProps {
  status: AnimalStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return <AnimalStatusBadge status={status} size="sm" className={className} />;
}
