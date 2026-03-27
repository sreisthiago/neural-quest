// ═══════════════════════════════════════════════════════════════
// Neural Quest V5.0 — Simulador de Missão
// Teatro de Operações Cognitivas - Captura telemetria real
// ═══════════════════════════════════════════════════════════════

import { useState, useRef, useCallback, useEffect } from 'react';
import { Brain, Zap, Clock, Shield } from 'lucide-react';
import type { TelemetryEvent, MissionContext } from '../engine';

interface MissionStep {
  id: string;
  narrative: string;
  choices: { id: string; label: string; consequence: string }[];
  isAmbiguous: boolean;
  timePressure: boolean;
}

const MISSIONS: MissionStep[] = [
  {
    id: 'step_1',
    narrative:
      'Você é o comandante de uma estação orbital. Um meteoro se aproxima. Seus sensores mostram dados conflitantes: 60% de chance de impacto direto, mas a margem de erro é de 40%. Evacuar custa recursos críticos.',
    choices: [
      { id: 'evacuate', label: '🚀 Evacuar imediatamente', consequence: 'Recursos consumidos. Tripulação segura.' },
      { id: 'analyze', label: '🔬 Coletar mais dados', consequence: 'Tempo perdido. Novos dados obtidos.' },
      { id: 'partial', label: '⚡ Evacuação parcial', consequence: 'Equilíbrio entre segurança e recursos.' },
    ],
    isAmbiguous: true,
    timePressure: true,
  },
  {
    id: 'step_2',
    narrative:
      'Após sua decisão, a tripulação questiona sua liderança. Um engenheiro sênior propõe uma solução alternativa que contradiz seu plano. A equipe está dividida.',
    choices: [
      { id: 'override', label: '🛡️ Manter sua decisão', consequence: 'Autoridade mantida. Risco aceito.' },
      { id: 'adapt', label: '🔄 Adaptar e integrar ideias', consequence: 'Plano revisado. Moral melhorada.' },
      { id: 'delegate', label: '👥 Delegar ao engenheiro', consequence: 'Controle cedido. Pressão reduzida.' },
    ],
    isAmbiguous: true,
    timePressure: false,
  },
  {
    id: 'step_3',
    narrative:
      'ALERTA CRÍTICO: Um sistema secundário falhou durante a execução do plano. Você tem 30 segundos para redirecionar energia. Cada segundo conta. O painel mostra 4 circuitos, mas apenas 2 são seguros.',
    choices: [
      { id: 'circuit_a', label: '🔴 Circuito Alpha', consequence: 'Risco alto, ganho máximo.' },
      { id: 'circuit_b', label: '🟡 Circuito Beta', consequence: 'Risco moderado, ganho estável.' },
      { id: 'circuit_c', label: '🟢 Circuito Gamma', consequence: 'Risco baixo, ganho mínimo.' },
      { id: 'circuit_d', label: '🔵 Circuito Delta', consequence: 'Desconhecido.' },
    ],
    isAmbiguous: true,
    timePressure: true,
  },
  {
    id: 'step_4',
    narrative:
      'A crise foi contida. Agora você precisa redigir o relatório pós-incidente. Uma anomalia nos dados sugere que alguém da equipe sabotou um subsistema. As evidências são circunstanciais.',
    choices: [
      { id: 'investigate', label: '🔍 Investigar formalmente', consequence: 'Transparência. Possível conflito.' },
      { id: 'quiet', label: '🤫 Investigar discretamente', consequence: 'Calma mantida. Risco de demora.' },
      { id: 'ignore', label: '❌ Ignorar anomalia', consequence: 'Paz mantida. Risco latente.' },
    ],
    isAmbiguous: true,
    timePressure: false,
  },
];

interface MissionSimulatorProps {
  onComplete: (
    events: TelemetryEvent[],
    mission: MissionContext
  ) => Promise<void>;
  userId: string;
}

