// ═══════════════════════════════════════════════════════════════
// Neural Quest V5.0 — Power-Up Trail Engine
// Integração LMS ↔ Motor Oráculo: Curva de Aprendizado,
// Validação de Proficiência, Nudge, Match Score
// ═══════════════════════════════════════════════════════════════

import type {
  PowerUpTrail,
  TrailCheckpoint,
  TrailLoreChapter,
  LearningCurve,
  LearningCurvePoint,
  CognitiveMetric,
  MissionContext,
  PerformanceMatch,
  JobPosting,
  ReinforcementNudge,
  OperationalDNA,
} from './models';

// ── Dados de trilhas disponíveis (conteúdo imersivo) ──────────

interface TrailTemplate {
  trail_id: string;
  title: string;
  subject: string;
  description: string;
  icon_emoji: string;
  difficulty_level: number;
  lore: TrailLoreChapter[];
  checkpoint_missions: MissionContext[];
}

export const TRAIL_TEMPLATES: TrailTemplate[] = [
  {
    trail_id: 'trail_gestao_crise',
    title: 'Gestão de Crise',
    subject: 'Gestão de Crise',
    description:
      'Navegue por cenários de alto impacto e prove sua capacidade de liderar sob pressão extrema.',
    icon_emoji: '🔥',
    difficulty_level: 8,
    lore: [
      {
        chapter_id: 'gc_ch1',
        title: 'Capítulo I — O Protocolo Quebrado',
        lore_text:
          'A Estação Nexus-7 opera em silêncio há 342 dias. Hoje, às 03:47h, o protocolo de segurança Delta-9 disparou sem causa aparente. Você é o Comandante de Turno. Os sistemas mostram leituras conflitantes — o reator principal indica sobrecarga, mas os sensores secundários mostram valores normais. Sua equipe de 12 operadores espera sua ordem. O manual diz "evacuar", mas a última evacuação falsa custou 2.3 milhões de créditos e 3 demissões.',
        illustration_emoji: '🚨',
      },
      {
        chapter_id: 'gc_ch2',
        title: 'Capítulo II — O Fator Humano',
        lore_text:
          'Enquanto você analisa os dados do reator, a Engenheira-Chefe Vasquez entra na sala com uma expressão que você nunca viu nela. "Comandante, preciso falar em particular." Ela revela que há 3 semanas um técnico júnior relatou uma micro-fissura no sistema de refrigeração, mas o relatório foi arquivado pelo turno anterior para "não criar pânico". Agora as leituras começam a fazer sentido — mas será que é tarde demais?',
        illustration_emoji: '🧑‍🔬',
      },
      {
        chapter_id: 'gc_ch3',
        title: 'Capítulo III — Cascata de Falhas',
        lore_text:
          'Exatamente 14 minutos após o alerta inicial, o sistema de comunicação externa cai. Você está isolado. O reator mostra uma curva de temperatura ascendente — lenta, mas constante. A equipe médica reporta que dois técnicos do turno anterior estão com sintomas de exposição leve. O relógio não para. Cada decisão tomada agora terá consequências que serão analisadas por meses.',
        illustration_emoji: '⚡',
      },
      {
        chapter_id: 'gc_ch4',
        title: 'Capítulo IV — O Dilema do Comandante',
        lore_text:
          'Vasquez apresenta duas opções: Opção Alpha — shutdown controlado do reator, que salva a estação mas destrói 18 meses de pesquisa em andamento e custa a carreira de quem deu a ordem se for alarme falso. Opção Beta — procedimento de contenção parcial, que preserva a pesquisa mas mantém o risco ativo por mais 6 horas até a equipe de emergência chegar. Não existe Opção C. O silêncio na sala é ensurdecedor.',
        illustration_emoji: '⚖️',
      },
      {
        chapter_id: 'gc_ch5',
        title: 'Capítulo V — Sob Pressão Máxima',
        lore_text:
          'Sua decisão foi tomada. Mas agora vem o mais difícil: a execução. Três membros da equipe discordam abertamente da sua escolha. Um deles, o veterano Torres, ameaça registrar uma objeção formal. Enquanto isso, os indicadores continuam mudando. Cada segundo de hesitação é registrado. Cada micro-expressão de dúvida é percebida pela equipe. Liderar não é apenas decidir — é sustentar a decisão enquanto o mundo treme ao redor.',
        illustration_emoji: '🎯',
      },
      {
        chapter_id: 'gc_ch6',
        title: 'Capítulo VI — O Relatório Final',
        lore_text:
          'A crise foi contida. Agora, 72 horas depois, você precisa redigir o relatório que definirá responsabilidades, lições aprendidas e recomendações. Mas os dados brutos contam uma história mais complexa do que qualquer narrativa simplificada. Como você equilibra transparência com proteção da equipe? Como transforma caos em aprendizado institucional? Este é o último teste — e talvez o mais revelador.',
        illustration_emoji: '📋',
      },
    ],
    checkpoint_missions: Array.from({ length: 6 }, (_, i) => ({
      mission_id: `gc_checkpoint_${i + 1}`,
      mission_type: i < 2 ? 'decision_making' : i < 4 ? 'problem_solving' : 'ethical_reasoning',
      difficulty_level: 5 + i,
      expected_actions: ['analyze', 'decide', 'adapt'],
      critical_decisions: [`gc_decision_${i + 1}`],
      correct_path_events: [],
      time_limits_ms: i % 2 === 0 ? { primary: 30000 } : {} as Record<string, number>,
      parameters: { has_ambiguity: true, checkpoint_index: i + 1 },
    })) as MissionContext[],
  },
  {
    trail_id: 'trail_logica_booleana',
    title: 'Lógica Booleana',
    subject: 'Lógica Booleana',
    description:
      'Domine os fundamentos da lógica computacional através de enigmas que desafiam seu raciocínio.',
    icon_emoji: '🧮',
    difficulty_level: 6,
    lore: [
      {
        chapter_id: 'lb_ch1',
        title: 'Capítulo I — As Portas do Oráculo',
        lore_text:
          'No subsolo da Cidadela Digital, existe uma sala que poucos conhecem: a Câmara das Portas Lógicas. Cada porta responde apenas a combinações específicas de verdade e falsidade. Os antigos programadores diziam que quem domina as portas, domina a realidade. Sua primeira tarefa: entender que AND, OR e NOT não são apenas operadores — são a linguagem fundamental do universo digital.',
        illustration_emoji: '🚪',
      },
      {
        chapter_id: 'lb_ch2',
        title: 'Capítulo II — O Paradoxo do Guardião',
        lore_text:
          'O Guardião da segunda porta faz apenas uma pergunta: "Se eu disser que esta porta está trancada, e a porta ao lado está aberta, e pelo menos uma dessas afirmações é verdadeira... você entra por qual?" Tabelas-verdade não são exercícios abstratos — são mapas de sobrevivência. Cada linha é um cenário possível, cada coluna é uma variável que pode salvar ou destruir.',
        illustration_emoji: '🤖',
      },
      {
        chapter_id: 'lb_ch3',
        title: 'Capítulo III — Circuitos Vivos',
        lore_text:
          'Além das portas, o corredor revela uma parede inteira de circuitos pulsantes. Cada um representa uma expressão booleana complexa. XOR — a porta do "ou exclusivo" — brilha com uma luz diferente. "Apenas um pode ser verdadeiro", sussurra o circuito. Aqui você aprende que a elegância está na simplificação: expressões complexas podem ser reduzidas a formas mínimas.',
        illustration_emoji: '⚡',
      },
      {
        chapter_id: 'lb_ch4',
        title: 'Capítulo IV — Álgebra das Sombras',
        lore_text:
          'A Câmara se aprofunda. As Leis de De Morgan ecoam nas paredes: "A negação da conjunção é a disjunção das negações." Parece abstrato até que você percebe: cada sistema de segurança, cada firewall, cada algoritmo de busca depende dessas leis. Dominar De Morgan é ter raio-X para ver através de qualquer sistema lógico.',
        illustration_emoji: '🌑',
      },
      {
        chapter_id: 'lb_ch5',
        title: 'Capítulo V — Mapas de Karnaugh',
        lore_text:
          'No penúltimo nível, as expressões booleanas se tornam tridimensionais. Os Mapas de Karnaugh flutuam no ar como hologramas — ferramentas visuais para simplificar o que parece impossível. Quatro variáveis, dezesseis combinações, e você precisa encontrar o padrão oculto. A velocidade importa, mas a precisão é inegociável.',
        illustration_emoji: '🗺️',
      },
      {
        chapter_id: 'lb_ch6',
        title: 'Capítulo VI — O Arquiteto Digital',
        lore_text:
          'A última porta se abre para uma sala vazia — exceto por um terminal. A tela mostra: "Projete um circuito que resolva o seguinte problema real..." Aqui, teoria vira prática. Você não está mais resolvendo exercícios — está construindo soluções. Cada porta lógica que você posiciona é uma decisão de design que afetará milhares de operações por segundo.',
        illustration_emoji: '🏗️',
      },
    ],
    checkpoint_missions: Array.from({ length: 6 }, (_, i) => ({
      mission_id: `lb_checkpoint_${i + 1}`,
      mission_type: 'pattern_recognition',
      difficulty_level: 4 + i,
      expected_actions: ['solve', 'verify', 'optimize'],
      critical_decisions: [`lb_decision_${i + 1}`],
      correct_path_events: [],
      time_limits_ms: { primary: 45000 } as Record<string, number>,
      parameters: { has_ambiguity: i >= 3, checkpoint_index: i + 1 },
    })) as MissionContext[],
  },
  {
    trail_id: 'trail_compliance_nr1',
    title: 'Compliance NR-1',
    subject: 'Compliance NR 1',
    description:
      'Domine a Norma Regulamentadora 1 através de simulações que testam sua aplicação prática.',
    icon_emoji: '📜',
    difficulty_level: 7,
    lore: [
      {
        chapter_id: 'nr1_ch1',
        title: 'Capítulo I — O Incidente na Planta',
        lore_text:
          'Terça-feira, 14h23. Planta industrial Setor Norte. Um operador novo relata tontura e dor de cabeça, mas o supervisor de turno minimiza: "É só o calor." Três horas depois, o operador desmaia. A NR-1 existe exatamente para este momento — ela é a norma-mãe, a fundação sobre a qual todas as outras se apoiam. Você é o novo Analista de Segurança e precisa entender: o que falhou aqui não foi um acidente — foi um sistema.',
        illustration_emoji: '🏭',
      },
      {
        chapter_id: 'nr1_ch2',
        title: 'Capítulo II — Direitos e Responsabilidades',
        lore_text:
          'Na sala de reuniões, o Diretor Industrial faz a pergunta que ninguém quer responder: "Quem é responsável?" A NR-1 é clara: empregador E empregado têm obrigações. O PGR (Programa de Gerenciamento de Riscos) deveria ter identificado o risco térmico. O ASO (Atestado de Saúde Ocupacional) deveria estar atualizado. O treinamento deveria ter sido dado. Mas entre o "deveria" e o "foi feito" existe um abismo onde acidentes acontecem.',
        illustration_emoji: '⚖️',
      },
      {
        chapter_id: 'nr1_ch3',
        title: 'Capítulo III — O Mapa de Riscos',
        lore_text:
          'Você começa a reconstruir o GRO (Gerenciamento de Riscos Ocupacionais) da planta. Cada setor é um território com seus próprios perigos — físicos, químicos, biológicos, ergonômicos. A NR-1 exige que cada risco seja identificado, avaliado e controlado. Não em teoria — na prática, no chão de fábrica, com nomes e datas. O inventário de riscos não é burocracia — é um mapa de sobrevivência.',
        illustration_emoji: '🗺️',
      },
      {
        chapter_id: 'nr1_ch4',
        title: 'Capítulo IV — Capacitação ou Teatro?',
        lore_text:
          'Revisando os registros de treinamento, você descobre algo perturbador: 87% dos funcionários assinaram a lista de presença do treinamento de segurança, mas quando entrevistados, menos de 30% conseguem descrever os procedimentos de emergência. A NR-1 não pede "presença" — pede "capacitação". Existe uma diferença oceânica entre as duas. Como transformar treinamento em competência real e mensurável?',
        illustration_emoji: '🎓',
      },
      {
        chapter_id: 'nr1_ch5',
        title: 'Capítulo V — A Fiscalização',
        lore_text:
          'O Auditor Fiscal do Trabalho chegou. Sem aviso. Com uma prancheta digital e perguntas cirúrgicas. "Mostre-me o inventário de riscos atualizado. Mostre-me os registros de capacitação com avaliação de aprendizagem. Mostre-me o plano de ação para os riscos classificados como inaceitáveis." Cada documento que falta é uma multa. Cada inconsistência é uma evidência. Este é o teste real.',
        illustration_emoji: '🔍',
      },
      {
        chapter_id: 'nr1_ch6',
        title: 'Capítulo VI — Cultura de Prevenção',
        lore_text:
          'Seis meses depois. A planta mudou. Não por causa das multas — por causa da cultura. Você implementou um sistema onde cada operador é também um observador de segurança. Os quase-acidentes são reportados sem medo de punição. O PGR é um documento vivo, atualizado mensalmente. A NR-1 deixou de ser "a norma que o auditor cobra" e virou "a forma como trabalhamos". Esta é a verdadeira conformidade.',
        illustration_emoji: '🛡️',
      },
    ],
    checkpoint_missions: Array.from({ length: 6 }, (_, i) => ({
      mission_id: `nr1_checkpoint_${i + 1}`,
      mission_type: i < 3 ? 'decision_making' : 'ethical_reasoning',
      difficulty_level: 5 + i,
      expected_actions: ['identify_risk', 'apply_protocol', 'justify'],
      critical_decisions: [`nr1_decision_${i + 1}`],
      correct_path_events: [],
      time_limits_ms: i === 4 ? { primary: 20000 } : {} as Record<string, number>,
      parameters: { has_ambiguity: true, checkpoint_index: i + 1 },
    })) as MissionContext[],
  },
];

