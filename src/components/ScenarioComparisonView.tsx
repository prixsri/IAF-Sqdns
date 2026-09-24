import React from 'react';
import { SCENARIO_PRESETS, runFleetSimulation } from '../utils/simulationEngine';
import { SimulationConfig } from '../types/fleet';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { Target, ShieldCheck, Zap, ArrowRight } from 'lucide-react';

interface ScenarioComparisonViewProps {
  activeConfig: SimulationConfig;
  onApplyScenario: (config: SimulationConfig, presetId: string) => void;
}

export const ScenarioComparisonView: React.FC<ScenarioComparisonViewProps> = ({
  activeConfig,
  onApplyScenario,
}) => {
  // Pre-calculate simulation trajectories for each of the 4 presets
  const scenarioResults = SCENARIO_PRESETS.map((preset) => {
    const sim = runFleetSimulation(preset.config);
    // Find minimum squadron trough
    let minSqdn = 999;
    let minYear = 2025;
    let yearsUnder30 = 0;
    let yearHit42: number | null = null;

    sim.forEach((d) => {
      if (d.totalSquadrons < minSqdn) {
        minSqdn = d.totalSquadrons;
        minYear = d.year;
      }
      if (d.totalSquadrons < 30) {
        yearsUnder30++;
      }
      if (d.totalSquadrons >= 42 && yearHit42 === null) {
        yearHit42 = d.year;
      }
    });

    const endYearData = sim[sim.length - 1]; // 2040

    return {
      preset,
      sim,
      minSqdn,
      minYear,
      yearsUnder30,
      yearHit42,
      finalSqdns: endYearData.totalSquadrons,
      finalAirframes: endYearData.totalAirframes,
      finalGen5: endYearData.generationShare.gen5,
    };
  });

  // Prepare combined line chart dataset for year 2025 to 2040
  const years = scenarioResults[0].sim.map((d) => d.year);
  const comparisonChartData = years.map((y, idx) => {
    const dataPoint: any = { year: y };
    scenarioResults.forEach((sr) => {
      dataPoint[sr.preset.id] = sr.sim[idx].totalSquadrons;
    });
    return dataPoint;
  });

  const colors = {
    baseline: '#06b6d4', // Cyan
    'engine-crisis-no-mrfa': '#ef4444', // Red
    'indigenous-surge': '#f59e0b', // Amber
    'dual-track-high-readiness': '#10b981', // Emerald
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                STRATEGIC WARGAME ENGINE
              </span>
              <span className="text-xs text-slate-400 font-mono">
                GAME THEORY & SCENARIO TRADEOFF ANALYSIS
              </span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1 flex items-center gap-2">
              <Target className="w-5 h-5 text-cyan-400" />
              <span>DYNAMIC SCENARIO COMPARISON MATRIX</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl">
              Evaluate alternative procurement vectors against the sanctioned 42-squadron mandate.
              Compare the depth of the 2028–2031 squadron trough, vulnerability window, and long-term 2040 fleet mass.
            </p>
          </div>
        </div>
      </div>

      {/* OVERLAID COMPARATIVE CHART */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl backdrop-blur-md">
        <h3 className="text-sm font-bold text-white mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>SQUADRON STRENGTH TRAJECTORY COMPARISON (2025–2040)</span>
          </div>
          <span className="text-xs font-mono text-slate-400">All 4 Scenarios vs 42 Benchmark</span>
        </h3>

        <div className="h-[360px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={comparisonChartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="year" stroke="#64748b" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis domain={[22, 48]} stroke="#64748b" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-slate-950/95 border border-slate-700/80 p-3 rounded-lg shadow-2xl text-xs font-mono backdrop-blur-md">
                        <div className="text-cyan-400 font-bold border-b border-slate-800 pb-1 mb-2">
                          YEAR: {label}
                        </div>
                        {payload.map((entry: any, index: number) => {
                          const preset = SCENARIO_PRESETS.find((p) => p.id === entry.dataKey);
                          return (
                            <div key={index} className="flex items-center justify-between gap-4 py-0.5">
                              <span style={{ color: entry.color }} className="font-semibold">
                                {preset?.name}:
                              </span>
                              <span className="font-bold text-white">{entry.value} Sqdns</span>
                            </div>
                          );
                        })}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />

              {/* Sanctioned line */}
              <ReferenceLine
                y={42}
                stroke="#10b981"
                strokeWidth={2}
                strokeDasharray="4 4"
                label={{ value: '42 Sanctioned Target', fill: '#10b981', position: 'top', fontSize: 11 }}
              />

              {/* Red Line */}
              <ReferenceLine
                y={30}
                stroke="#ef4444"
                strokeWidth={1.5}
                strokeDasharray="2 2"
                label={{ value: '30 Critical Red Line', fill: '#ef4444', position: 'bottom', fontSize: 11 }}
              />

              <Line
                type="monotone"
                dataKey="baseline"
                name="Baseline Roadmap"
                stroke={colors.baseline}
                strokeWidth={3}
                dot={{ r: 2 }}
              />
              <Line
                type="monotone"
                dataKey="engine-crisis-no-mrfa"
                name="Worst Case (Crisis + No MRFA)"
                stroke={colors['engine-crisis-no-mrfa']}
                strokeWidth={2.5}
                strokeDasharray="5 5"
                dot={{ r: 2 }}
              />
              <Line
                type="monotone"
                dataKey="indigenous-surge"
                name="Indigenous Surge (HAL 30/yr)"
                stroke={colors['indigenous-surge']}
                strokeWidth={2.5}
                dot={{ r: 2 }}
              />
              <Line
                type="monotone"
                dataKey="dual-track-high-readiness"
                name="Dual-Track Fast Recovery"
                stroke={colors['dual-track-high-readiness']}
                strokeWidth={3}
                dot={{ r: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Side-by-Side Scenario Cards Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {scenarioResults.map((sr) => {
          const isCurrentActive =
            JSON.stringify(sr.preset.config) === JSON.stringify(activeConfig);
          return (
            <div
              key={sr.preset.id}
              className={`bg-slate-900/90 border rounded-xl p-5 shadow-lg flex flex-col justify-between transition-all backdrop-blur-md ${
                isCurrentActive
                  ? 'border-cyan-500 ring-2 ring-cyan-500/20 shadow-cyan-950/30'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                    sr.preset.badge === 'Worst Case' ? 'bg-red-950 text-red-400 border border-red-800' :
                    sr.preset.badge === 'Fastest Recovery' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                    sr.preset.badge === 'Indigenous Surge' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                    'bg-cyan-950 text-cyan-400 border border-cyan-800'
                  }`}>
                    {sr.preset.badge}
                  </span>
                  {isCurrentActive && (
                    <span className="text-[10px] font-mono text-cyan-400 font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      ACTIVE
                    </span>
                  )}
                </div>

                <h4 className="text-base font-bold text-white mb-1">{sr.preset.name}</h4>
                <div className="text-xs font-mono text-cyan-400/90 mb-2">{sr.preset.tagline}</div>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">{sr.preset.description}</p>

                {/* Scorecard Table */}
                <div className="space-y-2 py-3 border-y border-slate-800 text-xs font-mono">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Lowest Trough:</span>
                    <span className={`font-bold ${sr.minSqdn < 30 ? 'text-red-400' : 'text-amber-400'}`}>
                      {sr.minSqdn} Sqdns ({sr.minYear})
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Vulnerability Window:</span>
                    <span className="text-white font-bold">
                      {sr.yearsUnder30 > 0 ? `${sr.yearsUnder30} Yrs (<30 Sqdns)` : 'None (<30 avoided)'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Reach 42 Target:</span>
                    <span className={`font-bold ${sr.yearHit42 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {sr.yearHit42 ? `Year ${sr.yearHit42}` : 'Not by 2040'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">2040 Total Mass:</span>
                    <span className="text-cyan-400 font-bold">
                      {sr.finalSqdns} Sqdns ({sr.finalAirframes} Jets)
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">2040 Gen 5 Stealth:</span>
                    <span className="text-purple-400 font-bold">{sr.finalGen5} Frames</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 mt-2">
                <button
                  onClick={() => onApplyScenario(sr.preset.config, sr.preset.id)}
                  disabled={isCurrentActive}
                  className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 border ${
                    isCurrentActive
                      ? 'bg-slate-800 text-slate-500 border-slate-700 cursor-default'
                      : 'bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border-cyan-500/50'
                  }`}
                >
                  <span>{isCurrentActive ? 'Currently Loaded' : 'Simulate This Scenario'}</span>
                  {!isCurrentActive && <ArrowRight className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
