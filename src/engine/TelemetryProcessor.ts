// ═══════════════════════════════════════════════════════════════
// Neural Quest V5.0 — Processador de Telemetria (Edge-First)
// Transposto de telemetry_processor.py
// ═══════════════════════════════════════════════════════════════

import type { TelemetryEvent, ProcessedTelemetryBatch } from './models';

export class TelemetryProcessor {
  /**
   * Calcula hash SHA-256 dos eventos para verificação de integridade.
   * No browser usamos a Web Crypto API.
   */
  private async calculateEventHash(events: TelemetryEvent[]): Promise<string> {
    const sorted = events
      .map((e) => JSON.stringify(e, Object.keys(e).sort()))
      .sort();
    const fullString = sorted.join('');
    const encoder = new TextEncoder();
    const data = encoder.encode(fullString);

    try {
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    } catch {
      // Fallback: simple hash for environments without crypto.subtle
      let hash = 0;
      for (let i = 0; i < fullString.length; i++) {
        const char = fullString.charCodeAt(i);
        hash = ((hash << 5) - hash + char) | 0;
      }
      return Math.abs(hash).toString(16).padStart(16, '0');
    }
  }

  /**
   * Processa um lote de eventos de telemetria bruta.
   * Aplica lógica Edge-First: pré-cálculos e detecção inicial de anomalias.
   */
  async processBatch(events: TelemetryEvent[]): Promise<ProcessedTelemetryBatch> {
    if (events.length === 0) {
      throw new Error('A lista de eventos não pode estar vazia.');
    }

    const sorted = [...events].sort((a, b) => a.timestamp_ms - b.timestamp_ms);
    const userId = sorted[0].user_id;
    const sessionId = sorted[0].session_id;
    const missionId = sorted[0].mission_id;
    const startTs = sorted[0].timestamp_ms;
    const endTs = sorted[sorted.length - 1].timestamp_ms;

    // --- Cálculos Edge-First ---
    const reactionTimes: number[] = [];
    let keypressCount = 0;
    const mouseMovements: { x: number; y: number; t: number }[] = [];
    let prevKeypressTs: number | null = null;
    const keypressIntervals: number[] = [];

    for (let i = 0; i < sorted.length; i++) {
      const event = sorted[i];

      if (event.event_type === 'decision' && i > 0) {
        reactionTimes.push(event.timestamp_ms - sorted[i - 1].timestamp_ms);
      }

      if (event.event_type === 'keypress') {
        keypressCount++;
        if (prevKeypressTs !== null) {
          keypressIntervals.push(event.timestamp_ms - prevKeypressTs);
        }
        prevKeypressTs = event.timestamp_ms;
      }

      if (
        event.event_type === 'mousemove' &&
        typeof event.payload.x === 'number' &&
        typeof event.payload.y === 'number'
      ) {
        mouseMovements.push({
          x: event.payload.x as number,
          y: event.payload.y as number,
          t: event.timestamp_ms,
        });
      }
    }

    const avgReactionTimeMs =
      reactionTimes.length > 0
        ? reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length
        : null;

    const durationSec = (endTs - startTs) / 1000;
    const keypressRate = durationSec > 0 ? keypressCount / durationSec : 0;

    // Detecção de anomalia: ritmo de keypress muito constante
    let edgeAnomalyDetected = false;
    let avgKeypressInterval: number | null = null;

    if (keypressIntervals.length > 5) {
      avgKeypressInterval =
        keypressIntervals.reduce((a, b) => a + b, 0) / keypressIntervals.length;

      const consistentCount = keypressIntervals.filter(
        (interval) => Math.abs(interval - avgKeypressInterval!) < avgKeypressInterval! * 0.1
      ).length;

      if (consistentCount / keypressIntervals.length > 0.8) {
        edgeAnomalyDetected = true;
      }
    }

    // Distância total do mouse
    let totalMouseDistance = 0;
    for (let i = 1; i < mouseMovements.length; i++) {
      const prev = mouseMovements[i - 1];
      const curr = mouseMovements[i];
      totalMouseDistance += Math.sqrt(
        (curr.x - prev.x) ** 2 + (curr.y - prev.y) ** 2
      );
    }

    const eventsHash = await this.calculateEventHash(sorted);

    return {
      user_id: userId,
      session_id: sessionId,
      mission_id: missionId,
      start_timestamp_ms: startTs,
      end_timestamp_ms: endTs,
      raw_events_count: sorted.length,
      avg_reaction_time_ms: avgReactionTimeMs,
      keypress_rate: keypressRate,
      mouse_movement_distance_px: totalMouseDistance,
      edge_anomaly_detected: edgeAnomalyDetected,
      events_hash: eventsHash,
      aggregated_data: {
        total_mouse_events: mouseMovements.length,
        total_keypress_events: keypressCount,
        avg_keypress_interval_ms: avgKeypressInterval,
      },
    };
  }
}
