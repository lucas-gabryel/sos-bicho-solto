'use client';

import {
  Camera,
  Clock,
  ExternalLink,
  FileDown,
  FileText,
  LogIn,
  LogOut,
  Sparkles,
  Stethoscope,
  User,
  ZoomIn,
} from 'lucide-react';
import Image from 'next/image';
import { type ComponentType, useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import {
  type EventoAnimal,
  MOTIVO_SAIDA_LABELS,
  type MotivoSaidaAnimal,
  TIPO_EVENTO_LABELS,
  type TipoEventoAnimal,
} from '@/types/animal';

interface TipoVisualConfig {
  icon: ComponentType<{ className?: string }>;
  iconBg: string;
  badgeClass: string;
}

const TIPO_CONFIG: Record<TipoEventoAnimal, TipoVisualConfig> = {
  ENTRADA: {
    icon: LogIn,
    iconBg:
      'bg-emerald-100 text-emerald-700 ring-emerald-200/70 dark:bg-emerald-950/50 dark:text-emerald-400 dark:ring-emerald-900/60',
    badgeClass:
      'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400',
  },
  SAIDA: {
    icon: LogOut,
    iconBg:
      'bg-amber-100 text-amber-700 ring-amber-200/70 dark:bg-amber-950/50 dark:text-amber-400 dark:ring-amber-900/60',
    badgeClass:
      'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400',
  },
  MEDICO: {
    icon: Stethoscope,
    iconBg:
      'bg-blue-100 text-blue-700 ring-blue-200/70 dark:bg-blue-950/50 dark:text-blue-400 dark:ring-blue-900/60',
    badgeClass:
      'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400',
  },
  FOTO: {
    icon: Camera,
    iconBg:
      'bg-purple-100 text-purple-700 ring-purple-200/70 dark:bg-purple-950/50 dark:text-purple-400 dark:ring-purple-900/60',
    badgeClass:
      'bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400',
  },
  OUTRO: {
    icon: FileText,
    iconBg:
      'bg-orange-100 text-orange-700 ring-orange-200/70 dark:bg-orange-950/50 dark:text-orange-400 dark:ring-orange-900/60',
    badgeClass:
      'bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400',
  },
};

const MOTIVO_SAIDA_BADGE: Record<MotivoSaidaAnimal, string> = {
  ADOCAO: 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400',
  TRANSFERENCIA:
    'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400',
  OBITO: 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
};

const FILTER_OPTIONS: { value: 'ALL' | TipoEventoAnimal; label: string }[] = [
  { value: 'ALL', label: 'Todos' },
  { value: 'MEDICO', label: 'Médico' },
  { value: 'ENTRADA', label: 'Entrada' },
  { value: 'SAIDA', label: 'Saída' },
  { value: 'FOTO', label: 'Fotos' },
  { value: 'OUTRO', label: 'Outros' },
];

function formatEventDateTime(isoValue?: string | null): string {
  if (!isoValue) return '-';
  const date = new Date(isoValue);
  if (Number.isNaN(date.getTime())) return '-';

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function isImageDocument(evento: EventoAnimal): boolean {
  if (!evento.documentoUrl) return false;
  if (evento.documentoTipo?.startsWith('image/')) return true;
  if (!evento.documentoTipo && evento.tipo === 'FOTO') return true;
  if (
    !evento.documentoTipo &&
    /\.(jpe?g|png|gif|webp|avif|svg)(\?.*)?$/i.test(evento.documentoUrl)
  ) {
    return true;
  }
  return false;
}

interface AnimalTimelineProps {
  eventos?: EventoAnimal[];
  showFilter?: boolean;
  compact?: boolean;
}

export function AnimalTimeline({
  eventos = [],
  showFilter = false,
  compact = false,
}: AnimalTimelineProps) {
  const [selectedType, setSelectedType] = useState<'ALL' | TipoEventoAnimal>('ALL');
  const [lightboxEvent, setLightboxEvent] = useState<EventoAnimal | null>(null);

  const sortedEventos = useMemo(() => {
    return [...eventos].sort((a, b) => {
      const dateA = new Date(a.data || a.dataEvento || a.criadoEm).getTime();
      const dateB = new Date(b.data || b.dataEvento || b.criadoEm).getTime();
      return dateB - dateA;
    });
  }, [eventos]);

  const filteredEventos = useMemo(() => {
    if (!showFilter || selectedType === 'ALL') {
      return sortedEventos;
    }
    return sortedEventos.filter((ev) => ev.tipo === selectedType);
  }, [sortedEventos, showFilter, selectedType]);

  return (
    <div className="space-y-4">
      {showFilter && sortedEventos.length > 0 && (
        <div
          role="group"
          aria-label="Filtrar eventos por categoria"
          className="flex flex-wrap items-center gap-1.5"
        >
          {FILTER_OPTIONS.map((option) => {
            const count =
              option.value === 'ALL'
                ? sortedEventos.length
                : sortedEventos.filter((ev) => ev.tipo === option.value).length;

            if (option.value !== 'ALL' && count === 0) {
              return null;
            }

            const isActive = selectedType === option.value;

            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={isActive}
                onClick={() => setSelectedType(option.value)}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors',
                  isActive
                    ? 'border-orange-600/30 bg-orange-100 text-orange-800 dark:border-orange-500/30 dark:bg-orange-950/50 dark:text-orange-300'
                    : 'border-border bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                <span>{option.label}</span>
                <span className="rounded-full bg-background/80 px-1.5 py-0.2 text-[10px] font-semibold">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {filteredEventos.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border py-8 text-center text-muted-foreground">
          <Clock className="size-7 opacity-35" />
          <p className="text-sm font-medium">
            {sortedEventos.length === 0
              ? 'Nenhum evento registrado na linha do tempo.'
              : 'Nenhum evento encontrado nesta categoria.'}
          </p>
        </div>
      ) : (
        <ol className="relative ml-4 border-l-2 border-border pl-6 space-y-5">
          {filteredEventos.map((evento) => {
            const config = TIPO_CONFIG[evento.tipo] ?? TIPO_CONFIG.OUTRO;
            const Icon = config.icon;
            const isImage = isImageDocument(evento);
            const isPdf =
              evento.documentoTipo === 'application/pdf' ||
              /\.pdf(\?.*)?$/i.test(evento.documentoUrl ?? '');

            return (
              <li key={evento.id} className="relative">
                <span
                  className={cn(
                    'absolute -left-[37px] top-0.5 flex size-7 items-center justify-center rounded-full ring-4 ring-card',
                    config.iconBg,
                  )}
                >
                  <Icon className="size-3.5" />
                </span>

                <div
                  className={cn(
                    'rounded-xl border border-border bg-muted/25 transition-colors hover:bg-muted/40',
                    compact ? 'p-3' : 'p-4',
                  )}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Badge
                        className={cn(
                          'h-auto rounded-full border-transparent px-2.5 py-0.5 text-[11px] font-semibold',
                          config.badgeClass,
                        )}
                      >
                        {TIPO_EVENTO_LABELS[evento.tipo] ?? evento.tipo}
                      </Badge>

                      {evento.tipo === 'SAIDA' && evento.motivoSaida && (
                        <Badge
                          className={cn(
                            'h-auto rounded-full border-transparent px-2.5 py-0.5 text-[11px] font-semibold',
                            MOTIVO_SAIDA_BADGE[evento.motivoSaida] ??
                              'bg-muted text-foreground',
                          )}
                        >
                          {MOTIVO_SAIDA_LABELS[evento.motivoSaida] ??
                            evento.motivoSaida}
                        </Badge>
                      )}

                      {evento.automatico && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                          <Sparkles className="size-2.5 text-orange-500" />
                          Automático
                        </span>
                      )}
                    </div>

                    <time
                      dateTime={evento.data || evento.dataEvento}
                      className="font-mono text-[11px] text-muted-foreground"
                    >
                      {formatEventDateTime(evento.data || evento.dataEvento)}
                    </time>
                  </div>

                  <p
                    className={cn(
                      'mt-2 whitespace-pre-line text-foreground',
                      compact ? 'text-xs' : 'text-sm',
                    )}
                  >
                    {evento.descricao}
                  </p>

                  {evento.documentoUrl && (
                    <div className="mt-3">
                      {isImage ? (
                        <button
                          type="button"
                          onClick={() => setLightboxEvent(evento)}
                          className="group relative inline-flex items-center gap-3 overflow-hidden rounded-lg border border-border bg-background p-1.5 pr-3 text-left transition hover:border-orange-500/50 hover:shadow-xs"
                        >
                          <div className="relative size-14 shrink-0 overflow-hidden rounded-md bg-muted">
                            <Image
                              src={evento.documentoUrl}
                              alt={evento.documentoNome || evento.descricao}
                              fill
                              sizes="56px"
                              unoptimized
                              className="object-cover transition-transform duration-200 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/0 text-white opacity-0 transition group-hover:bg-black/35 group-hover:opacity-100">
                              <ZoomIn className="size-4" />
                            </div>
                          </div>
                          <div className="min-w-0">
                            <p className="max-w-52 truncate text-xs font-medium text-foreground">
                              {evento.documentoNome || 'Imagem comprobatória'}
                            </p>
                            <p className="text-[11px] text-orange-600 dark:text-orange-400">
                              Clique para ampliar
                            </p>
                          </div>
                        </button>
                      ) : (
                        <a
                          href={evento.documentoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground transition hover:border-orange-500/50 hover:bg-orange-50/50 hover:text-orange-700 dark:hover:bg-orange-950/20 dark:hover:text-orange-400"
                        >
                          <FileDown className="size-4 shrink-0 text-orange-600 dark:text-orange-400" />
                          <span className="max-w-60 truncate">
                            {evento.documentoNome || 'Abrir comprovante'}
                          </span>
                          <span className="text-muted-foreground">·</span>
                          <span className="inline-flex items-center gap-1 text-orange-600 dark:text-orange-400">
                            {isPdf ? 'Ver documento / Baixar PDF' : 'Ver documento'}
                            <ExternalLink className="size-3" />
                          </span>
                        </a>
                      )}
                    </div>
                  )}

                  {evento.criadoPor?.nome && (
                    <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <User className="size-3 shrink-0" />
                      <span>Registrado por {evento.criadoPor.nome}</span>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      )}

      <Dialog
        open={Boolean(lightboxEvent)}
        onOpenChange={(open) => {
          if (!open) setLightboxEvent(null);
        }}
      >
        <DialogContent className="max-w-3xl overflow-hidden rounded-2xl p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="truncate text-base">
              {lightboxEvent?.documentoNome || 'Registro fotográfico / Comprovante'}
            </DialogTitle>
            <DialogDescription>
              {lightboxEvent
                ? `${formatEventDateTime(lightboxEvent.data || lightboxEvent.dataEvento)} — ${lightboxEvent.descricao}`
                : ''}
            </DialogDescription>
          </DialogHeader>

          {lightboxEvent?.documentoUrl && (
            <div className="space-y-4">
              <div className="relative h-[55vh] w-full overflow-hidden rounded-xl border border-border bg-muted/40">
                <Image
                  src={lightboxEvent.documentoUrl}
                  alt={lightboxEvent.documentoNome || lightboxEvent.descricao}
                  fill
                  sizes="(max-width: 768px) 100vw, 768px"
                  unoptimized
                  className="object-contain"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLightboxEvent(null)}
                >
                  Fechar
                </Button>
                <Button asChild variant="primary">
                  <a
                    href={lightboxEvent.documentoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="size-4" />
                    Abrir original
                  </a>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
