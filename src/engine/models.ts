// ═══════════════════════════════════════════════════════════════
// Neural Quest V5.0 — Modelos de Dados (TypeScript)
// Transposto de models.py para tipagem forte no frontend
// ═══════════════════════════════════════════════════════════════

/** Evento de telemetria bruta capturado na borda (dispositivo do usuário). */
export interface TelemetryEvent {
  timestamp_ms: number;
  event_type: string;
  user_id: string;
  session_id: string;
  mission_id: string;
  payload: Record<string, unknown>;
  device_info: Record<string, unknown>;
}

/** Lote de telemetria pré-processada na borda antes de envio à nuvem. */
export interface ProcessedTelemetryBatch {
  user_id: string;
  session_id: string;
  mission_id: string;
  start_timestamp_ms: number;
  end_timestamp_ms: number;
  raw_events_count: number;
  avg_reaction_time_ms: number | null;
  keypress_rate: number | null;
  mouse_movement_distance_px: number | null;
  edge_anomaly_detected: boolean;
  events_hash: string;
  aggregated_data: Record<string, unknown>;
}

/** Métrica cognitiva calculada pelo Engine Oráculo. */
export interface CognitiveMetric {
  user_id: string;
  mission_id: string;
  metric_type: 'LD' | 'RA' | 'TA';
  value: number;
  timestamp_ms: number;
  context: Record<string, unknown>;
}

/** DNA Operacional consolidado de um usuário. */
export interface OperationalDNA {
  user_id: string;
  last_updated_ms: number;
  latency_decision: number | null;
  resilience_adaptive: number | null;
  tolerance_ambiguity: number | null;
  cognitive_profile: Record<string, unknown>;
  history: DNASnapshot[];
  dynamic_baseline: Record<string, unknown>;
}

export interface DNASnapshot {
  timestamp_ms: number;
  LD: number | null;
  RA: number | null;
  TA: number | null;
}

/** Relatório de anomalias detectadas (ISN). */
export interface AnomalyReport {
  user_id: string;
  session_id: string;
  mission_id: string;
  anomaly_type: string;
  severity: 'low' | 'medium' | 'high';
  score: number;
  details: Record<string, unknown>;
  timestamp_ms: number;
}

/** Codex Digital sugerido ao usuário. */
export interface CodexDigital {
  codex_id: string;
  user_id: string;
  title: string;
  description: string;
  suggested_by_metric: string;
  content_url: string;
  suggested_at_ms: number;
  status: 'pending' | 'completed' | 'dismissed';
}

/** Contexto de uma missão do CognQuest. */
export interface MissionContext {
  mission_id: string;
  mission_type: string;
  difficulty_level: number;
  expected_actions: string[];
  critical_decisions: string[];
  correct_path_events: string[];
  time_limits_ms: Record<string, number>;
  parameters: Record<string, unknown>;
}

/** Baseline dinâmica de um usuário. */
export interface UserBaseline {
  user_id: string;
  last_calibrated_ms: number;
  reaction_time_ms: number;
  keypress_rate: number;
  mouse_speed_px_s: number;
  reaction_time_jitter: number;
  calibration_context: Record<string, unknown>;
}

// ═══════════════════════════════════════════════════════════════
// EdTech — Power-Up Trail / Bureau de Talentos / Dashboard Escolar
// ═══════════════════════════════════════════════════════════════

/** Conteúdo narrativo de um capítulo da trilha */
export interface TrailLoreChapter {
  chapter_id: string;
  title: string;
  lore_text: string;
  illustration_emoji: string;
}

/** Checkpoint M.E.N.I. dentro de uma Trilha de Poder */
export interface TrailCheckpoint {
  checkpoint_index: number; // 1-6
  mission_context: MissionContext;
  status: 'locked' | 'available' | 'completed' | 'failed';
  metrics_snapshot: Record<string, CognitiveMetric> | null;
  completed_at_ms: number | null;
}

/** Trilha de Poder (Power-Up Trail) */
export interface PowerUpTrail {
  trail_id: string;
  title: string;
  subject: string; // Ex: 'Gestão de Crise', 'Lógica Booleana'
  description: string;
  icon_emoji: string;
  difficulty_level: number;
  lore_chapters: TrailLoreChapter[];
  checkpoints: TrailCheckpoint[];
  status: 'not_started' | 'in_progress' | 'completed' | 'certified';
  started_at_ms: number | null;
  completed_at_ms: number | null;
  certificate_hash: string | null;
}

/** Snapshot de métricas ao longo dos 6 checkpoints (Curva de Aprendizado) */
export interface LearningCurvePoint {
  checkpoint_index: number;
  ld: number;
  ra: number;
  ta: number;
  iiv: number; // Intra-Individual Variability
  es: number;  // Eficiência Sináptica
  timestamp_ms: number;
}

/** Curva de Aprendizado consolidada de uma trilha */
export interface LearningCurve {
  trail_id: string;
  user_id: string;
  points: LearningCurvePoint[];
  cognitive_automation_detected: boolean;
  es_above_baseline: boolean;
  certified: boolean;
}

/** Match de Performance para Bureau de Talentos */
export interface PerformanceMatch {
  match_id: string;
  user_id: string;
  vaga_id: string;
  vaga_title: string;
  company: string;
  match_score: number; // 0-100
  breakdown: {
    ld_match: number;
    ra_match: number;
    ta_match: number;
    trail_relevance: number;
  };
  proven_trails: string[]; // IDs das trilhas que comprovam a competência
  generated_at_ms: number;
}

/** Perfil do Bureau de Talentos */
export interface BureauProfile {
  user_id: string;
  display_name: string;
  completed_trails: PowerUpTrail[];
  dna: OperationalDNA;
  learning_curves: LearningCurve[];
  match_history: PerformanceMatch[];
  overall_es_ema: number; // Média Móvel Exponencial da Eficiência Sináptica
}

/** Vaga para Match no Bureau */
export interface JobPosting {
  vaga_id: string;
  title: string;
  company: string;
  required_ld: number;
  required_ra: number;
  required_ta: number;
  required_trails: string[];
  description: string;
}

/** Aluno no Dashboard Escolar */
export interface StudentCognitiveProfile {
  student_id: string;
  name: string;
  grade: string;
  dna: OperationalDNA;
  active_trails: PowerUpTrail[];
  saturation_threshold_min: number; // Minutos até saturação sensorial
  weak_areas: string[];
  strong_areas: string[];
  suggested_codex: CodexDigital[];
}

/** Turma no Dashboard Escolar */
export interface ClassroomInsight {
  class_id: string;
  class_name: string;
  students: StudentCognitiveProfile[];
  avg_ld: number;
  avg_ra: number;
  avg_ta: number;
  insight_text: string;
  recommended_adjustments: string[];
}

/** Nudge de reforço quando RA falha */
export interface ReinforcementNudge {
  nudge_id: string;
  user_id: string;
  trail_id: string;
  checkpoint_index: number;
  metric_failed: string;
  micro_content_title: string;
  micro_content_description: string;
  status: 'pending' | 'viewed' | 'completed';
}
