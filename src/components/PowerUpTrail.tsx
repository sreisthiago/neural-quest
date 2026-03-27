// ═══════════════════════════════════════════════════════════════
// Neural Quest V5.0 — Power-Up Trail (Trilha de Poder)
// Experiência imersiva: Lore narrativa + 6 Checkpoints M.E.N.I.
// ═══════════════════════════════════════════════════════════════

import { useState, useRef, useCallback, useEffect } from 'react';
import {
  BookOpen, Lock, CheckCircle2, Play, Zap, Brain,
  AlertTriangle, ArrowRight, ChevronDown, ChevronUp,
  Award, TrendingUp, Shield,
} from 'lucide-react';
import type {
  PowerUpTrail as TrailType,
  TelemetryEvent,
  MissionContext,
  CognitiveMetric,
  LearningCurvePoint,
  ReinforcementNudge,
} from '../engine';
import { PowerUpTrailEngine, TRAIL_TEMPLATES } from '../engine';

// ── Checkpoint Test Component ──────────────────────────────────

interface CheckpointTestProps {
  checkpointIndex: number;
  missionContext: MissionContext;
  loreTitle: string;
  userId: string;
  onComplete: (
    events: TelemetryEvent[],
    mission: MissionContext,
    checkpointIndex: number
  ) => void;
}

