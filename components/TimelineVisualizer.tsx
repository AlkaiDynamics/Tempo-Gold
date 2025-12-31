
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { year: 1500, julianDrift: 10, gregorianDrift: 0, propheticDrift: -5 },
  { year: 1582, julianDrift: 10, gregorianDrift: 0, propheticDrift: -10 },
  { year: 1700, julianDrift: 11, gregorianDrift: 0, propheticDrift: -15 },
  { year: 1800, julianDrift: 12, gregorianDrift: 0, propheticDrift: -20 },
  { year: 1900, julianDrift: 13, gregorianDrift: 0, propheticDrift: -25 },
  { year: 2000, julianDrift: 13, gregorianDrift: 0, propheticDrift: -30 },
  { year: 2025, julianDrift: 13, gregorianDrift: 0, propheticDrift: -32 },
];

const TimelineVisualizer: React.FC = () => {
  return (
    <div className="glass-panel p-6 rounded-xl h-[400px]">
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Historical Chronological Drift (Days)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis 
            dataKey="year" 
            stroke="#666" 
            tick={{fontSize: 10}}
          />
          <YAxis 
            stroke="#666" 
            tick={{fontSize: 10}} 
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', fontSize: '12px' }}
            itemStyle={{ color: '#00ffaa' }}
          />
          <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
          <Line 
            type="monotone" 
            dataKey="julianDrift" 
            stroke="#f59e0b" 
            strokeWidth={2} 
            dot={{r: 3}} 
            name="Julian vs Solar"
          />
          <Line 
            type="monotone" 
            dataKey="propheticDrift" 
            stroke="#0ea5e9" 
            strokeWidth={2} 
            dot={{r: 3}} 
            name="Prophetic vs Solar"
          />
          <Line 
            type="monotone" 
            dataKey="gregorianDrift" 
            stroke="#00ffaa" 
            strokeWidth={2} 
            dot={{r: 3}} 
            name="Gregorian vs Solar"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TimelineVisualizer;
