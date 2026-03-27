// ═══════════════════════════════════════════════════════════════
// Neural Quest V5.0 — Bureau de Talentos (B2B)
// Match de Performance + DNA Operacional como portfólio
// ═══════════════════════════════════════════════════════════════

import { useState, useRef } from 'react';
import {
  Briefcase, Target, Award, Users,
  ChevronRight, Zap, Shield, Eye, Star,
} from 'lucide-react';
import type { OperationalDNA, PerformanceMatch, JobPosting } from '../engine';
import { PowerUpTrailEngine } from '../engine';

// ── Vagas simuladas ────────────────────────────────────────────

const SAMPLE_JOBS: JobPosting[] = [
  {
    vaga_id: 'vaga_001',
    title: 'Líder de Operações de Crise',
    company: 'Nexus Industries',
    required_ld: 70,
    required_ra: 75,
    required_ta: 65,
    required_trails: ['trail_gestao_crise'],
    description:
      'Buscamos alguém com alta resiliência e capacidade de decisão rápida sob pressão extrema.',
  },
  {
    vaga_id: 'vaga_002',
    title: 'Analista de Lógica Computacional',
    company: 'CyberForge Labs',
    required_ld: 80,
    required_ra: 50,
    required_ta: 60,
    required_trails: ['trail_logica_booleana'],
    description:
      'Precisamos de raciocínio lógico afiado e velocidade de processamento acima da média.',
  },
  {
    vaga_id: 'vaga_003',
    title: 'Especialista em Compliance e Segurança',
    company: 'SafeGuard Corp',
    required_ld: 60,
    required_ra: 70,
    required_ta: 80,
    required_trails: ['trail_compliance_nr1'],
    description:
      'Capacidade de navegar ambiguidades regulatórias e manter conformidade sob mudança constante.',
  },
  {
    vaga_id: 'vaga_004',
    title: 'Gestor de Inovação Multidisciplinar',
    company: 'Horizon Ventures',
    required_ld: 65,
    required_ra: 80,
    required_ta: 85,
    required_trails: ['trail_gestao_crise', 'trail_logica_booleana'],
    description:
      'Perfil que combina pensamento lógico com alta tolerância à incerteza e capacidade de pivotagem.',
  },
];

// ── Match Card ─────────────────────────────────────────────────

