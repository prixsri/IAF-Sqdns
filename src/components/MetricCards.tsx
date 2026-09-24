import React from 'react';
import { Shield, AlertTriangle, CheckCircle, TrendingUp, TrendingDown, Cpu, Box, Flame } from 'lucide-react';
import { SimulationYearData } from '../types/fleet';

interface MetricCardsProps {
  currentData: SimulationYearData;
  previousData?: SimulationYearData;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ currentData, previousData }) => {
  const target = currentData.targetSquadrons; // 42
  const activeSqdns = currentData.totalSquadrons;
  const deficit = currentData.deficit;
  const isDeficit = deficit > 0;

  // Delta from previous year
  const sqdnDelta = previousData
    ? parseFloat((currentData.totalSquadrons - previousData.totalSquadrons).toFixed(1))
    : 0;
  const fighterDelta = previousData
    ? currentData.totalAirframes - previousData.totalAirframes
    : 0;

  // Total inducted vs retired in current year
  const totalInductions = currentData.inductions.reduce((acc, curr) => acc + curr.count, 0);
  const totalRetirements = currentData.retirements.reduce((acc, curr) => acc + curr.count, 0);

  // Generation percentages
  const totalGenFighters =
    currentData.generationShare.gen4 +
    currentData.generationShare.gen45 +
    currentData.generationShare.gen5;
  const pGen4 = totalGenFighters > 0 ? Math.round((currentData.generationShare.gen4 / totalGenFighters) * 100) : 0;
  const pGen45 = totalGenFighters > 0 ? Math.round((currentData.generationShare.gen45 / totalGenFighters) * 100) : 0;
  const pGen5 = totalGenFighters > 0 ? Math.round((currentData.generationShare.gen5 / totalGenFighters) * 100) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* 1. SQUADRON STRENGTH VS SANCTIONED TARGET */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg relative overflow-hidden backdrop-blur-md">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span className="font-mono uppercase tracking-wider">ACTIVE SQUADRONS</span>
          <Shield className="w-4 h-4 text-cyan-400" />
        </div>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-3xl font-black font-mono text-white">{activeSqdns}</span>
          <span className="text-slate-500 font-mono text-xs">/ {target} SANCTIONED</span>
        </div>

        {/* Progress Bar towards 42 */}
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-2">
          <div
            className={`h-full transition-all duration-500 ${
              activeSqdns < 30 ? 'bg-red-500' : activeSqdns < 36 ? 'bg-amber-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${Math.min(100, (activeSqdns / target) * 100)}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono">
          <span className="text-slate-400">Force Ratio: {Math.round((activeSqdns / target) * 100)}%</span>
          <span className={`flex items-center gap-0.5 ${sqdnDelta > 0 ? 'text-emerald-400' : sqdnDelta < 0 ? 'text-red-400' : 'text-slate-400'}`}>
            {sqdnDelta > 0 ? <TrendingUp className="w-3 h-3" /> : sqdnDelta < 0 ? <TrendingDown className="w-3 h-3" /> : null}
            {sqdnDelta > 0 ? `+${sqdnDelta}` : sqdnDelta} vs Prev Year
          </span>
        </div>
      </div>

      {/* 2. FORCE DEFICIT / SURPLUS */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg relative overflow-hidden backdrop-blur-md">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span className="font-mono uppercase tracking-wider">FORCE DEFICIT / SURPLUS</span>
          {isDeficit ? (
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          ) : (
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          )}
        </div>
        <div className="flex items-baseline gap-2 mb-2">
          <span className={`text-3xl font-black font-mono ${isDeficit ? 'text-amber-400' : 'text-emerald-400'}`}>
            {isDeficit ? `-${deficit}` : `+${Math.abs(deficit)}`}
          </span>
          <span className="text-slate-500 font-mono text-xs">SQUADRONS ({Math.round(Math.abs(deficit) * 18)} JETS)</span>
        </div>

        <div className="text-[11px] text-slate-300 font-medium mb-1 flex items-center justify-between">
          <span>Readiness Posture:</span>
          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
            activeSqdns < 30
              ? 'bg-red-950 text-red-400 border border-red-800/80'
              : activeSqdns < 36
              ? 'bg-amber-950 text-amber-300 border border-amber-800/80'
              : 'bg-emerald-950 text-emerald-300 border border-emerald-800/80'
          }`}>
            {activeSqdns < 30 ? 'High Vulnerability' : activeSqdns < 36 ? 'Strained Threshold' : 'Robust Capability'}
          </span>
        </div>

        <div className="text-[11px] text-slate-400 flex justify-between font-mono">
          <span>Total Combat Jets:</span>
          <span className="text-white font-bold">
            {currentData.totalAirframes} Frames {fighterDelta !== 0 && (
              <span className={`text-[10px] font-normal ${fighterDelta > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                ({fighterDelta > 0 ? `+${fighterDelta}` : fighterDelta})
              </span>
            )}
          </span>
        </div>
      </div>

      {/* 3. GENERATION MASS BREAKDOWN */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg relative overflow-hidden backdrop-blur-md">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span className="font-mono uppercase tracking-wider">TECH GENERATION MIX</span>
          <Cpu className="w-4 h-4 text-cyan-400" />
        </div>
        <div className="flex items-baseline justify-between mb-2">
          <div className="text-xs font-mono">
            <span className="text-purple-400 font-bold">{pGen5}%</span> <span className="text-slate-500">Gen 5</span>
            <span className="text-slate-600 mx-1.5">•</span>
            <span className="text-cyan-400 font-bold">{pGen45}%</span> <span className="text-slate-500">Gen 4.5</span>
            <span className="text-slate-600 mx-1.5">•</span>
            <span className="text-slate-300 font-bold">{pGen4}%</span> <span className="text-slate-500">Gen 4</span>
          </div>
        </div>

        {/* Stacked generation bar */}
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex mb-2">
          <div className="bg-purple-500 h-full transition-all duration-500" style={{ width: `${pGen5}%` }} title={`Gen 5: ${currentData.generationShare.gen5} jets`} />
          <div className="bg-cyan-500 h-full transition-all duration-500" style={{ width: `${pGen45}%` }} title={`Gen 4.5: ${currentData.generationShare.gen45} jets`} />
          <div className="bg-slate-500 h-full transition-all duration-500" style={{ width: `${pGen4}%` }} title={`Gen 4: ${currentData.generationShare.gen4} jets`} />
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>Stealth Assets (AMCA):</span>
          <span className="text-purple-300 font-bold">{currentData.generationShare.gen5} Airframes</span>
        </div>
      </div>

      {/* 4. ENGINE PIPELINE & ANNUAL TURNOVER */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg relative overflow-hidden backdrop-blur-md">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span className="font-mono uppercase tracking-wider">ANNUAL INFLOW / OUTFLOW</span>
          <Box className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="flex items-baseline justify-between mb-2">
          <div className="flex items-center gap-3">
            <span className="text-emerald-400 font-mono text-sm font-bold flex items-center gap-1">
              +{totalInductions} Inducted
            </span>
            <span className="text-red-400 font-mono text-sm font-bold flex items-center gap-1">
              -{totalRetirements} Retired
            </span>
          </div>
        </div>

        {/* Engine Pipeline Alert / Info */}
        <div className="bg-slate-950/80 rounded p-1.5 border border-slate-800 text-[11px] font-mono flex items-center justify-between mb-1">
          <span className="text-slate-400 flex items-center gap-1">
            <Flame className="w-3 h-3 text-amber-400" />
            F404 Gliders Pending Engine:
          </span>
          <span className={`font-bold ${currentData.engineStatus.f404GlidersAwaitingEngine > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
            {currentData.engineStatus.f404GlidersAwaitingEngine} Frames
          </span>
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
          <span>Cum. F404 Deliveries: {currentData.engineStatus.f404DeliveredCum}</span>
          <span>Mk1A Built: {currentData.engineStatus.f404AirframesBuiltCum}</span>
        </div>
      </div>
    </div>
  );
};
