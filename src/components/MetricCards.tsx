import React from 'react';
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Cpu,
  Box,
  Flame
} from 'lucide-react';
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
  
  // Total inducted vs retired in current year
  const totalInductions = currentData.inductions.reduce((acc, curr) => acc + curr.count, 0);
  const totalRetirements = currentData.retirements.reduce((acc, curr) => acc + curr.count, 0);
  const netTurnover = totalInductions - totalRetirements;

  // Generation percentages
  const totalGenFighters =
    currentData.generationShare.gen4 +
    currentData.generationShare.gen45 +
    currentData.generationShare.gen5;
  const pGen4 = totalGenFighters > 0 ? Math.round((currentData.generationShare.gen4 / totalGenFighters) * 100) : 0;
  const pGen45 = totalGenFighters > 0 ? Math.round((currentData.generationShare.gen45 / totalGenFighters) * 100) : 0;
  const pGen5 = totalGenFighters > 0 ? Math.round((currentData.generationShare.gen5 / totalGenFighters) * 100) : 0;

  const isCritical = activeSqdns < 30;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* 1. SQUADRON STRENGTH VS SANCTIONED TARGET */}
      <div className={`bg-slate-900/90 border rounded-xl p-4 shadow-lg relative overflow-hidden backdrop-blur-md transition-all ${
        isCritical ? 'border-red-900/60 shadow-red-950/20' : 'border-slate-800'
      }`}>
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span className="font-mono uppercase tracking-wider text-[11px] font-semibold text-slate-300">
            ACTIVE FORCE STRENGTH
          </span>
          <Shield className="w-4 h-4 text-cyan-400" />
        </div>

        <div className="flex items-baseline justify-between mb-2">
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl sm:text-4xl font-black font-mono tracking-tight ${
              isCritical ? 'text-red-400' : activeSqdns < 36 ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {activeSqdns}
            </span>
            <span className="text-slate-400 font-mono text-xs">
              / {target} SQDNS
            </span>
          </div>

          <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
            isCritical ? 'bg-red-950 text-red-300 border border-red-800' : 'bg-slate-800 text-slate-300'
          }`}>
            {Math.round((activeSqdns / target) * 100)}% Posture
          </span>
        </div>

        {/* Progress Bar towards 42 */}
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-2 relative">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              isCritical ? 'bg-red-500' : activeSqdns < 36 ? 'bg-amber-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${Math.min(100, (activeSqdns / target) * 100)}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono">
          <span className="text-slate-400">{currentData.totalAirframes} Combat Jets Active</span>
          <span className={`flex items-center gap-0.5 font-bold ${
            sqdnDelta > 0 ? 'text-emerald-400' : sqdnDelta < 0 ? 'text-red-400' : 'text-slate-400'
          }`}>
            {sqdnDelta > 0 ? <TrendingUp className="w-3.5 h-3.5" /> : sqdnDelta < 0 ? <TrendingDown className="w-3.5 h-3.5" /> : null}
            {sqdnDelta > 0 ? `+${sqdnDelta}` : sqdnDelta} vs Prev Year
          </span>
        </div>
      </div>

      {/* 2. FORCE DEFICIT / SURPLUS */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg relative overflow-hidden backdrop-blur-md">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span className="font-mono uppercase tracking-wider text-[11px] font-semibold text-slate-300">
            FORCE DEFICIT / DEFENSE GAP
          </span>
          {isDeficit ? (
            <AlertTriangle className={`w-4 h-4 ${isCritical ? 'text-red-400 animate-pulse' : 'text-amber-400'}`} />
          ) : (
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          )}
        </div>

        <div className="flex items-baseline justify-between mb-2">
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl sm:text-4xl font-black font-mono tracking-tight ${
              isCritical ? 'text-red-400' : isDeficit ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {isDeficit ? `-${deficit}` : `+${Math.abs(deficit)}`}
            </span>
            <span className="text-slate-400 font-mono text-xs">
              SQDNS ({Math.round(Math.abs(deficit) * 18)} JETS)
            </span>
          </div>
        </div>

        <div className="text-[11px] text-slate-300 font-medium mb-1.5 flex items-center justify-between">
          <span className="text-slate-400 font-mono text-[10px]">READINESS EVALUATION:</span>
          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
            isCritical
              ? 'bg-red-950 text-red-400 border border-red-800'
              : activeSqdns < 36
              ? 'bg-amber-950 text-amber-300 border border-amber-800'
              : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
          }`}>
            {isCritical ? 'High Vulnerability' : activeSqdns < 36 ? 'Strained Threshold' : 'Robust Capability'}
          </span>
        </div>

        <div className="text-[11px] text-slate-400 flex justify-between font-mono pt-1 border-t border-slate-800/80">
          <span>Sanctioned Target:</span>
          <span className="text-slate-200 font-bold">756 Jets (42 Sqdns)</span>
        </div>
      </div>

      {/* 3. GENERATION MASS BREAKDOWN */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg relative overflow-hidden backdrop-blur-md">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span className="font-mono uppercase tracking-wider text-[11px] font-semibold text-slate-300">
            TECH GENERATION MIX
          </span>
          <Cpu className="w-4 h-4 text-purple-400" />
        </div>

        <div className="flex items-baseline justify-between mb-2">
          <div className="text-xs font-mono">
            <span className="text-purple-400 font-bold">{pGen5}%</span> <span className="text-slate-400">Gen 5</span>
            <span className="text-slate-600 mx-1.5">•</span>
            <span className="text-cyan-400 font-bold">{pGen45}%</span> <span className="text-slate-400">4.5+</span>
            <span className="text-slate-600 mx-1.5">•</span>
            <span className="text-slate-300 font-bold">{pGen4}%</span> <span className="text-slate-400">Gen 4</span>
          </div>
        </div>

        {/* Stacked generation bar */}
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex mb-2">
          <div
            className="bg-purple-500 h-full transition-all duration-500"
            style={{ width: `${pGen5}%` }}
            title={`Gen 5 Stealth: ${currentData.generationShare.gen5} jets`}
          />
          <div
            className="bg-cyan-500 h-full transition-all duration-500"
            style={{ width: `${pGen45}%` }}
            title={`Gen 4.5+: ${currentData.generationShare.gen45} jets`}
          />
          <div
            className="bg-slate-500 h-full transition-all duration-500"
            style={{ width: `${pGen4}%` }}
            title={`Gen 4 Legacy: ${currentData.generationShare.gen4} jets`}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>Stealth Assets (AMCA):</span>
          <span className="text-purple-300 font-bold">
            {currentData.generationShare.gen5} Airframes
          </span>
        </div>
      </div>

      {/* 4. ENGINE PIPELINE & ANNUAL TURNOVER */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg relative overflow-hidden backdrop-blur-md">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span className="font-mono uppercase tracking-wider text-[11px] font-semibold text-slate-300">
            ANNUAL INFLOW & OUTFLOW
          </span>
          <Box className="w-4 h-4 text-emerald-400" />
        </div>

        <div className="flex items-baseline justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-mono text-xs font-bold bg-emerald-950/70 border border-emerald-800/80 px-2 py-0.5 rounded">
              +{totalInductions} In
            </span>
            <span className="text-red-400 font-mono text-xs font-bold bg-red-950/70 border border-red-800/80 px-2 py-0.5 rounded">
              -{totalRetirements} Out
            </span>
          </div>
          <span className={`text-xs font-mono font-bold ${
            netTurnover > 0 ? 'text-emerald-400' : netTurnover < 0 ? 'text-red-400' : 'text-slate-400'
          }`}>
            Net: {netTurnover > 0 ? `+${netTurnover}` : netTurnover}
          </span>
        </div>

        {/* Engine Pipeline Alert / Info */}
        <div className="bg-slate-950/80 rounded p-1.5 border border-slate-800 text-[11px] font-mono flex items-center justify-between mb-1">
          <span className="text-slate-400 flex items-center gap-1">
            <Flame className="w-3 h-3 text-amber-400" />
            Gliders Pending GE F404:
          </span>
          <span className={`font-bold ${
            currentData.engineStatus.f404GlidersAwaitingEngine > 0 ? 'text-amber-400' : 'text-emerald-400'
          }`}>
            {currentData.engineStatus.f404GlidersAwaitingEngine} Frames
          </span>
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
          <span>Cum F404 Delivered: {currentData.engineStatus.f404DeliveredCum}</span>
          <span>Mk1A Built: {currentData.engineStatus.f404AirframesBuiltCum}</span>
        </div>
      </div>
    </div>
  );
};