function MatchCard({ match }: { match: PerformanceMatch }) {
  const scoreColor =
    match.match_score >= 80
      ? 'text-emerald-400'
      : match.match_score >= 60
        ? 'text-amber-400'
        : 'text-red-400';

  const scoreBg =
    match.match_score >= 80
      ? 'from-emerald-500/20 to-emerald-500/5'
      : match.match_score >= 60
        ? 'from-amber-500/20 to-amber-500/5'
        : 'from-red-500/20 to-red-500/5';

  return (
    <div className="rounded-xl border border-gray-700/50 bg-gray-800/30 p-4 transition-all hover:border-gray-600">
      <div className="flex items-start gap-4">
        {/* Score */}
        <div
          className={`flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-gradient-to-br ${scoreBg}`}
        >
          <span className={`text-2xl font-black ${scoreColor}`}>
            {match.match_score}
          </span>
          <span className="text-[9px] text-gray-500">MATCH</span>
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-white">{match.vaga_title}</h4>
          <p className="text-xs text-gray-500">{match.company}</p>

          {/* Breakdown */}
          <div className="mt-3 grid grid-cols-4 gap-2">
            {[
              { label: 'LD', value: match.breakdown.ld_match, icon: Zap, color: 'text-cyan-400' },
              { label: 'RA', value: match.breakdown.ra_match, icon: Shield, color: 'text-emerald-400' },
              { label: 'TA', value: match.breakdown.ta_match, icon: Eye, color: 'text-amber-400' },
              { label: 'Trilhas', value: match.breakdown.trail_relevance, icon: Award, color: 'text-violet-400' },
            ].map((b) => (
              <div key={b.label} className="text-center">
                <b.icon className={`mx-auto h-3 w-3 ${b.color}`} />
                <p className="text-[10px] text-gray-600">{b.label}</p>
                <p className="text-xs font-bold text-gray-300">{b.value}%</p>
              </div>
            ))}
          </div>

          {match.proven_trails.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {match.proven_trails.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-violet-500/20 px-2 py-0.5 text-[10px] text-violet-300"
                >
                  ✅ {t.replace('trail_', '').replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Bureau de Talentos ─────────────────────────────────────────

interface BureauTalentosProps {
  dna: OperationalDNA | null;
  completedTrailIds: string[];
}

export default function BureauTalentos({
  dna,
  completedTrailIds,
}: BureauTalentosProps) {
  const [matches, setMatches] = useState<PerformanceMatch[]>([]);
  const [isMatching, setIsMatching] = useState(false);
  const engineRef = useRef(new PowerUpTrailEngine());

  const runMatching = () => {
    if (!dna) return;
    setIsMatching(true);

    setTimeout(() => {
      const results = SAMPLE_JOBS.map((job) =>
        engineRef.current.generateMatchScore(job, dna, completedTrailIds)
      ).sort((a, b) => b.match_score - a.match_score);

      setMatches(results);
      setIsMatching(false);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-cyan-400" />
          <h2 className="text-lg font-bold text-white">Bureau de Talentos</h2>
        </div>
        <p className="mt-1 text-sm text-gray-400">
          Seu DNA Operacional é seu portfólio. O RH não compra um currículo que
          diz "Sei Excel" — ele compra um <strong className="text-violet-300">Match de Performance</strong> comprovado
          por telemetria comportamental.
        </p>
      </div>

      {/* DNA Preview */}
      {dna ? (
        <div className="rounded-xl border border-gray-700/40 bg-gray-800/30 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Target className="h-4 w-4 text-violet-400" />
            <span className="text-xs font-semibold text-gray-300">
              Seu Perfil no Bureau
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Latência de Decisão', value: dna.latency_decision, icon: Zap, color: 'text-cyan-400' },
              { label: 'Resiliência Adaptativa', value: dna.resilience_adaptive, icon: Shield, color: 'text-emerald-400' },
              { label: 'Tolerância à Ambiguidade', value: dna.tolerance_ambiguity, icon: Eye, color: 'text-amber-400' },
            ].map((m) => (
              <div key={m.label} className="rounded-lg bg-gray-800/60 p-3 text-center">
                <m.icon className={`mx-auto h-4 w-4 ${m.color}`} />
                <p className="mt-1 text-[10px] text-gray-500">{m.label}</p>
                <p className="text-xl font-bold text-white">
                  {m.value?.toFixed(1) ?? '—'}
                </p>
              </div>
            ))}
          </div>
          {completedTrailIds.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {completedTrailIds.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] text-emerald-300"
                >
                  🏆 {t.replace('trail_', '').replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          )}

          <button
            onClick={runMatching}
            disabled={isMatching}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02] hover:shadow-cyan-500/30 disabled:opacity-50"
          >
            {isMatching ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Processando Match...
              </>
            ) : (
              <>
                <Users className="h-4 w-4" />
                Gerar Match de Performance
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-gray-700 py-12">
          <Target className="h-10 w-10 text-gray-700" />
          <p className="text-sm text-gray-400">
            Complete missões e trilhas para gerar seu perfil no Bureau
          </p>
        </div>
      )}

      {/* Match Results */}
      {matches.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-gray-300">
              Resultados do Match
            </h3>
            <span className="rounded-full bg-cyan-500/20 px-2 py-0.5 text-xs text-cyan-300">
              {matches.length} vagas analisadas
            </span>
          </div>

          <div className="grid gap-3">
            {matches.map((m) => (
              <MatchCard key={m.match_id} match={m} />
            ))}
          </div>

          <div className="rounded-lg border border-gray-700/30 bg-gray-800/20 p-3">
            <p className="text-xs text-gray-500 leading-relaxed">
              💰 <strong className="text-gray-400">Monetização B2B:</strong> Taxa de
              "Sucesso de Match" + acesso ao banco de talentos pré-validados.
              O RH paga pela certeza — não por currículos decorados.
            </p>
          </div>
        </div>
      )}

      {/* Vagas disponíveis */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-400">
          Vagas Disponíveis no Nexus
        </h3>
        {SAMPLE_JOBS.map((job) => (
          <div
            key={job.vaga_id}
            className="rounded-lg border border-gray-700/30 bg-gray-800/20 p-3"
          >
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-300">
                {job.title}
              </span>
              <ChevronRight className="ml-auto h-3 w-3 text-gray-600" />
            </div>
            <p className="mt-1 text-xs text-gray-500">{job.company}</p>
            <p className="mt-1 text-xs text-gray-600">{job.description}</p>
            <div className="mt-2 flex gap-2">
              <span className="text-[10px] text-cyan-500">LD≥{job.required_ld}</span>
              <span className="text-[10px] text-emerald-500">RA≥{job.required_ra}</span>
              <span className="text-[10px] text-amber-500">TA≥{job.required_ta}</span>
            </div>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
        <h3 className="mb-2 text-sm font-semibold text-violet-300">
          Como funciona o Bureau
        </h3>
        <div className="grid gap-2 sm:grid-cols-3">
          {[
            {
              step: '1',
              title: 'Complete Trilhas',
              desc: 'Cada curso é uma mineração de dados para seu perfil no Nexus.',
            },
            {
              step: '2',
              title: 'DNA Validado',
              desc: 'Os dados dos 6 testes alimentam seu DNA Operacional comprovado.',
            },
            {
              step: '3',
              title: 'Match Automático',
              desc: 'O RH recebe candidatos com performance provada, não currículos.',
            },
          ].map((s) => (
            <div key={s.step} className="rounded-lg bg-black/20 p-3">
              <div className="mb-1 flex h-6 w-6 items-center justify-center rounded-full bg-violet-500/30 text-xs font-bold text-violet-300">
                {s.step}
              </div>
              <p className="text-xs font-medium text-white">{s.title}</p>
              <p className="mt-0.5 text-[11px] text-gray-500">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
