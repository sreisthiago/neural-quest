// ═══════════════════════════════════════════════════════════════
// Neural Quest V5.0 — Dashboard Escolar (B2B2C)
// Raio-X Cognitivo para escolas e pais
// ═══════════════════════════════════════════════════════════════

import { useState } from 'react';
import {
  GraduationCap, Users, Brain, AlertTriangle, BookOpen,
  TrendingUp, Zap, Shield, Eye, ChevronDown, ChevronUp,
  Heart, Clock,
} from 'lucide-react';
import type { OperationalDNA } from '../engine';
import DNARadar from './DNARadar';

// ── Mock Data ──────────────────────────────────────────────────

interface MockStudent {
  id: string;
  name: string;
  avatar: string;
  grade: string;
  ld: number;
  ra: number;
  ta: number;
  saturation_min: number;
  weak_areas: string[];
  strong_areas: string[];
  insight: string;
  codex_suggestion: string;
}

const MOCK_STUDENTS: MockStudent[] = [
  {
    id: 'stu_01',
    name: 'Ana Beatriz',
    avatar: '👧',
    grade: '9A',
    ld: 78,
    ra: 65,
    ta: 82,
    saturation_min: 25,
    weak_areas: ['Resiliência em Física'],
    strong_areas: ['Tolerância à Ambiguidade', 'Raciocínio Lógico'],
    insight: 'Alta TA demonstra capacidade de navegar problemas abertos. RA moderada sugere dificuldade em se recuperar de erros em exatas.',
    codex_suggestion: 'Codex de Estratégias de Recuperação para Exatas',
  },
  {
    id: 'stu_02',
    name: 'Carlos Eduardo',
    avatar: '👦',
    grade: '9A',
    ld: 52,
    ra: 88,
    ta: 45,
    saturation_min: 15,
    weak_areas: ['Latência de Decisão', 'Tolerância à Ambiguidade'],
    strong_areas: ['Resiliência Adaptativa', 'Persistência'],
    insight: 'Não é "ruim em matemática" — atinge saturação sensorial após 15 minutos. Alta RA mostra que quando retoma, aprende rápido.',
    codex_suggestion: 'Codex de Concentração e Gestão de Energia Cognitiva',
  },
  {
    id: 'stu_03',
    name: 'Daniela Silva',
    avatar: '👧',
    grade: '9A',
    ld: 91,
    ra: 73,
    ta: 68,
    saturation_min: 35,
    weak_areas: ['Atividades colaborativas'],
    strong_areas: ['Velocidade de Decisão', 'Foco sob Pressão'],
    insight: 'Excelente LD indica processamento rápido. Pode beneficiar-se de desafios mais complexos para manter engajamento.',
    codex_suggestion: 'Codex de Liderança e Colaboração',
  },
  {
    id: 'stu_04',
    name: 'Felipe Santos',
    avatar: '👦',
    grade: '9A',
    ld: 44,
    ra: 41,
    ta: 77,
    saturation_min: 20,
    weak_areas: ['Decisão sob pressão', 'Recuperação de erros'],
    strong_areas: ['Pensamento divergente', 'Criatividade'],
    insight: 'Perfil criativo com alta TA, mas precisa de suporte em estruturação do raciocínio e gestão de pressão temporal.',
    codex_suggestion: 'Codex de Tomada de Decisão Estruturada',
  },
  {
    id: 'stu_05',
    name: 'Gabriela Lima',
    avatar: '👧',
    grade: '9A',
    ld: 85,
    ra: 82,
    ta: 90,
    saturation_min: 40,
    weak_areas: [],
    strong_areas: ['Todos os eixos cognitivos', 'Liderança natural'],
    insight: 'Perfil excepcional em todos os eixos. Candidata a programa de aceleração e mentoria de pares.',
    codex_suggestion: 'Codex Avançado de Pensamento Sistêmico',
  },
];

// ── Student Card ───────────────────────────────────────────────