// ── Engine da Trilha de Poder ──────────────────────────────────

export class PowerUpTrailEngine {
  private learningCurves: Map<string, LearningCurve> = new Map();
  private nudges: ReinforcementNudge[] = [];

  /** Inicializa uma trilha para o usuário */
  initTrail(_userId: string, template: TrailTemplate): PowerUpTrail {
    const checkpoints: TrailCheckpoint[] = template.checkpoint_missions.map(
      (mc, i) => ({
        checkpoint_index: i + 1,
        mission_context: mc,
        status: i === 0 ? 'available' : 'locked',
        metrics_snapshot: null,
        completed_at_ms: null,
      })
    );

    return {
      trail_id: template.trail_id,
      title: template.title,
      subject: template.subject,
      description: template.description,
      icon_emoji: template.icon_emoji,
      difficulty_level: template.difficulty_level,
      lore_chapters: template.lore,
      checkpoints,
      status: 'not_started',
      started_at_ms: null,
      completed_at_ms: null,
      certificate_hash: null,
    };
  }

  /** Registra resultado de um checkpoint e calcula curva de aprendizado */
  completeCheckpoint(
    trail: PowerUpTrail,
    checkpointIndex: number,
    metrics: Record<string, CognitiveMetric>
  ): {
    updatedTrail: PowerUpTrail;
    nudge: ReinforcementNudge | null;
    curvePoint: LearningCurvePoint;
  } {
    const cp = trail.checkpoints[checkpointIndex - 1];
    if (!cp) throw new Error(`Checkpoint ${checkpointIndex} não encontrado`);

    // Registrar métricas
    cp.metrics_snapshot = metrics;
    cp.status = 'completed';
    cp.completed_at_ms = Date.now();

    // Calcular ponto da curva de aprendizado
    const ld = metrics.LD?.value ?? 50;
    const ra = metrics.RA?.value ?? 50;
    const ta = metrics.TA?.value ?? 50;

    // Calcular IIV (Intra-Individual Variability) — quanto variou em relação ao anterior
    const curveKey = `${trail.trail_id}_${cp.mission_context.mission_id}`;
    let prevCurve = this.learningCurves.get(trail.trail_id);
    let iiv = 0;

    if (prevCurve && prevCurve.points.length > 0) {
      const prev = prevCurve.points[prevCurve.points.length - 1];
      iiv = Math.sqrt(
        Math.pow(ld - prev.ld, 2) +
        Math.pow(ra - prev.ra, 2) +
        Math.pow(ta - prev.ta, 2)
      ) / 3;
    }

    // ES (Eficiência Sináptica) = média ponderada das métricas + penalização por variabilidade
    const es = Math.max(0, ((ld + ra + ta) / 3) - (iiv * 0.5));

    const curvePoint: LearningCurvePoint = {
      checkpoint_index: checkpointIndex,
      ld,
      ra,
      ta,
      iiv: Math.round(iiv * 100) / 100,
      es: Math.round(es * 100) / 100,
      timestamp_ms: Date.now(),
    };

    // Atualizar curva de aprendizado
    if (!prevCurve) {
      prevCurve = {
        trail_id: trail.trail_id,
        user_id: 'current_user',
        points: [],
        cognitive_automation_detected: false,
        es_above_baseline: false,
        certified: false,
      };
      this.learningCurves.set(trail.trail_id, prevCurve);
    }
    prevCurve.points.push(curvePoint);

    // Detectar Automatização Cognitiva: LD estabilizou + IIV baixa nos últimos 3 checkpoints
    if (prevCurve.points.length >= 3) {
      const last3 = prevCurve.points.slice(-3);
      const avgIIV = last3.reduce((s, p) => s + p.iiv, 0) / 3;
      const ldStable =
        Math.abs(last3[0].ld - last3[2].ld) < 10;
      prevCurve.cognitive_automation_detected = avgIIV < 8 && ldStable;
    }

    // Verificar ES acima da baseline (baseline da guilda = 55)
    const GUILD_BASELINE_ES = 55;
    const allAbove = prevCurve.points.every((p) => p.es >= GUILD_BASELINE_ES);
    prevCurve.es_above_baseline = allAbove;

    // ── Motor de Recomendação: Nudge se RA falhar ──
    let nudge: ReinforcementNudge | null = null;
    if (ra < 50) {
      nudge = {
        nudge_id: `nudge_${curveKey}_${Date.now()}`,
        user_id: 'current_user',
        trail_id: trail.trail_id,
        checkpoint_index: checkpointIndex,
        metric_failed: 'RA',
        micro_content_title: 'Micro-Módulo: Estratégias de Recuperação',
        micro_content_description:
          'Sua Resiliência Adaptativa está abaixo do ideal. Este micro-conteúdo focado em técnicas de recuperação cognitiva irá fortalecer sua capacidade de aprender com erros antes de avançar.',
        status: 'pending',
      };
      this.nudges.push(nudge);
    }

    if (ld < 40) {
      nudge = {
        nudge_id: `nudge_ld_${curveKey}_${Date.now()}`,
        user_id: 'current_user',
        trail_id: trail.trail_id,
        checkpoint_index: checkpointIndex,
        metric_failed: 'LD',
        micro_content_title: 'Micro-Módulo: Foco sob Pressão',
        micro_content_description:
          'Sua Latência de Decisão indica hesitação excessiva. Este micro-conteúdo trabalhará técnicas de priorização rápida e frameworks de decisão.',
        status: 'pending',
      };
      this.nudges.push(nudge);
    }

    // Desbloquear próximo checkpoint (se não houver nudge bloqueante de RA)
    if (checkpointIndex < 6) {
      const nextCp = trail.checkpoints[checkpointIndex];
      if (nextCp) {
        nextCp.status = nudge && nudge.metric_failed === 'RA' ? 'locked' : 'available';
      }
    }

    // Status da trilha
    if (trail.status === 'not_started') {
      trail.status = 'in_progress';
      trail.started_at_ms = Date.now();
    }

    const allCompleted = trail.checkpoints.every((c) => c.status === 'completed');
    if (allCompleted) {
      trail.status = prevCurve.es_above_baseline ? 'certified' : 'completed';
      trail.completed_at_ms = Date.now();
      prevCurve.certified = prevCurve.es_above_baseline;
      if (prevCurve.certified) {
        trail.certificate_hash = this.generateCertificateHash(trail);
      }
    }

    return {
      updatedTrail: { ...trail },
      nudge,
      curvePoint,
    };
  }

