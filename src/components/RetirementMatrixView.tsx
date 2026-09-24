import React from 'react';
import { SimulationYearData } from '../types/fleet';
import { ArrowDownRight, ArrowUpRight, TrendingDown, Shield } from 'lucide-react';

interface RetirementMatrixViewProps {
  simulationData: SimulationYearData[];
}

export const RetirementMatrixView: React.FC<RetirementMatrixViewProps> = ({ simulationData }) => {
  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-800">
                LIFECYCLE REPLACEMENT MATRIX
              </span>
              <span className="text-xs text-slate-400 font-mono">
                AIRFRAME PHASE-OUT & INDUCTION BALANCE SHEET
              </span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1 flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-red-400" />
              <span>LEGACY FLEET RETIREMENT CURVES & CAPITAL INDUCTIONS</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl">
              Tracks the structural phase-out of SEPECAT Jaguar (from 2028), Mikoyan MiG-29 (from 2029),
              older Su-30MKI batches (from 2030), and Mirage 2000 vs incoming indigenous and imported serial production lines.
            </p>
          </div>
        </div>
      </div>

      {/* Main Year-by-Year Inflow & Outflow Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl backdrop-blur-md">
        <h3 className="text-sm font-bold text-white mb-4 pb-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span>ANNUAL FLEET DYNAMICS BALANCE SHEET (2025–2040)</span>
          </div>
          <span className="text-xs font-mono text-slate-400">Values in Combat Airframes</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px] bg-slate-950/70">
                <th className="py-2.5 px-3 font-semibold">YEAR</th>
                <th className="py-2.5 px-3 font-semibold text-emerald-400">NEW INDUCTIONS</th>
                <th className="py-2.5 px-3 font-semibold text-red-400">PHASED RETIREMENTS</th>
                <th className="py-2.5 px-3 font-semibold text-right">NET DELTA</th>
                <th className="py-2.5 px-3 font-semibold text-right">TOTAL AIRFRAMES</th>
                <th className="py-2.5 px-3 font-semibold text-right text-cyan-400">ACTIVE SQDNS</th>
                <th className="py-2.5 px-3 font-semibold text-right">DEFICIT (vs 42)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {simulationData.map((d) => {
                const totalInducted = d.inductions.reduce((acc, curr) => acc + curr.count, 0);
                const totalRetired = d.retirements.reduce((acc, curr) => acc + curr.count, 0);
                const net = totalInducted - totalRetired;

                return (
                  <tr key={d.year} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 font-bold text-white bg-slate-950/30">
                      {d.year}
                    </td>

                    {/* Inductions Column */}
                    <td className="py-3 px-3">
                      {d.inductions.length > 0 ? (
                        <div className="space-y-1">
                          {d.inductions.map((ind, i) => (
                            <div key={i} className="text-emerald-300 flex items-center gap-1.5 font-sans">
                              <span className="font-mono font-bold text-emerald-400">+{ind.count}</span>
                              <span className="text-[11px] text-slate-300">{ind.name}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>

                    {/* Retirements Column */}
                    <td className="py-3 px-3">
                      {d.retirements.length > 0 ? (
                        <div className="space-y-1">
                          {d.retirements.map((ret, i) => (
                            <div key={i} className="text-red-300 flex items-center gap-1.5 font-sans">
                              <span className="font-mono font-bold text-red-400">-{ret.count}</span>
                              <span className="text-[11px] text-slate-300">{ret.name}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>

                    {/* Net Delta */}
                    <td className="py-3 px-3 text-right">
                      <span className={`font-bold ${net > 0 ? 'text-emerald-400' : net < 0 ? 'text-red-400' : 'text-slate-400'}`}>
                        {net > 0 ? `+${net}` : net}
                      </span>
                    </td>

                    {/* Total Airframes */}
                    <td className="py-3 px-3 text-right font-bold text-white">
                      {d.totalAirframes}
                    </td>

                    {/* Active Squadrons */}
                    <td className="py-3 px-3 text-right font-black text-cyan-400 text-sm">
                      {d.totalSquadrons}
                    </td>

                    {/* Deficit */}
                    <td className="py-3 px-3 text-right">
                      <span className={`font-bold ${d.deficit > 10 ? 'text-red-400' : d.deficit > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {d.deficit > 0 ? `-${d.deficit}` : `+${Math.abs(d.deficit)}`}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Program Sunset & Induction Schedule Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Legacy Fleet Sunset Schedules */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg backdrop-blur-md">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-red-400 mb-3 flex items-center gap-1.5">
            <ArrowDownRight className="w-4 h-4 text-red-400" />
            <span>LEGACY FLEET SUNSET HORIZONS</span>
          </h4>

          <div className="space-y-3 text-xs">
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div className="flex justify-between items-center mb-1">
                <span className="text-white font-bold">SEPECAT Jaguar (DARIN II / III)</span>
                <span className="text-red-400 font-mono font-bold">2028–2034</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                ~116 airframes phased out starting 2028 (~18-20 airframes per year). Fleet airframe fatigue and Adour engine obsolescence dictate retirement.
              </p>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div className="flex justify-between items-center mb-1">
                <span className="text-white font-bold">Mikoyan MiG-29 (UPG)</span>
                <span className="text-red-400 font-mono font-bold">2029–2033</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                ~58 airframes begin phased withdrawal from 2029 (~18 frames/yr) as their second service-life extensions expire.
              </p>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div className="flex justify-between items-center mb-1">
                <span className="text-white font-bold">Su-30MKI (Batch 1 Older Airframes)</span>
                <span className="text-amber-400 font-mono font-bold">2030–2036</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Initial airframes delivered in 2002-2005 reach 25-year structural airframe limit. Concurrently, younger batches rotate into the ₹65,000 Cr "Super Sukhoi" modernization line.
              </p>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div className="flex justify-between items-center mb-1">
                <span className="text-white font-bold">Dassault Mirage 2000 I/TI</span>
                <span className="text-amber-400 font-mono font-bold">2032–2036</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                3 active squadrons at Gwalior will phase down starting 2032 as spare parts from Dassault line closures become scarce.
              </p>
            </div>
          </div>
        </div>

        {/* Future Modernization Program Timelines */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg backdrop-blur-md">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-1.5">
            <ArrowUpRight className="w-4 h-4 text-emerald-400" />
            <span>MODERNIZATION INDUCTION MILESTONES</span>
          </h4>

          <div className="space-y-3 text-xs">
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div className="flex justify-between items-center mb-1">
                <span className="text-white font-bold">Tejas Mk1-A (180 Total Order)</span>
                <span className="text-emerald-400 font-mono font-bold">Dec 2026–2035</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Ramps from Dec 2026 across Bengaluru (Line 1 & 2) and Nashik (Line 3). When Mk2 enters production, Mk1A rate shifts to 16/yr.
              </p>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div className="flex justify-between items-center mb-1">
                <span className="text-white font-bold">Tejas Mk2 (120 Planned Units)</span>
                <span className="text-cyan-400 font-mono font-bold">Sept 2030 Onward</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Rollout scheduled March 2027; first series induction Sept 2030 powered by GE F-414-IN turbofans (2/month supply).
              </p>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div className="flex justify-between items-center mb-1">
                <span className="text-white font-bold">114 Rafale MRFA (Make-in-India)</span>
                <span className="text-cyan-400 font-mono font-bold">2030 (Fly-away) / 2031+</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                18 fly-away fighters delivered in 2030 followed by 96 domestically assembled jets at 12 units/yr (contract signed pre-March 2027).
              </p>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div className="flex justify-between items-center mb-1">
                <span className="text-white font-bold">AMCA Mk1 LSP & Mk2 Full Production</span>
                <span className="text-purple-400 font-mono font-bold">2032 (Mk1) / 2035 (Mk2)</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                40 Mk1 Lead-in Series Production at 16 units/yr starting 2032; 120 AMCA Mk2 with indigenous high-thrust engine starts 2035.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
