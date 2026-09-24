import React, { useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Calendar, Flag } from 'lucide-react';
import { SimulationYearData } from '../types/fleet';

interface TimelineSliderProps {
  currentYear: number;
  setCurrentYear: React.Dispatch<React.SetStateAction<number>>;
  simulationData: SimulationYearData[];
}

export const TimelineSlider: React.FC<TimelineSliderProps> = ({
  currentYear,
  setCurrentYear,
  simulationData,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1); // 1 = 1.2s per year, 2 = 0.6s

  const minYear = 2025;
  const maxYear = 2040;

  // Auto-play effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentYear(prev => {
          if (prev >= maxYear) {
            setIsPlaying(false);
            return maxYear;
          }
          return prev + 1;
        });
      }, 1400 / playbackSpeed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, playbackSpeed, setCurrentYear]);

  const currentYearData = simulationData.find(d => d.year === currentYear);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-xl mb-6 relative overflow-hidden backdrop-blur-md">
      {/* Background HUD Grid Line Accent */}
      <div className="absolute top-0 right-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent" />

      {/* Top Row: Year Banner & Playback Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-cyan-950/80 border border-cyan-500/50 rounded-lg px-4 py-2 flex items-center gap-3">
            <Calendar className="w-5 h-5 text-cyan-400" />
            <div>
              <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest leading-none">
                SIMULATION TIMELINE
              </div>
              <div className="text-2xl font-black font-mono tracking-tight text-white flex items-baseline gap-2">
                <span>{currentYear}</span>
                <span className="text-xs font-normal text-slate-400">
                  {currentYear === 2025 ? '(Baseline Point)' : currentYear === 2040 ? '(Horizon End)' : ''}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Year Status Badge */}
          {currentYearData && (
            <div className="hidden md:flex flex-col text-xs">
              <span className="text-slate-400">Force Strength Status:</span>
              <span className={`font-mono font-bold ${
                currentYearData.totalSquadrons < 30 ? 'text-red-400' :
                currentYearData.totalSquadrons < 35 ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {currentYearData.totalSquadrons} Sqdns ({currentYearData.totalAirframes} Fighters)
                {currentYearData.totalSquadrons < 30 ? ' • CRITICAL DEFICIT' : currentYearData.totalSquadrons >= 42 ? ' • SANCTIONED TARGET MET' : ''}
              </span>
            </div>
          )}
        </div>

        {/* Media Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentYear(Math.max(minYear, currentYear - 1))}
            disabled={currentYear <= minYear}
            className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40 transition-colors border border-slate-700 text-xs"
            title="Previous Year"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs transition-all border ${
              isPlaying
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 hover:bg-amber-500/30'
                : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 hover:bg-cyan-500/30'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>PAUSE</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>AUTO PLAY</span>
              </>
            )}
          </button>

          <button
            onClick={() => setCurrentYear(Math.min(maxYear, currentYear + 1))}
            disabled={currentYear >= maxYear}
            className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40 transition-colors border border-slate-700 text-xs"
            title="Next Year"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              setCurrentYear(minYear);
              setIsPlaying(false);
            }}
            className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors border border-slate-700 text-xs"
            title="Reset to 2025"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <div className="flex items-center bg-slate-800/80 rounded-lg p-0.5 border border-slate-700 text-xs ml-1">
            <button
              onClick={() => setPlaybackSpeed(1)}
              className={`px-2 py-1 rounded text-[11px] font-mono font-bold ${
                playbackSpeed === 1 ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              1x
            </button>
            <button
              onClick={() => setPlaybackSpeed(2)}
              className={`px-2 py-1 rounded text-[11px] font-mono font-bold ${
                playbackSpeed === 2 ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              2x
            </button>
          </div>
        </div>
      </div>

      {/* Main Slider Track */}
      <div className="relative pt-2 pb-6 px-1">
        <input
          type="range"
          min={minYear}
          max={maxYear}
          step={1}
          value={currentYear}
          onChange={(e) => setCurrentYear(parseInt(e.target.value, 10))}
          className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
        />

        {/* Tick labels */}
        <div className="flex justify-between text-[11px] font-mono text-slate-500 mt-2 select-none">
          {Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i).map((year) => {
            const isSelected = year === currentYear;
            const isMilestone = year === 2026 || year === 2027 || year === 2030 || year === 2032 || year === 2035;
            return (
              <button
                key={year}
                onClick={() => setCurrentYear(year)}
                className={`flex flex-col items-center group transition-colors ${
                  isSelected
                    ? 'text-cyan-400 font-bold scale-110'
                    : isMilestone
                    ? 'text-slate-300 font-medium hover:text-cyan-300'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <span className={`w-1 h-1.5 rounded-full mb-1 ${
                  isSelected ? 'bg-cyan-400 h-2.5' : isMilestone ? 'bg-amber-400' : 'bg-slate-700'
                }`} />
                <span>{year % 100}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Milestone Ticker for Selected Year */}
      {currentYearData && currentYearData.keyMilestones && currentYearData.keyMilestones.length > 0 && (
        <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-2.5 flex items-start gap-2 text-xs">
          <Flag className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-semibold mr-2">
              YEAR {currentYear} KEY MILESTONES:
            </span>
            <div className="flex flex-wrap gap-2 mt-1">
              {currentYearData.keyMilestones.map((m, idx) => (
                <span
                  key={idx}
                  className="bg-slate-900 border border-slate-700/80 text-slate-300 rounded px-2 py-0.5 font-medium inline-flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
