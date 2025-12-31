
import React, { useMemo, useState } from 'react';
import { FORENSIC_ANCHORS, TROPICAL_YEAR, ULS_EPOCH_UNIX } from '../constants';
import { ForensicAnchor } from '../types';
import { Info, Target, Zap, ChevronRight, History, Star } from 'lucide-react';

interface Props {
  uls: number;
  phantomTimeEnabled: boolean;
}

const DeepHistoryTimeline: React.FC<Props> = ({ uls, phantomTimeEnabled }) => {
  const [selectedAnchor, setSelectedAnchor] = useState<ForensicAnchor | null>(null);

  // Range: -4000 BC to 2100 AD
  const START_ULS = -126230400000; // ~4000 BC
  const END_ULS = 66225600000;    // ~2100 AD
  const TOTAL_RANGE = END_ULS - START_ULS;

  const toX = (ulsVal: number) => {
    return ((ulsVal - START_ULS) / TOTAL_RANGE) * 100;
  };

  const julianDriftX = useMemo(() => {
    // Julian drift is ~0.0078 days per year. Over 2000 years, it's ~15 days.
    // Visually we exaggerate it to show the "arc" of divergence.
    const points: [number, number][] = [];
    for (let u = START_ULS; u <= END_ULS; u += TOTAL_RANGE / 50) {
      const year = (u / TROPICAL_YEAR);
      const driftOffset = year > 0 ? (year / 128) * 5 : 0; // Cumulative arc
      points.push([toX(u), 50 + driftOffset]);
    }
    return points.map(p => `${p[0]},${p[1]}`).join(' ');
  }, [TOTAL_RANGE]);

  return (
    <div className="w-full h-[600px] bg-black/40 border-2 border-white/5 rounded-[3rem] overflow-hidden flex flex-col relative group">
      
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="p-8 border-b border-white/5 flex items-center justify-between bg-black/20">
        <div className="flex items-center gap-4">
          <History className="text-[#00ffaa]" />
          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.4em]">Deep-Time Strata Map</h3>
            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">Strata Branching: Pre-Flood to Atomic Era</p>
          </div>
        </div>
        {selectedAnchor && (
          <div className="flex items-center gap-6 animate-in slide-in-from-right duration-500">
             <div className="flex flex-col items-end">
                <span className={`text-[10px] font-black uppercase tracking-widest ${selectedAnchor.color}`}>{selectedAnchor.name}</span>
                <span className="text-[9px] text-gray-500 font-bold uppercase">{selectedAnchor.description}</span>
             </div>
             <button onClick={() => setSelectedAnchor(null)} className="p-2 hover:bg-white/10 rounded-full transition-all text-gray-400"><Zap size={14}/></button>
          </div>
        )}
      </div>

      <div className="flex-1 relative overflow-x-auto custom-scrollbar bg-[#050508]">
        <div className="h-full min-w-[3000px] relative px-20">
          
          {/* Axis Labels */}
          <div className="absolute top-10 left-0 w-full flex justify-between px-20 text-[10px] font-black text-gray-700 uppercase tracking-widest pointer-events-none">
            <span>4000 BC</span>
            <span>2000 BC</span>
            <span>Epoch 0</span>
            <span>1000 AD</span>
            <span>1582 Reform</span>
            <span>Atomic Now</span>
            <span>2100 AD</span>
          </div>

          <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
            {/* The Alpha Spine (Absolute Truth) */}
            <line 
              x1="0%" y1="50%" x2="100%" y2="50%" 
              stroke="rgba(234, 179, 8, 0.2)" 
              strokeWidth="2" 
              strokeDasharray="10,10"
            />
            <text x="0" y="48%" className="fill-yellow-500/40 text-[10px] font-black uppercase">Alpha Spine (Sidereal)</text>

            {/* Julian Stratum (Continuous Drift) */}
            <polyline 
              points={julianDriftX} 
              fill="none" 
              stroke="rgba(59, 130, 246, 0.4)" 
              strokeWidth="3" 
            />
            <text x="20%" y="58%" className="fill-blue-500/40 text-[10px] font-black uppercase">Julian Stratum (Beta)</text>

            {/* Gregorian Branching Point */}
            {/* Break happens at Oct 1582 */}
            <path 
              d={`M ${toX(49914432000)} 54 L ${toX(49914432000 + 10000000)} 40 L 100% 40`} 
              fill="none" 
              stroke="rgba(239, 68, 68, 0.6)" 
              strokeWidth="3"
            />
            <circle cx={`${toX(49914432000)}%`} cy="54" r="5" className="fill-red-500 animate-pulse shadow-[0_0_10px_red]" />
            <text x={`${toX(49914432000)}%`} y="35" className="fill-red-500 text-[10px] font-black uppercase">Gregorian Shift</text>

            {/* Prophetic Layer (Parallel Reality) */}
            <line 
              x1={`${toX(-14000000000)}%`} y1="70%" x2="100%" y2="70%" 
              stroke="rgba(192, 132, 252, 0.3)" 
              strokeWidth="2" 
            />
            <text x={`${toX(-14000000000)}%`} y="75%" className="fill-purple-500/40 text-[10px] font-black uppercase">Prophetic 360-Day Stream</text>

            {/* Current Moment Cursor */}
            <line 
              x1={`${toX(uls)}%`} y1="0" x2={`${toX(uls)}%`} y2="100%" 
              stroke="#00ffaa" 
              strokeWidth="1" 
              strokeDasharray="4,4"
              className="animate-pulse"
            />
            <rect 
              x={`${toX(uls) - 0.5}%`} y="0" width="1%" height="100%" 
              fill="url(#currentMomentGrad)"
            />
            <defs>
              <linearGradient id="currentMomentGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00ffaa" stopOpacity="0" />
                <stop offset="50%" stopColor="#00ffaa" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#00ffaa" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Anchors (Pock Marks) */}
            {FORENSIC_ANCHORS.map(anchor => {
              const xPos = toX(anchor.uls);
              const yPos = anchor.type === 'PROPHECY' ? 70 : anchor.type === 'CELESTIAL' ? 20 : 50;
              
              return (
                <g key={anchor.id} className="cursor-pointer group/anchor" onClick={() => setSelectedAnchor(anchor)}>
                  {/* Prophecy Trajectory Beam */}
                  {anchor.originULS && (
                    <line 
                      x1={`${toX(anchor.originULS)}%`} y1={yPos + "%"} 
                      x2={`${xPos}%`} y2={yPos + "%"} 
                      stroke="rgba(255, 165, 0, 0.2)" 
                      strokeWidth="1" 
                      className="group-hover/anchor:stroke-orange-500 group-hover/anchor:stroke-2 transition-all"
                    />
                  )}
                  
                  <circle 
                    cx={`${xPos}%`} cy={yPos + "%"} r="6" 
                    className={`${anchor.color.replace('text-', 'fill-')} transition-all group-hover/anchor:r-8`}
                  />
                  <circle 
                    cx={`${xPos}%`} cy={yPos + "%"} r="12" 
                    className={`${anchor.color.replace('text-', 'fill-')} opacity-0 group-hover/anchor:opacity-10 transition-all`}
                  />
                  
                  <text 
                    x={`${xPos}%`} y={yPos - 3 + "%"} 
                    textAnchor="middle" 
                    className={`text-[8px] font-black uppercase tracking-tighter opacity-0 group-hover/anchor:opacity-100 transition-all ${anchor.color.replace('text-', 'fill-')}`}
                  >
                    {anchor.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      <div className="p-6 bg-black/40 border-t border-white/5 flex items-center justify-between">
         <div className="flex gap-8">
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-yellow-500" />
               <span className="text-[9px] font-black text-gray-600 uppercase">Alpha Reality</span>
            </div>
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-blue-500" />
               <span className="text-[9px] font-black text-gray-600 uppercase">Julian Drift</span>
            </div>
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-red-500" />
               <span className="text-[9px] font-black text-gray-600 uppercase">Gregorian Split</span>
            </div>
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-purple-500" />
               <span className="text-[9px] font-black text-gray-600 uppercase">Prophetic Branch</span>
            </div>
         </div>
         <div className="flex items-center gap-2 text-[#00ffaa]">
            <Info size={14} />
            <span className="text-[9px] font-black uppercase tracking-widest">Interactive Audit: Click nodes to inspect temporal metadata.</span>
         </div>
      </div>
    </div>
  );
};

export default DeepHistoryTimeline;
