
import React from 'react';
import { CareerRecommendation } from '../types';
import { TrendingUp, BarChart3, Info } from 'lucide-react';

interface CareerChartsProps {
  recommendations: CareerRecommendation[];
}

const CareerCharts: React.FC<CareerChartsProps> = ({ recommendations }) => {
  // Helpers for scaling
  const maxSalary = Math.max(...recommendations.map(r => r.salaryMax)) * 1.1; // Add 10% buffer
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Salary Range Chart */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
        <div className="flex items-center mb-6">
          <div className="p-2 bg-green-100 text-green-600 rounded-lg mr-3">
            <TrendingUp size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">Salary Outlook</h3>
            <p className="text-xs text-slate-500">Estimated monthly starting salary (PKR)</p>
          </div>
        </div>
        
        <div className="flex-grow flex items-end justify-around gap-4 h-48 relative pt-4">
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20 z-0">
             <div className="border-t border-slate-400 w-full h-0"></div>
             <div className="border-t border-slate-400 w-full h-0"></div>
             <div className="border-t border-slate-400 w-full h-0"></div>
             <div className="border-t border-slate-400 w-full h-0"></div>
          </div>

          {recommendations.map((rec, idx) => {
            const heightPercent = (rec.salaryMax / maxSalary) * 100;
            const bottomPercent = (rec.salaryMin / maxSalary) * 100;
            const barHeight = heightPercent - bottomPercent;

            return (
              <div key={idx} className="flex flex-col items-center w-full z-10 group relative">
                {/* Tooltip */}
                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-20 pointer-events-none">
                  {rec.salaryMin.toLocaleString()} - {rec.salaryMax.toLocaleString()} PKR
                </div>

                <div className="w-full max-w-[60px] relative h-full flex items-end">
                   {/* Floating Bar */}
                   <div 
                      className="w-full bg-gradient-to-t from-green-500 to-emerald-400 rounded-t-md rounded-b-md shadow-md transition-all duration-500 hover:brightness-110"
                      style={{ 
                        height: `${barHeight}%`, 
                        marginBottom: `${bottomPercent}%` 
                      }}
                   ></div>
                </div>
                <span className="text-xs font-semibold text-slate-600 mt-3 text-center line-clamp-1 w-full px-1" title={rec.title}>
                  Path {idx + 1}
                </span>
              </div>
            );
          })}
        </div>
        <div className="mt-2 text-center text-xs text-slate-400 italic">
          High and Low estimates based on market trends
        </div>
      </div>

      {/* Market Fit Chart */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
        <div className="flex items-center mb-6">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg mr-3">
            <BarChart3 size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">Strategic Fit</h3>
            <p className="text-xs text-slate-500">Personal Match vs. Market Demand</p>
          </div>
        </div>

        <div className="flex-grow space-y-6 flex flex-col justify-center">
          {recommendations.map((rec, idx) => (
            <div key={idx}>
              <div className="flex justify-between items-end mb-1">
                <span className="text-sm font-bold text-slate-700 truncate mr-2" title={rec.title}>
                  {idx + 1}. {rec.title}
                </span>
              </div>
              <div className="space-y-2">
                {/* Match Score Bar */}
                <div className="flex items-center group">
                   <div className="w-24 text-xs text-slate-500 font-medium">Personal Fit</div>
                   <div className="flex-grow h-2.5 bg-slate-100 rounded-full overflow-hidden">
                     <div 
                       className="h-full bg-brand-500 rounded-full relative"
                       style={{ width: `${rec.matchScore}%` }}
                     >
                     </div>
                   </div>
                   <div className="w-10 text-right text-xs font-bold text-brand-600">{rec.matchScore}%</div>
                </div>

                {/* Market Demand Bar */}
                <div className="flex items-center group">
                   <div className="w-24 text-xs text-slate-500 font-medium">Market Demand</div>
                   <div className="flex-grow h-2.5 bg-slate-100 rounded-full overflow-hidden">
                     <div 
                       className="h-full bg-blue-500 rounded-full"
                       style={{ width: `${rec.marketDemand}%` }}
                     ></div>
                   </div>
                   <div className="w-10 text-right text-xs font-bold text-blue-600">{rec.marketDemand}%</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-center gap-4 text-xs text-slate-500">
           <div className="flex items-center"><div className="w-2 h-2 rounded-full bg-brand-500 mr-1"></div> Your Interest</div>
           <div className="flex items-center"><div className="w-2 h-2 rounded-full bg-blue-500 mr-1"></div> Market Opportunity</div>
        </div>
      </div>
    </div>
  );
};

export default CareerCharts;
