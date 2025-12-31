
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Activity, Clock, Layers, Globe, Zap, 
  Target, Info, AlertTriangle, ShieldCheck, ChevronLeft, ChevronRight,
  Database, SlidersHorizontal, Eye, Compass, History, Ruler, Sparkles, Star, Sun, Landmark, Map
} from 'lucide-react';
import { getNowULS, getSystemDate, formatTimeParts } from './services/temporalEngine';
import { CalendarType, ForensicAnchor, TheoryFactor } from './types';
import { SCALES, FORENSIC_ANCHORS, ULS_EPOCH_UNIX, TROPICAL_YEAR } from './constants';
import DeepHistoryTimeline from './components/DeepHistoryTimeline';

const THEORIES: TheoryFactor[] = [
  { id: 'phantom-time', name: 'Phantom Time (~297y)', enabled: false, value: 297, description: 'Theory that early Middle Ages (614-911 AD) were fabricated.' },
  { id: 'axial-shift', name: 'Sidereal Axial (23h56m)', enabled: false, value: 0, description: 'True rotation period vs Atomic civil clock drift.' },
  { id: 'nibiru-cycle', name: 'Nibiru Cycle (3600y)', enabled: false, value: 3600, description: 'Orbital factor for cataclysm synchronization.' }
];

const App: React.FC = () => {
  const [uls, setUls] = useState(0);
  const [theories, setTheories] = useState(THEORIES);
  const [activeScale, setActiveScale] = useState('month');
  const [viewMode, setViewMode] = useState<'grid' | 'history'>('grid');
  const [viewOffset, setViewOffset] = useState(0);
  const [hoveredAnchor, setHoveredAnchor] = useState<ForensicAnchor | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setUls(getNowULS(theories)), 16);
    return () => clearInterval(timer);
  }, [theories]);

  const time = useMemo(() => formatTimeParts(uls), [uls]);
  
  const toggleTheory = (id: string) => {
    setTheories(prev => prev.map(t => t.id === id ? { ...t, enabled: !t.enabled } : t));
  };

  const currentViewULS = useMemo(() => uls + viewOffset, [uls, viewOffset]);
  
  const gridCells = useMemo(() => {
    const scale = SCALES.find(s => s.id === activeScale) || SCALES[1];
    const unitSize = scale.unit;
    const baseULS = Math.floor(currentViewULS / unitSize) * unitSize;

    return Array.from({ length: scale.count }).map((_, i) => {
      const cellULS = baseULS + (i * unitSize);
      const anchors = FORENSIC_ANCHORS.filter(a => {
        const isEventInCell = a.uls >= cellULS && a.uls < cellULS + unitSize;
        const isOriginInCell = a.originULS && a.originULS >= cellULS && a.originULS < cellULS + unitSize;
        return isEventInCell || isOriginInCell;
      });
      return { uls: cellULS, anchors };
    });
  }, [activeScale, currentViewULS]);

  const getAnchorIcon = (type: ForensicAnchor['type']) => {
    switch(type) {
      case 'CELESTIAL': return <Star size={14} />;
      case 'POLITICAL': return <Landmark size={14} />;
      case 'PROPHECY': return <Target size={14} />;
      case 'HISTORICAL': return <History size={14} />;
      default: return <Database size={14} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#020205] text-white flex flex-col font-['Inter'] overflow-hidden selection:bg-[#00ffaa] selection:text-black">
      
      {/* ATOMIC ZENITH HEADER */}
      <header className="h-28 bg-black border-b border-white/10 flex items-center justify-between px-10 backdrop-blur-3xl z-50">
        <div className="flex items-center gap-6">
          <div className="p-4 bg-[#00ffaa]/10 rounded-[2rem] border border-[#00ffaa]/20 shadow-[0_0_30px_rgba(0,255,170,0.15)]">
            <ShieldCheck className="text-[#00ffaa]" size={32} />
          </div>
          <div>
            <h1 className="text-sm font-black uppercase tracking-[0.5em] text-white/90">Temporal Forensic Auditor</h1>
            <div className="flex items-center gap-2 mt-2">
              <div className="h-1.5 w-1.5 bg-[#00ffaa] rounded-full animate-pulse shadow-[0_0_8px_#00ffaa]" />
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Master Atomic Coordinate (SI)</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-16">
          <div className="flex items-baseline gap-6">
             <div className="text-right">
                <span className="text-[11px] text-gray-600 font-black uppercase tracking-widest block mb-1">Current Gregorian AD</span>
                <span className="text-5xl font-black mono text-white leading-none tracking-tighter">
                  {time.hours}:{time.minutes}:{time.seconds}
                </span>
             </div>
             <div className="text-left border-l border-white/10 pl-6">
                <span className="text-[11px] text-[#00ffaa] font-black uppercase tracking-widest block mb-1">Quantum Pulse</span>
                <span className="text-2xl font-black mono text-[#00ffaa] leading-none tracking-tight">.{time.ms}</span>
             </div>
          </div>
          <div className="hidden xl:flex flex-col items-end border-r border-white/10 pr-10">
             <span className="text-[10px] text-gray-600 font-black uppercase tracking-widest mb-1">ULS Progress (Epoch 0001)</span>
             <span className="text-sm mono text-gray-300 font-bold tracking-widest">{uls.toLocaleString()} s</span>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        
        {/* UNIT STAIRCASE (LEFT SIDEBAR) */}
        <aside className="w-28 bg-black border-r border-white/5 flex flex-col items-center py-10 gap-10 overflow-y-auto custom-scrollbar">
           <button 
             onClick={() => setViewMode('history')}
             className={`flex flex-col items-center gap-4 transition-all group ${viewMode === 'history' ? 'opacity-100' : 'opacity-20 hover:opacity-60'}`}
           >
             <Map className={`transition-all ${viewMode === 'history' ? 'text-[#00ffaa]' : 'text-gray-400'}`} size={24} />
             <span className="text-[10px] font-black uppercase tracking-[0.3em] vertical-rl text-gray-400 rotate-180 mb-2">History Map</span>
           </button>
           
           <div className="w-full border-t border-white/5 my-4" />

           {SCALES.map(s => (
             <button 
               key={s.id}
               onClick={() => { setActiveScale(s.id); setViewOffset(0); setViewMode('grid'); }}
               className={`flex flex-col items-center gap-4 transition-all group ${activeScale === s.id && viewMode === 'grid' ? 'opacity-100' : 'opacity-20 hover:opacity-60'}`}
             >
               <div className={`w-1.5 h-16 rounded-full transition-all duration-500 ${activeScale === s.id && viewMode === 'grid' ? 'bg-[#00ffaa] shadow-[0_0_15px_#00ffaa]' : 'bg-white/10'}`} />
               <span className="text-[10px] font-black uppercase tracking-[0.3em] vertical-rl text-gray-400 rotate-180 mb-2">{s.label}</span>
             </button>
           ))}
        </aside>

        {/* THE FORENSIC SYNCHROTRON (GRID) */}
        <main className="flex-1 flex flex-col relative bg-[#050508] overflow-hidden">
          {/* Grid Controls */}
          <div className="p-8 flex items-center justify-between border-b border-white/5 bg-black/40 backdrop-blur-md">
             <div className="flex items-center gap-8">
                <div className="flex gap-2">
                  <button onClick={() => setViewOffset(o => o - (gridCells[0].uls - gridCells[1].uls))} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all text-gray-400 hover:text-white"><ChevronLeft size={20}/></button>
                  <button onClick={() => setViewOffset(o => o + (gridCells[1].uls - gridCells[0].uls))} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all text-gray-400 hover:text-white"><ChevronRight size={20}/></button>
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-black uppercase text-gray-600 tracking-widest">Active Stratum Window</span>
                  <h2 className="text-xl font-black uppercase text-[#00ffaa] tracking-tight">
                    {viewMode === 'history' ? 'Universal History Map' : activeScale === 'month' ? new Date(ULS_EPOCH_UNIX + gridCells[0].uls * 1000).toLocaleString('default', { month: 'long', year: 'numeric' }) : `UNIT: ${activeScale.toUpperCase()}`}
                  </h2>
                </div>
             </div>
             <div className="flex items-center gap-4">
                <button onClick={() => { setViewOffset(0); setViewMode('grid'); }} className="px-8 py-3 bg-[#00ffaa]/5 border border-[#00ffaa]/20 rounded-2xl text-[10px] font-black uppercase tracking-widest text-[#00ffaa] hover:bg-[#00ffaa]/10 transition-all shadow-[0_0_20px_rgba(0,255,170,0.05)]">Sync to Atomic Zenith</button>
             </div>
          </div>

          {/* View Mode Switching */}
          <div className="flex-1 overflow-hidden p-10 flex flex-col gap-10">
            {viewMode === 'history' ? (
              <DeepHistoryTimeline uls={uls} phantomTimeEnabled={theories.find(t => t.id === 'phantom-time')?.enabled || false} />
            ) : (
              <div className="flex-1 overflow-x-auto overflow-y-hidden flex gap-10 custom-scrollbar pb-8">
                {gridCells.map((cell, i) => (
                  <div key={i} className={`min-w-[400px] h-full flex flex-col rounded-[4rem] bg-white/[0.02] border transition-all duration-700 p-10 relative overflow-hidden group hover:bg-white/[0.05] 
                    ${cell.anchors.length > 0 ? 'border-[#00ffaa]/20 shadow-[0_0_40px_rgba(0,255,170,0.02)]' : 'border-white/5 hover:border-white/10'}`}>
                    
                    {/* Visual Laser Connection (Prophecy Link) */}
                    {cell.anchors.some(a => a.type === 'PROPHECY' && a.originULS && a.originULS < cell.uls) && (
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500/0 via-orange-500/40 to-orange-500/0 blur-sm" />
                    )}

                    {/* Audit Node Header */}
                    <div className="flex justify-between items-start mb-10">
                      <div className="flex flex-col">
                        <span className="text-6xl font-black text-white/90 group-hover:text-[#00ffaa] transition-colors tracking-tighter">
                          {activeScale === '24h' ? `${i}:00` : activeScale === 'year' ? new Date(ULS_EPOCH_UNIX + cell.uls * 1000).getUTCFullYear() : i + 1}
                        </span>
                        <span className="block text-[11px] text-gray-600 font-black uppercase mt-2 tracking-[0.3em]">Temporal Node</span>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] font-black uppercase text-gray-700 mb-3 tracking-widest flex items-center justify-end gap-2">
                          <Compass size={12} /> Audit Intersection
                        </div>
                        <div className="flex flex-col gap-2 items-end">
                           <span className="px-4 py-1.5 rounded-xl bg-blue-500/10 text-blue-400 text-[9px] font-black uppercase border border-blue-500/10 hover:bg-blue-500/20 transition-all cursor-help" title="The Julian 'Un-meddled' Timeline">JUL: {getSystemDate(cell.uls, CalendarType.JULIAN)}</span>
                           <span className="px-4 py-1.5 rounded-xl bg-yellow-500/10 text-yellow-500 text-[9px] font-black uppercase border border-yellow-500/10 hover:bg-yellow-500/20 transition-all cursor-help" title="360-Day Prophetic Engine">PRO: {getSystemDate(cell.uls, CalendarType.PROPHETIC)}</span>
                           <span className="px-4 py-1.5 rounded-xl bg-[#00ffaa]/10 text-[#00ffaa] text-[9px] font-black uppercase border border-[#00ffaa]/10 hover:bg-[#00ffaa]/20 transition-all cursor-help" title="Mayan Long Count Coordinate">MAY: {getSystemDate(cell.uls, CalendarType.MAYAN)}</span>
                        </div>
                      </div>
                    </div>

                    {/* The Evidence: Anchors & Historical Strata */}
                    <div className="flex-1 overflow-y-auto space-y-5 pr-3 custom-scrollbar">
                       {cell.anchors.length > 0 ? cell.anchors.map(anchor => (
                         <div 
                          key={anchor.id} 
                          onMouseEnter={() => setHoveredAnchor(anchor)}
                          onMouseLeave={() => setHoveredAnchor(null)}
                          className={`p-6 rounded-[2.5rem] bg-white/[0.03] border border-white/5 hover:border-white/20 transition-all cursor-pointer group/anchor relative overflow-hidden`}
                         >
                            {anchor.type === 'PROPHECY' && (
                              <div className="absolute top-0 right-0 w-1 h-full bg-orange-500 opacity-20" />
                            )}
                            <div className="flex items-center gap-4 mb-3">
                               <div className={`p-2 rounded-xl bg-white/5 ${anchor.color}`}>{getAnchorIcon(anchor.type)}</div>
                               <span className={`text-[11px] font-black uppercase tracking-wider ${anchor.color}`}>{anchor.name}</span>
                            </div>
                            <p className="text-[12px] text-gray-500 font-medium leading-relaxed uppercase tracking-tight line-clamp-3">{anchor.description}</p>
                            
                            {/* Prophecy Metadata */}
                            {anchor.type === 'PROPHECY' && anchor.originULS && (
                              <div className="mt-5 pt-5 border-t border-white/5 flex items-center justify-between">
                                <span className="text-[9px] text-gray-700 font-black uppercase tracking-widest">Trajectory Drift</span>
                                <span className="text-[10px] text-orange-500 mono font-bold">
                                  {(cell.uls - anchor.originULS) / TROPICAL_YEAR > 0 ? '+' : ''}
                                  {((cell.uls - anchor.originULS) / TROPICAL_YEAR).toFixed(1)}y
                                </span>
                              </div>
                            )}
                         </div>
                       )) : (
                         <div className="h-full flex flex-col items-center justify-center opacity-10">
                            <Database size={60} strokeWidth={1} className="mb-6 text-gray-600" />
                            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-700">No Forensic Data</span>
                         </div>
                       )}
                    </div>

                    {/* Audit Node Footer */}
                    <div className="mt-10 pt-8 border-t border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Activity size={14} className="text-gray-700" />
                        <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest">Node: {Math.floor(cell.uls)}</span>
                      </div>
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                        <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                        <div className="w-1.5 h-1.5 rounded-full bg-[#00ffaa]/40" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>

        {/* THEORY SWITCHBOARD (RIGHT SIDEBAR) */}
        <aside className="w-[400px] bg-black border-l border-white/5 p-10 flex flex-col gap-10 overflow-y-auto custom-scrollbar">
          <div className="flex items-center gap-4 mb-4">
             <SlidersHorizontal className="text-[#00ffaa]" size={20} />
             <h2 className="text-sm font-black uppercase tracking-[0.4em]">Theory Switchboard</h2>
          </div>

          <div className="space-y-8">
            {theories.map(theory => (
              <div 
                key={theory.id}
                onClick={() => toggleTheory(theory.id)}
                className={`p-8 rounded-[3rem] border transition-all duration-500 cursor-pointer group relative overflow-hidden
                  ${theory.enabled ? 'bg-[#00ffaa]/10 border-[#00ffaa]/40 shadow-[0_0_30px_rgba(0,255,170,0.05)]' : 'bg-white/[0.02] border-white/5 hover:border-white/15'}`}
              >
                {theory.enabled && (
                   <div className="absolute top-0 right-0 p-4">
                      <Zap className="text-[#00ffaa] animate-pulse" size={16} />
                   </div>
                )}
                <div className="flex items-center justify-between mb-5">
                  <span className={`text-[11px] font-black uppercase tracking-[0.2em] ${theory.enabled ? 'text-[#00ffaa]' : 'text-gray-500'}`}>{theory.name}</span>
                  <div className={`w-4 h-4 rounded-full transition-all duration-700 ${theory.enabled ? 'bg-[#00ffaa] shadow-[0_0_15px_#00ffaa]' : 'bg-gray-800'}`} />
                </div>
                <p className="text-[11px] text-gray-600 font-bold leading-relaxed uppercase tracking-tighter group-hover:text-gray-400 transition-colors">{theory.description}</p>
              </div>
            ))}
          </div>

          {/* Forensic Comparison Tool (Hover Info) */}
          <div className="mt-auto">
            {hoveredAnchor ? (
               <div className="p-8 rounded-[3rem] bg-white/[0.03] border border-white/10 animate-in fade-in slide-in-from-bottom-5 duration-500">
                  <div className="flex items-center gap-3 mb-4">
                    <Info size={16} className="text-[#00ffaa]" />
                    <span className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em]">Live Forensic Comparison</span>
                  </div>
                  <p className="text-xs text-gray-300 font-medium leading-relaxed uppercase tracking-tighter mb-4">
                    Comparing {hoveredAnchor.name} across divergent strata.
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] mono">
                      <span className="text-gray-600">JUL DRIFT</span>
                      <span className="text-blue-400">13 Days</span>
                    </div>
                    <div className="flex justify-between text-[10px] mono">
                      <span className="text-gray-600">MAYAN OFFSET</span>
                      <span className="text-[#00ffaa]">+1,872,000 Kins</span>
                    </div>
                  </div>
               </div>
            ) : (
              <div className="p-8 rounded-[3rem] bg-red-600/[0.03] border border-red-600/10 flex flex-col items-center text-center opacity-60">
                <AlertTriangle className="text-red-600 mb-6" size={32} />
                <h4 className="text-[11px] font-black uppercase text-red-600 tracking-[0.3em] mb-3">Temporal Contamination</h4>
                <p className="text-[10px] text-gray-600 uppercase font-bold tracking-tighter leading-relaxed">
                  Switching factors will instantly decouple the auditor from Institutional records. Historical synchronization will be visually corrupted.
                </p>
              </div>
            )}
          </div>
        </aside>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 255, 170, 0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0, 255, 170, 0.3); }
        .vertical-rl { writing-mode: vertical-rl; }
        .mono { font-family: 'JetBrains Mono', monospace; }
        @keyframes pulse-shadow {
          0% { box-shadow: 0 0 10px rgba(0, 255, 170, 0.2); }
          50% { box-shadow: 0 0 25px rgba(0, 255, 170, 0.5); }
          100% { box-shadow: 0 0 10px rgba(0, 255, 170, 0.2); }
        }
      `}} />
    </div>
  );
};

export default App;
