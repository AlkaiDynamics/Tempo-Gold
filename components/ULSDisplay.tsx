
import React, { useState, useEffect } from 'react';
import { getNowULS, formatULS } from '../services/temporalEngine';

const ULSDisplay: React.FC = () => {
  const [uls, setUls] = useState(getNowULS());

  useEffect(() => {
    const timer = setInterval(() => {
      setUls(getNowULS());
    }, 100);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="glass-panel p-6 rounded-xl border-l-4 border-l-[#00ffaa]">
      <div className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-2">Live ULS Coordinate</div>
      <div className="text-4xl md:text-5xl mono font-bold neon-accent tracking-tighter">
        {formatULS(uls)}
      </div>
      <div className="mt-2 text-xs text-gray-400">
        Continuous, decimalized atomic seconds from Epoch 0001.01.01
      </div>
    </div>
  );
};

export default ULSDisplay;
