
import React from 'react';
import { ForensicAuditReport } from '../types';
import { ShieldAlert, Info, ExternalLink, Activity } from 'lucide-react';

// Use standard lucide icons if available via script, or just custom SVG
const IconBox = ({ children, color }: { children: React.ReactNode, color: string }) => (
  <div className={`p-2 rounded-lg ${color} bg-opacity-20 inline-flex mr-3`}>
    {children}
  </div>
);

interface Props {
  report: ForensicAuditReport;
  loading: boolean;
}

const AuditPanel: React.FC<Props> = ({ report, loading }) => {
  if (loading) {
    return (
      <div className="glass-panel p-12 rounded-xl flex flex-col items-center justify-center space-y-4 animate-pulse">
        <div className="w-12 h-12 border-4 border-[#00ffaa] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-400 mono text-sm">SCANNING TEMPORAL STRATA...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="glass-panel p-8 rounded-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Activity size={120} />
        </div>
        
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <ShieldAlert className="mr-2 text-red-500" /> Forensic Audit Result
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">The Alpha (Forensic Data)</h3>
            <div className="space-y-4">
              <div>
                <span className="block text-xs text-gray-500">ULS Coordinate</span>
                <span className="mono text-lg text-[#00ffaa]">{report.ulsCoordinate}</span>
              </div>
              <div>
                <span className="block text-xs text-gray-500">Celestial Offset</span>
                <span className="mono text-lg text-yellow-500">{report.celestialOffset.toFixed(4)}°</span>
              </div>
              <div>
                <span className="block text-xs text-gray-500">Pure Math (Alpha Intent)</span>
                <p className="text-sm italic text-gray-300">"{report.alphaCalculation}"</p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">The Beta (Contamination)</h3>
            <div className="space-y-4">
              <div>
                <span className="block text-xs text-gray-500">Inherited Debt Ledger</span>
                <span className="text-sm font-semibold text-orange-400 uppercase">{report.inheritedDebt}</span>
              </div>
              <div>
                <span className="block text-xs text-gray-500">Contamination Factors</span>
                <ul className="mt-1 space-y-1">
                  {report.contaminationFactors.map((f, i) => (
                    <li key={i} className="text-xs flex items-start">
                      <span className="text-red-500 mr-2">•</span> {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-10 pt-6 border-t border-white border-opacity-10">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Executive Summary</h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            {report.summary}
          </p>
        </div>

        {report.sources.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-3">
            {report.sources.map((s, i) => (
              <a 
                key={i} 
                href={s.uri} 
                target="_blank" 
                rel="noreferrer"
                className="text-[10px] bg-white bg-opacity-5 hover:bg-opacity-10 border border-white border-opacity-10 px-3 py-1 rounded flex items-center transition-all"
              >
                {s.title} <ExternalLink size={10} className="ml-1" />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditPanel;
