// ═══════════════════════════════════════════════════════════════
// Neural Quest V5.0 — Oracle Engine V5.0
// O Orquestrador Central do Teatro de Operações Cognitivas
// Transposto de main_engine.py
// ═══════════════════════════════════════════════════════════════

import type {
  TelemetryEvent,
  CognitiveMetric,
  OperationalDNA,
  AnomalyReport,
  MissionContext,
  UserBaseline,
  CodexDigital,
} from './models';
import { TelemetryProcessor } from './TelemetryProcessor';
import { CognitiveLogic } from './CognitiveLogic';
import { AnomalyDetector } from './AnomalyDetector';

export class OracleEngineV5 {
  private telemetryProcessor = new TelemetryProcessor();
  private cognitiveLogic = new CognitiveLogic();
  private anomalyDetector = new AnomalyDetector();

  // Stores (em produção seriam bancos de dados)
  public userDNAs: Map<string, OperationalDNA> = new Map();
  public userBaselines: Map<string, UserBaseline> = new Map();
  public suggestedCodex: CodexDigital[] = [];
  public anomalyHistory: AnomalyReport[] = [];

  /** Obtém ou cria baseline padrão para um usuário. */
  private getOrCreateBaseline(userId: string): UserBaseline {
    if (!this.userBaselines.has(userId)) {
      this.userBaselines.set(userId, {
        user_id: userId,
        last_calibrated_ms: Date.now(),
        reaction_time_ms: 750,
        keypress_rate: 3.0,
        mouse_speed_px_s: 100,
        reaction_time_jitter: 50,
        calibration_context: {},
      });
    }
    return this.userBaselines.get(userId)!;
  }

  /** Atualiza o DNA Operacional com novas métricas. */
  private updateDNA(
    userId: string,
    metrics: Record<string, CognitiveMetric>
  ): OperationalDNA {
    if (!this.userDNAs.has(userId)) {
      this.userDNAs.set(userId, {
        user_id: userId,
        last_updated_ms: Date.now(),
        latency_decision: null,
        resilience_adaptive: null,
        tolerance_ambiguity: null,
        cognitive_profile: {},
        history: [],
        dynamic_baseline: {},
      });
    }

    const dna = this.userDNAs.get(userId)!;

    if (metrics.LD) dna.latency_decision = metrics.LD.value;
    if (metrics.RA) dna.resilience_adaptive = metrics.RA.value;
    if (metrics.TA) dna.tolerance_ambiguity = metrics.TA.value;
    dna.last_updated_ms = Date.now();

    dna.history.push({
      timestamp_ms: dna.last_updated_ms,
      LD: dna.latency_decision,
      RA: dna.resilience_adaptive,
      TA: dna.tolerance_ambiguity,
    });

    return { ...dna };
  }

  /** Sugere Codex Digitais baseados nas lacunas cognitivas. */
  private suggestCodex(
    userId: string,
    metrics: Record<string, CognitiveMetric>
  ): CodexDigital[] {
    const newCodex: CodexDigital[] = [];

    if (metrics.LD && metrics.LD.value < 60) {
      const codex: CodexDigital = {
        codex_id: `codex_ld_${userId}_${Date.now()}`,
        user_id: userId,
        title: 'Aprimorando a Tomada de Decisão',
        description:
          'Técnicas para reduzir a latência de decisão e melhorar o foco sob pressão.',
        suggested_by_metric: 'LD',
        content_url: 'https://neuralquest.io/books/decisao_rapida',
        suggested_at_ms: Date.now(),
        status: 'pending',
      };
      newCodex.push(codex);
      this.suggestedCodex.push(codex);
    }

    if (metrics.RA && metrics.RA.value < 70) {
      const codex: CodexDigital = {
        codex_id: `codex_ra_${userId}_${Date.now()}`,
        user_id: userId,
        title: 'Cultivando a Resiliência Adaptativa',
        description:
          'Guia para desenvolver a capacidade de se recuperar de falhas e adaptar estratégias.',
        suggested_by_metric: 'RA',
        content_url: 'https://neuralquest.io/books/resiliencia_adaptativa',
        suggested_at_ms: Date.now(),
        status: 'pending',
      };
      newCodex.push(codex);
      this.suggestedCodex.push(codex);
    }

    if (metrics.TA && metrics.TA.value < 60) {
      const codex: CodexDigital = {
        codex_id: `codex_ta_${userId}_${Date.now()}`,
        user_id: userId,
        title: 'Navegando na Incerteza',
        description:
          'Estratégias para desenvolver tolerância à ambiguidade e prosperar em cenários incertos.',
        suggested_by_metric: 'TA',
        content_url: 'https://neuralquest.io/books/tolerancia_ambiguidade',
        suggested_at_ms: Date.now(),
        status: 'pending',
      };
      newCodex.push(codex);
      this.suggestedCodex.push(codex);
    }

    return newCodex;
  }

  /**
   * Processa um stream completo de telemetria para uma missão.
   * Pipeline: Edge Processing → Anomaly Detection → Cognitive Metrics → DNA Update → Codex
   */
  async processTelemetryStream(
    events: TelemetryEvent[],
    missionContext: MissionContext
  ): Promise<{
    dna: OperationalDNA;
    anomalies: AnomalyReport[];
    codex: CodexDigital[];
    metrics: Record<string, CognitiveMetric>;
  }> {
    const userId = events[0].user_id;
    const baseline = this.getOrCreateBaseline(userId);

    // 1. Processamento Edge-First
    const processedBatch = await this.telemetryProcessor.processBatch(events);

    // 2. Detecção de Anomalias (ISN)
    const anomalies = this.anomalyDetector.analyzeBatch(
      processedBatch,
      baseline
    );
    this.anomalyHistory.push(...anomalies);

    // 3. Cálculo Cognitivo (M.E.N.I.)
    const metrics = this.cognitiveLogic.processBatchForCognition(
      processedBatch,
      missionContext,
      baseline
    );

    // 4. Atualização do DNA Operacional
    const dna = this.updateDNA(userId, metrics);

    // 5. Sugestão de Codex Digitais
    const codex = this.suggestCodex(userId, metrics);

    return { dna, anomalies, codex, metrics };
  }
}
