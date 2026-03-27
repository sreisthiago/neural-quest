// ═══════════════════════════════════════════════════════════════
// Neural Quest V5.0 — Painel de Codex Digitais
// Sugestões de desenvolvimento baseadas na telemetria
// ═══════════════════════════════════════════════════════════════

import { BookOpen, ExternalLink, Sparkles } from 'lucide-react';
import type { CodexDigital } from '../engine';

const METRIC_COLORS: Record<string, string> = {
  LD: 'from-cyan-500 to-blue-600',
  RA: 'from-emerald-500 to-teal-600',
  TA: 'from-amber-500 to-orange-600',
};

const METRIC_LABELS: Record<string, string> = {
  LD: 'Latência de Decisão',
  RA: 'Resiliência Adaptativa',
  TA: 'Tolerância à Ambiguidade',
};

interface CodexPanelProps {
  codex: CodexDigital[];
}

export default function CodexPanel({ codex }: CodexPanelProps) {
  if (codex.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-gray-700 py-16">
        <BookOpen className="h-12 w-12 text-gray-700" />
        <p className="text-sm text-gray-400">Nenhum Codex sugerido ainda</p>
        <p className="text-xs text-gray-600">
          Complete missões para revelar lacunas cognitivas e receber sugestões
          personalizadas de desenvolvimento
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-amber-400" />
        <h3 className="text-sm font-semibold text-gray-300">
          Codex Digitais Recomendados
        </h3>
        <span className="rounded-full bg-violet-500/20 px-2 py-0.5 text-xs text-violet-300">
          {codex.length} sugestões
        </span>
      </div>

      <p className="text-xs leading-relaxed text-gray-500">
        Baseado no seu DNA Operacional, estes Codex (livros digitais com ISBN)
        foram selecionados para preencher as lacunas identificadas pela
        telemetria. O faturamento por livros garante imunidade tributária.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        {codex.map((c) => {
          const gradient = METRIC_COLORS[c.suggested_by_metric] ?? 'from-gray-500 to-gray-600';
          return (
            <div
              key={c.codex_id}
              className="group rounded-xl border border-gray-700/50 bg-gray-800/30 p-4 transition-all hover:border-violet-500/30 hover:bg-gray-800/60"
            >
              <div className="mb-3 flex items-start justify-between">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${gradient}`}
                >
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <span className="rounded-full bg-gray-700/50 px-2 py-0.5 text-xs text-gray-400">
                  {METRIC_LABELS[c.suggested_by_metric] ??
                    c.suggested_by_metric}
                </span>
              </div>
              <h4 className="mb-1 text-sm font-semibold text-white">
                {c.title}
              </h4>
              <p className="text-xs leading-relaxed text-gray-400">
                {c.description}
              </p>
              <button className="mt-3 flex items-center gap-1 text-xs font-medium text-violet-400 transition-colors hover:text-violet-300">
                <ExternalLink className="h-3 w-3" />
                Acessar Codex
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
