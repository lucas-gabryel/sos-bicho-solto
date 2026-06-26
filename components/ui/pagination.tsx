'use client';

import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

type PageItem = number | 'ellipsis-start' | 'ellipsis-end';

function getPageItems(current: number, total: number): PageItem[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  const items: PageItem[] = [1];

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2) {
    items.push('ellipsis-start');
  }

  for (let page = start; page <= end; page += 1) {
    items.push(page);
  }

  if (end < total - 1) {
    items.push('ellipsis-end');
  }

  items.push(total);

  return items;
}

export function Pagination({ page, totalPages, onPageChange, className }: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const items = getPageItems(page, totalPages);

  return (
    <nav role="navigation" aria-label="Paginação" className={cn('flex w-full justify-center', className)}>
      <ul className="flex flex-row items-center gap-1">
        <li>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            aria-label="Página anterior"
          >
            <ChevronLeft className="size-4" />
            Anterior
          </Button>
        </li>

        {items.map((item) =>
          typeof item === 'number' ? (
            <li key={item}>
              <Button
                type="button"
                variant={item === page ? 'outline' : 'ghost'}
                size="icon-sm"
                onClick={() => onPageChange(item)}
                aria-current={item === page ? 'page' : undefined}
                aria-label={`Página ${item}`}
              >
                {item}
              </Button>
            </li>
          ) : (
            <li key={item} aria-hidden className="flex size-7 items-center justify-center text-muted-foreground">
              <MoreHorizontal className="size-4" />
            </li>
          ),
        )}

        <li>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            aria-label="Próxima página"
          >
            Próximo
            <ChevronRight className="size-4" />
          </Button>
        </li>
      </ul>
    </nav>
  );
}
