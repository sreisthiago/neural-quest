// ═══════════════════════════════════════════════════════════════
// Neural Quest V5.0 — Verticais de Aplicação
// RH, Educação e Economia Prateada
// ═══════════════════════════════════════════════════════════════

import { Briefcase, GraduationCap, Heart, ArrowRight, CheckCircle2 } from 'lucide-react';

interface Vertical {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  color: string;
  gradient: string;
  features: string[];
  useCase: string;
}

const VERTICALS: Vertical[] = [
  {
    id: 'rh',
    icon: Briefcase,
    title: 'RH Corporativo',
    subtitle: 'Admissão & Treinamento',
    color: 'text-cyan-400',
    gradient: 'from-cyan-500 to-blue-600',
    features: [
      'Raids de Contratação em massa',
      'Wellness OS — Monitoramento de fadiga',
      'Requalificação contínua via Codex',
      'DNA Operacional como portfólio de competência',
      'Detecção de burnout via telemetria',
    ],
    useCase:
      'Substitui processos seletivos tradicionais por jornadas narrativas que revelam o potencial autêntico do candidato, eliminando vieses de entrevista.',
  },
  {
    id: 'educacao',
    icon: GraduationCap,
    title: 'Educação (7-18 anos)',
    subtitle: 'Mapeamento do Ciclo Escolar',
    color: 'text-emerald-400',
    gradient: 'from-emerald-500 to-teal-600',
    features: [
      'Substituição de provas por jornadas narrativas',
      'DNA Operacional evolutivo por ano letivo',
      'Identificação precoce de aptidões',
      'Gamificação com telemetria cognitiva',
      'Relatórios para pais e educadores',
    ],
    useCase:
      'Cada aluno carrega um DNA Operacional que evolui ao longo dos anos, criando um retrato multidimensional de competências que vai além de notas.',
  },
  {
    id: 'prateada',
    icon: Heart,
    title: 'Economia Prateada',
    subtitle: 'Neuroplasticidade & Bem-Estar',
    color: 'text-amber-400',
    gradient: 'from-amber-500 to-orange-600',
    features: [
      'Desafios adaptativos para neuroplasticidade',
      'Diversão terapêutica gamificada',
      'Monitoramento de declínio cognitivo',
      'Relatórios para profissionais de saúde',
      'Socialização via missões cooperativas',
    ],
    useCase:
      'Combate o declínio cognitivo através de desafios que se adaptam ao nível do usuário, transformando exercício mental em aventura narrativa.',
  },
];

export default function Verticais() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-white">Verticais de Aplicação</h2>
        <p className="mt-1 text-sm text-gray-400">
          A Neural Quest é infraestrutura de confiança cognitiva para múltiplos
          setores
        </p>
      </div>

      <div className="grid gap-4">
        {VERTICALS.map((v) => (
          <div
            key={v.id}
            className="group rounded-xl border border-gray-700/50 bg-gray-800/30 p-5 transition-all hover:border-gray-600"
          >
            <div className="flex items-start gap-4">
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${v.gradient}`}
              >
                <v.icon className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-white">
                  {v.title}
                </h3>
                <p className={`text-xs font-medium ${v.color}`}>
                  {v.subtitle}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-gray-400">
                  {v.useCase}
                </p>

                <div className="mt-3 grid gap-1.5 sm:grid-cols-2">
                  {v.features.map((feat) => (
                    <div
                      key={feat}
                      className="flex items-center gap-2 text-xs text-gray-500"
                    >
                      <CheckCircle2 className="h-3 w-3 shrink-0 text-violet-500" />
                      {feat}
                    </div>
                  ))}
                </div>

                <button className="mt-3 flex items-center gap-1 text-xs font-medium text-violet-400 transition-colors hover:text-violet-300">
                  Explorar vertical
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Business Model */}
      <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-5">
        <h3 className="mb-2 text-sm font-semibold text-violet-300">
          💰 Modelo de Negócios — Margem Infinita
        </h3>
        <div className="grid gap-3 text-xs leading-relaxed text-gray-400 sm:grid-cols-3">
          <div className="rounded-lg bg-black/20 p-3">
            <p className="mb-1 font-medium text-white">Faturamento Principal</p>
            <p>
              Venda de Livros Digitais/Físicos com ISBN próprio. Imunidade
              tributária garantida.
            </p>
          </div>
          <div className="rounded-lg bg-black/20 p-3">
            <p className="mb-1 font-medium text-white">Software como Brinde</p>
            <p>
              O simulador e skins são cedidos como ferramentas de teste
              vinculadas ao conteúdo.
            </p>
          </div>
          <div className="rounded-lg bg-black/20 p-3">
            <p className="mb-1 font-medium text-white">Ciclo de Monetização</p>
            <p>
              Sugestão automática de Codex Digitais baseada nas lacunas
              identificadas.
            </p>
          </div>
        </div>
      </div>

      {/* Roadmap */}
      <div className="rounded-xl border border-gray-700/50 bg-gray-800/30 p-5">
        <h3 className="mb-3 text-sm font-semibold text-gray-300">
          🗺️ Roadmap de 5 Anos
        </h3>
        <div className="space-y-3">
          {[
            {
              year: 'Ano 1',
              title: 'Fundação',
              desc: 'MVP com motor M.E.N.I., primeiras verticais RH e Educação, ISN básico.',
            },
            {
              year: 'Ano 2',
              title: 'Escala Nacional',
              desc: 'API aberta para parceiros, Economia Prateada, ML avançado (Isolation Forests).',
            },
            {
              year: 'Ano 3',
              title: 'Efeito de Rede',
              desc: 'DNA Operacional como credencial portátil, marketplace de Codex, dados federados.',
            },
            {
              year: 'Ano 4',
              title: 'Expansão Global',
              desc: 'Multilíngue, compliance GDPR/LGPD, parcerias governamentais, biometria passiva.',
            },
            {
              year: 'Ano 5',
              title: 'Infraestrutura Definitiva',
              desc: 'Padrão global de avaliação cognitiva, API certificada, rede descentralizada de confiança.',
            },
          ].map((step, i) => (
            <div key={i} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-500/20 text-xs font-bold text-violet-400">
                  {i + 1}
                </div>
                {i < 4 && <div className="h-full w-px bg-violet-500/20" />}
              </div>
              <div className="pb-3">
                <p className="text-xs font-medium text-violet-400">
                  {step.year}: {step.title}
                </p>
                <p className="text-xs text-gray-500">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
