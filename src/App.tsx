// ═══════════════════════════════════════════════════════════════
// Neural Quest V5.0 — Teatro de Operações Cognitivas
// Plataforma EdTech com Trilhas de Poder, Bureau, Dashboard
// ═══════════════════════════════════════════════════════════════

import { useState } from 'react';
import {
  Brain,
  LayoutDashboard,
  Crosshair,
  ShieldAlert,
  BookOpen,
  Layers,
  Menu,
  X,
  Dna,
  Swords,
  Briefcase,
  GraduationCap,
} from 'lucide-react';
import { useOracleEngine } from './hooks/useOracleEngine';
import Dashboard from './components/Dashboard';
import MissionSimulator from './components/MissionSimulator';
import AnomalyLog from './components/AnomalyLog';
import CodexPanel from './components/CodexPanel';
import Verticais from './components/Verticais';
import PowerUpTrail from './components/PowerUpTrail';
import BureauTalentos from './components/BureauTalentos';
import SchoolDashboard from './components/SchoolDashboard';

type Tab =
  | 'dashboard'
  | 'trails'
  | 'mission'
  | 'bureau'
  | 'escola'
  | 'anomalies'
  | 'codex'
  | 'verticais';

const TABS: {
  id: Tab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  section?: string;
}[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, section: 'CORE' },
  { id: 'trails', label: 'Trilhas de Poder', icon: Swords, section: 'CORE' },
  { id: 'mission', label: 'Missão Rápida', icon: Crosshair, section: 'CORE' },
  { id: 'bureau', label: 'Bureau de Talentos', icon: Briefcase, section: 'VERTICAIS' },
  { id: 'escola', label: 'Dashboard Escolar', icon: GraduationCap, section: 'VERTICAIS' },
  { id: 'anomalies', label: 'ISN (Anomalias)', icon: ShieldAlert, section: 'ENGINE' },
  { id: 'codex', label: 'Codex Digitais', icon: BookOpen, section: 'ENGINE' },
  { id: 'verticais', label: 'Sobre & Roadmap', icon: Layers, section: 'ENGINE' },
];

