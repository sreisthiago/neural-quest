// ═══════════════════════════════════════════════════════════════
// Neural Quest V5.0 — Hook do Oracle Engine
// Conecta o motor cognitivo ao ciclo de vida React
// ═══════════════════════════════════════════════════════════════

import { useState, useRef, useCallback } from 'react';
import {
  OracleEngineV5,
  type TelemetryEvent,
  type MissionContext,
  type OperationalDNA,
  type AnomalyReport,
  type CodexDigital,
  type CognitiveMetric,
} from '../engine';

interface EngineState {
  dna: OperationalDNA | null;
  anomalies: AnomalyReport[];
  codex: CodexDigital[];
  metrics: Record<string, CognitiveMetric> | null;
  eventLog: TelemetryEvent[];
  isProcessing: boolean;
  missionsCompleted: number;
}

export function useOracleEngine() {
  const engineRef = useRef(new OracleEngineV5());

  const [state, setState] = useState<EngineState>({
    dna: null,
    anomalies: [],
    codex: [],
    metrics: null,
    eventLog: [],
    isProcessing: false,
    missionsCompleted: 0,
  });

  const addEvent = useCallback((event: TelemetryEvent) => {
    setState((prev) => ({
      ...prev,
      eventLog: [...prev.eventLog.slice(-99), event],
    }));
  }, []);

  const processStream = useCallback(
    async (events: TelemetryEvent[], mission: MissionContext) => {
      setState((prev) => ({ ...prev, isProcessing: true }));

      try {
        const result = await engineRef.current.processTelemetryStream(
          events,
          mission
        );

        setState((prev) => ({
          ...prev,
          dna: result.dna,
          anomalies: [...prev.anomalies, ...result.anomalies],
          codex: [...engineRef.current.suggestedCodex],
          metrics: result.metrics,
          isProcessing: false,
          missionsCompleted: prev.missionsCompleted + 1,
        }));

        return result;
      } catch (error) {
        setState((prev) => ({ ...prev, isProcessing: false }));
        throw error;
      }
    },
    []
  );

  const resetEngine = useCallback(() => {
    engineRef.current = new OracleEngineV5();
    setState({
      dna: null,
      anomalies: [],
      codex: [],
      metrics: null,
      eventLog: [],
      isProcessing: false,
      missionsCompleted: 0,
    });
  }, []);

  return {
    ...state,
    addEvent,
    processStream,
    resetEngine,
    engine: engineRef.current,
  };
}
