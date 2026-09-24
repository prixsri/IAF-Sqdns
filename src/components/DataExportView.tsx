import React, { useState } from 'react';
import { SimulationYearData, SimulationConfig } from '../types/fleet';
import { Download, Printer, FileText, Table, CheckCircle2 } from 'lucide-react';

interface DataExportViewProps {
  simulationData: SimulationYearData[];
  config: SimulationConfig;
}

export const DataExportView: React.FC<DataExportViewProps> = ({ simulationData, config }) => {
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);

  // Generate CSV string
  const handleExportCSV = () => {
    const headers = [
      'Year',
      'Total Airframes',
      'Total Squadrons',
      'Target Squadrons',
      'Deficit',
      'Su-30MKI',
      'Rafale Current',
      'Rafale MRFA',
      'Tejas Mk1',
      'Tejas Mk1A',
      'Tejas Mk2',
      'AMCA Mk1',
      'AMCA Mk2',
      'Jaguar',
      'MiG-29',
      'Mirage 2000',
      'Ghatak UCAV',
      'Cum F404 Engines Received',
      'Tejas Mk1A Built',
      'Gliders Backlog',
      'Gen 4 Fighters',
      'Gen 4.5 Fighters',
      'Gen 5 Fighters'
    ];

    const rows = simulationData.map(d => [
      d.year,
      d.totalAirframes,
      d.totalSquadrons,
      d.targetSquadrons,
      d.deficit,
      d.airframes.su30mki || 0,
      d.airframes.rafale || 0,
      d.airframes.rafale_mrfa || 0,
      d.airframes.tejas_mk1 || 0,
      d.airframes.tejas_mk1a || 0,
      d.airframes.tejas_mk2 || 0,
      d.airframes.amca_mk1 || 0,
      d.airframes.amca_mk2 || 0,
      d.airframes.jaguar || 0,
      d.airframes.mig29 || 0,
      d.airframes.mirage2000 || 0,
      d.airframes.ghatak_ucav || 0,
      d.engineStatus.f404DeliveredCum,
      d.engineStatus.f404AirframesBuiltCum,
      d.engineStatus.f404GlidersAwaitingEngine,
      d.generationShare.gen4,
      d.generationShare.gen45,
      d.generationShare.gen5
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `IAF_Fleet_Simulation_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  // Find min squadron year and stats
  const minSqdn = Math.min(...simulationData.map(d => d.totalSquadrons));
  const minYear = simulationData.find(d => d.totalSquadrons === minSqdn)?.year || 2028;
  const endData = simulationData[simulationData.length - 1];

  return (
    <div className="space-y-6">
      {/* Header and Actions */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4 backdrop-blur-md">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            <span>DATA EXPLORER & STRATEGIC EXECUTIVE BRIEFING</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Export granular projection datasets to CSV or print the formal IAF Force Structure assessment.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/50 px-3.5 py-2 rounded-lg text-xs font-bold transition-all shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV Dataset</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3.5 py-2 rounded-lg text-xs font-bold transition-all shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Print Executive Briefing</span>
          </button>
        </div>
      </div>

      {copiedNotification && (
        <div className="bg-emerald-950 border border-emerald-800 text-emerald-300 p-3 rounded-lg text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Simulation CSV dataset successfully generated and downloaded!</span>
        </div>
      )}

      {/* Executive Briefing Summary Card (Printable) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-xl backdrop-blur-md">
        <div className="border-b border-slate-800 pb-4 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-cyan-950 border border-cyan-500 flex items-center justify-center text-xs font-bold text-cyan-400 font-mono">
              IAF
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                CONFIDENTIAL // FORCE PLANNING ESTIMATE: SQUADRON EVOLUTION 2025–2040
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                Integrated Air Staff Requirement (ASR) Simulation Model
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-950 px-2 py-1 rounded border border-cyan-800">
            SANCTIONED: 42 SQUADRONS
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono mb-6">
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-500 block text-[10px]">PROJECTED CRITICAL TROUGH</span>
            <span className="text-red-400 font-bold text-base">{minSqdn} Squadrons</span>
            <span className="text-slate-400 block text-[10px] mt-0.5">Occurs around Year {minYear}</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-500 block text-[10px]">2040 PROJECTED FLEET SIZE</span>
            <span className="text-cyan-400 font-bold text-base">{endData.totalSquadrons} Squadrons</span>
            <span className="text-slate-400 block text-[10px] mt-0.5">{endData.totalAirframes} Combat Airframes</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-500 block text-[10px]">2040 5TH-GEN STEALTH SHARE</span>
            <span className="text-purple-400 font-bold text-base">{endData.generationShare.gen5} AMCA Units</span>
            <span className="text-slate-400 block text-[10px] mt-0.5">
              {Math.round((endData.generationShare.gen5 / endData.totalAirframes) * 100)}% of Total Fighter Fleet
            </span>
          </div>
        </div>

        {/* Active Scenario Parameters Metadata */}
        <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-400 mb-5 flex flex-wrap gap-x-4 gap-y-1">
          <span><strong className="text-white">MRFA Status:</strong> {config.mrfaRafaleEnabled ? '114 Jets Active' : 'Cancelled'}</span>
          <span>•</span>
          <span><strong className="text-white">GE Engine Lag:</strong> +{config.geEngineDelayMonths} mos</span>
          <span>•</span>
          <span><strong className="text-white">HAL Mk1A Line:</strong> {config.halMk1aCapacity} / yr</span>
          <span>•</span>
          <span><strong className="text-white">Tejas Mk2:</strong> Year {config.tejasMk2StartYear}</span>
          <span>•</span>
          <span><strong className="text-white">AMCA Mk1 LSP:</strong> Year {config.amcaMk1StartYear}</span>
          <span>•</span>
          <span><strong className="text-white">Retirement Pace:</strong> {config.retirementPace}</span>
        </div>

        <div className="space-y-3 text-xs text-slate-300 leading-relaxed font-sans">
          <h4 className="font-mono font-bold uppercase tracking-wider text-cyan-400 text-xs">
            STRATEGIC KEY TAKEAWAYS & AIR STAFF FINDINGS:
          </h4>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
            <li>
              <strong>The 2028–2031 Vulnerability Trough:</strong> Phased retirement of SEPECAT Jaguar and MiG-29 UPG creates a critical force depression where IAF strength dips to ~{minSqdn} squadrons. This leaves India vulnerable in a simultaneous two-front deterrence scenario unless Tejas Mk1A induction accelerates to 24+ units/year without delay.
            </li>
            <li>
              <strong>GE F-404 Engine Bottleneck Sensitivity:</strong> A delay of even 12 to 18 months in GE F-404-IN20 engine deliveries compounds the trough, creating up to 16 un-engined "gliders" at HAL hangars and postponing squadron rejuvenation past 2030.
            </li>
            <li>
              <strong>Impact of the 114 MRFA Decision:</strong> Procuring 114 Rafales provides an immediate infusion of 18 fly-away jets in 2030 and 96 Make-in-India units through 2038, accounting for ~6.3 vital squadrons that stabilize the medium combat tier.
            </li>
            <li>
              <strong>AMCA Stealth Transition:</strong> The 84-month development clock following the October 2026 DCPP decision enables AMCA Mk1 Lead-in Series Production from 2032, paving the way for 120 indigenous Mk2 units from 2035.
            </li>
          </ul>
        </div>
      </div>

      {/* Comprehensive Raw Data Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl backdrop-blur-md">
        <h3 className="text-sm font-bold text-white mb-3 flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Table className="w-4 h-4 text-cyan-400" />
            <span>FULL ANNUAL DATASET MATRIX (2025–2040)</span>
          </div>
          <span className="text-xs font-mono text-slate-400">16-Year Simulation Horizon</span>
        </h3>

        <div className="overflow-x-auto max-h-[440px] overflow-y-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="sticky top-0 bg-slate-950 border-b border-slate-800 text-slate-400 text-[11px]">
              <tr>
                <th className="py-2.5 px-2 font-semibold">YEAR</th>
                <th className="py-2.5 px-2 font-semibold text-right">TOTAL JETS</th>
                <th className="py-2.5 px-2 font-semibold text-right text-cyan-400">SQDNS</th>
                <th className="py-2.5 px-2 font-semibold text-right">DEFICIT</th>
                <th className="py-2.5 px-2 font-semibold text-right">SU-30</th>
                <th className="py-2.5 px-2 font-semibold text-right">RAFALE</th>
                <th className="py-2.5 px-2 font-semibold text-right">MK1-A</th>
                <th className="py-2.5 px-2 font-semibold text-right">MK2</th>
                <th className="py-2.5 px-2 font-semibold text-right">AMCA</th>
                <th className="py-2.5 px-2 font-semibold text-right">JAG</th>
                <th className="py-2.5 px-2 font-semibold text-right">MIG29</th>
                <th className="py-2.5 px-2 font-semibold text-right">MIRAGE</th>
                <th className="py-2.5 px-2 font-semibold text-right text-amber-400">GLIDERS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {simulationData.map((d) => (
                <tr key={d.year} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-2 font-bold text-white bg-slate-950/40">{d.year}</td>
                  <td className="py-2.5 px-2 text-right font-medium text-slate-200">{d.totalAirframes}</td>
                  <td className="py-2.5 px-2 text-right font-bold text-cyan-400">{d.totalSquadrons}</td>
                  <td className="py-2.5 px-2 text-right font-bold text-red-400">-{d.deficit}</td>
                  <td className="py-2.5 px-2 text-right text-slate-300">{d.airframes.su30mki || 0}</td>
                  <td className="py-2.5 px-2 text-right text-slate-300">
                    {(d.airframes.rafale || 0) + (d.airframes.rafale_mrfa || 0)}
                  </td>
                  <td className="py-2.5 px-2 text-right text-cyan-300">{d.airframes.tejas_mk1a || 0}</td>
                  <td className="py-2.5 px-2 text-right text-cyan-300">{d.airframes.tejas_mk2 || 0}</td>
                  <td className="py-2.5 px-2 text-right text-purple-300">
                    {(d.airframes.amca_mk1 || 0) + (d.airframes.amca_mk2 || 0)}
                  </td>
                  <td className="py-2.5 px-2 text-right text-slate-400">{d.airframes.jaguar || 0}</td>
                  <td className="py-2.5 px-2 text-right text-slate-400">{d.airframes.mig29 || 0}</td>
                  <td className="py-2.5 px-2 text-right text-slate-400">{d.airframes.mirage2000 || 0}</td>
                  <td className="py-2.5 px-2 text-right font-bold text-amber-400">
                    {d.engineStatus.f404GlidersAwaitingEngine}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