const CHECKPOINT_SCENARIOS: Record<number, {
  narrative: string;
  choices: { id: string; label: string; quality: 'good' | 'neutral' | 'risky' }[];
}[]> = {
  1: [
    {
      narrative: 'Você recebe o primeiro briefing. Os dados são claros, mas o tempo é curto. Qual sua abordagem inicial?',
      choices: [
        { id: 'methodical', label: '📊 Análise metódica dos dados', quality: 'good' },
        { id: 'intuitive', label: '⚡ Decisão intuitiva rápida', quality: 'neutral' },
        { id: 'delegate', label: '👥 Consultar a equipe primeiro', quality: 'good' },
      ],
    },
    {
      narrative: 'Uma variável inesperada surge. O cenário mudou desde o briefing. Como você reage?',
      choices: [
        { id: 'adapt', label: '🔄 Adaptar o plano imediatamente', quality: 'good' },
        { id: 'stick', label: '🛡️ Manter o plano original', quality: 'risky' },
        { id: 'pause', label: '⏸️ Pausar e reavaliar tudo', quality: 'neutral' },
      ],
    },
  ],
  2: [
    {
      narrative: 'A pressão aumenta. Dois membros da equipe apresentam soluções opostas. Os dados apoiam ambas parcialmente.',
      choices: [
        { id: 'synthesis', label: '🧬 Sintetizar ambas as propostas', quality: 'good' },
        { id: 'pick_a', label: '🅰️ Escolher a proposta mais segura', quality: 'neutral' },
        { id: 'reject_both', label: '❌ Rejeitar ambas e criar sua própria', quality: 'risky' },
      ],
    },
    {
      narrative: 'Seu plano falhou parcialmente. Um subsistema não respondeu como esperado. O que define os próximos 60 segundos?',
      choices: [
        { id: 'diagnose', label: '🔍 Diagnosticar a causa raiz', quality: 'good' },
        { id: 'workaround', label: '🔧 Improviso — contornar o problema', quality: 'neutral' },
        { id: 'escalate', label: '📡 Escalar para comando superior', quality: 'risky' },
      ],
    },
  ],
  3: [
    {
      narrative: 'Informação incompleta. Apenas 40% dos sensores estão online. Você precisa agir mesmo sem visão completa.',
      choices: [
        { id: 'probabilistic', label: '🎯 Decisão probabilística com os dados disponíveis', quality: 'good' },
        { id: 'wait', label: '⏳ Esperar mais dados chegarem', quality: 'risky' },
        { id: 'triangulate', label: '📐 Triangular com fontes alternativas', quality: 'good' },
      ],
    },
    {
      narrative: 'A equipe está dividida e o moral cai. A incerteza corrói a confiança. Liderança é testada.',
      choices: [
        { id: 'transparency', label: '💬 Comunicar a incerteza com honestidade', quality: 'good' },
        { id: 'confidence', label: '💪 Projetar confiança mesmo sem certeza', quality: 'neutral' },
        { id: 'isolate', label: '🔒 Isolar a equipe da informação parcial', quality: 'risky' },
      ],
    },
  ],
  4: [
    {
      narrative: 'Um erro anterior gerou consequências imprevistas. A cadeia de causalidade é complexa. Como você processa?',
      choices: [
        { id: 'root_cause', label: '🌳 Análise de causa raiz completa', quality: 'good' },
        { id: 'forward', label: '➡️ Olhar para frente, não para trás', quality: 'neutral' },
        { id: 'blame', label: '👤 Identificar o responsável', quality: 'risky' },
      ],
    },
    {
      narrative: 'Você precisa documentar o que aconteceu. Mas a verdade é complexa e nem todos querem ouvi-la.',
      choices: [
        { id: 'full_truth', label: '📝 Relatório completo e transparente', quality: 'good' },
        { id: 'curated', label: '✂️ Relatório curado com foco em soluções', quality: 'neutral' },
        { id: 'minimal', label: '📄 Relatório mínimo para conformidade', quality: 'risky' },
      ],
    },
  ],
  5: [
    {
      narrative: 'Teste sob pressão temporal extrema. O sistema exibe 4 opções e o contador regressivo iniciou. 15 segundos.',
      choices: [
        { id: 'quick_scan', label: '👁️ Scan rápido → melhor opção disponível', quality: 'good' },
        { id: 'first_instinct', label: '⚡ Primeiro instinto, sem hesitar', quality: 'neutral' },
        { id: 'freeze', label: '🧊 Congelar — analisar cada detalhe', quality: 'risky' },
      ],
    },
    {
      narrative: 'Após sua decisão rápida, novos dados revelam que havia uma opção melhor. Você tinha apenas informação parcial.',
      choices: [
        { id: 'accept_learn', label: '🎓 Aceitar e incorporar o aprendizado', quality: 'good' },
        { id: 'justify', label: '🗣️ Justificar com base no que era sabido', quality: 'neutral' },
        { id: 'regret', label: '😤 Frustração — deveria ter esperado', quality: 'risky' },
      ],
    },
  ],
  6: [
    {
      narrative: 'Avaliação final. Tudo o que você aprendeu nesta trilha converge. Um cenário complexo que testa os 3 eixos: LD, RA e TA simultaneamente.',
      choices: [
        { id: 'integrated', label: '🧠 Resposta integrada usando todo o aprendizado', quality: 'good' },
        { id: 'safe', label: '🛡️ Abordagem conservadora e segura', quality: 'neutral' },
        { id: 'bold', label: '🚀 Abordagem ousada e inovadora', quality: 'neutral' },
      ],
    },
    {
      narrative: 'Reflexão final: Se você pudesse voltar ao Checkpoint 1 com o que sabe agora, o que faria diferente?',
      choices: [
        { id: 'evolve', label: '🔄 Mudaria minha abordagem inicial', quality: 'good' },
        { id: 'same', label: '✅ Manteria as mesmas decisões', quality: 'neutral' },
        { id: 'uncertain', label: '❓ Não tenho certeza — depende do contexto', quality: 'good' },
      ],
    },
  ],
};

