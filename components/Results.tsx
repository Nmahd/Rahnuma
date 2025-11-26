
import React, { useState } from 'react';
import { CareerRecommendation, CareerResponse, University } from '../types';
import { 
  MapPin, 
  GraduationCap, 
  Award, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink, 
  Clock, 
  DollarSign, 
  Trophy, 
  PlusCircle, 
  CheckCircle2,
  TrendingUp,
  Banknote,
  Globe,
  Youtube,
  Star,
  Users,
  Lightbulb,
  Edit2
} from 'lucide-react';
import UniversityComparison from './UniversityComparison';

interface ResultsProps {
  data: CareerResponse;
  onReset: () => void;
  onEdit: () => void;
}

const Results: React.FC<ResultsProps> = ({ data, onReset, onEdit }) => {
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

  const recommendations = data?.recommendations || [];

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fadeIn pb-24">
      {/* Header Analysis */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
        <div className="flex items-center gap-4 mb-4">
           <div className="p-3 bg-brand-100 rounded-full text-brand-700">
             <Trophy size={28} />
           </div>
           <div>
             <h2 className="text-2xl font-bold text-slate-900">Career Analysis</h2>
             <p className="text-sm text-slate-500">Based on your profile and interests</p>
           </div>
        </div>
        <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed text-lg">
          <p>{data?.analysis || "Here is your personalized career analysis based on the details you provided."}</p>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-slate-900 mb-6 px-1 uppercase tracking-wider text-sm text-slate-500">Your Top Recommendations</h3>
        {/* Career Cards */}
        <div className="space-y-6">
          {recommendations.length > 0 ? (
            recommendations.map((career, idx) => (
              <CareerCard 
                key={idx} 
                career={career} 
                index={idx + 1} 
                comparisonList={comparisonList}
                onToggleCompare={toggleCompare}
              />
            ))
          ) : (
            <div className="text-center p-8 bg-white rounded-2xl border border-slate-200">
              <p className="text-slate-500">No recommendations found. Please try again.</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center mt-12 gap-4">
        <button 
          onClick={onEdit}
          className="px-6 py-3 bg-white text-slate-700 border border-slate-300 rounded-full font-medium hover:bg-slate-50 transition shadow-sm flex items-center"
        >
          <Edit2 size={16} className="mr-2" />
          Edit Profile
        </button>
        <button 
          onClick={onReset}
          className="px-8 py-3 bg-slate-900 text-white rounded-full font-medium hover:bg-slate-800 transition shadow-lg hover:-translate-y-0.5"
        >
          Start New Assessment
        </button>
      </div>

      {/* Floating Comparison Bar */}
      {comparisonList.length > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 bg-slate-900 text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-6 animate-slideUp w-[90%] max-w-lg border border-slate-700">
          <div className="flex-grow font-medium">
            <span className="font-bold text-brand-400">{comparisonList.length}</span> University{comparisonList.length > 1 ? 's' : ''} Selected
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowComparison(true)}
              className="bg-brand-600 hover:bg-brand-500 text-white px-5 py-2 rounded-full text-sm font-bold transition"
            >
              Compare
            </button>
            <button 
              onClick={() => setComparisonList([])}
              className="text-slate-400 hover:text-white transition p-2"
              title="Clear selection"
            >
              <XIcon size={20} />
            </button>
          </div>
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
    <div className={`bg-white rounded-xl border transition-all duration-300 ${isSelected ? 'border-brand-500 ring-1 ring-brand-500' : 'border-slate-200 hover:border-brand-200 hover:shadow-sm'}`}>
      <div className="p-5 cursor-pointer" onClick={() => setShowDetails(!showDetails)}>
        <div className="flex justify-between items-start gap-4">
            <div className="flex-grow">
              <div className="flex flex-wrap justify-between items-start gap-2">
                  <h4 className="font-bold text-slate-900 text-lg">{uni.name}</h4>
                  {uni.ranking && (
                    <span className="inline-flex items-center text-xs font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded-md border border-amber-100">
                      <Trophy size={12} className="mr-1" /> {uni.ranking}
                    </span>
                  )}
              </div>
              
              <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-slate-600">
                <span className="flex items-center">
                   <MapPin size={14} className="mr-1.5 text-slate-400" /> {uni.city}
                </span>
                <span className="flex items-center">
                   <Banknote size={14} className="mr-1.5 text-green-600" /> {uni.feeRange}
                </span>
                <span className="px-2 py-0.5 bg-slate-100 rounded text-xs font-medium text-slate-500">
                   {uni.sector}
                </span>
              </div>
            </div>
            
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onToggleCompare(uni);
              }}
              className={`p-2 rounded-full transition-colors shrink-0 ${
                isSelected 
                  ? 'bg-brand-600 text-white hover:bg-brand-700' 
                  : 'bg-slate-100 text-slate-400 hover:bg-brand-50 hover:text-brand-600'
              }`}
              title="Compare"
            >
              {isSelected ? <CheckCircle2 size={18} /> : <PlusCircle size={18} />}
            </button>
        </div>
        
        {/* Quick view of details indicator */}
        <div className="mt-4 flex justify-center">
            {showDetails ? <ChevronUp size={16} className="text-slate-300" /> : <ChevronDown size={16} className="text-slate-300" />}
        </div>
      </div>
      
      {showDetails && (
        <div className="px-5 pb-5 pt-0 border-t border-slate-100 bg-slate-50/30">
          <div className="mt-4 space-y-5">
             <div>
                <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Recommended Programs</h5>
                <div className="flex flex-wrap gap-2">
                   {uni.recommendedPrograms && uni.recommendedPrograms.length > 0 ? (
                     uni.recommendedPrograms.map((prog, idx) => (
                       <span key={idx} className="text-sm bg-white border border-slate-200 px-3 py-1 rounded-md text-slate-700">
                         {prog}
                       </span>
                     ))
                   ) : (
                      <span className="text-sm text-slate-500 italic">General programs available</span>
                   )}
                </div>
             </div>

             <div>
                <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Key Subjects</h5>
                <div className="flex flex-wrap gap-2">
                  {uni.keySubjects && uni.keySubjects.length > 0 ? (
                    uni.keySubjects.map((subject, idx) => (
                      <span key={idx} className="text-xs font-medium text-slate-600 bg-slate-100 border border-slate-200 px-2 py-1 rounded-md">
                        {subject}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-slate-500 italic">Standard curriculum</span>
                  )}
                </div>
             </div>

             {uni.website && (
                <div className="pt-2">
                  <a 
                    href={uni.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm font-semibold text-brand-600 hover:text-brand-700 hover:underline"
                    onClick={(e) => e.stopPropagation()} 
                  >
                    Visit Official Website <ExternalLink size={14} className="ml-1" />
                  </a>
                </div>
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
  const [expanded, setExpanded] = useState(index === 1);
  
  // Safe defaults
  const roadmap = career.roadmap || [];
  const skills = career.skills || [];
  const universities = career.universities || [];
  const shortCourses = career.shortCourses || [];
  const youtubeCourses = career.youtubeCourses || [];
  const roleModels = career.roleModels || [];

  return (
    <div className={`bg-white rounded-2xl shadow-sm border overflow-hidden transition-all duration-300 ${expanded ? 'border-brand-200 shadow-md' : 'border-slate-200'}`}>
      {/* Header Section */}
      <div 
        className="p-6 md:p-8 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex flex-col md:flex-row gap-6">
          {/* Rank Number */}
          <div className="hidden md:flex flex-shrink-0 w-12 h-12 rounded-xl bg-slate-900 text-white items-center justify-center font-bold text-xl">
             {index}
          </div>

          <div className="flex-grow">
            <div className="flex justify-between items-start">
               <div>
                  <div className="md:hidden inline-flex mb-2 px-2 py-0.5 rounded bg-slate-900 text-white text-xs font-bold">
                    #{index}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 leading-tight">{career.title}</h3>
                  <p className="text-slate-500 mt-1 line-clamp-2">{career.description}</p>
               </div>
               
               {/* Match Score Badge */}
               <div className="ml-4 text-center shrink-0">
                  <div className="text-2xl font-black text-brand-600">{career.matchScore}%</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Match</div>
               </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6">
               <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                  <div className="text-xs text-green-700 font-medium flex items-center mb-1">
                    <Banknote size={14} className="mr-1" /> Est. Salary
                  </div>
                  <div className="text-sm font-bold text-slate-800">{career.estimatedSalaryRangePKR}</div>
               </div>
               
               <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                  <div className="text-xs text-blue-700 font-medium flex items-center mb-1">
                    <TrendingUp size={14} className="mr-1" /> Demand
                  </div>
                  <div className="text-sm font-bold text-slate-800">{career.marketDemand}% Score</div>
               </div>

               <div className="col-span-2 sm:col-span-1 bg-slate-50 rounded-lg p-3 border border-slate-100 flex items-center justify-center sm:justify-start">
                   <div className="text-sm font-medium text-slate-600 flex items-center">
                      <span className="text-slate-400 mr-2 text-xs uppercase">Action</span>
                      {expanded ? <span className="text-brand-600 font-bold">View Less</span> : "View Details"}
                      {expanded ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />}
                   </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="px-6 pb-8 pt-0 md:px-8 md:pl-24 animate-fadeIn">
          <div className="border-t border-slate-100 my-6"></div>
          
          <div className="space-y-10">
            {/* Skills & Roadmap */}
            <div>
              <div className="mb-6">
                <h4 className="flex items-center text-lg font-bold text-slate-900 mb-4">
                  <Lightbulb size={20} className="mr-2 text-yellow-500" /> Top Skills You Need
                </h4>
                <div className="flex flex-wrap gap-2">
                  {skills.length > 0 ? (
                    skills.map((skill, i) => (
                      <span key={i} className="px-3 py-1.5 bg-yellow-50 text-yellow-800 text-sm font-semibold rounded-lg border border-yellow-100">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-slate-400 italic">No specific skills listed.</span>
                  )}
                </div>
              </div>

              <h4 className="flex items-center text-lg font-bold text-slate-900 mb-4">
                <MapPin size={20} className="mr-2 text-brand-500" /> Career Roadmap
              </h4>
              <div className="relative border-l-2 border-slate-200 ml-2.5 space-y-6 pb-2">
                {roadmap.length > 0 ? (
                  roadmap.map((step, i) => (
                    <div key={i} className="relative pl-8">
                      <span className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-white border-4 border-slate-300"></span>
                      <p className="text-base text-slate-700">{step}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-400 italic pl-6">No specific roadmap available.</p>
                )}
              </div>
            </div>

             {/* Freelancing */}
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                <h4 className="text-base font-bold text-slate-900 mb-2 flex items-center">
                  <Globe size={18} className="mr-2 text-blue-500" /> Freelancing & Opportunities
                </h4>
                <p className="text-slate-600 text-sm leading-relaxed">{career.freelancePotential}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Universities */}
              <div>
                <h4 className="flex items-center text-lg font-bold text-slate-900 mb-4">
                  <GraduationCap size={20} className="mr-2 text-purple-600" /> University Recommendations
                </h4>
                <div className="space-y-3">
                  {universities.length > 0 ? (
                    universities.map((uni, i) => (
                      <UniversityCard 
                        key={i} 
                        uni={uni} 
                        isSelected={comparisonList.some(u => u.name === uni.name)}
                        onToggleCompare={onToggleCompare}
                      />
                    ))
                  ) : (
                    <p className="text-sm text-slate-400 italic">No university recommendations available.</p>
                  )}
                </div>
              </div>

              {/* Short Courses */}
              <div>
                <h4 className="flex items-center text-lg font-bold text-slate-900 mb-4">
                  <Award size={20} className="mr-2 text-orange-500" /> Short Courses
                </h4>
                <div className="space-y-3">
                  {shortCourses.map((course, i) => (
                    <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 hover:border-orange-200 transition-colors">
                        <div className="flex justify-between items-start">
                          <h5 className="font-bold text-slate-800 text-base">{course.name}</h5>
                          <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded uppercase">
                             {course.provider}
                          </span>
                        </div>
                        
                        <p className="text-xs text-slate-500 mt-1 mb-3">
                          {course.description || "No description available."}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mb-3">
                           {course.duration && <Badge icon={<Clock size={10}/>} text={course.duration} />}
                           {course.cost && <Badge icon={<DollarSign size={10}/>} text={course.cost} />}
                        </div>
                        
                        {course.link && (
                          <a 
                            href={course.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-semibold text-orange-600 hover:text-orange-700 hover:underline flex items-center"
                          >
                            View Course <ExternalLink size={10} className="ml-1" />
                          </a>
                        )}
                    </div>
                  ))}
                  {shortCourses.length === 0 && (
                    <div className="p-4 text-center text-sm text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                      No short courses found.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Inspiration & Free Learning Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
               {/* YouTube Courses */}
               <div>
                  <h4 className="flex items-center text-lg font-bold text-slate-900 mb-4">
                    <Youtube size={20} className="mr-2 text-red-600" /> Free YouTube Courses
                  </h4>
                  <div className="space-y-3">
                     {youtubeCourses.length > 0 ? (
                       youtubeCourses.map((yt, i) => (
                         <a 
                           key={i} 
                           href={yt.url}
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="flex items-center p-3 bg-white rounded-xl border border-slate-200 hover:border-red-200 hover:shadow-sm transition group"
                         >
                           <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600 flex-shrink-0 mr-3 group-hover:bg-red-600 group-hover:text-white transition-colors">
                              <Youtube size={20} />
                           </div>
                           <div>
                              <h5 className="text-sm font-bold text-slate-800 group-hover:text-red-700">{yt.title}</h5>
                              <p className="text-xs text-slate-500">{yt.channelName}</p>
                           </div>
                           <ExternalLink size={14} className="ml-auto text-slate-300 group-hover:text-red-400" />
                         </a>
                       ))
                     ) : (
                        <p className="text-sm text-slate-400 italic">No specific YouTube courses suggested.</p>
                     )}
                  </div>
               </div>

               {/* Role Models */}
               <div>
                  <h4 className="flex items-center text-lg font-bold text-slate-900 mb-4">
                    <Star size={20} className="mr-2 text-yellow-500" /> Role Models
                  </h4>
                  <div className="space-y-3">
                     {roleModels.length > 0 ? (
                       roleModels.map((person, i) => (
                         <div key={i} className="flex items-start p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 flex-shrink-0 mr-3">
                               <Users size={20} />
                            </div>
                            <div>
                               <h5 className="text-sm font-bold text-slate-800">{person.name}</h5>
                               <p className="text-xs font-semibold text-slate-600">{person.role}</p>
                               <p className="text-xs text-slate-500 mt-1 italic">"{person.context}"</p>
                            </div>
                         </div>
                       ))
                     ) : (
                        <p className="text-sm text-slate-400 italic">No specific role models found.</p>
                     )}
                  </div>
               </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

const Badge = ({icon, text}: {icon: React.ReactNode, text: string}) => (
  <span className="inline-flex items-center text-[10px] font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded border border-slate-200">
    <span className="mr-1 opacity-70">{icon}</span> {text}
  </span>
);

export default Results;