const USER_ID = 'operador_alpha';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [completedTrailIds, setCompletedTrailIds] = useState<string[]>([]);
  const engine = useOracleEngine();

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            dna={engine.dna}
            metrics={engine.metrics}
            anomalies={engine.anomalies}
            missionsCompleted={engine.missionsCompleted}
            eventCount={engine.eventLog.length}
          />
        );
      case 'trails':
        return (
          <PowerUpTrail
            userId={USER_ID}
            onProcessTelemetry={async (events, mission) => {
              const result = await engine.processStream(events, mission);
              // Track completed trails
              if (result) {
                // We'll handle trail completion inside the component
              }
              return { metrics: result?.metrics ?? {} };
            }}
          />
        );
      case 'mission':
        return (
          <MissionSimulator
            userId={USER_ID}
            onComplete={async (events, mission) => {
              await engine.processStream(events, mission);
              setActiveTab('dashboard');
            }}
          />
        );
      case 'bureau':
        return (
          <BureauTalentos
            dna={engine.dna}
            completedTrailIds={completedTrailIds}
          />
        );
      case 'escola':
        return <SchoolDashboard userDna={engine.dna} />;
      case 'anomalies':
        return <AnomalyLog anomalies={engine.anomalies} />;
      case 'codex':
        return <CodexPanel codex={engine.codex} />;
      case 'verticais':
        return <Verticais />;
      default:
        return null;
    }
  };

  // Group tabs by section
  const sections = [
    { label: 'PLATAFORMA', tabs: TABS.filter((t) => t.section === 'CORE') },
    { label: 'VERTICAIS B2B', tabs: TABS.filter((t) => t.section === 'VERTICAIS') },
    { label: 'ENGINE', tabs: TABS.filter((t) => t.section === 'ENGINE') },
  ];

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-gray-800 bg-gray-900 transition-transform lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 border-b border-gray-800 px-5 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-700 shadow-lg shadow-violet-500/20">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-white">
              Neural Quest
            </h1>
            <p className="text-[10px] font-medium tracking-widest text-violet-400">
              V5.0 • EDTECH COGNITIVA
            </p>
          </div>
          <button
            className="ml-auto lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-4">
          {sections.map((section) => (
            <div key={section.label}>
              <p className="mb-1 px-3 text-[10px] font-semibold tracking-widest text-gray-600">
                {section.label}
              </p>
              <div className="space-y-0.5">
                {section.tabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setSidebarOpen(false);
                      }}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-violet-500/15 text-violet-300'
                          : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                      }`}
                    >
                      <tab.icon
                        className={`h-4 w-4 ${isActive ? 'text-violet-400' : ''}`}
                      />
                      <span className="truncate">{tab.label}</span>
                      {tab.id === 'anomalies' &&
                        engine.anomalies.length > 0 && (
                          <span className="ml-auto rounded-full bg-red-500/20 px-2 py-0.5 text-xs text-red-400">
                            {engine.anomalies.length}
                          </span>
                        )}
                      {tab.id === 'codex' && engine.codex.length > 0 && (
                        <span className="ml-auto rounded-full bg-amber-500/20 px-2 py-0.5 text-xs text-amber-400">
                          {engine.codex.length}
                        </span>
                      )}
                      {tab.id === 'trails' && (
                        <span className="ml-auto rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] text-emerald-400">
                          NEW
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User DNA badge */}
        <div className="border-t border-gray-800 p-4">
          <div className="rounded-lg bg-gray-800/50 p-3">
            <div className="flex items-center gap-2">
              <Dna className="h-4 w-4 text-violet-400" />
              <span className="text-xs font-medium text-gray-300">
                Operador
              </span>
            </div>
            <p className="mt-1 font-mono text-xs text-gray-500">{USER_ID}</p>
            {engine.dna && (
              <div className="mt-2 grid grid-cols-3 gap-1">
                {[
                  { label: 'LD', value: engine.dna.latency_decision },
                  { label: 'RA', value: engine.dna.resilience_adaptive },
                  { label: 'TA', value: engine.dna.tolerance_ambiguity },
                ].map((m) => (
                  <div key={m.label} className="text-center">
                    <p className="text-[10px] text-gray-600">{m.label}</p>
                    <p className="text-xs font-bold text-gray-300">
                      {m.value?.toFixed(0) ?? '—'}
                    </p>
                  </div>
                ))}
              </div>
            )}
            {completedTrailIds.length > 0 && (
              <p className="mt-1 text-[10px] text-emerald-400">
                🏆 {completedTrailIds.length} trilha(s) certificada(s)
              </p>
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between border-b border-gray-800 bg-gray-900/50 px-4 py-3 backdrop-blur-sm lg:px-6">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5 text-gray-400" />
            </button>
            <div>
              <h2 className="text-sm font-semibold text-white">
                {TABS.find((t) => t.id === activeTab)?.label}
              </h2>
              <p className="text-xs text-gray-500">
                Teatro de Operações Cognitivas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {engine.isProcessing && (
              <div className="flex items-center gap-2 rounded-full bg-violet-500/10 px-3 py-1">
                <span className="h-2 w-2 animate-pulse rounded-full bg-violet-500" />
                <span className="text-xs text-violet-300">Processando…</span>
              </div>
            )}
            <button
              onClick={() => {
                engine.resetEngine();
                setCompletedTrailIds([]);
              }}
              className="rounded-lg bg-gray-800 px-3 py-1.5 text-xs text-gray-400 transition-colors hover:bg-gray-700 hover:text-gray-200"
            >
              Reset Engine
            </button>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="mx-auto max-w-5xl">{renderContent()}</div>
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-800 bg-gray-900/30 px-4 py-2">
          <div className="flex items-center justify-between text-[10px] text-gray-600">
            <span>
              Neural Quest V5.0 • Motor Oráculo • Justiça Cognitiva • EdTech
            </span>
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Engine Online • ISN Ativo • LMS Integrado
            </span>
          </div>
        </footer>
      </main>
    </div>
  );
}