export default function MissionSimulator({
  onComplete,
  userId,
}: MissionSimulatorProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [consequence, setConsequence] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);

  const eventsRef = useRef<TelemetryEvent[]>([]);
  const sessionId = useRef(`session_${Date.now()}`);
  const stepStartTime = useRef(Date.now());
  const errorsRef = useRef(0);
  const correctionsRef = useRef(0);
  const exploratoryRef = useRef(0);
  const prematureRef = useRef(0);

  const missionId = 'orbital_crisis_001';

  const pushEvent = useCallback(
    (type: string, payload: Record<string, unknown> = {}) => {
      eventsRef.current.push({
        timestamp_ms: Date.now(),
        event_type: type,
        user_id: userId,
        session_id: sessionId.current,
        mission_id: missionId,
        payload,
        device_info: {
          screen: `${window.innerWidth}x${window.innerHeight}`,
          ua: navigator.userAgent.slice(0, 50),
        },
      });
    },
    [userId]
  );

  // Capture mouse movements during mission
  useEffect(() => {
    if (!isActive) return;

    const handleMouseMove = (e: MouseEvent) => {
      pushEvent('mousemove', { x: e.clientX, y: e.clientY });
    };

    const handleKeyPress = (e: KeyboardEvent) => {
      pushEvent('keypress', { key: e.key });
    };

    // Throttle mouse events to every 200ms
    let lastMouse = 0;
    const throttledMouse = (e: MouseEvent) => {
      if (Date.now() - lastMouse > 200) {
        lastMouse = Date.now();
        handleMouseMove(e);
      }
    };

    window.addEventListener('mousemove', throttledMouse);
    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('mousemove', throttledMouse);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [isActive, pushEvent]);

  // Countdown timer for time-pressure steps
  useEffect(() => {
    if (!isActive || !MISSIONS[currentStep]?.timePressure) {
      setCountdown(null);
      return;
    }

    setCountdown(30);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          // Auto-select if time runs out (premature decision)
          prematureRef.current++;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentStep, isActive]);

  const startMission = () => {
    eventsRef.current = [];
    errorsRef.current = 0;
    correctionsRef.current = 0;
    exploratoryRef.current = 0;
    prematureRef.current = 0;
    sessionId.current = `session_${Date.now()}`;
    setCurrentStep(0);
    setIsActive(true);
    setIsComplete(false);
    setConsequence(null);
    stepStartTime.current = Date.now();
    pushEvent('start_mission');
  };

  const handleChoice = async (choiceId: string, consequenceText: string) => {
    const reactionTime = Date.now() - stepStartTime.current;

    // Track decision telemetry
    pushEvent('decision', {
      choice: choiceId,
      step: MISSIONS[currentStep].id,
      reaction_time_ms: reactionTime,
    });

    // Classify behavior
    if (reactionTime < 2000 && MISSIONS[currentStep].isAmbiguous) {
      prematureRef.current++;
    }
    if (reactionTime > 3000 && MISSIONS[currentStep].isAmbiguous) {
      exploratoryRef.current++;
    }

    // Simulate error/correction pattern
    if (choiceId === 'circuit_a' || choiceId === 'ignore') {
      errorsRef.current++;
    }
    if (choiceId === 'adapt' || choiceId === 'analyze') {
      correctionsRef.current++;
      exploratoryRef.current++;
    }

    setConsequence(consequenceText);

    // Brief pause to show consequence
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setConsequence(null);

    if (currentStep < MISSIONS.length - 1) {
      setCurrentStep((prev) => prev + 1);
      stepStartTime.current = Date.now();
    } else {
      // Mission complete
      pushEvent('end_mission');
      setIsActive(false);
      setIsComplete(true);

      // Enrich aggregated data
      const enrichedEvents = eventsRef.current;

      const missionContext: MissionContext = {
        mission_id: missionId,
        mission_type: 'ethical_decision_making',
        difficulty_level: 7,
        expected_actions: ['evacuate', 'analyze', 'adapt'],
        critical_decisions: MISSIONS.map((m) => m.id),
        correct_path_events: [],
        time_limits_ms: { step_1: 30000, step_3: 30000 },
        parameters: { has_ambiguity: true, ethical_dilemma: true },
      };

      // Inject aggregated behavioral data into last event
      enrichedEvents.push({
        timestamp_ms: Date.now(),
        event_type: 'aggregated_behavior',
        user_id: userId,
        session_id: sessionId.current,
        mission_id: missionId,
        payload: {
          errors_count: errorsRef.current,
          quick_corrections_count: correctionsRef.current,
          exploratory_actions_count: exploratoryRef.current,
          premature_decisions_count: prematureRef.current,
        },
        device_info: {},
      });

      await onComplete(enrichedEvents, missionContext);
    }
  };

  const step = MISSIONS[currentStep];

  if (!isActive && !isComplete) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-12">
        <div className="relative">
          <div className="absolute inset-0 animate-ping rounded-full bg-violet-500/20" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-700 shadow-lg shadow-violet-500/30">
            <Brain className="h-12 w-12 text-white" />
          </div>
        </div>
        <div className="max-w-lg text-center">
          <h2 className="mb-2 text-2xl font-bold text-white">
            Operação: Crise Orbital
          </h2>
          <p className="mb-1 text-sm text-violet-300">
            Teatro de Operações Cognitivas — Missão de Avaliação
          </p>
          <p className="text-sm leading-relaxed text-gray-400">
            Você será colocado em um cenário de pressão com decisões éticas e
            ambíguas. Sua telemetria comportamental será capturada em tempo real
            para mapear seu DNA Operacional.
          </p>
        </div>
        <button
          onClick={startMission}
          className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-8 py-3 font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:scale-105 hover:shadow-violet-500/40"
        >
          <Zap className="h-5 w-5 transition-transform group-hover:scale-110" />
          Iniciar Missão
        </button>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20">
          <Shield className="h-10 w-10 text-emerald-400" />
        </div>
        <h2 className="text-xl font-bold text-white">Missão Concluída</h2>
        <p className="text-sm text-gray-400">
          Telemetria processada. DNA Operacional atualizado.
        </p>
        <button
          onClick={startMission}
          className="mt-2 rounded-lg bg-gray-800 px-6 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-700"
        >
          Repetir Missão
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-medium text-gray-500">
          Fase {currentStep + 1}/{MISSIONS.length}
        </span>
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-500"
            style={{
              width: `${((currentStep + 1) / MISSIONS.length) * 100}%`,
            }}
          />
        </div>
        {countdown !== null && (
          <div className="flex items-center gap-1 text-amber-400">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-mono font-bold">{countdown}s</span>
          </div>
        )}
      </div>

      {/* Consequence flash */}
      {consequence && (
        <div className="animate-pulse rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
          ⚡ {consequence}
        </div>
      )}

      {/* Narrative */}
      {!consequence && (
        <>
          <div className="rounded-xl border border-gray-700/50 bg-gray-800/50 p-6">
            <p className="leading-relaxed text-gray-200">{step.narrative}</p>
            {step.timePressure && (
              <p className="mt-2 text-xs font-medium text-red-400">
                ⏱️ Decisão sob pressão temporal
              </p>
            )}
          </div>

          {/* Choices */}
          <div className="grid gap-3">
            {step.choices.map((choice) => (
              <button
                key={choice.id}
                onClick={() => handleChoice(choice.id, choice.consequence)}
                className="group rounded-xl border border-gray-700/50 bg-gray-800/30 p-4 text-left transition-all hover:border-violet-500/50 hover:bg-violet-500/10"
              >
                <span className="text-sm font-medium text-gray-200 transition-colors group-hover:text-white">
                  {choice.label}
                </span>
              </button>
            ))}
          </div>
        </>
      )}

      {/* Telemetry indicator */}
      <div className="flex items-center gap-2 text-xs text-gray-600">
        <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
        Telemetria capturando: mouse, keypress, latência de decisão
      </div>
    </div>
  );
}
