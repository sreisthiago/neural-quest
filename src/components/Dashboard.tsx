// ═══════════════════════════════════════════════════════════════
// Neural Quest V5.0 — Dashboard Central
// Visualização do DNA Operacional e métricas em tempo real
// ═══════════════════════════════════════════════════════════════

import { Activity, Brain, Shield, Eye, TrendingUp, Zap } from 'lucide-react';
import type { OperationalDNA, CognitiveMetric, AnomalyReport } from '../engine';
import DNARadar from './DNARadar';

interface DashboardProps {
  dna: OperationalDNA | null;
  metrics: Record<string, CognitiveMetric> | null;
  anomalies: AnomalyReport[];
  missionsCompleted: number;
  eventCount: number;
}

function MetricCard({
  icon: Icon,
  label,
  value,
  color,
  subtitle,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number | null;
  color: string;
  subtitle: string;
}) {
  const val = value ?? 0;
  const barColor =
    val >= 70
      ? 'bg-emerald-500'
      : val >= 40
        ? 'bg-amber-500'
        : 'bg-red-500';

  return (
    <div className="rounded-xl border border-gray-700/50 bg-gray-800/50 p-4">
      <div className="mb-3 flex items-center gap-2">
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${color}`}>
          <Icon className="h-4 w-4 text-white" />
        </div>
        <div>
          <p className="text-xs font-medium text-gray-400">{label}</p>
          <p className="text-xs text-gray-600">{subtitle}</p>
        </div>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-3xl font-bold text-white">
          {value !== null ? value.toFixed(1) : '—'}
        </span>
        <span className="mb-1 text-xs text-gray-500">/100</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-700">
        <div
          className={`h-full rounded-full ${barColor} transition-all duration-1000`}
          style={{ width: `${val}%` }}
        />
      </div>
    </div>
  );
}

export default function Dashboard({
  dna,
  metrics: _metrics,
  anomalies,
  missionsCompleted,
  eventCount,
}: DashboardProps) {
  void _metrics; // Reservado para expansões futuras
  const ld = dna?.latency_decision ?? 0;
  const ra = dna?.resilience_adaptive ?? 0;
  const ta = dna?.tolerance_ambiguity ?? 0;

  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          {
            icon: Brain,
            label: 'Missões',
            value: missionsCompleted,
            color: 'text-violet-400',
          },
          {
            icon: Activity,
            label: 'Eventos',
            value: eventCount,
            color: 'text-cyan-400',
          },
          {
            icon: Shield,
            label: 'Anomalias',
            value: anomalies.length,
            color: anomalies.length > 0 ? 'text-red-400' : 'text-emerald-400',
          },
          {
            icon: TrendingUp,
            label: 'DNA Score',
            value: dna ? Math.round((ld + ra + ta) / 3) : 0,
            color: 'text-amber-400',
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-gray-700/50 bg-gray-800/50 p-3"
          >
            <div className="flex items-center gap-2">
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
              <span className="text-xs text-gray-400">{stat.label}</span>
            </div>
            <p className="mt-1 text-2xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {!dna ? (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-gray-700 py-16 text-center">
          <Eye className="h-12 w-12 text-gray-700" />
          <div>
            <p className="text-lg font-medium text-gray-400">
              Nenhuma telemetria processada
            </p>
            <p className="text-sm text-gray-600">
              Complete uma missão para revelar seu DNA Operacional
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* DNA Radar */}
          <div className="flex flex-col items-center rounded-xl border border-gray-700/50 bg-gray-800/30 p-6">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-300">
              <Zap className="h-4 w-4 text-violet-400" />
              DNA Operacional
            </h3>
            <DNARadar ld={ld} ra={ra} ta={ta} size={220} />
            <p className="mt-4 text-center text-xs leading-relaxed text-gray-500">
              Mapeamento Neuro-Intuitivo gerado por telemetria comportamental
              involuntária. Este perfil é único e infalsificável.
            </p>
          </div>

          {/* Metric Cards */}
          <div className="grid gap-3">
            <MetricCard
              icon={Zap}
              label="Latência de Decisão"
              value={dna.latency_decision}
              color="bg-cyan-600"
              subtitle="Velocidade de processamento sob pressão"
            />
            <MetricCard
              icon={Shield}
              label="Resiliência Adaptativa"
              value={dna.resilience_adaptive}
              color="bg-emerald-600"
              subtitle="Recuperação e aprendizado com erro"
            />
            <MetricCard
              icon={Eye}
              label="Tolerância à Ambiguidade"
              value={dna.tolerance_ambiguity}
              color="bg-amber-600"
              subtitle="Performance em cenários incertos"
            />
          </div>
        </div>
      )}

      {/* DNA History */}
      {dna && dna.history.length > 1 && (
        <div className="rounded-xl border border-gray-700/50 bg-gray-800/30 p-4">
          <h3 className="mb-3 text-sm font-semibold text-gray-300">
            Evolução do DNA Operacional
          </h3>
          <div className="flex items-end gap-1" style={{ height: 80 }}>
            {dna.history.map((snap, i) => {
              const avg =
                ((snap.LD ?? 0) + (snap.RA ?? 0) + (snap.TA ?? 0)) / 3;
              return (
                <div
                  key={i}
                  className="flex-1 rounded-t bg-gradient-to-t from-violet-600 to-indigo-500 transition-all"
                  style={{ height: `${avg}%` }}
                  title={`Missão ${i + 1}: Score médio ${avg.toFixed(1)}`}
                />
              );
            })}
          </div>
          <div className="mt-1 flex justify-between text-xs text-gray-600">
            <span>Missão 1</span>
            <span>Missão {dna.history.length}</span>
          </div>
        </div>
      )}
    </div>
  );
}
