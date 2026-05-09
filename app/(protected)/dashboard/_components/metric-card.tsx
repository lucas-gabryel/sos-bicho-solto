import { cn } from '@/lib/utils';
import { type LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface MetricCardProps {
  label: string;
  value: number;
  sub: string;
  icon: LucideIcon;
  color: 'orange' | 'blue' | 'green' | 'purple';
  href: string;
}

const colorMap = {
  orange: {
    icon: 'bg-orange-100 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400',
    orb: 'bg-orange-500',
  },
  blue: {
    icon: 'bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400',
    orb: 'bg-blue-500',
  },
  green: {
    icon: 'bg-green-100 text-green-600 dark:bg-green-950/40 dark:text-green-400',
    orb: 'bg-green-500',
  },
  purple: {
    icon: 'bg-purple-100 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400',
    orb: 'bg-purple-500',
  },
};

export function MetricCard({ label, value, sub, icon: Icon, color, href }: MetricCardProps) {
  const colors = colorMap[color];

  return (
    <Link
      href={href}
      className="relative overflow-hidden rounded-[14px] border border-border bg-card p-5 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md"
    >
      <div
        className={cn(
          'pointer-events-none absolute -bottom-4 -right-4 size-20 rounded-full opacity-[0.07]',
          colors.orb,
        )}
      />
      <div className={cn('mb-3.5 flex size-9 items-center justify-center rounded-[10px]', colors.icon)}>
        <Icon className="size-4.5" />
      </div>
      <p className="mb-1 text-xs text-muted-foreground">{label}</p>
      <p className="text-[28px] font-semibold leading-none text-foreground">{value}</p>
      <p className="mt-1 text-[11px] text-muted-foreground/70">{sub}</p>
    </Link>
  );
}