  /** Gera hash de certificação baseado nos dados da trilha */
  private generateCertificateHash(trail: PowerUpTrail): string {
    const data = `${trail.trail_id}:${trail.checkpoints
      .map((c) => `${c.checkpoint_index}:${c.completed_at_ms}`)
      .join(',')}:${Date.now()}`;
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    return `NQ5-CERT-${Math.abs(hash).toString(16).toUpperCase().padStart(8, '0')}`;
  }

  /** Calcula EMA (Exponential Moving Average) da Eficiência Sináptica */
  calculateESEma(curves: LearningCurve[], alpha: number = 0.3): number {
    const allPoints = curves
      .flatMap((c) => c.points)
      .sort((a, b) => a.timestamp_ms - b.timestamp_ms);

    if (allPoints.length === 0) return 0;

    let ema = allPoints[0].es;
    for (let i = 1; i < allPoints.length; i++) {
      ema = alpha * allPoints[i].es + (1 - alpha) * ema;
    }
    return Math.round(ema * 100) / 100;
  }

  /** Generate_Match_Score: Cruza requisitos da vaga com dados do usuário */
  generateMatchScore(
    job: JobPosting,
    dna: OperationalDNA,
    completedTrailIds: string[]
  ): PerformanceMatch {
    const ld = dna.latency_decision ?? 0;
    const ra = dna.resilience_adaptive ?? 0;
    const ta = dna.tolerance_ambiguity ?? 0;

    // Match por métrica: quanto mais próximo ou acima do requisito, melhor
    const ldMatch = Math.min(100, (ld / Math.max(1, job.required_ld)) * 100);
    const raMatch = Math.min(100, (ra / Math.max(1, job.required_ra)) * 100);
    const taMatch = Math.min(100, (ta / Math.max(1, job.required_ta)) * 100);

    // Relevância das trilhas completadas
    const requiredTrails = job.required_trails;
    const matchedTrails = requiredTrails.filter((t) =>
      completedTrailIds.includes(t)
    );
    const trailRelevance =
      requiredTrails.length > 0
        ? (matchedTrails.length / requiredTrails.length) * 100
        : 100;

    // Score final ponderado
    const matchScore = Math.round(
      ldMatch * 0.25 + raMatch * 0.25 + taMatch * 0.25 + trailRelevance * 0.25
    );

    return {
      match_id: `match_${job.vaga_id}_${dna.user_id}_${Date.now()}`,
      user_id: dna.user_id,
      vaga_id: job.vaga_id,
      vaga_title: job.title,
      company: job.company,
      match_score: matchScore,
      breakdown: {
        ld_match: Math.round(ldMatch),
        ra_match: Math.round(raMatch),
        ta_match: Math.round(taMatch),
        trail_relevance: Math.round(trailRelevance),
      },
      proven_trails: matchedTrails,
      generated_at_ms: Date.now(),
    };
  }

  /** Obtém a curva de aprendizado de uma trilha */
  getLearningCurve(trailId: string): LearningCurve | null {
    return this.learningCurves.get(trailId) ?? null;
  }

  /** Obtém todos os nudges pendentes */
  getPendingNudges(): ReinforcementNudge[] {
    return this.nudges.filter((n) => n.status === 'pending');
  }

  /** Marca nudge como visualizado/completo */
  resolveNudge(nudgeId: string): void {
    const nudge = this.nudges.find((n) => n.nudge_id === nudgeId);
    if (nudge) nudge.status = 'completed';
  }
}
