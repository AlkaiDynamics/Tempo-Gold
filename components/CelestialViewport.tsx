
import React, { useRef, useEffect } from 'react';
import { calculateCelestialOffset } from '../services/temporalEngine';

interface Props {
  uls: number;
  showNet: boolean;
  isPatched: boolean;
}

const CelestialViewport: React.FC<Props> = ({ uls, showNet, isPatched }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const offset = calculateCelestialOffset(uls);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw Deep Space
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width / 2
      );
      gradient.addColorStop(0, '#0a0b1e');
      gradient.addColorStop(1, '#020205');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Star Field (Alpha Truth - Static relative to universe)
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((offset * Math.PI) / 180);

      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 200; i++) {
        const x = Math.sin(i * 132.32) * (canvas.width * 0.4);
        const y = Math.cos(i * 92.98) * (canvas.width * 0.4);
        const size = Math.random() * 1.5;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        
        if (i % 15 === 0) {
          ctx.strokeStyle = 'rgba(0, 255, 170, 0.1)';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(x, y);
          const nx = Math.sin((i+1) * 132.32) * (canvas.width * 0.4);
          const ny = Math.cos((i+1) * 92.98) * (canvas.width * 0.4);
          ctx.lineTo(nx, ny);
          ctx.stroke();
        }
      }
      ctx.restore();

      // Institutional Overlay (The "Net")
      if (showNet) {
        ctx.save();
        // If isPatched is true, we "jerk" the net 10 days forward visually
        const netShift = isPatched ? 15 : 0; 
        ctx.translate(netShift, 0);
        
        ctx.strokeStyle = isPatched ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        for (let i = -40; i < canvas.width + 40; i += 40) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i, canvas.height);
          ctx.stroke();
        }
        for (let i = -40; i < canvas.height + 40; i += 40) {
          ctx.beginPath();
          ctx.moveTo(0, i);
          ctx.lineTo(canvas.width, i);
          ctx.stroke();
        }
        ctx.restore();
      }

      // Compass Rose
      ctx.strokeStyle = 'rgba(0, 255, 170, 0.3)';
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, canvas.height * 0.35, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    };

    render();
  }, [uls, showNet, isPatched]);

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden border border-white border-opacity-10 bg-black">
      <canvas 
        ref={canvasRef} 
        width={800} 
        height={600} 
        className="w-full h-full object-cover opacity-80"
      />
      <div className="absolute top-4 left-4 flex flex-col">
        <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Alpha Viewport</span>
        <span className="text-xs text-[#00ffaa] mono font-bold">Cosmic Synchronization</span>
      </div>
      <div className="absolute top-4 right-4 text-right">
        <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${isPatched ? 'bg-red-500 text-white' : 'bg-green-500 text-black'}`}>
          {isPatched ? 'Patch Active (Beta)' : 'Un-Meddled (Alpha)'}
        </span>
      </div>
      <div className="absolute bottom-4 right-4 flex flex-col items-end">
        <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Sidereal Drift</span>
        <span className="text-xs text-yellow-500 mono font-bold">{calculateCelestialOffset(uls).toFixed(4)}°</span>
      </div>
    </div>
  );
};

export default CelestialViewport;
