import React from 'react';
import { SimulationConfig } from '../types/fleet';
import { X, Sliders, RotateCcw, Check, Shield, Factory, Clock } from 'lucide-react';

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: SimulationConfig;
  setConfig: (config: SimulationConfig) => void;
  onResetToDefault: () => void;
}

export const ConfigModal: React.FC<ConfigModalProps> = ({
  isOpen,
  onClose,
  config,
  setConfig,
  onResetToDefault,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white uppercase tracking-wider">
              Simulation Parameters & Wargame Assumptions
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6 text-xs font-mono">
          {/* 1. Rafale 114 MRFA Procurement */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white font-bold font-sans text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                114 Rafale MRFA Procurement Program
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.mrfaRafaleEnabled}
                  onChange={(e) => setConfig({ ...config, mrfaRafaleEnabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500"></div>
              </label>
            </div>

            {config.mrfaRafaleEnabled ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300 pt-2 border-t border-slate-800/80">
                <div>
                  <span className="text-slate-500 block text-[10px]">FIRST 18 FLY-AWAY LOT:</span>
                  <select
                    value={config.mrfaFlyawayDeliveryYear}
                    onChange={(e) => setConfig({ ...config, mrfaFlyawayDeliveryYear: parseInt(e.target.value, 10) })}
                    className="w-full mt-1 bg-slate-900 border border-slate-700 text-cyan-300 px-2.5 py-1.5 rounded"
                  >
                    <option value={2029}>2029 (Fast-Tracked)</option>
                    <option value={2030}>2030 (Nominal Schedule)</option>
                    <option value={2031}>2031 (Delayed Contract)</option>
                  </select>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">MAKE-IN-INDIA ASSEMBLY RATE:</span>
                  <select
                    value={config.mrfaMakeInIndiaRate}
                    onChange={(e) => setConfig({ ...config, mrfaMakeInIndiaRate: parseInt(e.target.value, 10) })}
                    className="w-full mt-1 bg-slate-900 border border-slate-700 text-cyan-300 px-2.5 py-1.5 rounded"
                  >
                    <option value={8}>8 Units / Year (Conservative)</option>
                    <option value={12}>12 Units / Year (Baseline Target)</option>
                    <option value={16}>16 Units / Year (Surge Line)</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="text-red-400/90 text-[11px] pt-1 italic font-sans">
                MRFA program disabled. No additional 114 Rafales will be inducted (IAF relies strictly on indigenous production).
              </div>
            )}
          </div>

          {/* 2. GE F-404 Engine Delays & HAL Line Capacity */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <h4 className="text-white font-bold font-sans text-sm mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              GE F-404-IN20 Engine Supply Constraints (Tejas Mk1-A)
            </h4>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400">GE Engine Delivery Delay:</span>
                  <span className="text-amber-400 font-bold">
                    {config.geEngineDelayMonths === 0 ? 'On-Time (0 mos)' : `+${config.geEngineDelayMonths} Months Delay`}
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
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>0m</span>
                  <span>6m</span>
                  <span>12m</span>
                  <span>18m</span>
                  <span>24m</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800/80">
                <div>
                  <span className="text-slate-500 block text-[10px]">HAL MK1A LINE CAPACITY:</span>
                  <select
                    value={config.halMk1aCapacity}
                    onChange={(e) => setConfig({ ...config, halMk1aCapacity: parseInt(e.target.value, 10) })}
                    className="w-full mt-1 bg-slate-900 border border-slate-700 text-cyan-300 px-2.5 py-1.5 rounded"
                  >
                    <option value={16}>16 Units / Year (Constrained)</option>
                    <option value={24}>24 Units / Year (Baseline 3 Lines)</option>
                    <option value={30}>30 Units / Year (Scaled Capacity)</option>
                  </select>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">GE COMMITTED ANNUAL SUPPLY:</span>
                  <select
                    value={config.geEngineAnnualSupply}
                    onChange={(e) => setConfig({ ...config, geEngineAnnualSupply: parseInt(e.target.value, 10) })}
                    className="w-full mt-1 bg-slate-900 border border-slate-700 text-cyan-300 px-2.5 py-1.5 rounded"
                  >
                    <option value={12}>12 Engines / Year (1.0/mo)</option>
                    <option value={24}>24 Engines / Year (2.0/mo committed)</option>
                    <option value={30}>30 Engines / Year (2.5/mo surge)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Tejas Mk2 & AMCA Milestones */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <h4 className="text-white font-bold font-sans text-sm mb-3 flex items-center gap-2">
              <Factory className="w-4 h-4 text-purple-400" />
              Tejas Mk2 & AMCA 5th-Gen Stealth Timelines
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-slate-400 block text-[11px] mb-1">Tejas Mk2 First Induction:</span>
                <select
                  value={config.tejasMk2StartYear}
                  onChange={(e) => setConfig({ ...config, tejasMk2StartYear: parseInt(e.target.value, 10) })}
                  className="w-full bg-slate-900 border border-slate-700 text-cyan-300 px-2.5 py-1.5 rounded"
                >
                  <option value={2029}>2029 (Expedited)</option>
                  <option value={2030}>2030 (Sept 2030 Target)</option>
                  <option value={2032}>2032 (Delayed Rollout)</option>
                </select>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px] mb-1">AMCA Mk1 LSP Start:</span>
                <select
                  value={config.amcaMk1StartYear}
                  onChange={(e) => setConfig({ ...config, amcaMk1StartYear: parseInt(e.target.value, 10) })}
                  className="w-full bg-slate-900 border border-slate-700 text-cyan-300 px-2.5 py-1.5 rounded"
                >
                  <option value={2031}>2031 (Aggressive Flight Test)</option>
                  <option value={2032}>2032 (Target 16/yr LSP)</option>
                  <option value={2034}>2034 (Delayed Certification)</option>
                </select>
              </div>
            </div>
          </div>

          {/* 4. Legacy Fleet Retirement Pace */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <h4 className="text-white font-bold font-sans text-sm mb-2 flex items-center gap-2">
              <Shield className="w-4 h-4 text-red-400" />
              Legacy Airframe Retirement Curves (Jaguar & MiG-29)
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'accelerated', label: 'Accelerated', desc: 'Retire 1-2 yrs early' },
                { id: 'normal', label: 'Nominal', desc: 'Baseline 2028-2034' },
                { id: 'slep_extended', label: 'SLEP Extended', desc: 'Service-life extension' }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setConfig({ ...config, retirementPace: opt.id as any })}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    config.retirementPace === opt.id
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  <span className="font-bold block text-xs font-sans">{opt.label}</span>
                  <span className="text-[10px] text-slate-500 block">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-5 mt-4 border-t border-slate-800">
          <button
            onClick={onResetToDefault}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Official Baseline</span>
          </button>

          <button
            onClick={onClose}
            className="flex items-center gap-1.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs transition-colors"
          >
            <Check className="w-4 h-4" />
            <span>Apply Assumptions</span>
          </button>
        </div>
      </div>
    </div>
  );
};
