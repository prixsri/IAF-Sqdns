import React from 'react';
import { SimulationYearData } from '../types/fleet';
import { Shield, ArrowUpRight, ArrowDownRight, Radio } from 'lucide-react';

interface ActiveFleetBreakdownProps {
  currentData: SimulationYearData;
}

export const ActiveFleetBreakdown: React.FC<ActiveFleetBreakdownProps> = ({ currentData }) => {

  // List of all kinetic fighter types including projected future types
  const fighterTypes = [
    { id: 'su30mki', name: 'Sukhoi Su-30MKI', gen: 'Gen 4.5', role: 'Air Dominance / Heavy Strike' },
    { id: 'rafale', name: 'Dassault Rafale (Original 36)', gen: 'Gen 4.5+', role: 'Omnirole Strike' },
    { id: 'rafale_mrfa', name: 'Rafale (114 MRFA Program)', gen: 'Gen 4.5+', role: 'Make-in-India Omnirole' },
    { id: 'tejas_mk1', name: 'HAL Tejas Mk1 (IOC/FOC)', gen: 'Gen 4.5', role: 'Light Combat Fighter' },
    { id: 'tejas_mk1a', name: 'HAL Tejas Mk1-A', gen: 'Gen 4.5', role: 'Upgraded LCA (AESA/EW)' },
    { id: 'tejas_mk2', name: 'HAL Tejas Mk2 (MWF)', gen: 'Gen 4.5+', role: 'Medium Weight Fighter' },
    { id: 'amca_mk1', name: 'DRDO AMCA Mk1 (LSP)', gen: 'Gen 5 Stealth', role: '5th Gen Air Dominance' },
    { id: 'amca_mk2', name: 'DRDO AMCA Mk2', gen: 'Gen 5 Stealth', role: 'Indigenous Engine Stealth' },
    { id: 'mirage2000', name: 'Dassault Mirage 2000 I/TI', gen: 'Gen 4', role: 'Precision Strike Interceptor' },
    { id: 'mig29', name: 'Mikoyan MiG-29 UPG', gen: 'Gen 4', role: 'Air Superiority Interceptor' },
    { id: 'jaguar', name: 'SEPECAT Jaguar DARIN II/III', gen: 'Gen 4', role: 'Deep Strike / Maritime' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      {/* 1. Left 2 Columns: Active Airframes Roster in Selected Year */}
      <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg backdrop-blur-md">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span>ACTIVE FIGHTER INVENTORY — YEAR {currentData.year}</span>
            </h3>
            <p className="text-xs text-slate-400">
              Operational airframes and squadron allocations (standard 18 airframes per squadron).
            </p>
          </div>
          <div className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-800/80 px-2.5 py-1 rounded">
            {currentData.totalSquadrons} ACTIVE SQUADRONS
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                <th className="pb-2 font-medium">AIRCRAFT PLATFORM</th>
                <th className="pb-2 font-medium">GENERATION</th>
                <th className="pb-2 font-medium text-right">ACTIVE FRAMES</th>
                <th className="pb-2 font-medium text-right">SQUADRONS</th>
                <th className="pb-2 font-medium text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {fighterTypes.map(f => {
                const count = currentData.airframes[f.id] || 0;
                const sqdns = currentData.squadrons[f.id] || 0;
                if (count === 0 && (f.id === 'amca_mk1' || f.id === 'amca_mk2' || f.id === 'tejas_mk2' || f.id === 'rafale_mrfa')) {
                  // Not yet inducted
                  return (
                    <tr key={f.id} className="text-slate-600">
                      <td className="py-2.5 font-sans font-medium text-slate-500">{f.name}</td>
                      <td className="py-2.5 text-[10px]">{f.gen}</td>
                      <td className="py-2.5 text-right">—</td>
                      <td className="py-2.5 text-right">—</td>
                      <td className="py-2.5 text-right">
                        <span className="text-[10px] bg-slate-900 text-slate-500 px-1.5 py-0.5 rounded border border-slate-800">
                          Pre-induction
                        </span>
                      </td>
                    </tr>
                  );
                }
                if (count === 0) {
                  // Retired
                  return (
                    <tr key={f.id} className="text-slate-600 bg-slate-950/30">
                      <td className="py-2.5 font-sans font-medium text-slate-600 line-through">{f.name}</td>
                      <td className="py-2.5 text-[10px]">{f.gen}</td>
                      <td className="py-2.5 text-right">0</td>
                      <td className="py-2.5 text-right">0.0</td>
                      <td className="py-2.5 text-right">
                        <span className="text-[10px] bg-red-950/40 text-red-400 px-1.5 py-0.5 rounded border border-red-900/50">
                          Retired
                        </span>
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr key={f.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-2.5 font-sans font-medium text-slate-200 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      <span>{f.name}</span>
                    </td>
                    <td className="py-2.5">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                        f.gen.includes('Gen 5') ? 'bg-purple-950 text-purple-300 border border-purple-800' :
                        f.gen.includes('4.5') ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' :
                        'bg-slate-800 text-slate-300'
                      }`}>
                        {f.gen}
                      </span>
                    </td>
                    <td className="py-2.5 text-right font-bold text-white text-sm">{count}</td>
                    <td className="py-2.5 text-right font-bold text-cyan-400 text-sm">{sqdns}</td>
                    <td className="py-2.5 text-right">
                      <span className="text-[10px] bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-800">
                        Operational
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Right Column: Annual Inflow/Outflow Activity & Ghatak UCAV */}
      <div className="space-y-6">
        {/* Inductions & Retirements Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg backdrop-blur-md">
          <h3 className="text-sm font-bold text-white mb-3 flex items-center justify-between pb-2 border-b border-slate-800">
            <span>ANNUAL TURNOVER ({currentData.year})</span>
            <span className="text-[11px] font-mono text-slate-400">Net Flow</span>
          </h3>

          <div className="space-y-4">
            {/* New Inductions */}
            <div>
              <div className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>Inductions This Year:</span>
              </div>
              {currentData.inductions.length > 0 ? (
                <div className="space-y-1.5">
                  {currentData.inductions.map((ind, i) => (
                    <div
                      key={i}
                      className="bg-emerald-950/40 border border-emerald-800/60 rounded px-2.5 py-1.5 flex items-center justify-between text-xs"
                    >
                      <span className="text-emerald-200 font-sans">{ind.name}</span>
                      <span className="font-mono font-bold text-emerald-400 text-sm">+{ind.count}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-slate-500 italic bg-slate-950/50 p-2 rounded">
                  No new series airframes inducted this year.
                </div>
              )}
            </div>

            {/* Retirements */}
            <div>
              <div className="text-[11px] font-mono font-bold text-red-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <ArrowDownRight className="w-3.5 h-3.5" />
                <span>Phase-Outs / Retirements:</span>
              </div>
              {currentData.retirements.length > 0 ? (
                <div className="space-y-1.5">
                  {currentData.retirements.map((ret, i) => (
                    <div
                      key={i}
                      className="bg-red-950/40 border border-red-800/60 rounded px-2.5 py-1.5 flex items-center justify-between text-xs"
                    >
                      <span className="text-red-200 font-sans">{ret.name}</span>
                      <span className="font-mono font-bold text-red-400 text-sm">-{ret.count}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-slate-500 italic bg-slate-950/50 p-2 rounded">
                  No frame retirements scheduled this year.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Ghatak Autonomous UCAV Loyal Wingman Status */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg backdrop-blur-md">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
            <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-purple-400" />
              <span>Ghatak Stealth UCAV Fleet</span>
            </h4>
            <span className="text-[10px] bg-purple-950 text-purple-300 border border-purple-800 px-1.5 py-0.5 rounded font-mono">
              SWiFT Derivative
            </span>
          </div>

          <div className="flex items-baseline justify-between mb-2 font-mono">
            <span className="text-2xl font-black text-purple-300">
              {currentData.airframes.ghatak_ucav || 0}
            </span>
            <span className="text-xs text-slate-400">/ 60 UNITS PLANNED</span>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
            Autonomous flying-wing unmanned combat aerial vehicle equipped with internal weapons bay for precision deep strike in anti-access / area denial (A2/AD) airspace.
          </p>

          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-purple-500 h-full transition-all duration-500"
              style={{ width: `${Math.min(100, (((currentData.airframes.ghatak_ucav || 0) / 60) * 100))}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
