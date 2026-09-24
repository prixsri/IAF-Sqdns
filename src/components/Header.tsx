import React from 'react';
import { Sliders, Terminal } from 'lucide-react';
import { SimulationConfig } from '../types/fleet';
import { SCENARIO_PRESETS } from '../utils/simulationEngine';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  setConfig: (config: SimulationConfig) => void;
  selectedPresetId: string;
  setSelectedPresetId: (id: string) => void;
  onOpenConfigModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  setConfig,
  selectedPresetId,
  setSelectedPresetId,
  onOpenConfigModal,
}) => {
  const tabs = [
    { id: 'simulation', label: 'Fleet Simulator', icon: '📊' },
    { id: 'baseline', label: 'Baseline ORBAT', icon: '🗂️' },
    { id: 'engine', label: 'GE Engine Pipeline', icon: '⚙️' },
    { id: 'wargame', label: 'Scenario Comparison', icon: '🎯' },
    { id: 'retirements', label: 'Phase-Out Matrix', icon: '📉' },
    { id: 'data', label: 'Data & Report', icon: '📄' },
  ];

  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    const preset = SCENARIO_PRESETS.find(p => p.id === presetId);
    if (preset) {
      setConfig({ ...preset.config });
    }
  };

  return (
    <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar with Brand and Preset Picker */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3 gap-3 border-b border-slate-800/60">
          <div className="flex items-center space-x-3">
            {/* IAF Roundel SVG */}
            <div className="relative flex-shrink-0 w-10 h-10 rounded-full bg-slate-950 p-0.5 shadow-md border border-cyan-500/30">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="50" cy="50" r="46" fill="#0369a1" />
                <circle cx="50" cy="50" r="34" fill="#f97316" />
                <circle cx="50" cy="50" r="22" fill="#ffffff" />
                <circle cx="50" cy="50" r="10" fill="#10b981" />
              </svg>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                  <span>IAF FLEET & SQUADRON STRENGTH SIMULATOR</span>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/80">
                    STRAT-SIM v2.4
                  </span>
                </h1>
              </div>
              <p className="text-xs text-slate-400">
                Indian Air Force Force-Structure Dynamics, GE Engine Constraints & 42-Squadron Roadmap (2025–2040)
              </p>
            </div>
          </div>

          {/* Quick Scenario Preset Dropdown & Settings Button */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center bg-slate-950/80 rounded-lg p-1 border border-slate-800 text-xs">
              <span className="text-slate-400 px-2 font-medium flex items-center gap-1">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                Scenario:
              </span>
              <select
                value={selectedPresetId}
                onChange={(e) => handleSelectPreset(e.target.value)}
                className="bg-slate-900 text-cyan-300 font-medium px-2 py-1 rounded border border-slate-700/80 focus:outline-none focus:border-cyan-500 text-xs"
              >
                {SCENARIO_PRESETS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} [{p.badge}]
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={onOpenConfigModal}
              className="flex items-center gap-1.5 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              title="Customize Simulation Parameters"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Configure Engine</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 overflow-x-auto py-2 scrollbar-none">
          {tabs.map((tab) => {
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
