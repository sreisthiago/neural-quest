// ═══════════════════════════════════════════════════════════════
// Neural Quest V5.0 — Log de Anomalias (ISN)
// Camada de Inviolabilidade do Sistema Neural
// ═══════════════════════════════════════════════════════════════

import { ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';
import type { AnomalyReport } from '../engine';

const ANOMALY_LABELS: Record<string, string> = {
  superhuman_speed: 'Velocidade Sobre-Humana',
  inhuman_reaction_time: 'Tempo de Reação Impossível',
  edge_detected_script: 'Script Detectado (Edge)',
  suspicious_improvement_possible_account_sharing: 'Possível Account Sharing',
  severe_cognitive_fatigue: 'Fadiga Cognitiva Severa',
};

const SEVERITY_STYLES = {
  high: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400', icon: ShieldAlert },
  medium: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400', icon: AlertTriangle },
  low: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', icon: ShieldCheck },
};

interface AnomalyLogProps {
  anomalies: AnomalyReport[];
}

export default function AnomalyLog({ anomalies }: AnomalyLogProps) {
  if (anomalies.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-gray-700 py-16">
        <ShieldCheck className="h-12 w-12 text-emerald-500/50" />
        <p className="text-sm text-gray-400">
          Nenhuma anomalia detectada. Sistema limpo.
        </p>
        <p className="text-xs text-gray-600">
          O ISN (Inviolabilidade do Sistema Neural) monitora continuamente
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <ShieldAlert className="h-5 w-5 text-red-400" />
        <h3 className="text-sm font-semibold text-gray-300">
          {anomalies.length} anomalia(s) detectada(s)
        </h3>
      </div>

      {anomalies.map((anomaly, i) => {
        const style = SEVERITY_STYLES[anomaly.severity];
        const Icon = style.icon;

        return (
          <div
            key={i}
            className={`rounded-xl border ${style.border} ${style.bg} p-4`}
          >
            <div className="flex items-start gap-3">
              <Icon className={`mt-0.5 h-5 w-5 ${style.text}`} />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className={`text-sm font-medium ${style.text}`}>
                    {ANOMALY_LABELS[anomaly.anomaly_type] ??
                      anomaly.anomaly_type}
                  </p>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${style.bg} ${style.text}`}
                  >
                    {anomaly.severity.toUpperCase()}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-400">
                  Score: {(anomaly.score * 100).toFixed(0)}% • Sessão:{' '}
                  {anomaly.session_id.slice(-8)}
                </p>
                <div className="mt-2 rounded-lg bg-black/20 p-2">
                  <pre className="text-xs text-gray-500">
                    {JSON.stringify(anomaly.details, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
