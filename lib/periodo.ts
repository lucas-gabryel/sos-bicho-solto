export interface Periodo {
  /** `YYYY-MM-DD` (dia local); vazio = sem limite. */
  de: string;
  ate: string;
}

export type PresetPeriodo = 'mes-atual' | 'mes-anterior' | 'ultimos-90' | 'ano-atual' | 'tudo';

export const PRESETS_PERIODO: { id: PresetPeriodo; label: string }[] = [
  { id: 'mes-atual', label: 'Este mês' },
  { id: 'mes-anterior', label: 'Mês anterior' },
  { id: 'ultimos-90', label: 'Últimos 90 dias' },
  { id: 'ano-atual', label: 'Este ano' },
  { id: 'tudo', label: 'Todo o histórico' },
];

function paraIso(data: Date) {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

export function calcularPeriodo(preset: PresetPeriodo, hoje = new Date()): Periodo {
  const ano = hoje.getFullYear();
  const mes = hoje.getMonth();

  switch (preset) {
    case 'mes-atual':
      return { de: paraIso(new Date(ano, mes, 1)), ate: paraIso(hoje) };
    case 'mes-anterior':
      return { de: paraIso(new Date(ano, mes - 1, 1)), ate: paraIso(new Date(ano, mes, 0)) };
    case 'ultimos-90':
      return { de: paraIso(new Date(ano, mes, hoje.getDate() - 89)), ate: paraIso(hoje) };
    case 'ano-atual':
      return { de: paraIso(new Date(ano, 0, 1)), ate: paraIso(hoje) };
    case 'tudo':
      return { de: '', ate: '' };
  }
}
