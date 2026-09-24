import React, { useState } from 'react';
import {
  HISTORICAL_AND_COMMITTED_DELIVERIES,
  HAL_PRODUCTION_LINES,
  GE_F414_PROGRAM_PARAMS
} from '../data/engineDeliveries';
import { SimulationConfig, SimulationYearData } from '../types/fleet';
import {
  Cpu,
  Flame,
  AlertCircle,
  Clock,
  Factory,
  ShieldAlert,
} from 'lucide-react';

interface EnginePipelineViewProps {
  config: SimulationConfig;
  setConfig: (config: SimulationConfig) => void;
  simulationData: SimulationYearData[];
}

export const EnginePipelineView: React.FC<EnginePipelineViewProps> = ({
  config,
  setConfig,
  simulationData,
}) => {
  const [filterContract, setFilterContract] = useState<'all' | '83' | '97'>('all');

  const filteredLogs = HISTORICAL_AND_COMMITTED_DELIVERIES.filter(log => {
    if (filterContract === '83') return log.contract.includes('83');
    if (filterContract === '97') return log.contract.includes('97');
    return true;
  });

  // Calculate current engine telemetry from simulationData
  const currentYearData = simulationData.find(d => d.year === 2026) || simulationData[0];

  return (
    <div className="space-y-6">
      {/* Top Banner: Engine Supply Status Overview */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800">
                CRITICAL SUPPLY CHAIN BOTTLENECK
              </span>
              <span className="text-xs text-slate-400 font-mono">
                GE AEROSPACE F404 & F414 PIPELINE
              </span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-amber-400" />
              <span>TEJAS MK1-A & MK2 ENGINE DELIVERY & AIRFRAME CONVERGENCE</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl">
              Serial output of the 83 + 97 Tejas Mk1-A order depends directly on the receipt of GE F-404-IN20 engines.
              When engine arrival lags behind HAL assembly throughput, completed airframes become "gliders" parked awaiting propulsion.
            </p>
          </div>

          {/* Quick Engine Telemetry Badges */}
          <div className="flex flex-wrap gap-2 text-xs font-mono">
            <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-lg">
              <span className="text-slate-500 block text-[10px]">TOTAL MK1-A ORDER</span>
              <span className="text-white font-bold text-sm">83 + 97 = 180 Units</span>
            </div>
            <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-lg">
              <span className="text-slate-500 block text-[10px]">COMMITTED SUPPLY RATE</span>
              <span className="text-cyan-400 font-bold text-sm">2 Engines / Month (24/yr)</span>
            </div>
            <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-lg">
              <span className="text-slate-500 block text-[10px]">CURRENT GLIDER BUFFER</span>
              <span className={`font-bold text-sm ${currentYearData.engineStatus.f404GlidersAwaitingEngine > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {currentYearData.engineStatus.f404GlidersAwaitingEngine} Airframes
              </span>
            </div>
          </div>
        </div>

        {/* Interactive Engine Parameters Slider Controls */}
        <div className="pt-4 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {/* 1. Engine Delay Slider */}
          <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                GE Delivery Lag:
              </span>
              <span className="font-mono font-bold text-amber-400">
                {config.geEngineDelayMonths === 0 ? 'On-Schedule (0 mos)' : `+${config.geEngineDelayMonths} Months Delay`}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={24}
              step={6}
              value={config.geEngineDelayMonths}
              onChange={(e) => setConfig({ ...config, geEngineDelayMonths: parseInt(e.target.value, 10) })}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
              <span>0m (Target)</span>
              <span>6m</span>
              <span>12m</span>
              <span>18m</span>
              <span>24m (Severe)</span>
            </div>
          </div>

          {/* 2. HAL Mk1A Line Capacity */}
          <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                <Factory className="w-3.5 h-3.5 text-cyan-400" />
                HAL Mk1A Line Capacity:
              </span>
              <span className="font-mono font-bold text-cyan-400">
                {config.halMk1aCapacity} Units / Year
              </span>
            </div>
            <input
              type="range"
              min={16}
              max={30}
              step={2}
              value={config.halMk1aCapacity}
              onChange={(e) => setConfig({ ...config, halMk1aCapacity: parseInt(e.target.value, 10) })}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
              <span>16/yr (Slow)</span>
              <span>24/yr (Baseline)</span>
              <span>30/yr (Max Surge)</span>
            </div>
          </div>

          {/* 3. Engine Annual Delivery Rate */}
          <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-emerald-400" />
                GE Supply Commitment:
              </span>
              <span className="font-mono font-bold text-emerald-400">
                {config.geEngineAnnualSupply} Engines / Year
              </span>
            </div>
            <input
              type="range"
              min={12}
              max={30}
              step={6}
              value={config.geEngineAnnualSupply}
              onChange={(e) => setConfig({ ...config, geEngineAnnualSupply: parseInt(e.target.value, 10) })}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
              <span>12/yr (1.0/mo)</span>
              <span>24/yr (2.0/mo)</span>
              <span>30/yr (2.5/mo)</span>
            </div>
          </div>
        </div>
      </div>

      {/* HAL Manufacturing Production Line Breakdown */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg backdrop-blur-md">
        <h3 className="text-sm font-bold text-white mb-3 flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Factory className="w-4 h-4 text-cyan-400" />
            <span>HAL PRODUCTION INFRASTRUCTURE & THREE-LINE SCALING</span>
          </div>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-950/70 border border-cyan-800 px-2 py-0.5 rounded">
            Baseline: 24/yr • Max: 30/yr
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {HAL_PRODUCTION_LINES.map((line) => (
            <div
              key={line.id}
              className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-mono text-cyan-400 font-bold">{line.name}</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono uppercase bg-slate-900 border border-slate-700 text-slate-300">
                    {line.status}
                  </span>
                </div>
                <div className="text-xs text-slate-400 font-sans mb-3">{line.location}</div>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">{line.role}</p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500">Rated Output:</span>
                <span className="text-white font-bold">
                  {line.nominalCapacity}–{line.maxCapacity} Aircraft / Year
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Note on Line Trade-off */}
        <div className="mt-4 p-3 rounded-lg bg-amber-950/30 border border-amber-900/50 flex items-start gap-2.5 text-xs text-amber-200/90">
          <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-amber-300">Production Line Capacity Trade-off Rule: </span>
            When the Tejas Mk2 Medium Weight Fighter enters production (September 2030), one HAL assembly line re-tools for the heavier Mk2 fuselage. Consequently, Tejas Mk1-A line capacity throttles down to a sustained <span className="font-mono font-bold text-white">16 units/year</span>.
          </div>
        </div>
      </div>

      {/* Two-Column View: Historical Delivery Receipts vs GE F414 Deal Roadmap */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Historical Receipts & Commitments Table */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg backdrop-blur-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>GE F-404-IN20 RECEIPT & COMMITTED TIMELINE LOG</span>
              </h3>
              <p className="text-xs text-slate-400">
                Documented engine receipts by HAL categorized by year-month and public commitments.
              </p>
            </div>

            {/* Contract Filter */}
            <div className="flex items-center bg-slate-950 rounded-lg p-0.5 border border-slate-800 text-[11px] font-mono">
              <button
                onClick={() => setFilterContract('all')}
                className={`px-2 py-1 rounded ${filterContract === 'all' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400'}`}
              >
                All
              </button>
              <button
                onClick={() => setFilterContract('83')}
                className={`px-2 py-1 rounded ${filterContract === '83' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400'}`}
              >
                83-Order
              </button>
              <button
                onClick={() => setFilterContract('97')}
                className={`px-2 py-1 rounded ${filterContract === '97' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400'}`}
              >
                97-Order
              </button>
            </div>
          </div>

          <div className="overflow-x-auto max-h-[420px] overflow-y-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="sticky top-0 bg-slate-950 border-b border-slate-800 text-slate-400 text-[11px]">
                <tr>
                  <th className="pb-2 font-medium">PERIOD</th>
                  <th className="pb-2 font-medium">BATCH</th>
                  <th className="pb-2 font-medium text-right">COMMITTED</th>
                  <th className="pb-2 font-medium text-right">ACTUAL / EST</th>
                  <th className="pb-2 font-medium text-center">STATUS</th>
                  <th className="pb-2 font-medium">OBSERVATIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredLogs.map((log, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-2.5 font-bold text-slate-200">{log.period}</td>
                    <td className="py-2.5 text-slate-400 text-[11px]">{log.contract}</td>
                    <td className="py-2.5 text-right font-medium text-slate-300">{log.committed}</td>
                    <td className="py-2.5 text-right font-bold text-white text-sm">
                      {log.actualOrProjected}
                    </td>
                    <td className="py-2.5 text-center">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                        log.status === 'delivered' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                        log.status === 'delayed' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                        'bg-cyan-950 text-cyan-300 border border-cyan-800'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="py-2.5 text-[11px] text-slate-300 font-sans max-w-xs truncate" title={log.notes}>
                      {log.notes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Col: GE F-414 Program Card */}
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg backdrop-blur-md">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
              <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-cyan-400" />
                <span>GE F-414-INS6 ROADMAP</span>
              </h4>
              <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800 px-1.5 py-0.5 rounded font-mono">
                Tejas Mk2 & AMCA
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex justify-between items-center font-mono">
                <span className="text-slate-400">Deal Signing Milestone:</span>
                <span className="text-cyan-400 font-bold">{GE_F414_PROGRAM_PARAMS.contractSignTarget}</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex justify-between items-center font-mono">
                <span className="text-slate-400">Committed Supply Rate:</span>
                <span className="text-white font-bold">{GE_F414_PROGRAM_PARAMS.supplyRateMonthly} Engines / Month</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex justify-between items-center font-mono">
                <span className="text-slate-400">Technology Transfer (ToT):</span>
                <span className="text-emerald-400 font-bold">{GE_F414_PROGRAM_PARAMS.totPercentage}% to HAL</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex justify-between items-center font-mono">
                <span className="text-slate-400">Wet Thrust Rating:</span>
                <span className="text-amber-400 font-bold">{GE_F414_PROGRAM_PARAMS.thrustRatingKN} kN</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-300 leading-relaxed">
              <p>
                <strong>March 2027 Milestone:</strong> Bilateral commercial agreement between GE Aerospace and HAL includes 11 critical engine manufacturing technologies, enabling domestic hot-section blisk and single-crystal blade co-production in India.
              </p>
            </div>
          </div>

          {/* Glider Backlog Counter Explainer */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg backdrop-blur-md">
            <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>WHAT IS A "GLIDER" AIRFRAME?</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              When HAL structural assembly lines run at peak output (e.g., 24 jets/yr) but GE engine deliveries lag, airframes are rolled off the line with ballast or dummy engines. They cannot be handed over to IAF squadrons until flight-cleared F-404-IN20 powerplants arrive.
            </p>
            <div className="p-2.5 bg-slate-950 rounded border border-slate-800 text-[11px] font-mono text-slate-400">
              <span className="text-cyan-400 font-bold">Current Simulation Setting: </span>
              {config.geEngineDelayMonths} months delay creates a max backlog of{' '}
              <span className="text-amber-400 font-bold">{currentYearData.engineStatus.f404GlidersAwaitingEngine} gliders</span>.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
