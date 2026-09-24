import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  AreaChart,
  Area,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { SimulationYearData } from '../types/fleet';
import { Activity, Info } from 'lucide-react';

interface SimulationChartsProps {
  simulationData: SimulationYearData[];
  currentYear: number;
  setCurrentYear: (year: number) => void;
}

export const SimulationCharts: React.FC<SimulationChartsProps> = ({
  simulationData,
  currentYear,
  setCurrentYear,
}) => {
  const [activeChartTab, setActiveChartTab] = useState<'squadrons' | 'composition' | 'engines' | 'generations'>('squadrons');

  // Prepare chart datasets
  const chartData = simulationData.map(d => ({
    year: d.year,
    totalSquadrons: d.totalSquadrons,
    targetSquadrons: d.targetSquadrons,
    deficit: d.deficit,
    totalAirframes: d.totalAirframes,
    // Types
    su30mki: d.airframes.su30mki || 0,
    rafale: (d.airframes.rafale || 0) + (d.airframes.rafale_mrfa || 0),
    tejas_mk1: d.airframes.tejas_mk1 || 0,
    tejas_mk1a: d.airframes.tejas_mk1a || 0,
    tejas_mk2: d.airframes.tejas_mk2 || 0,
    amca: (d.airframes.amca_mk1 || 0) + (d.airframes.amca_mk2 || 0),
    jaguar: d.airframes.jaguar || 0,
    mig29: d.airframes.mig29 || 0,
    mirage2000: d.airframes.mirage2000 || 0,
    // Engines
    enginesReceived: d.engineStatus.f404DeliveredCum,
    airframesBuilt: d.engineStatus.f404AirframesBuiltCum,
    gliders: d.engineStatus.f404GlidersAwaitingEngine,
    // Generations
    gen4: d.generationShare.gen4,
    gen45: d.generationShare.gen45,
    gen5: d.generationShare.gen5,
  }));

  // Custom Dark Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-950/95 border border-slate-700/80 p-3 rounded-lg shadow-2xl text-xs font-mono backdrop-blur-md">
          <div className="text-cyan-400 font-bold border-b border-slate-800 pb-1 mb-2 flex items-center justify-between">
            <span>YEAR: {label}</span>
            <span className="text-[10px] text-slate-400 font-normal">Click to Jump</span>
          </div>
          <div className="space-y-1">
            {payload.map((entry: any, index: number) => (
              <div key={`item-${index}`} className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-1.5" style={{ color: entry.color }}>
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                  {entry.name}:
                </span>
                <span className="font-bold text-slate-100">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl mb-6 backdrop-blur-md">
      {/* Chart Selector Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>FORCE TRAJECTORY & PROJECTION ANALYTICS</span>
          </h2>
          <p className="text-xs text-slate-400">
            Click on any year in the chart to scrub the simulation timeline directly.
          </p>
        </div>

        {/* Tab buttons */}
        <div className="flex items-center bg-slate-950 rounded-lg p-1 border border-slate-800 text-xs">
          <button
            onClick={() => setActiveChartTab('squadrons')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
              activeChartTab === 'squadrons'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Squadrons vs 42 Target
          </button>
          <button
            onClick={() => setActiveChartTab('composition')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
              activeChartTab === 'composition'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Fleet Composition
          </button>
          <button
            onClick={() => setActiveChartTab('engines')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
              activeChartTab === 'engines'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            GE F404 Engine Pipeline
          </button>
          <button
            onClick={() => setActiveChartTab('generations')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
              activeChartTab === 'generations'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Gen Mix Evolution
          </button>
        </div>
      </div>

      {/* CHART CONTENT */}
      <div className="h-[360px] w-full">
        {activeChartTab === 'squadrons' && (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              onClick={(state) => {
                if (state && state.activeLabel) {
                  setCurrentYear(Number(state.activeLabel));
                }
              }}
              margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="sqdnArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="year" stroke="#64748b" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis domain={[20, 48]} stroke="#64748b" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />

              {/* Sanctioned 42-Squadron Benchmark */}
              <ReferenceLine
                y={42}
                stroke="#10b981"
                strokeWidth={2}
                strokeDasharray="4 4"
                label={{
                  value: 'Sanctioned Strength (42 Sqdns)',
                  fill: '#10b981',
                  position: 'insideTopRight',
                  fontSize: 11,
                }}
              />

              {/* 30-Squadron Critical Threshold */}
              <ReferenceLine
                y={30}
                stroke="#ef4444"
                strokeWidth={1.5}
                strokeDasharray="2 2"
                label={{
                  value: 'Critical Red Line (30 Sqdns)',
                  fill: '#ef4444',
                  position: 'insideBottomRight',
                  fontSize: 11,
                }}
              />

              {/* Selected scrubber year marker */}
              <ReferenceLine
                x={currentYear}
                stroke="#38bdf8"
                strokeWidth={2}
                label={{
                  value: `Selected Year (${currentYear})`,
                  fill: '#38bdf8',
                  position: 'insideTopLeft',
                  fontSize: 11,
                }}
              />

              <Area
                type="monotone"
                dataKey="totalSquadrons"
                name="Active Squadrons"
                stroke="#06b6d4"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#sqdnArea)"
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}

        {activeChartTab === 'composition' && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              onClick={(state) => {
                if (state && state.activeLabel) {
                  setCurrentYear(Number(state.activeLabel));
                }
              }}
              margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="year" stroke="#64748b" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
              <ReferenceLine x={currentYear} stroke="#ffffff" strokeWidth={1.5} strokeDasharray="3 3" />

              {/* Stacked Airframes */}
              <Area type="monotone" dataKey="amca" name="AMCA Mk1/Mk2 (5th Gen)" stackId="1" stroke="#a855f7" fill="#a855f7" />
              <Area type="monotone" dataKey="tejas_mk2" name="Tejas Mk2 (MWF)" stackId="1" stroke="#0ea5e9" fill="#0ea5e9" />
              <Area type="monotone" dataKey="tejas_mk1a" name="Tejas Mk1-A" stackId="1" stroke="#38bdf8" fill="#38bdf8" />
              <Area type="monotone" dataKey="tejas_mk1" name="Tejas Mk1 (IOC/FOC)" stackId="1" stroke="#0284c7" fill="#0284c7" />
              <Area type="monotone" dataKey="rafale" name="Rafale (Current + MRFA)" stackId="1" stroke="#10b981" fill="#10b981" />
              <Area type="monotone" dataKey="su30mki" name="Su-30MKI" stackId="1" stroke="#3b82f6" fill="#3b82f6" />
              <Area type="monotone" dataKey="mirage2000" name="Mirage 2000" stackId="1" stroke="#eab308" fill="#eab308" />
              <Area type="monotone" dataKey="mig29" name="MiG-29 UPG" stackId="1" stroke="#f97316" fill="#f97316" />
              <Area type="monotone" dataKey="jaguar" name="Jaguar DARIN" stackId="1" stroke="#ef4444" fill="#ef4444" />
            </AreaChart>
          </ResponsiveContainer>
        )}

        {activeChartTab === 'engines' && (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              onClick={(state) => {
                if (state && state.activeLabel) {
                  setCurrentYear(Number(state.activeLabel));
                }
              }}
              margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="year" stroke="#64748b" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
              <ReferenceLine x={currentYear} stroke="#ffffff" strokeWidth={1.5} strokeDasharray="3 3" />

              <Line
                type="monotone"
                dataKey="enginesReceived"
                name="Cum. GE F404 Engines Received"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="airframesBuilt"
                name="Cum. Tejas Mk1A Airframes Inducted"
                stroke="#06b6d4"
                strokeWidth={3}
                dot={{ r: 3 }}
              />
              <Bar
                dataKey="gliders"
                name="Gliders (Airframes Built Awaiting Engines)"
                fill="#f59e0b"
                opacity={0.8}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}

        {activeChartTab === 'generations' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              onClick={(state) => {
                if (state && state.activeLabel) {
                  setCurrentYear(Number(state.activeLabel));
                }
              }}
              margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="year" stroke="#64748b" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
              <ReferenceLine x={currentYear} stroke="#ffffff" strokeWidth={1.5} strokeDasharray="3 3" />

              <Bar dataKey="gen5" name="5th Gen Stealth (AMCA)" stackId="a" fill="#a855f7" />
              <Bar dataKey="gen45" name="4.5 Gen (Su-30MKI, Rafale, Tejas)" stackId="a" fill="#06b6d4" />
              <Bar dataKey="gen4" name="4th Gen (Jaguar, MiG-29, Mirage)" stackId="a" fill="#64748b" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Chart Context Footer */}
      <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
          <span>
            {activeChartTab === 'squadrons' &&
              'IAF sanctioned force posture requires 42 combat squadrons (756 jets) to guarantee two-front air superiority.'}
            {activeChartTab === 'composition' &&
              'Shows the phased sunset of Jaguar, MiG-29 and Mirage 2000 offset by Tejas Mk1A, Tejas Mk2, and AMCA inductions.'}
            {activeChartTab === 'engines' &&
              'Glider airframes occur when HAL manufacturing pace outstrips GE F-404-IN20 engine delivery rate.'}
            {activeChartTab === 'generations' &&
              'Tracks the strategic qualitative transition from legacy 4th Gen airframes to indigenous 4.5+ and 5th Gen stealth platforms.'}
          </span>
        </div>
        <div className="font-mono text-cyan-400 text-right">
          Interactive Data Point: {currentYear}
        </div>
      </div>
    </div>
  );
};
