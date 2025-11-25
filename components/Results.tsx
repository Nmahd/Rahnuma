
import React, { useState } from 'react';
import { CareerRecommendation, CareerResponse } from '../types';
import { MapPin, GraduationCap, Briefcase, Award, Laptop, Banknote, ChevronDown, ChevronUp, ExternalLink, Clock, DollarSign, BookOpen } from 'lucide-react';

interface ResultsProps {
  data: CareerResponse;
  onReset: () => void;
}

const Results: React.FC<ResultsProps> = ({ data, onReset }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-12">
      {/* Header Analysis */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
        <h2 className="text-3xl font-bold text-slate-800 mb-4">Your Career Analysis</h2>
        <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed">
          <p>{data.analysis}</p>
        </div>
      </div>

      <h3 className="text-xl font-bold text-slate-800 px-2">Recommended Career Paths</h3>

      {/* Career Cards */}
      <div className="space-y-6">
        {data.recommendations.map((career, idx) => (
          <CareerCard key={idx} career={career} index={idx + 1} />
        ))}
      </div>

      <div className="flex justify-center mt-12">
        <button 
          onClick={onReset}
          className="px-8 py-3 bg-slate-900 text-white rounded-full font-medium hover:bg-slate-800 transition shadow-lg"
        >
          Start New Assessment
        </button>
      </div>
    </div>
  );
};

const CareerCard: React.FC<{ career: CareerRecommendation, index: number }> = ({ career, index }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden transition-all hover:shadow-lg">
      <div 
        className="p-6 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4 flex-grow">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-xl">
              {index}
            </div>
            <div className="flex-grow">
              <h3 className="text-xl font-bold text-slate-800">{career.title}</h3>
              <p className="text-slate-500 text-sm mt-1 line-clamp-2 md:line-clamp-1 mb-2">{career.description}</p>
              
              {/* Prominent Salary in Collapsed View */}
              <div className="inline-flex items-center bg-green-50 px-3 py-1.5 rounded-md border border-green-100 mt-1">
                 <Banknote size={16} className="text-green-600 mr-2" />
                 <span className="text-sm font-semibold text-green-800">{career.estimatedSalaryRangePKR} <span className="font-normal text-green-600 text-xs">/month</span></span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 pl-16 md:pl-0 flex-shrink-0">
             <div className="flex flex-col items-end">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Match</span>
                <span className="text-lg font-bold text-brand-600">{career.matchScore}%</span>
             </div>
             {expanded ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
          </div>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-slate-100 bg-slate-50/50 p-6 md:p-8 animate-fadeIn">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Roadmap */}
            <div>
              <h4 className="flex items-center text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">
                <MapPin size={16} className="mr-2 text-brand-500" /> Path to Success
              </h4>
              <ul className="space-y-3">
                {career.roadmap.map((step, i) => (
                  <li key={i} className="flex items-start text-sm text-slate-600">
                    <span className="mr-3 flex-shrink-0 w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-xs font-medium text-slate-500">{i + 1}</span>
                    {step}
                  </li>
                ))}
              </ul>
            </div>

            {/* Freelance & Details */}
            <div className="space-y-6">
              <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                <h4 className="flex items-center text-sm font-bold text-slate-900 mb-2 uppercase tracking-wider">
                  <Laptop size={16} className="mr-2 text-blue-500" /> Freelance Scope
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed">{career.freelancePotential}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
             {/* Universities */}
            <div>
              <h4 className="flex items-center text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">
                <GraduationCap size={16} className="mr-2 text-purple-500" /> Top Universities
              </h4>
              <div className="space-y-3">
                {career.universities.map((uni, i) => (
                  <div key={i} className="bg-white p-4 rounded-lg border border-slate-200 text-sm hover:border-brand-200 transition-colors group">
                    <div className="flex justify-between items-start">
                       <div className="flex-grow">
                         <div className="flex justify-between items-start">
                             <span className="font-semibold text-slate-800 text-base">{uni.name}</span>
                         </div>
                         <div className="flex items-center text-slate-500 mt-1 space-x-2">
                           <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-600">{uni.city}</span>
                           <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-600">{uni.sector}</span>
                         </div>
                         <div className="mt-3 flex items-center justify-between">
                            <div className="text-xs text-slate-500 font-medium bg-green-50 text-green-700 px-2 py-1 rounded inline-block">
                               Fees: <span className="font-bold">{uni.feeRange}</span>
                            </div>
                         </div>
                       </div>
                    </div>
                    {uni.website && (
                       <a 
                         href={uni.website} 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 bg-slate-50 text-brand-600 hover:bg-brand-50 hover:text-brand-700 text-xs font-semibold rounded border border-slate-100 transition-colors"
                       >
                         Visit Website <ExternalLink size={12} />
                       </a>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Short Courses */}
            <div>
              <h4 className="flex items-center text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">
                <Award size={16} className="mr-2 text-orange-500" /> Recommended Short Courses
              </h4>
              <div className="space-y-3">
                {career.shortCourses.map((course, i) => (
                  <div key={i} className="bg-white p-4 rounded-lg border border-slate-200 text-sm hover:border-orange-200 transition-colors">
                    <div className="flex items-start">
                       <div className="flex-shrink-0 mt-1 bg-orange-100 p-2 rounded-lg text-orange-600 mr-3">
                         <Briefcase size={18} />
                       </div>
                       <div className="flex-grow">
                          <p className="font-semibold text-slate-800 text-base">{course.name}</p>
                          {course.description && (
                            <p className="text-xs text-slate-500 mt-1 leading-relaxed mb-2">
                              <BookOpen size={10} className="inline mr-1" />
                              {course.description}
                            </p>
                          )}
                          <div className="flex flex-wrap gap-2 mt-2">
                             <span className="inline-flex items-center text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                               <Award size={12} className="mr-1" /> {course.provider}
                             </span>
                             <span className="inline-flex items-center text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                               <Clock size={12} className="mr-1" /> {course.duration}
                             </span>
                             {course.cost && (
                               <span className="inline-flex items-center text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded border border-green-100">
                                 <DollarSign size={12} className="mr-1" /> {course.cost}
                               </span>
                             )}
                          </div>
                          
                          {course.link && (
                            <a 
                              href={course.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-3 inline-flex items-center text-xs font-medium text-orange-600 hover:text-orange-700 hover:underline"
                            >
                              View Course <ExternalLink size={10} className="ml-1" />
                            </a>
                          )}
                       </div>
                    </div>
                  </div>
                ))}
                {career.shortCourses.length === 0 && (
                  <p className="text-sm text-slate-500 italic">No specific short courses recommended for this path yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Results;
