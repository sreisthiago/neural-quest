// ═══════════════════════════════════════════════════════════════
// Neural Quest V5.0 — Lógica M.E.N.I.
// Mapeamento de Experiências Neuro-Intuitivas (LD, RA, TA)
// Transposto de cognitive_logic.py
// ═══════════════════════════════════════════════════════════════

import type {
  ProcessedTelemetryBatch,
  CognitiveMetric,
  MissionContext,
  UserBaseline,
} from './models';

export class CognitiveLogic {
  /** Normaliza um valor em relação à baseline e dificuldade da missão. */
  private normalizeValue(
    value: number,
    baseline: number,
    difficulty: number
  ): number {
    if (baseline === 0) return 0;
    return (value / baseline) * (1 + difficulty / 10);
  }

  /**
   * Calcula Latência de Decisão (LD).
   * Score 0–100 onde 100 = latência ideal (baixa).
   */
  calculateLD(
    batch: ProcessedTelemetryBatch,
    mission: MissionContext,
    baseline: UserBaseline
  ): number {
    if (!batch.avg_reaction_time_ms) return 0;

    const baselineRt = baseline.reaction_time_ms || 1;
    const ldNormalized = this.normalizeValue(
      batch.avg_reaction_time_ms,
      baselineRt,
      mission.difficulty_level
    );

    return Math.round(Math.max(0, Math.min(100, 100 - ldNormalized * 10)) * 100) / 100;
  }

  /**
   * Calcula Resiliência Adaptativa (RA).
   * Score 0–100 onde 100 = alta capacidade de recuperação.
   */
  calculateRA(
    batch: ProcessedTelemetryBatch,
    mission: MissionContext
  ): number {
    const errors = (batch.aggregated_data.errors_count as number) ?? 0;
    const corrections = (batch.aggregated_data.quick_corrections_count as number) ?? 0;

    if (errors === 0) return 100;

    const raRatio = corrections / errors;
    const score = Math.min(100, raRatio * 50 + mission.difficulty_level * 5);
    return Math.round(score * 100) / 100;
  }

  /**
   * Calcula Tolerância à Ambiguidade (TA).
   * Score 0–100 onde 100 = alto conforto com incerteza.
   */
  calculateTA(
    batch: ProcessedTelemetryBatch,
    mission: MissionContext
  ): number {
    const hasAmbiguity = mission.parameters.has_ambiguity as boolean;
    if (!hasAmbiguity) return 70;

    const exploratory = (batch.aggregated_data.exploratory_actions_count as number) ?? 0;
    const premature = (batch.aggregated_data.premature_decisions_count as number) ?? 0;

    if (premature === 0 && exploratory > 0) return 100;
    if (exploratory === 0 && premature > 0) return 0;
    if (exploratory === 0 && premature === 0) return 50;

    const taRatio = exploratory / (exploratory + premature);
    const score = Math.min(100, taRatio * 100 + mission.difficulty_level * 2);
    return Math.round(score * 100) / 100;
  }

  /**
   * Orquestra o cálculo de todas as métricas cognitivas para um lote.
   */
  processBatchForCognition(
    batch: ProcessedTelemetryBatch,
    mission: MissionContext,
    baseline: UserBaseline
  ): Record<string, CognitiveMetric> {
    const timestamp = batch.end_timestamp_ms;
    const context = {
      session_id: batch.session_id,
      mission_difficulty: mission.difficulty_level,
    };

    return {
      LD: {
        user_id: batch.user_id,
        mission_id: batch.mission_id,
        metric_type: 'LD',
        value: this.calculateLD(batch, mission, baseline),
        timestamp_ms: timestamp,
        context,
      },
      RA: {
        user_id: batch.user_id,
        mission_id: batch.mission_id,
        metric_type: 'RA',
        value: this.calculateRA(batch, mission),
        timestamp_ms: timestamp,
        context,
      },
      TA: {
        user_id: batch.user_id,
        mission_id: batch.mission_id,
        metric_type: 'TA',
        value: this.calculateTA(batch, mission),
        timestamp_ms: timestamp,
        context,
      },
    };
  }
}
