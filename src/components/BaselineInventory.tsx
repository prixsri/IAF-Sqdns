import React, { useState } from 'react';
import { BASELINE_FLEET } from '../data/baselineFleet';
import { AircraftSpec, FleetCategory } from '../types/fleet';
import { Search, Shield, Crosshair, ChevronRight, MapPin, X } from 'lucide-react';

export const BaselineInventory: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<FleetCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedAircraft, setSelectedAircraft] = useState<AircraftSpec | null>(null);

  const filteredFleet = BASELINE_FLEET.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.radar.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.squadrons.some(
        (s) =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.base.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  const categoryCounts = {
    all: BASELINE_FLEET.length,
    kinetic: BASELINE_FLEET.filter(a => a.category === 'kinetic').length,
    multiplier: BASELINE_FLEET.filter(a => a.category === 'multiplier').length,
    rotary: BASELINE_FLEET.filter(a => a.category === 'rotary').length,
    unmanned: BASELINE_FLEET.filter(a => a.category === 'unmanned').length,
  };

  return (
    <div className="space-y-6">
      {/* Overview & Filter Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-cyan-400" />
              <span>INDIAN AIR FORCE — BASELINE INVENTORY & ORDER OF BATTLE (ORBAT)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Comprehensive registry of active combat airframes, force multipliers, rotary wing, and unmanned aerial assets.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search airframe, base, radar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800">
          {[
            { id: 'all', label: 'All Fleet Assets', count: categoryCounts.all, icon: '🌐' },
            { id: 'kinetic', label: 'Kinetic (Combat Fighters)', count: categoryCounts.kinetic, icon: '✈️' },
            { id: 'multiplier', label: 'Force Multipliers (AWACS & Tankers)', count: categoryCounts.multiplier, icon: '🛫' },
            { id: 'rotary', label: 'Rotary (Attack & Transport Heli)', count: categoryCounts.rotary, icon: '🚁' },
            { id: 'unmanned', label: 'Unmanned (UAVs & Loitering)', count: categoryCounts.unmanned, icon: '🎯' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                selectedCategory === cat.id
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-sm'
                  : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
              <span className="text-[10px] bg-slate-800 px-1.5 py-0.2 rounded-full font-mono">
                {cat.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Aircraft Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredFleet.map((aircraft) => (
          <div
            key={aircraft.id}
            onClick={() => setSelectedAircraft(aircraft)}
            className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 hover:border-cyan-500/50 transition-all cursor-pointer group shadow-lg flex flex-col justify-between hover:shadow-cyan-950/20 backdrop-blur-md"
          >
            <div>
              {/* Card Header */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                    aircraft.category === 'kinetic' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' :
                    aircraft.category === 'multiplier' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                    aircraft.category === 'rotary' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                    'bg-purple-950 text-purple-300 border border-purple-800'
                  }`}>
                    {aircraft.generation}
                  </span>
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors mt-1">
                    {aircraft.name}
                  </h3>
                  <div className="text-xs text-slate-400 font-medium">
                    {aircraft.role}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-black font-mono text-cyan-400">
                    {aircraft.currentAirframes}
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 uppercase">
                    Airframes
                  </div>
                </div>
              </div>

              {/* Specs Pills */}
              <div className="grid grid-cols-2 gap-2 my-3 text-[11px] font-mono">
                <div className="bg-slate-950/70 p-2 rounded border border-slate-800/80">
                  <span className="text-slate-500 block text-[10px]">RADAR / SENSOR</span>
                  <span className="text-slate-200 truncate block font-sans" title={aircraft.radar}>
                    {aircraft.radar}
                  </span>
                </div>
                <div className="bg-slate-950/70 p-2 rounded border border-slate-800/80">
                  <span className="text-slate-500 block text-[10px]">COMBAT RADIUS</span>
                  <span className="text-slate-200 block font-mono">
                    {aircraft.combatRangeKm > 0 ? `${aircraft.combatRangeKm} km` : 'Strategic'}
                  </span>
                </div>
              </div>

              {/* Key Weapons Snippet */}
              <div className="mb-3">
                <div className="text-[10px] uppercase font-mono text-slate-400 mb-1 flex items-center gap-1">
                  <Crosshair className="w-3 h-3 text-cyan-400" />
                  <span>Key Armament / Systems:</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {aircraft.keyWeapons.slice(0, 3).map((w, i) => (
                    <span
                      key={i}
                      className="text-[10px] bg-slate-950 text-slate-300 px-1.5 py-0.5 rounded border border-slate-800 truncate max-w-full"
                    >
                      {w}
                    </span>
                  ))}
                  {aircraft.keyWeapons.length > 3 && (
                    <span className="text-[10px] text-cyan-400 px-1">
                      +{aircraft.keyWeapons.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Card Footer: Active Squadrons & View Link */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono text-[11px] flex items-center gap-1">
                <MapPin className="w-3 h-3 text-cyan-400" />
                {aircraft.squadrons.length} Base Deployments
              </span>
              <span className="text-cyan-400 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5 text-[11px]">
                <span>Details & Roster</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: Full Aircraft Details & Squadron Deployment Roster */}
      {selectedAircraft && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setSelectedAircraft(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header info */}
            <div className="flex items-start gap-4 mb-4 pb-4 border-b border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-2xl flex-shrink-0">
                {selectedAircraft.silhouette}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                    {selectedAircraft.generation}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Inducted: {selectedAircraft.firstInducted}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mt-1">
                  {selectedAircraft.name}
                </h3>
                <p className="text-xs text-slate-300 font-medium">{selectedAircraft.role}</p>
              </div>
            </div>

            {/* Operational Summary */}
            <p className="text-xs text-slate-300 leading-relaxed mb-5 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
              {selectedAircraft.description}
            </p>

            {/* Technical Specifications Matrix */}
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 mb-2">
              TECHNICAL SPECIFICATIONS & HARDWARE
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5 text-xs font-mono">
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                <span className="text-slate-500 block text-[10px]">RADAR SYSTEM</span>
                <span className="text-white font-sans font-medium">{selectedAircraft.radar}</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                <span className="text-slate-500 block text-[10px]">PROPULSION ENGINE</span>
                <span className="text-white font-sans font-medium">{selectedAircraft.engineType}</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                <span className="text-slate-500 block text-[10px]">ORIGIN & BUILDER</span>
                <span className="text-white font-sans font-medium">{selectedAircraft.manufacturer}</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                <span className="text-slate-500 block text-[10px]">MAX SPEED</span>
                <span className="text-cyan-400 font-bold">Mach {selectedAircraft.maxSpeedMach}</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                <span className="text-slate-500 block text-[10px]">COMBAT RADIUS</span>
                <span className="text-cyan-400 font-bold">{selectedAircraft.combatRangeKm} km</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                <span className="text-slate-500 block text-[10px]">EXTERNAL STORES</span>
                <span className="text-cyan-400 font-bold">{selectedAircraft.hardpoints} Hardpoints</span>
              </div>
            </div>

            {/* Armament Roster */}
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 mb-2">
              KEY WEAPONS & INTEGRATED PAYLOAD
            </h4>
            <div className="flex flex-wrap gap-1.5 mb-5">
              {selectedAircraft.keyWeapons.map((weapon, idx) => (
                <span
                  key={idx}
                  className="bg-slate-950 border border-cyan-800/50 text-cyan-200 text-xs px-2.5 py-1 rounded"
                >
                  {weapon}
                </span>
              ))}
            </div>

            {/* Squadron Deployments */}
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 mb-2 flex items-center justify-between">
              <span>ACTIVE SQUADRON DEPLOYMENTS & BASES</span>
              <span className="text-slate-400 font-normal">
                {selectedAircraft.squadrons.length} Documented Units
              </span>
            </h4>
            <div className="space-y-2">
              {selectedAircraft.squadrons.map((sq, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-cyan-400">{sq.number}</span>
                    <span className="text-white font-medium">"{sq.name}"</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      {sq.base}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px]">
                      {sq.command} Command
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
