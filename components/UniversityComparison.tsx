
import React from 'react';
import { University } from '../types';
import { X, Trophy, MapPin, Building2, Banknote, GraduationCap } from 'lucide-react';

interface UniversityComparisonProps {
  universities: University[];
  onClose: () => void;
  onRemove: (uni: University) => void;
}

const UniversityComparison: React.FC<UniversityComparisonProps> = ({ universities, onClose, onRemove }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
          <h2 className="text-2xl font-bold text-slate-800">University Comparison</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="overflow-x-auto flex-grow p-6 bg-slate-50">
          {universities.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-slate-500">
              <p>No universities selected for comparison.</p>
            </div>
          ) : (
            <div className="grid gap-4" style={{ gridTemplateColumns: `150px repeat(${universities.length}, minmax(240px, 1fr))` }}>
              {/* Header Column */}
              <div className="flex flex-col gap-4 font-semibold text-slate-500 pt-16">
                <div className="h-10 flex items-center"><MapPin size={16} className="mr-2"/> City</div>
                <div className="h-10 flex items-center"><Building2 size={16} className="mr-2"/> Sector</div>
                <div className="h-10 flex items-center"><Trophy size={16} className="mr-2"/> Ranking</div>
                <div className="h-10 flex items-center"><Banknote size={16} className="mr-2"/> Fee/Sem</div>
                <div className="h-32 flex items-start pt-2"><GraduationCap size={16} className="mr-2"/> Programs</div>
              </div>

              {/* University Columns */}
              {universities.map((uni, idx) => (
                <div key={idx} className="flex flex-col gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative">
                   <button 
                     onClick={() => onRemove(uni)} 
                     className="absolute top-2 right-2 text-slate-400 hover:text-red-500"
                     title="Remove"
                   >
                     <X size={16} />
                   </button>
                   
                   <div className="h-12 flex items-center font-bold text-slate-800 text-lg mb-4 text-center justify-center">
                     {uni.name}
                   </div>

                   <div className="h-10 flex items-center bg-slate-50 px-3 rounded text-sm text-slate-700">
                     {uni.city}
                   </div>
                   <div className="h-10 flex items-center bg-slate-50 px-3 rounded text-sm text-slate-700">
                     {uni.sector}
                   </div>
                   <div className="h-10 flex items-center bg-slate-50 px-3 rounded text-sm text-slate-700">
                     {uni.ranking}
                   </div>
                   <div className="h-10 flex items-center bg-green-50 px-3 rounded text-sm font-semibold text-green-700 border border-green-100">
                     {uni.feeRange}
                   </div>
                   <div className="h-32 overflow-y-auto bg-slate-50 p-2 rounded text-xs text-slate-600">
                     <ul className="list-disc list-inside space-y-1">
                       {uni.recommendedPrograms?.map((prog, i) => (
                         <li key={i}>{prog}</li>
                       )) || <li>N/A</li>}
                     </ul>
                   </div>
                   
                   <a 
                     href={uni.website} 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="mt-2 w-full py-2 bg-brand-50 text-brand-600 hover:bg-brand-100 hover:text-brand-700 text-sm font-semibold rounded text-center transition"
                   >
                     Visit Website
                   </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UniversityComparison;
