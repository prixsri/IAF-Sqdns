import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { TimelineSlider } from './components/TimelineSlider';
import { MetricCards } from './components/MetricCards';
import { SimulationCharts } from './components/SimulationCharts';
import { ActiveFleetBreakdown } from './components/ActiveFleetBreakdown';
import { BaselineInventory } from './components/BaselineInventory';
import { EnginePipelineView } from './components/EnginePipelineView';
import { ScenarioComparisonView } from './components/ScenarioComparisonView';
import { RetirementMatrixView } from './components/RetirementMatrixView';
import { DataExportView } from './components/DataExportView';
import { ConfigModal } from './components/ConfigModal';
import { SimulationConfig } from './types/fleet';
import { DEFAULT_CONFIG, runFleetSimulation } from './utils/simulationEngine';
import { Zap, Clock, ArrowRight } from 'lucide-react';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('simulation');
  const [config, setConfig] = useState<SimulationConfig>(DEFAULT_CONFIG);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('baseline');
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState<boolean>(false);

  // Re-run simulation dynamically on any config changes
  const simulationData = useMemo(() => {
    return runFleetSimulation(config);
  }, [config]);

  // Current year data and previous year data
  const currentYearIndex = simulationData.findIndex(d => d.year === currentYear);
  const currentData = simulationData[currentYearIndex !== -1 ? currentYearIndex : 0];
  const previousData = currentYearIndex > 0 ? simulationData[currentYearIndex - 1] : undefined;

  const handleApplyScenario = (newConfig: SimulationConfig, presetId: string) => {
    setConfig({ ...newConfig });
    setSelectedPresetId(presetId);
  };

  const handleResetToDefault = () => {
    setConfig({ ...DEFAULT_CONFIG });
    setSelectedPresetId('baseline');
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans grid-bg selection:bg-cyan-500 selection:text-white">
      {/* Top Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        setConfig={setConfig}
        selectedPresetId={selectedPresetId}
        setSelectedPresetId={setSelectedPresetId}
        onOpenConfigModal={() => setIsConfigModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* ================= TAB 1: FLEET SIMULATOR & TIMELINE ================= */}
        {currentTab === 'simulation' && (
          <div className="space-y-4">
            {/* Quick Strategic Controls Bar */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 shadow-md flex flex-wrap items-center justify-between gap-3 text-xs backdrop-blur-md">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-mono flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-cyan-400" />
                  Quick Assumptions:
                </span>
                {/* MRFA Toggle */}
                <button
                  onClick={() => setConfig({ ...config, mrfaRafaleEnabled: !config.mrfaRafaleEnabled })}
                  className={`px-2.5 py-1 rounded font-mono font-semibold transition-all border ${
                    config.mrfaRafaleEnabled
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                      : 'bg-red-950/80 text-red-300 border-red-800 line-through'
                  }`}
                >
                  {config.mrfaRafaleEnabled ? '114 Rafale MRFA: Active' : '114 MRFA: Cancelled'}
                </button>

                {/* Engine Delay Quick Selector */}
                <div className="flex items-center bg-slate-950 rounded px-2 py-0.5 border border-slate-800 font-mono text-[11px]">
                  <span className="text-slate-400 mr-1.5 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-400" />
                    GE Lag:
                  </span>
                  <select
                    value={config.geEngineDelayMonths}
                    onChange={(e) => setConfig({ ...config, geEngineDelayMonths: parseInt(e.target.value, 10) })}
                    className="bg-transparent text-amber-300 font-bold focus:outline-none cursor-pointer"
                  >
                    <option value={0} className="bg-slate-900">0 mos (On-time)</option>
                    <option value={6} className="bg-slate-900">+6 mos delay</option>
                    <option value={12} className="bg-slate-900">+12 mos delay</option>
                    <option value={18} className="bg-slate-900">+18 mos delay</option>
                    <option value={24} className="bg-slate-900">+24 mos delay</option>
                  </select>
                </div>

                {/* HAL Output Quick Selector */}
                <div className="flex items-center bg-slate-950 rounded px-2 py-0.5 border border-slate-800 font-mono text-[11px]">
                  <span className="text-slate-400 mr-1.5">HAL Rate:</span>
                  <select
                    value={config.halMk1aCapacity}
                    onChange={(e) => setConfig({ ...config, halMk1aCapacity: parseInt(e.target.value, 10) })}
                    className="bg-transparent text-cyan-300 font-bold focus:outline-none cursor-pointer"
                  >
                    <option value={16} className="bg-slate-900">16 / yr</option>
                    <option value={24} className="bg-slate-900">24 / yr (Standard)</option>
                    <option value={30} className="bg-slate-900">30 / yr (Surge)</option>
                  </select>
                </div>
              </div>

              <button
                onClick={() => setIsConfigModalOpen(true)}
                className="text-cyan-400 hover:text-cyan-300 font-mono text-xs flex items-center gap-1 underline underline-offset-4"
              >
                <span>Advanced Parameters</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Interactive Timeline Slider with Play/Pause & Milestones */}
            <TimelineSlider
              currentYear={currentYear}
              setCurrentYear={setCurrentYear}
              simulationData={simulationData}
            />

            {/* Tactical HUD Telemetry Metrics Cards */}
            <MetricCards
              currentData={currentData}
              previousData={previousData}
            />

            {/* Interactive Visual Charts (Squadrons, Composition, Engine Gliders, Tech Gen) */}
            <SimulationCharts
              simulationData={simulationData}
              currentYear={currentYear}
              setCurrentYear={setCurrentYear}
            />

            {/* Active Inventory & Annual Induction/Retirement Details for Scrubber Year */}
            <ActiveFleetBreakdown
              currentData={currentData}
            />
          </div>
        )}

        {/* ================= TAB 2: BASELINE ORBAT INVENTORY ================= */}
        {currentTab === 'baseline' && (
          <BaselineInventory />
        )}

        {/* ================= TAB 3: ENGINE PIPELINE TRACKER ================= */}
        {currentTab === 'engine' && (
          <EnginePipelineView
            config={config}
            setConfig={setConfig}
            simulationData={simulationData}
          />
        )}

        {/* ================= TAB 4: SCENARIO WARGAME COMPARISON ================= */}
        {currentTab === 'wargame' && (
          <ScenarioComparisonView
            activeConfig={config}
            onApplyScenario={handleApplyScenario}
          />
        )}

        {/* ================= TAB 5: RETIREMENT & INDUCTION MATRIX ================= */}
        {currentTab === 'retirements' && (
          <RetirementMatrixView
            simulationData={simulationData}
          />
        )}

        {/* ================= TAB 6: DATA EXPORT & BRIEFING REPORT ================= */}
        {currentTab === 'data' && (
          <DataExportView
            simulationData={simulationData}
            config={config}
          />
        )}
      </main>

      {/* Global Configuration Modal */}
      <ConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        config={config}
        setConfig={setConfig}
        onResetToDefault={handleResetToDefault}
      />

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-5 text-slate-500 text-xs font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>INDIAN AIR FORCE STRATEGIC FORCE STRUCTURE SIMULATOR</span>
          </div>
          <div className="text-slate-500 text-center sm:text-right">
            Based on Public MoD, Parliamentary Standing Committee & HAL / GE Procurement Commitments
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