function StudentCard({ student, expanded, onToggle }: {
  student: MockStudent;
  expanded: boolean;
  onToggle: () => void;
}) {
  const avgScore = Math.round((student.ld + student.ra + student.ta) / 3);
  const scoreColor = avgScore >= 70 ? 'text-emerald-400' : avgScore >= 50 ? 'text-amber-400' : 'text-red-400';

  return (
    <div className="rounded-xl border border-gray-700/40 bg-gray-800/20 transition-all hover:border-gray-600/50">
      <button
        onClick={onToggle}
        className="flex w-full items-center gap-3 p-4 text-left"
      >
        <span className="text-2xl">{student.avatar}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white">{student.name}</p>
          <p className="text-xs text-gray-500">Turma {student.grade}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs">
            <span className="text-cyan-400">{student.ld}</span>
            <span className="text-gray-700">/</span>
            <span className="text-emerald-400">{student.ra}</span>
            <span className="text-gray-700">/</span>
            <span className="text-amber-400">{student.ta}</span>
          </div>
          <span className={`text-lg font-bold ${scoreColor}`}>{avgScore}</span>
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-gray-700/30 p-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Radar */}
            <div className="flex flex-col items-center">
              <DNARadar ld={student.ld} ra={student.ra} ta={student.ta} size={160} />
            </div>

            {/* Details */}
            <div className="space-y-3">
              {/* Metrics */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'LD', value: student.ld, icon: Zap, color: 'text-cyan-400' },
                  { label: 'RA', value: student.ra, icon: Shield, color: 'text-emerald-400' },
                  { label: 'TA', value: student.ta, icon: Eye, color: 'text-amber-400' },
                ].map((m) => (
                  <div key={m.label} className="rounded-lg bg-gray-800/50 p-2 text-center">
                    <m.icon className={`mx-auto h-3 w-3 ${m.color}`} />
                    <p className="text-[10px] text-gray-500">{m.label}</p>
                    <p className="text-sm font-bold text-white">{m.value}</p>
                  </div>
                ))}
              </div>

              {/* Saturation */}
              <div className="flex items-center gap-2 rounded-lg bg-amber-500/10 p-2">
                <Clock className="h-4 w-4 text-amber-400" />
                <div>
                  <p className="text-[10px] text-amber-300">Saturação Sensorial</p>
                  <p className="text-xs text-gray-300">
                    Atinge limiar após <strong>{student.saturation_min} minutos</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Insight */}
          <div className="rounded-lg bg-violet-500/10 border border-violet-500/20 p-3">
            <div className="flex items-center gap-2 mb-1">
              <Brain className="h-4 w-4 text-violet-400" />
              <span className="text-xs font-semibold text-violet-300">
                Raio-X Cognitivo
              </span>
            </div>
            <p className="text-xs leading-relaxed text-gray-300">
              {student.insight}
            </p>
          </div>

          {/* Areas */}
          <div className="grid gap-2 sm:grid-cols-2">
            <div>
              <p className="mb-1 text-[10px] font-medium text-emerald-400">
                ✅ Pontos Fortes
              </p>
              {student.strong_areas.map((a) => (
                <p key={a} className="text-xs text-gray-400">• {a}</p>
              ))}
            </div>
            {student.weak_areas.length > 0 && (
              <div>
                <p className="mb-1 text-[10px] font-medium text-amber-400">
                  ⚠️ Oportunidades
                </p>
                {student.weak_areas.map((a) => (
                  <p key={a} className="text-xs text-gray-400">• {a}</p>
                ))}
              </div>
            )}
          </div>

          {/* Codex Suggestion */}
          <div className="flex items-center gap-2 rounded-lg bg-gray-800/50 p-3">
            <BookOpen className="h-4 w-4 text-violet-400" />
            <div>
              <p className="text-[10px] text-gray-500">Codex Sugerido</p>
              <p className="text-xs font-medium text-violet-300">
                {student.codex_suggestion}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Dashboard Escolar ─────────────────────────────────────

interface SchoolDashboardProps {
  userDna: OperationalDNA | null;
}

