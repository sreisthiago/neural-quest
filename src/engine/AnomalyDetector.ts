// ═══════════════════════════════════════════════════════════════
// Neural Quest V5.0 — Detector de Anomalias (ISN)
// Camada de Inviolabilidade do Sistema Neural
// Transposto de anomaly_detector.py
// ═══════════════════════════════════════════════════════════════

import type { ProcessedTelemetryBatch, AnomalyReport, UserBaseline } from './models';

interface Thresholds {
  max_keypress_rate: number;
  min_reaction_time_ms: number;
  max_consistent_intervals_ratio: number;
}

export class AnomalyDetector {
  private thresholds: Thresholds = {
    max_keypress_rate: 15.0,
    min_reaction_time_ms: 100.0,
    max_consistent_intervals_ratio: 0.85,
  };

  /** Detecta comportamentos típicos de bots ou scripts. */
  private detectBotBehavior(
    batch: ProcessedTelemetryBatch
  ): AnomalyReport | null {
    const now = Date.now();

    // Taxa de keypress sobre-humana
    if (
      batch.keypress_rate !== null &&
      batch.keypress_rate > this.thresholds.max_keypress_rate
    ) {
      return {
        user_id: batch.user_id,
        session_id: batch.session_id,
        mission_id: batch.mission_id,
        anomaly_type: 'superhuman_speed',
        severity: 'high',
        score: 0.95,
        details: {
          keypress_rate: batch.keypress_rate,
          threshold: this.thresholds.max_keypress_rate,
        },
        timestamp_ms: now,
      };
    }

    // Tempo de reação impossível
    if (
      batch.avg_reaction_time_ms !== null &&
      batch.avg_reaction_time_ms < this.thresholds.min_reaction_time_ms
    ) {
      return {
        user_id: batch.user_id,
        session_id: batch.session_id,
        mission_id: batch.mission_id,
        anomaly_type: 'inhuman_reaction_time',
        severity: 'high',
        score: 0.9,
        details: {
          avg_reaction_time_ms: batch.avg_reaction_time_ms,
          threshold: this.thresholds.min_reaction_time_ms,
        },
        timestamp_ms: now,
      };
    }

    // Anomalia detectada na borda
    if (batch.edge_anomaly_detected) {
      return {
        user_id: batch.user_id,
        session_id: batch.session_id,
        mission_id: batch.mission_id,
        anomaly_type: 'edge_detected_script',
        severity: 'medium',
        score: 0.75,
        details: { reason: 'Ritmo constante detectado na borda (Edge)' },
        timestamp_ms: now,
      };
    }

    return null;
  }

  /** Detecta desvios significativos da baseline do usuário. */
  private detectBaselineDeviation(
    batch: ProcessedTelemetryBatch,
    baseline: UserBaseline
  ): AnomalyReport | null {
    if (!batch.avg_reaction_time_ms || !baseline.reaction_time_ms) {
      return null;
    }

    const deviation = Math.abs(
      batch.avg_reaction_time_ms - baseline.reaction_time_ms
    );

    // 3 desvios-padrão (simplificado via jitter)
    if (deviation > baseline.reaction_time_jitter * 3) {
      const isFaster = batch.avg_reaction_time_ms < baseline.reaction_time_ms;

      return {
        user_id: batch.user_id,
        session_id: batch.session_id,
        mission_id: batch.mission_id,
        anomaly_type: isFaster
          ? 'suspicious_improvement_possible_account_sharing'
          : 'severe_cognitive_fatigue',
        severity: isFaster ? 'high' : 'medium',
        score: 0.8,
        details: {
          current_rt: batch.avg_reaction_time_ms,
          baseline_rt: baseline.reaction_time_ms,
          deviation,
          allowed_jitter: baseline.reaction_time_jitter,
        },
        timestamp_ms: Date.now(),
      };
    }

    return null;
  }

  /** Analisa um lote de telemetria em busca de anomalias. */
  analyzeBatch(
    batch: ProcessedTelemetryBatch,
    baseline: UserBaseline
  ): AnomalyReport[] {
    const reports: AnomalyReport[] = [];

    const botReport = this.detectBotBehavior(batch);
    if (botReport) reports.push(botReport);

    const baselineReport = this.detectBaselineDeviation(batch, baseline);
    if (baselineReport) reports.push(baselineReport);

    return reports;
  }
}
