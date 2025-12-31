
import React, { useState } from 'react';
import { getULSFromDate, getSiderealZodiac, getTropicalZodiac } from '../services/temporalEngine';
import { Sparkles, ArrowRight, UserCheck } from 'lucide-react';

const BirthdayAudit: React.FC = () => {
  const [birthday, setBirthday] = useState('');
  const [auditResult, setAuditResult] = useState<{ sidereal: string; tropical: string; date: string } | null>(null);

  const performAudit = () => {
    if (!birthday) return;
    const dateObj = new Date(birthday);
    const uls = getULSFromDate(dateObj);
    setAuditResult({
      sidereal: getSiderealZodiac(uls),
      tropical: getTropicalZodiac(uls),
      date: dateObj.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
    });
  };

  return (
    <div className="glass-panel p-8 rounded-2xl border-2 border-[#00ffaa] border-opacity-30 bg-gradient-to-br from-[#050508] to-[#0a0a0f] relative overflow-hidden">
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#00ffaa] opacity-5 blur-3xl rounded-full" />
      
      <div className="flex items-center gap-3 mb-6">
        <UserCheck className="text-[#00ffaa]" size={24} />
        <h2 className="text-xl font-black uppercase tracking-tighter">Your Personal Temporal Audit</h2>
      </div>

      {!auditResult ? (
        <div className="space-y-6">
          <p className="text-sm text-gray-400 leading-relaxed">
            Ground yourself in the truth. Institutional calendars use a seasonal grid that hasn't moved in centuries, but the stars have. Enter your legal birthday to see where the Sun <span className="text-[#00ffaa] italic">actually</span> was.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <input 
              type="date" 
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              className="flex-1 bg-black border border-white border-opacity-10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00ffaa] transition-all"
            />
            <button 
              onClick={performAudit}
              className="bg-[#00ffaa] text-black font-extrabold px-8 py-3 rounded-xl hover:bg-[#00cc88] transition-all shadow-[0_0_20px_rgba(0,255,170,0.3)] flex items-center justify-center gap-2"
            >
              UNMASK THE SKY <Sparkles size={16} />
            </button>
          </div>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1 space-y-4">
              <div className="text-sm font-bold text-gray-500 uppercase tracking-widest">Audit for: {auditResult.date}</div>
              <div className="flex flex-col gap-6">
                <div className="p-4 rounded-xl bg-white bg-opacity-[0.03] border border-white border-opacity-5">
                  <span className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Institutional Beta Sign</span>
                  <span className="text-2xl font-black text-gray-400">{auditResult.tropical}</span>
                  <p className="text-[10px] text-gray-600 mt-2 uppercase">The "Layer of Paint" on your records.</p>
                </div>
                <div className="p-6 rounded-xl bg-[#00ffaa] bg-opacity-10 border border-[#00ffaa] border-opacity-30 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-2 opacity-20">
                    <Sparkles size={48} className="text-[#00ffaa]" />
                  </div>
                  <span className="text-[10px] uppercase font-bold text-[#00ffaa] block mb-1">Forensic Alpha Reality</span>
                  <span className="text-4xl font-black text-white">{auditResult.sidereal}</span>
                  <p className="text-xs text-gray-300 mt-4 leading-relaxed">
                    On the day you were born, the Earth's axial precession had already shifted the Sun into <span className="text-[#00ffaa] font-bold">{auditResult.sidereal}</span>. The world's calendar ignores this drift.
                  </p>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setAuditResult(null)}
              className="text-gray-500 hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest flex items-center gap-2"
            >
              Reset Audit <ArrowRight size={12} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BirthdayAudit;
