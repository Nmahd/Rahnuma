
import React, { useState } from 'react';
import { CareerRecommendation, CareerResponse, University } from '../types';
import { MapPin, GraduationCap, Briefcase, Award, Laptop, Banknote, ChevronDown, ChevronUp, ExternalLink, Clock, DollarSign, BookOpen, Trophy, Monitor, BarChart, PlusCircle, CheckCircle2 } from 'lucide-react';
import UniversityComparison from './UniversityComparison';
import CareerCharts from './CareerCharts';

interface ResultsProps {
  data: CareerResponse;
  onReset: () => void;
}

const Results: React.FC<ResultsProps> = ({ data, onReset }) => {
  const [comparisonList, setComparisonList] = useState<University[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  const toggleCompare = (uni: University) => {
    setComparisonList(prev => {
      const exists = prev.find(u => u.name === uni.name);
      if (exists) {
        return prev.filter(u => u.name !== uni.name);
      } else {
        if (prev.length >= 3) {
          alert("You can only compare up to 3 universities at a time.");
          return prev;
        }
        return [...prev, uni];
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-24">
      {/* Header Analysis */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
        <h2 className="text-3xl font-bold text-slate-800 mb-4">Your Career Analysis</h2>
        <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed">
          <p>{data.analysis}</p>
        </div>
      </div>

      {/* Visualizations */}
      <div>
        <h3 className="text-xl font-bold text-slate-800 px-2 mb-4">Market Insights</h3>
        <CareerCharts recommendations={data.recommendations} />
      </div>

      <h3 className="text-xl font-bold text-slate-800 px-2">Recommended Career Paths</h3>

      {/* Career Cards */}
      <div className="space-y-6">
        {data.recommendations.map((career, idx) => (
          <CareerCard 
            key={idx} 
            career={career} 
            index={idx + 1} 
            comparisonList={comparisonList}
            onToggleCompare={toggleCompare}
          />
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

      {/* Floating Comparison Bar */}
      {comparisonList.length > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 bg-slate-900 text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-6 animate-slideUp w-[90%] max-w-md border border-slate-700">
          <div className="flex-grow">
            <span className="font-bold">{comparisonList.length}</span> University{comparisonList.length > 1 ? 's' : ''} Selected
          </div>
          <button 
            onClick={() => setShowComparison(true)}
            className="bg-brand-600 hover:bg-brand-500 text-white px-5 py-2 rounded-full text-sm font-semibold transition"
          >
            Compare Now
          </button>
          <button 
            onClick={() => setComparisonList([])}
            className="text-slate-400 hover:text-white transition"
          >
            <XIcon size={20} />
          </button>
        </div>
      )}

      {showComparison && (
        <UniversityComparison 
          universities={comparisonList} 
          onClose={() => setShowComparison(false)} 
          onRemove={(uni) => toggleCompare(uni)}
        />
      )}
    </div>
  );
};

const XIcon = ({size}: {size: number}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const UniversityCard: React.FC<{ 
  uni: University, 
  isSelected: boolean, 
  onToggleCompare: (uni: University) => void 
}> = ({ uni, isSelected, onToggleCompare }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className={`bg-white rounded-lg border transition-all overflow-hidden ${isSelected ? 'border-brand-500 ring-1 ring-brand-500' : 'border-slate-200 hover:border-brand-200'}`}>
      <div className="p-4 cursor-pointer" onClick={() => setShowDetails(!showDetails)}>
        <div className="flex justify-between items-start">
            <div className="flex-grow">
              <div className="flex justify-between items-start">
                  <span className="font-semibold text-slate-800 text-base">{uni.name}</span>
                  <div className="flex items-center gap-2">
                    {uni.ranking && (
                      <span className="flex items-center text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded whitespace-nowrap border border-amber-100">
                        <Trophy size={10} className="mr-1" /> {uni.ranking}
                      </span>
                    )}
                    {showDetails ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                  </div>
              </div>
              <div className="flex items-center text-slate-500 mt-1 space-x-2">
                <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-600">{uni.city}</span>
                <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-600">{uni.sector}</span>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div className="text-xs text-slate-500 font-medium bg-green-50 text-green-700 px-2 py-1 rounded inline-block border border-green-100">
                    Fees: <span className="font-bold">{uni.feeRange}</span>
                </div>
                
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleCompare(uni);
                  }}
                  className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full border transition ${
                    isSelected 
                      ? 'bg-brand-600 text-white border-brand-600 hover:bg-brand-700' 
                      : 'bg-white text-slate-500 border-slate-200 hover:border-brand-300 hover:text-brand-600'
                  }`}
                >
                  {isSelected ? <CheckCircle2 size={12} /> : <PlusCircle size={12} />}
                  {isSelected ? 'Selected' : 'Compare'}
                </button>
              </div>
            </div>
        </div>
      </div>
      
      {showDetails && (
        <div className="px-4 pb-4 pt-0 bg-slate-50/50 border-t border-slate-100 animate-fadeIn">
          <div className="mt-3">
             <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center mb-2">
               <GraduationCap size={12} className="mr-1 text-brand-500" /> Recommended Programs
             </h5>
             <div className="flex flex-wrap gap-2 mb-3">
                {uni.recommendedPrograms && uni.recommendedPrograms.map((prog, idx) => (
                  <span key={idx} className="text-xs bg-white border border-slate-200 px-2 py-1 rounded text-slate-700">
                    {prog}
                  </span>
                ))}
                {(!uni.recommendedPrograms || uni.recommendedPrograms.length === 0) && (
                  <span className="text-xs text-slate-400 italic">No specific programs listed</span>
                )}
             </div>

             <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center mb-2">
               <BookOpen size={12} className="mr-1 text-blue-500" /> Course Outline Highlights
             </h5>
             <ul className="list-disc list-inside text-xs text-slate-600 mb-4 space-y-1">
                {uni.keySubjects && uni.keySubjects.map((subject, idx) => (
                  <li key={idx}>{subject}</li>
                ))}
                {(!uni.keySubjects || uni.keySubjects.length === 0) && (
                  <li className="italic text-slate-400 list-none">General curriculum not available</li>
                )}
             </ul>

             {uni.website && (
                <a 
                  href={uni.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white text-brand-600 hover:bg-brand-50 hover:text-brand-700 text-xs font-semibold rounded border border-brand-200 transition-colors shadow-sm"
                  onClick={(e) => e.stopPropagation()} 
                >
                  Visit Official Website <ExternalLink size={12} />
                </a>
             )}
          </div>
        </div>
      )}
    </div>
  );
};

const CareerCard: React.FC<{ 
  career: CareerRecommendation, 
  index: number,
  comparisonList: University[],
  onToggleCompare: (uni: University) => void
}> = ({ career, index, comparisonList, onToggleCompare }) => {
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
              <p className="text-xs text-slate-500 mb-3">Click on a university to view details. Use 'Compare' to see side-by-side.</p>
              <div className="space-y-3">
                {career.universities.map((uni, i) => (
                  <UniversityCard 
                    key={i} 
                    uni={uni} 
                    isSelected={comparisonList.some(u => u.name === uni.name)}
                    onToggleCompare={onToggleCompare}
                  />
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
                             {course.format && (
                               <span className="inline-flex items-center text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                                 <Monitor size={12} className="mr-1" /> {course.format}
                               </span>
                             )}
                             {course.level && (
                               <span className="inline-flex items-center text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                                 <BarChart size={12} className="mr-1" /> {course.level}
                               </span>
                             )}
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
