import { apiDownload } from '@/lib/api';

export type TipoRelatorio = 'animais' | 'acolhedores' | 'doacoes';

export type EspecieAnimalRelatorio = 'CAO' | 'GATO';

export interface FiltrosRelatorio {
  /** Datas no formato `YYYY-MM-DD` (dia local). Vazio = todo o histórico. */
  de?: string;
  ate?: string;
  especie?: EspecieAnimalRelatorio;
}

// Converte o dia local em instante UTC: o período cobre o dia inteiro no
// fuso de quem gerou o relatório.
function inicioDoDia(data?: string) {
  return data ? new Date(`${data}T00:00:00`).toISOString() : undefined;
}

function fimDoDia(data?: string) {
  return data ? new Date(`${data}T23:59:59.999`).toISOString() : undefined;
}

function salvarArquivo(blob: Blob, nome: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = nome;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export async function baixarRelatorio(tipo: TipoRelatorio, filtros: FiltrosRelatorio): Promise<void> {
  const pdf = await apiDownload(`/relatorios/${tipo}`, {
    de: inicioDoDia(filtros.de),
    ate: fimDoDia(filtros.ate),
    ...(tipo === 'animais' && { especie: filtros.especie }),
  });

  const sufixoPeriodo = filtros.de || filtros.ate ? `-${filtros.de ?? 'inicio'}-a-${filtros.ate ?? 'hoje'}` : '';
  salvarArquivo(pdf, `relatorio-${tipo}${sufixoPeriodo}.pdf`);
}
