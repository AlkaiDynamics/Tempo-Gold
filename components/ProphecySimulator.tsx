
import React, { useState, useEffect } from 'react';
import { CalendarType } from '../types';
import { PROPHETIC_YEAR_SECONDS, TROPICAL_YEAR_SECONDS } from '../constants';
import { Zap, TrendingUp, AlertCircle, CheckCircle2, ChevronRight, Activity, Target, ShieldAlert } from 'lucide-react';

const ProphecySimulator: React.FC = () => {
  const [origin, setOrigin] = useState(800);
  const [duration, setDuration] = useState(1260);
  const [engine, setEngine] = useState<CalendarType>(CalendarType.PROPHETIC_360);
  const [isSimulating, setIsSimulating] = useState(false);

  const calculateResults = () => {
    const alphaDurationSeconds = duration * PROPHETIC_YEAR_SECONDS;
    const betaDurationSeconds = duration * TROPICAL_YEAR_SECONDS;
    
    const driftYears = (betaDurationSeconds - alphaDurationSeconds) / TROPICAL_YEAR_SECONDS;
    const intersectionYear = origin + duration - driftYears;
    
    const alphaTarget = origin + duration;
    const betaIntersection = Math.round(intersectionYear);
    const driftDays = Math.round((betaDurationSeconds - alphaDurationSeconds) / (24 * 3600));

    const currentYear = new Date().getFullYear();
    let auditMessage = "";
    if (betaIntersection < currentYear && alphaTarget > currentYear) {
      auditMessage = `Historical Audit: The 1,260 prophetic years have already passed in the stars. Your calendar shows "2060" because it's using a ruler that is 5.24 days too long every year. The coordinate was reached in the Alpha stream years ago.`;
    } else if (betaIntersection > currentYear) {
      auditMessage = `The trajectory is incoming. Institutional Beta (Red) expects arrival in ${betaIntersection}, but the Alpha clock (Gold) is ticking faster. Prepare for intersection.`;
    } else {
      auditMessage = `Audit Complete: Both Alpha and Beta streams have resolved this coordinate. Trajectory historical data logged.`;
    }

    return {
      alphaTarget,
      betaIntersection,
      driftDays,
      driftYears: driftYears.toFixed(1),
      auditMessage
    };
  };

  const results = calculateResults();

  useEffect(() => {
    setIsSimulating(true);
    const timer = setTimeout(() => setIsSimulating(false), 800);
    return () => clearTimeout(timer);
  }, [origin, duration, engine]);

  return (
    <div className="glass-panel p-10 rounded-[50px] border-4 border-[#eab308] border-opacity-30 relative overflow-hidden bg-black bg-opacity-60 shadow-2xl">
      <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
        <Target size={200} className="text-yellow-500" />
      </div>

      <div className="flex items-center justify-between mb-12">
        <div className="flex flex-col">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-yellow-500/10 rounded-xl">
              <Zap className="text-yellow-500" size={20} />
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tighter text-white">Prophecy Trajectory Map</h3>
          </div>
          <span className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] ml-1">Decoding Original Chronological Intent</span>
        </div>
        <div className="flex items-center gap-4">
          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest hidden sm:block">Trajectory Engine:</label>
          <select 
            value={engine}
            onChange={(e) => setEngine(e.target.value as CalendarType)}
            className="bg-white bg-opacity-5 border-2 border-white border-opacity-10 text-[10px] mono font-black text-gray-400 px-6 py-3 rounded-2xl focus:outline-none focus:border-yellow-500 transition-all cursor-pointer hover:bg-white/10"
          >
            <option value={CalendarType.PROPHETIC_360}>360-DAY PROPHETIC</option>
            <option value={CalendarType.MAYAN_LONG_COUNT}>MAYAN LONG COUNT</option>
            <option value={CalendarType.JULIAN}>NATIVE JULIAN</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
        <div className="space-y-8">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
               <label className="text-[11px] text-gray-500 font-black uppercase tracking-[0.2em]">The Starting Line (AD)</label>
               <span className="text-xs text-yellow-500 mono font-bold bg-yellow-500/10 px-3 py-1 rounded-lg">{origin}</span>
            </div>
            <input 
              type="range" min="1" max="2000" step="1" value={origin}
              onChange={(e) => setOrigin(Number(e.target.value))}
              className="w-full accent-yellow-500 h-1.5 bg-white bg-opacity-10 rounded-full appearance-none cursor-pointer"
            />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
               <label className="text-[11px] text-gray-500 font-black uppercase tracking-[0.2em]">Linear Prophetic Span</label>
               <span className="text-xs text-[#00ffaa] mono font-bold bg-[#00ffaa]/10 px-3 py-1 rounded-lg">{duration} Years</span>
            </div>
            <input 
              type="range" min="1" max="3000" step="1" value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full accent-[#00ffaa] h-1.5 bg-white bg-opacity-10 rounded-full appearance-none cursor-pointer"
            />
          </div>
        </div>

        <div className="bg-white bg-opacity-[0.03] p-8 rounded-3xl border-2 border-white border-opacity-5 flex flex-col justify-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-1.5 h-full bg-red-600 opacity-30" />
          <div className="flex items-center gap-3 mb-4">
            <ShieldAlert className="text-red-500" size={18} />
            <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Temporal Drift Identified</span>
          </div>
          <div className="text-5xl font-black text-red-600 mono flex items-baseline tracking-tighter mb-4">
            {results.driftDays} <span className="text-xs ml-3 text-gray-600 uppercase font-black tracking-[0.3em]">Slipped Days</span>
          </div>
          <p className="text-[10px] text-gray-500 leading-relaxed uppercase font-black tracking-widest">
            Institutional Beta has drifted <span className="text-red-600 text-xs">~{results.driftYears} years</span> from the Alpha intent.
          </p>
        </div>
      </div>

      {/* Trajectory Video-Game Visual */}
      <div className="relative h-32 w-full bg-black bg-opacity-80 rounded-[40px] flex items-center px-16 overflow-hidden border-2 border-white border-opacity-5 mb-10 shadow-inner">
        {/* The Wall (Reform Point) */}
        <div className="absolute left-[55%] top-0 bottom-0 w-1 bg-red-500 opacity-20 blur-sm" />
        <div className="absolute left-[55%] top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center">
          <span className="text-[8px] text-red-500 font-black uppercase bg-black px-2 mb-1">1582 Reform Wall</span>
        </div>

        <div className="absolute left-16 h-6 w-6 bg-white rounded-full z-10 shadow-[0_0_20px_white] flex items-center justify-center">
           <div className="w-1.5 h-1.5 bg-black rounded-full" />
           <span className="absolute top-10 left-1/2 -translate-x-1/2 text-[10px] font-black mono text-gray-500">{origin}</span>
        </div>
        
        {/* Animated Light Beams */}
        <div 
          className={`absolute left-16 h-2 bg-gradient-to-r from-yellow-500/20 to-yellow-500 shadow-[0_0_30px_#eab308] transition-all duration-1000 ease-out flex items-center rounded-full
            ${isSimulating ? 'opacity-40 blur-md' : 'opacity-100 blur-0'}`} 
          style={{ width: '82%' }}
        >
          <div className="absolute right-0 -top-2 h-6 w-6 bg-yellow-500 rounded-full flex items-center justify-center ring-4 ring-yellow-500/20">
             <TrendingUp size={12} className="text-black font-black" />
             <span className="absolute -top-10 left-1/2 -translate-x-1/2 text-[10px] font-black mono text-yellow-500 whitespace-nowrap bg-black bg-opacity-90 px-3 py-1.5 rounded-xl border border-yellow-500/30">ALPHA {results.alphaTarget}</span>
          </div>
        </div>

        <div 
          className={`absolute left-16 h-2 bg-gradient-to-r from-red-600/20 to-red-600 shadow-[0_0_30px_#dc2626] transition-all duration-1000 ease-out flex items-center rounded-full
            ${isSimulating ? 'opacity-20 blur-md' : 'opacity-100 blur-0'}`} 
          style={{ width: '58%' }}
        >
          {/* Intersection Wall Logic */}
          <div className="absolute right-0 -top-2 h-6 w-6 bg-red-600 rounded-full flex items-center justify-center ring-4 ring-red-600/20">
             <AlertCircle size={12} className="text-white" />
             <span className="absolute top-10 left-1/2 -translate-x-1/2 text-[10px] font-black mono text-red-600 whitespace-nowrap bg-black bg-opacity-90 px-3 py-1.5 rounded-xl border border-red-600/30">BETA {results.betaIntersection}</span>
          </div>
        </div>
      </div>

      <div className="p-8 bg-yellow-500 bg-opacity-[0.03] border-2 border-yellow-500 border-opacity-20 rounded-[35px] relative group transition-all hover:bg-opacity-[0.06]">
        <div className="absolute inset-0 bg-yellow-500 opacity-0 group-hover:opacity-5 blur-3xl rounded-full transition-opacity" />
        <div className="flex items-start gap-6 relative">
          <div className="p-4 bg-yellow-500 bg-opacity-20 rounded-2xl flex-shrink-0">
             <CheckCircle2 size={24} className="text-yellow-500" />
          </div>
          <div className="space-y-3">
            <span className="text-[11px] font-black text-yellow-500 uppercase tracking-[0.4em] block">Forensic Verdict</span>
            <p className="text-lg text-gray-200 leading-relaxed font-bold tracking-tight">
              {results.auditMessage}
            </p>
            <div className="flex gap-4">
              <span className="text-[9px] text-gray-600 uppercase font-black tracking-widest border border-white/5 px-3 py-1 rounded-full">Traject-Coord: Uninterrupted</span>
              <span className="text-[9px] text-gray-600 uppercase font-black tracking-widest border border-white/5 px-3 py-1 rounded-full">Source: Alpha Engine v4</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProphecySimulator;