export default function SchoolDashboard({ userDna }: SchoolDashboardProps) {
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'escola' | 'pais'>('escola');

  // Classroom averages
  const avgLd = Math.round(MOCK_STUDENTS.reduce((s, st) => s + st.ld, 0) / MOCK_STUDENTS.length);
  const avgRa = Math.round(MOCK_STUDENTS.reduce((s, st) => s + st.ra, 0) / MOCK_STUDENTS.length);
  const avgTa = Math.round(MOCK_STUDENTS.reduce((s, st) => s + st.ta, 0) / MOCK_STUDENTS.length);

  void userDna;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">
              Dashboard de Potencial
            </h2>
          </div>
          <p className="mt-1 text-sm text-gray-400">
            O foco sai da nota e entra na Prevenção e Estímulo cognitivo
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex rounded-lg bg-gray-800 p-0.5">
          {[
            { id: 'escola' as const, label: 'Escola', icon: Users },
            { id: 'pais' as const, label: 'Pais', icon: Heart },
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setViewMode(mode.id)}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                viewMode === mode.id
                  ? 'bg-violet-500/20 text-violet-300'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <mode.icon className="h-3 w-3" />
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {viewMode === 'escola' ? (
        <>
          {/* Classroom Insight */}
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-emerald-400" />
              <span className="text-sm font-semibold text-emerald-300">
                Insight da Turma 9A
              </span>
            </div>
            <p className="text-xs leading-relaxed text-gray-300">
              A turma apresenta <strong className="text-amber-300">alta Tolerância à Ambiguidade
              (TA média: {avgTa})</strong>, demonstrando boa capacidade para problemas abertos.
              Porém, a <strong className="text-cyan-300">Latência de Decisão (LD média: {avgLd})</strong> indica
              hesitação em decisões rápidas, especialmente no conteúdo de Física.
              Recomendação: introduzir exercícios com pressão temporal progressiva.
            </p>
          </div>

          {/* Classroom Metrics */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'LD Média', value: avgLd, icon: Zap, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
              { label: 'RA Média', value: avgRa, icon: Shield, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
              { label: 'TA Média', value: avgTa, icon: Eye, color: 'text-amber-400', bg: 'bg-amber-500/10' },
            ].map((m) => (
              <div key={m.label} className={`rounded-xl ${m.bg} border border-gray-700/30 p-4 text-center`}>
                <m.icon className={`mx-auto h-5 w-5 ${m.color}`} />
                <p className="mt-1 text-[10px] text-gray-500">{m.label}</p>
                <p className="text-2xl font-bold text-white">{m.value}</p>
              </div>
            ))}
          </div>

          {/* Recommended Adjustments */}
          <div className="rounded-xl border border-gray-700/40 bg-gray-800/20 p-4">
            <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-300">
              <TrendingUp className="h-4 w-4 text-violet-400" />
              Ajustes Pedagógicos Recomendados
            </h3>
            <div className="space-y-2">
              {[
                '📊 Introduzir exercícios com timer progressivo em Física para treinar LD',
                '🔄 Criar atividades de "segundo round" — alunos refazem exercícios errados com abordagem diferente (RA)',
                '🧩 Usar problemas abertos e projetos interdisciplinares para capitalizar a alta TA da turma',
                '⏸️ Implementar pausas cognitivas a cada 20 minutos para alunos com baixo limiar de saturação',
              ].map((adj, i) => (
                <p key={i} className="text-xs leading-relaxed text-gray-400">{adj}</p>
              ))}
            </div>
          </div>

          {/* Student List */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-300">
              Alunos — Turma 9A ({MOCK_STUDENTS.length} alunos)
            </h3>
            {MOCK_STUDENTS.map((student) => (
              <StudentCard
                key={student.id}
                student={student}
                expanded={expandedStudent === student.id}
                onToggle={() =>
                  setExpandedStudent(
                    expandedStudent === student.id ? null : student.id
                  )
                }
              />
            ))}
          </div>
        </>
      ) : (
        /* ── Visão dos Pais ── */
        <>
          <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Heart className="h-5 w-5 text-pink-400" />
              <h3 className="text-sm font-semibold text-violet-300">
                Raio-X Cognitivo do seu Filho
              </h3>
            </div>
            <p className="text-xs leading-relaxed text-gray-400 mb-4">
              Este relatório mostra como seu filho processa informações,
              toma decisões e lida com desafios — não apenas se ele "acertou ou errou".
            </p>

            {/* Example: Carlos Eduardo (the one with saturation issues) */}
            <div className="rounded-lg bg-black/30 p-4 space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">👦</span>
                <div>
                  <p className="text-sm font-bold text-white">Carlos Eduardo</p>
                  <p className="text-xs text-gray-500">Turma 9A • 14 anos</p>
                </div>
              </div>

              <div className="flex justify-center">
                <DNARadar ld={52} ra={88} ta={45} size={180} />
              </div>

              <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-3">
                <p className="text-sm font-medium text-amber-300 mb-1">
                  💡 Descoberta Importante
                </p>
                <p className="text-xs leading-relaxed text-gray-300">
                  Seu filho <strong className="text-white">não é ruim em matemática</strong>.
                  Ele atinge a <strong className="text-amber-300">saturação sensorial após 15 minutos</strong> de
                  atividade contínua. Sua Resiliência Adaptativa é{' '}
                  <strong className="text-emerald-300">excepcional (88/100)</strong>, o que
                  significa que quando retoma o estudo após uma pausa, ele aprende com
                  velocidade impressionante.
                </p>
              </div>

              <div className="rounded-lg bg-violet-500/10 border border-violet-500/20 p-3">
                <p className="text-sm font-medium text-violet-300 mb-1">
                  📚 Recomendação Personalizada
                </p>
                <p className="text-xs leading-relaxed text-gray-300">
                  Sugerimos o <strong className="text-violet-200">Codex de Concentração e
                  Gestão de Energia Cognitiva</strong>. Técnica sugerida: estudo em blocos de
                  12 minutos com pausas de 3 minutos. Aumentar progressivamente para
                  18 minutos ao longo de 4 semanas.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-emerald-500/10 p-2">
                  <p className="text-[10px] font-medium text-emerald-400">Pontos Fortes</p>
                  <p className="text-xs text-gray-300">• Resiliência excepcional</p>
                  <p className="text-xs text-gray-300">• Persistência natural</p>
                  <p className="text-xs text-gray-300">• Aprende com erros</p>
                </div>
                <div className="rounded-lg bg-amber-500/10 p-2">
                  <p className="text-[10px] font-medium text-amber-400">Oportunidades</p>
                  <p className="text-xs text-gray-300">• Gestão de atenção</p>
                  <p className="text-xs text-gray-300">• Decisão sob pressão</p>
                  <p className="text-xs text-gray-300">• Problemas abertos</p>
                </div>
              </div>
            </div>
          </div>

          {/* Monetization Note */}
          <div className="rounded-lg border border-gray-700/30 bg-gray-800/20 p-3">
            <p className="text-xs text-gray-500 leading-relaxed">
              💰 <strong className="text-gray-400">Monetização B2B2C:</strong> Recorrência
              SaaS por aluno + venda direta de Codex de reforço para os pais
              (Upsell). O foco sai da nota e entra na prevenção e estímulo
              personalizado.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
