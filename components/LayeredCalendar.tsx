
import React from 'react';
import { generateLayeredMonth } from '../services/temporalEngine';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, AlertTriangle, Scissors, Link2Off, Info } from 'lucide-react';

interface Props {
  year: number;
  month: number;
  patch1582: boolean;
  onNavigate: (dir: number) => void;
}

const LayeredCalendar: React.FC<Props> = ({ year, month, patch1582, onNavigate }) => {
  const cells = generateLayeredMonth(year, month, patch1582);
  const monthName = new Date(Date.UTC(year, month)).toLocaleString('default', { month: 'long', timeZone: 'UTC' });

  const isOct1582 = year === 1582 && month === 9;
  const isSep1752 = year === 1752 && month === 8;
  const isRiftMonth = (isOct1582 || isSep1752) && patch1582;

  return (
    <div className="glass-panel p-8 rounded-[40px] border-4 border-white border-opacity-5 bg-black bg-opacity-70 relative overflow-hidden shadow-2xl">
      {/* Visual Glitch/Rift Effect */}
      {isRiftMonth && (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden opacity-20">
           <div className="absolute top-[30%] left-0 w-full h-[40%] bg-red-600 blur-[120px] transform -rotate-6 animate-pulse" />
           <div className="absolute top-[40%] right-0 w-full h-[40%] bg-orange-600 blur-[100px] transform rotate-3 animate-pulse delay-700" />
        </div>
      )}
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-10">
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-[#00ffaa]/10 rounded-xl">
                <CalendarIcon className="text-[#00ffaa]" size={20} />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tighter text-white">{monthName} {year}</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Synchronized Grid Stack</span>
              {isRiftMonth && (
                <span className="text-[9px] text-red-500 font-black uppercase tracking-widest px-2 py-0.5 bg-red-500/10 rounded-full flex items-center gap-1 border border-red-500/20">
                  <Link2Off size={10} /> Institutional Rupture
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => onNavigate(-1)} className="p-3 hover:bg-white hover:bg-opacity-10 rounded-2xl transition-all text-gray-500 hover:text-white border border-white border-opacity-5 hover:border-opacity-20"><ChevronLeft size={24}/></button>
            <button onClick={() => onNavigate(1)} className="p-3 hover:bg-white hover:bg-opacity-10 rounded-2xl transition-all text-gray-500 hover:text-white border border-white border-opacity-5 hover:border-opacity-20"><ChevronRight size={24}/></button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-3 text-[11px] font-black text-gray-600 uppercase mb-6 text-center tracking-[0.4em]">
          <div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>
        </div>

        <div className="grid grid-cols-7 gap-3">
          {cells.map((cell, i) => {
            if (!cell.betaDay) return <div key={i} className="aspect-square bg-white bg-opacity-[0.02] rounded-2xl" />;
            
            return (
              <div 
                key={i} 
                className={`aspect-square relative p-3 rounded-2xl border-2 transition-all group overflow-hidden flex flex-col justify-between
                  ${cell.isGap 
                    ? 'bg-red-950 bg-opacity-60 border-red-700 border-opacity-50 cursor-help' 
                    : 'bg-white bg-opacity-[0.04] hover:bg-opacity-[0.12] border-white border-opacity-5 hover:border-opacity-20'}`}
              >
                <div className="flex justify-between items-start">
                  <span className={`text-xl font-black leading-none tracking-tighter ${cell.isGap ? 'text-red-700 opacity-50 line-through' : 'text-gray-200'}`}>
                    {cell.betaDay}
                  </span>
                  {cell.isGap && <AlertTriangle size={14} className="text-red-600" />}
                </div>
                
                <div className="flex flex-col">
                  <span className={`text-[9px] mono font-black uppercase tracking-tighter transition-colors 
                    ${cell.isGap ? 'text-red-900' : 'text-gray-600 group-hover:text-yellow-600'}`}>
                    DAY {cell.alphaDay}
                  </span>
                  <span className="text-[7px] text-gray-800 uppercase font-black group-hover:text-gray-500 transition-colors">ALPHA COUNT</span>
                </div>

                {cell.isGap && (
                  <div className="absolute inset-0 bg-red-900/40 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all p-4 text-center pointer-events-none">
                    <div className="flex flex-col items-center">
                      <Scissors size={20} className="text-red-500 mb-2 animate-bounce" />
                      <span className="text-[8px] text-red-400 font-black uppercase leading-tight tracking-widest">TIME STOLEN HERE</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Forensic Note for Rift Months */}
        {isRiftMonth && (
          <div className="mt-8 p-6 bg-red-500 bg-opacity-5 border-2 border-red-500 border-opacity-20 rounded-3xl animate-in slide-in-from-bottom duration-500">
            <div className="flex items-start gap-4">
              <Info className="text-red-500 mt-1 shrink-0" size={20} />
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase text-red-500 tracking-[0.2em]">Forensic Audit Note: The Rupture</h4>
                <p className="text-sm text-gray-300 font-medium leading-relaxed">
                  {isOct1582 
                    ? "In 1582, Thursday Oct 4th was followed by Friday Oct 15th. The Pope deleted 10 days to re-align Easter. The stars moved, but the institutional record jumped."
                    : "In 1752, Wednesday Sept 2nd was followed by Thursday Sept 14th in the British Empire. 11 days were deleted to adopt the Gregorian patch."}
                </p>
                <div className="text-[9px] text-gray-600 uppercase font-black tracking-widest">
                  Impact: {isOct1582 ? "10" : "11"} Days of Sidereal Debt inherited.
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-12 p-8 bg-white bg-opacity-[0.02] rounded-[30px] border border-white border-opacity-5 flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-3 h-3 rounded-full bg-yellow-600 animate-pulse shadow-[0_0_15px_rgba(202,138,4,0.6)]" />
              <span className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-500">The Ghost Underlay</span>
            </div>
            <p className="text-[11px] text-gray-500 leading-relaxed uppercase font-bold tracking-widest">
              Beta Mask (Large) vs. Alpha Hard Drive (Small). Notice the grid physically cracking in October 1582 or September 1752.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2">
             <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-black">
                <Scissors size={14} className="text-gray-700" />
             </div>
             <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-black">
                <Link2Off size={14} className="text-gray-700" />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LayeredCalendar;