function CheckpointTest({ checkpointIndex, missionContext, loreTitle, userId, onComplete }: CheckpointTestProps) {
  const [phase, setPhase] = useState(0); // 0 or 1 (two sub-questions per checkpoint)
  const [isActive, setIsActive] = useState(false);
  const eventsRef = useRef<TelemetryEvent[]>([]);
  const sessionId = useRef(`cp_session_${Date.now()}`);
  const phaseStartRef = useRef(Date.now());
  const errorsRef = useRef(0);
  const correctionsRef = useRef(0);
  const exploratoryRef = useRef(0);
  const prematureRef = useRef(0);

  const scenarios = CHECKPOINT_SCENARIOS[checkpointIndex] ?? CHECKPOINT_SCENARIOS[1]!;

  const pushEvent = useCallback(
    (type: string, payload: Record<string, unknown> = {}) => {
      eventsRef.current.push({
        timestamp_ms: Date.now(),
        event_type: type,
        user_id: userId,
        session_id: sessionId.current,
        mission_id: missionContext.mission_id,
        payload,
        device_info: { screen: `${window.innerWidth}x${window.innerHeight}` },
      });
    },
    [userId, missionContext.mission_id]
  );

  useEffect(() => {
    if (!isActive) return;
    let lastMouse = 0;
    const onMove = (e: MouseEvent) => {
      if (Date.now() - lastMouse > 250) {
        lastMouse = Date.now();
        pushEvent('mousemove', { x: e.clientX, y: e.clientY });
      }
    };
    const onKey = (e: KeyboardEvent) => pushEvent('keypress', { key: e.key });
    window.addEventListener('mousemove', onMove);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('keydown', onKey);
    };
  }, [isActive, pushEvent]);

  const startTest = () => {
    eventsRef.current = [];
    errorsRef.current = 0;
    correctionsRef.current = 0;
    exploratoryRef.current = 0;
    prematureRef.current = 0;
    sessionId.current = `cp_session_${Date.now()}`;
    setPhase(0);
    setIsActive(true);
    phaseStartRef.current = Date.now();
    pushEvent('start_checkpoint', { checkpoint_index: checkpointIndex });
  };

  const handleChoice = async (choiceId: string, quality: string) => {
    const reactionTime = Date.now() - phaseStartRef.current;
    pushEvent('decision', {
      choice: choiceId,
      phase,
      checkpoint_index: checkpointIndex,
      reaction_time_ms: reactionTime,
    });

    if (reactionTime < 1500) prematureRef.current++;
    if (reactionTime > 4000) exploratoryRef.current++;
    if (quality === 'risky') errorsRef.current++;
    if (quality === 'good') correctionsRef.current++;

    if (phase < scenarios.length - 1) {
      setPhase((p) => p + 1);
      phaseStartRef.current = Date.now();
    } else {
      // Finalize
      pushEvent('end_checkpoint', { checkpoint_index: checkpointIndex });
      pushEvent('aggregated_behavior', {
        errors_count: errorsRef.current,
        quick_corrections_count: correctionsRef.current,
        exploratory_actions_count: exploratoryRef.current,
        premature_decisions_count: prematureRef.current,
      });
      setIsActive(false);
      onComplete(eventsRef.current, missionContext, checkpointIndex);
    }
  };

  if (!isActive) {
    return (
      <button
        onClick={startTest}
        className="flex w-full items-center gap-3 rounded-xl border border-violet-500/30 bg-violet-500/10 p-4 text-left transition-all hover:border-violet-500/60 hover:bg-violet-500/20"
      >
        <Play className="h-5 w-5 shrink-0 text-violet-400" />
        <div>
          <p className="text-sm font-semibold text-violet-300">
            Iniciar Checkpoint {checkpointIndex}
          </p>
          <p className="text-xs text-gray-500">{loreTitle}</p>
        </div>
        <Zap className="ml-auto h-4 w-4 text-violet-500" />
      </button>
    );
  }

  const scenario = scenarios[phase];
  if (!scenario) return null;

  return (
    <div className="rounded-xl border border-violet-500/40 bg-gradient-to-br from-gray-800/80 to-violet-950/30 p-5">
      <div className="mb-1 flex items-center gap-2">
        <Brain className="h-4 w-4 text-violet-400" />
        <span className="text-xs font-semibold text-violet-300">
          CHECKPOINT {checkpointIndex} • Fase {phase + 1}/{scenarios.length}
        </span>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-gray-200">
        {scenario.narrative}
      </p>
      <div className="mt-4 space-y-2">
        {scenario.choices.map((c) => (
          <button
            key={c.id}
            onClick={() => handleChoice(c.id, c.quality)}
            className="flex w-full items-center gap-3 rounded-lg border border-gray-600/40 bg-gray-800/60 px-4 py-3 text-left text-sm text-gray-200 transition-all hover:border-violet-500/50 hover:bg-gray-700/60"
          >
            <span>{c.label}</span>
            <ArrowRight className="ml-auto h-3 w-3 text-gray-600" />
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Learning Curve Visual ──────────────────────────────────────

function LearningCurveChart({ points }: { points: LearningCurvePoint[] }) {
  if (points.length === 0) return null;

  const maxES = 100;
  const w = 360;
  const h = 120;
  const padX = 30;
  const padY = 10;
  const chartW = w - padX * 2;
  const chartH = h - padY * 2;

  const getX = (i: number) => padX + (i / 5) * chartW;
  const getY = (val: number) => padY + chartH - (val / maxES) * chartH;

  const esPath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(p.checkpoint_index - 1)} ${getY(p.es)}`)
    .join(' ');

  const ldPath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(p.checkpoint_index - 1)} ${getY(p.ld)}`)
    .join(' ');

  return (
    <div className="rounded-lg border border-gray-700/40 bg-gray-800/30 p-3">
      <p className="mb-2 text-xs font-semibold text-gray-400">
        📈 Curva de Aprendizado
      </p>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
        {/* Baseline */}
        <line
          x1={padX} y1={getY(55)} x2={w - padX} y2={getY(55)}
          stroke="rgba(139,92,246,0.3)" strokeDasharray="4 4" strokeWidth="1"
        />
        <text x={w - padX + 2} y={getY(55) + 3} fill="rgba(139,92,246,0.5)" fontSize="7">
          Baseline
        </text>

        {/* LD line */}
        <path d={ldPath} fill="none" stroke="rgba(34,211,238,0.5)" strokeWidth="1.5" />

        {/* ES line (main) */}
        <path d={esPath} fill="none" stroke="rgba(139,92,246,0.9)" strokeWidth="2" />

        {/* Points */}
        {points.map((p) => (
          <g key={p.checkpoint_index}>
            <circle
              cx={getX(p.checkpoint_index - 1)}
              cy={getY(p.es)}
              r="4"
              fill="#7c3aed"
              stroke="#1a1a25"
              strokeWidth="2"
            />
            <text
              x={getX(p.checkpoint_index - 1)}
              y={h - 2}
              textAnchor="middle"
              fill="rgba(255,255,255,0.4)"
              fontSize="7"
            >
              CP{p.checkpoint_index}
            </text>
          </g>
        ))}
      </svg>
      <div className="mt-1 flex gap-4 text-[10px] text-gray-500">
        <span className="flex items-center gap-1">
          <span className="inline-block h-2 w-2 rounded-full bg-violet-500" /> ES (Eficiência Sináptica)
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-2 w-2 rounded-full bg-cyan-400" /> LD (Latência)
        </span>
      </div>
    </div>
  );
}

// ── Nudge Component ────────────────────────────────────────────

function NudgeAlert({
  nudge,
  onResolve,
}: {
  nudge: ReinforcementNudge;
  onResolve: () => void;
}) {
  return (
    <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-amber-300">
            ⚠️ {nudge.micro_content_title}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-gray-400">
            {nudge.micro_content_description}
          </p>
          <button
            onClick={onResolve}
            className="mt-3 flex items-center gap-2 rounded-lg bg-amber-500/20 px-4 py-2 text-xs font-medium text-amber-300 transition-all hover:bg-amber-500/30"
          >
            <CheckCircle2 className="h-3 w-3" />
            Revisar micro-conteúdo e desbloquear
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main PowerUpTrail Component ────────────────────────────────

interface PowerUpTrailProps {
  userId: string;
  onProcessTelemetry: (
    events: TelemetryEvent[],
    mission: MissionContext
  ) => Promise<{ metrics: Record<string, CognitiveMetric> }>;
}

export default function PowerUpTrailComponent({
  userId,
  onProcessTelemetry,
}: PowerUpTrailProps) {
  const [selectedTrailId, setSelectedTrailId] = useState<string | null>(null);
  const [activeTrail, setActiveTrail] = useState<TrailType | null>(null);
  const [expandedChapter, setExpandedChapter] = useState<number>(0);
  const [curvePoints, setCurvePoints] = useState<LearningCurvePoint[]>([]);
  const [currentNudge, setCurrentNudge] = useState<ReinforcementNudge | null>(null);
  const [certHash, setCertHash] = useState<string | null>(null);
  const [automationDetected, setAutomationDetected] = useState(false);

  const trailEngineRef = useRef(new PowerUpTrailEngine());

  const selectTrail = (trailId: string) => {
    const template = TRAIL_TEMPLATES.find((t) => t.trail_id === trailId);
    if (!template) return;

    const trail = trailEngineRef.current.initTrail(userId, template);
    setActiveTrail(trail);
    setSelectedTrailId(trailId);
    setCurvePoints([]);
    setCurrentNudge(null);
    setCertHash(null);
    setAutomationDetected(false);
    setExpandedChapter(0);
  };

  const handleCheckpointComplete = async (
    events: TelemetryEvent[],
    mission: MissionContext,
    checkpointIndex: number
  ) => {
    if (!activeTrail) return;

    // Processar telemetria pelo Oracle Engine principal
    const result = await onProcessTelemetry(events, mission);

    // Registrar no PowerUpTrailEngine
    const { updatedTrail, nudge, curvePoint } =
      trailEngineRef.current.completeCheckpoint(
        activeTrail,
        checkpointIndex,
        result.metrics
      );

    setActiveTrail(updatedTrail);
    setCurvePoints((prev) => [...prev, curvePoint]);

    if (nudge) {
      setCurrentNudge(nudge);
    }

    // Verificar certificação e automatização
    const curve = trailEngineRef.current.getLearningCurve(activeTrail.trail_id);
    if (curve) {
      setAutomationDetected(curve.cognitive_automation_detected);
      if (curve.certified && updatedTrail.certificate_hash) {
        setCertHash(updatedTrail.certificate_hash);
      }
    }

    // Auto-expandir próximo capítulo
    if (checkpointIndex < 6) {
      setExpandedChapter(checkpointIndex);
    }
  };

  const resolveNudge = () => {
    if (currentNudge) {
      trailEngineRef.current.resolveNudge(currentNudge.nudge_id);
      // Desbloquear próximo checkpoint
      if (activeTrail) {
        const nextCpIdx = currentNudge.checkpoint_index;
        const nextCp = activeTrail.checkpoints[nextCpIdx];
        if (nextCp) {
          nextCp.status = 'available';
          setActiveTrail({ ...activeTrail });
        }
      }
    }
    setCurrentNudge(null);
  };

  // ── Trail Selection ──
  if (!selectedTrailId || !activeTrail) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white">
            ⚔️ Trilhas de Poder
          </h2>
          <p className="mt-1 text-sm text-gray-400">
            Cada trilha é uma jornada narrativa com 6 Checkpoints M.E.N.I. que
            medem sua evolução cognitiva em tempo real.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TRAIL_TEMPLATES.map((t) => (
            <button
              key={t.trail_id}
              onClick={() => selectTrail(t.trail_id)}
              className="group rounded-xl border border-gray-700/50 bg-gray-800/30 p-5 text-left transition-all hover:border-violet-500/40 hover:bg-gray-800/60"
            >
              <div className="mb-3 text-3xl">{t.icon_emoji}</div>
              <h3 className="text-base font-bold text-white group-hover:text-violet-300">
                {t.title}
              </h3>
              <p className="mt-1 text-xs text-gray-500">{t.description}</p>
              <div className="mt-3 flex items-center gap-3">
                <span className="rounded-full bg-violet-500/20 px-2 py-0.5 text-xs text-violet-300">
                  Nível {t.difficulty_level}
                </span>
                <span className="text-xs text-gray-600">
                  6 Checkpoints • {t.lore.length} Capítulos
                </span>
              </div>
              <div className="mt-3 flex items-center gap-1 text-xs font-medium text-violet-400 opacity-0 transition-opacity group-hover:opacity-100">
                Iniciar Trilha <ArrowRight className="h-3 w-3" />
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ── Active Trail View ──
  const template = TRAIL_TEMPLATES.find((t) => t.trail_id === selectedTrailId)!;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => {
            setSelectedTrailId(null);
            setActiveTrail(null);
          }}
          className="text-xs text-gray-500 hover:text-gray-300"
        >
          ← Voltar
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{template.icon_emoji}</span>
            <h2 className="text-lg font-bold text-white">{template.title}</h2>
            {activeTrail.status === 'certified' && (
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-medium text-emerald-400">
                ✅ Certificado
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500">{template.description}</p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex gap-1">
        {activeTrail.checkpoints.map((cp) => (
          <div
            key={cp.checkpoint_index}
            className={`h-2 flex-1 rounded-full transition-all ${
              cp.status === 'completed'
                ? 'bg-emerald-500'
                : cp.status === 'available'
                  ? 'bg-violet-500/60 animate-pulse'
                  : 'bg-gray-700'
            }`}
            title={`Checkpoint ${cp.checkpoint_index}: ${cp.status}`}
          />
        ))}
      </div>

      {/* Automation Detection */}
      {automationDetected && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3">
          <TrendingUp className="h-5 w-5 text-emerald-400" />
          <div>
            <p className="text-sm font-semibold text-emerald-300">
              🧠 Automatização Cognitiva Detectada
            </p>
            <p className="text-xs text-gray-400">
              Sua LD estabilizou com baixa variabilidade. O motor comprova que
              houve consolidação de aprendizado.
            </p>
          </div>
        </div>
      )}

      {/* Certificate */}
      {certHash && (
        <div className="flex items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
          <Award className="h-6 w-6 text-amber-400" />
          <div>
            <p className="text-sm font-semibold text-amber-300">
              🏆 Certificação Concedida
            </p>
            <p className="text-xs text-gray-400">
              Proficiência validada por telemetria comportamental.
              ES mantida acima da baseline em todos os checkpoints.
            </p>
            <p className="mt-1 font-mono text-xs text-amber-500/70">
              Hash: {certHash}
            </p>
          </div>
        </div>
      )}

      {/* Nudge */}
      {currentNudge && (
        <NudgeAlert nudge={currentNudge} onResolve={resolveNudge} />
      )}

      {/* Learning Curve */}
      {curvePoints.length > 0 && <LearningCurveChart points={curvePoints} />}

      {/* Chapters + Checkpoints */}
      <div className="space-y-3">
        {template.lore.map((chapter, i) => {
          const cp = activeTrail.checkpoints[i];
          const isExpanded = expandedChapter === i;
          const isCompleted = cp?.status === 'completed';
          const isAvailable = cp?.status === 'available';
          const isLocked = cp?.status === 'locked';

          return (
            <div
              key={chapter.chapter_id}
              className={`rounded-xl border transition-all ${
                isCompleted
                  ? 'border-emerald-500/30 bg-emerald-500/5'
                  : isAvailable
                    ? 'border-violet-500/30 bg-violet-500/5'
                    : 'border-gray-700/40 bg-gray-800/20'
              }`}
            >
              {/* Chapter Header */}
              <button
                onClick={() => setExpandedChapter(isExpanded ? -1 : i)}
                className="flex w-full items-center gap-3 p-4 text-left"
              >
                <div className="text-xl">{chapter.illustration_emoji}</div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold ${
                    isCompleted ? 'text-emerald-300' : isAvailable ? 'text-violet-300' : 'text-gray-400'
                  }`}>
                    {chapter.title}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {isCompleted && (
                      <span className="flex items-center gap-1 text-[10px] text-emerald-400">
                        <CheckCircle2 className="h-3 w-3" /> Completo
                      </span>
                    )}
                    {isAvailable && !isCompleted && (
                      <span className="flex items-center gap-1 text-[10px] text-violet-400">
                        <Play className="h-3 w-3" /> Disponível
                      </span>
                    )}
                    {isLocked && (
                      <span className="flex items-center gap-1 text-[10px] text-gray-600">
                        <Lock className="h-3 w-3" /> Bloqueado
                      </span>
                    )}
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                )}
              </button>

              {/* Chapter Content */}
              {isExpanded && (
                <div className="border-t border-gray-700/30 p-4 space-y-4">
                  {/* Lore Text */}
                  <div className="rounded-lg bg-black/30 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="h-4 w-4 text-violet-400" />
                      <span className="text-xs font-medium text-violet-300">
                        Narrativa Imersiva
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-gray-300 italic">
                      {chapter.lore_text}
                    </p>
                  </div>

                  {/* Checkpoint Test */}
                  {cp && isAvailable && !isCompleted && (
                    <CheckpointTest
                      checkpointIndex={i + 1}
                      missionContext={cp.mission_context}
                      loreTitle={chapter.title}
                      userId={userId}
                      onComplete={handleCheckpointComplete}
                    />
                  )}

                  {/* Completed metrics */}
                  {isCompleted && curvePoints[i] && (
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: 'LD', value: curvePoints[i].ld, icon: Zap, color: 'text-cyan-400' },
                        { label: 'RA', value: curvePoints[i].ra, icon: Shield, color: 'text-emerald-400' },
                        { label: 'ES', value: curvePoints[i].es, icon: Brain, color: 'text-violet-400' },
                      ].map((m) => (
                        <div key={m.label} className="rounded-lg bg-gray-800/50 p-2 text-center">
                          <m.icon className={`mx-auto h-3 w-3 ${m.color}`} />
                          <p className="mt-1 text-xs text-gray-500">{m.label}</p>
                          <p className="text-sm font-bold text-white">
                            {m.value.toFixed(1)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
