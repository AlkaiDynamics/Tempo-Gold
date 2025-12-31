
import React from 'react';
import { formatULS, calculateCelestialOffset } from '../services/temporalEngine';
import { Compass } from 'lucide-react';

interface Props {
  uls: number;
  isPatched: boolean;
}

const MultiversalClock: React.FC<Props> = ({ uls, isPatched }) => {
  const date = new Date((uls * 1000) + -62135596800000); 
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  
  // Angles
  const betaAngle = ((hours % 12) * 30) + (minutes * 0.5);
  const alphaAngle = (uls % 86400) / 86400 * 360;
  const driftAngle = calculateCelestialOffset(uls);

  return (
    <div className="glass-panel p-8 rounded-[40px] flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-b from-[#0a0a14] to-black border-2 border-white border-opacity-5 shadow-2xl">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00ffaa]/0 via-[#00ffaa]/40 to-[#00ffaa]/0" />
      
      <div className="relative w-72 h-72 flex items-center justify-center">
        {/* The Husk (Beta Ring - Fixed) */}
        <div className="absolute w-full h-full rounded-full border-4 border-gray-900 shadow-inner flex items-center justify-center">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="absolute h-full w-px bg-gray-800" style={{ transform: `rotate(${i * 30}deg)` }}>
               <div className="h-2 w-px bg-gray-600 mt-1" />
            </div>
          ))}
          <div className="absolute top-4 text-[9px] font-black text-gray-700 tracking-widest">NORTH (GREG)</div>
        </div>

        {/* The Core (Alpha Ring - Rotating) */}
        <div 
          className="absolute w-[85%] h-[85%] rounded-full border-2 border-white/5 bg-white/2 transition-transform duration-1000 ease-out"
          style={{ transform: `rotate(${-driftAngle}deg)` }}
        >
          <div className="absolute top-2 left-1/2 -translate-x-1/2 flex flex-col items-center">
            <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full shadow-[0_0_10px_#eab308]" />
            <span className="text-[8px] font-black text-yellow-600 uppercase mt-1">STAR NORTH</span>
          </div>
        </div>

        {/* Alignment Needle (Drift Visualizer) */}
        <div className="absolute w-full h-full pointer-events-none">
          {/* Institutional Needle */}
          <div 
            className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-[50%] bg-red-600 opacity-80 origin-bottom rounded-full"
            style={{ transform: `rotate(0deg)` }}
          />
          {/* Alpha Needle */}
          <div 
            className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-[50%] bg-[#00ffaa] origin-bottom rounded-full shadow-[0_0_15px_#00ffaa]"
            style={{ transform: `rotate(${driftAngle}deg)` }}
          />
        </div>

        {/* Hand Shadow */}
        <div className="w-6 h-6 bg-black rounded-full z-10 border-2 border-white/10 flex items-center justify-center">
           <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
        </div>
      </div>

      <div className="mt-10 grid grid-cols-3 gap-8 w-full text-center">
        <div>
          <span className="text-[8px] font-black text-gray-600 uppercase block mb-1 tracking-[0.2em]">Husk Offset</span>
          <span className="text-sm font-black text-red-600 mono">0.00°</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="p-2 bg-white/5 rounded-full mb-2">
            <Compass size={14} className="text-[#00ffaa]" />
          </div>
          <span className="text-[8px] font-black text-[#00ffaa] uppercase tracking-[0.3em]">Drift Vector</span>
        </div>
        <div>
          <span className="text-[8px] font-black text-gray-600 uppercase block mb-1 tracking-[0.2em]">Alpha Offset</span>
          <span className="text-sm font-black text-yellow-500 mono">{driftAngle.toFixed(2)}°</span>
        </div>
      </div>

      <div className="mt-6 text-[10px] text-gray-600 uppercase font-black tracking-widest text-center px-4 leading-relaxed">
        Alignment Needle shows the physical deviation between the <span className="text-red-600">Institutional Mask</span> and the <span className="text-[#00ffaa]">Astronomical North</span>.
      </div>
    </div>
  );
};

export default MultiversalClock;
