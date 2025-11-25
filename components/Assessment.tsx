import React, { useState, useEffect } from 'react';
import { AssessmentData } from '../types';
import { INTEREST_OPTIONS, EDUCATION_LEVELS, SUBJECT_OPTIONS, WORK_PREFERENCES, CITIES_PAKISTAN, BUDGET_RANGES } from '../constants';
import { ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface AssessmentProps {
  onSubmit: (data: AssessmentData) => void;
  onCancel: () => void;
}

const Assessment: React.FC<AssessmentProps> = ({ onSubmit, onCancel }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<AssessmentData>({
    name: '',
    city: 'Karachi',
    educationLevel: EDUCATION_LEVELS[0],
    majorSubjects: SUBJECT_OPTIONS[EDUCATION_LEVELS[0]][0],
    interests: [],
    hobbies: '',
    workPreference: WORK_PREFERENCES[0],
    financialGoal: 'Financial Stability',
    budgetRange: BUDGET_RANGES[0]
  });

  const totalSteps = 4;

  // Update majorSubjects when educationLevel changes
  useEffect(() => {
    const subjects = SUBJECT_OPTIONS[formData.educationLevel];
    if (subjects && subjects.length > 0) {
      setFormData(prev => ({ ...prev, majorSubjects: subjects[0] }));
    }
  }, [formData.educationLevel]);

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
    else onSubmit(formData);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else onCancel();
  };

  const toggleInterest = (label: string) => {
    setFormData(prev => {
      const exists = prev.interests.includes(label);
      if (exists) {
        return { ...prev, interests: prev.interests.filter(i => i !== label) };
      } else {
        if (prev.interests.length >= 3) return prev; // Max 3
        return { ...prev, interests: [...prev.interests, label] };
      }
    });
  };

  // Helper for current subjects based on education level
  const currentSubjects = SUBJECT_OPTIONS[formData.educationLevel] || ["Other"];

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
      {/* Progress Bar */}
      <div className="bg-slate-100 h-2 w-full">
        <div 
          className="bg-brand-500 h-full transition-all duration-500 ease-in-out"
          style={{ width: `${(step / totalSteps) * 100}%` }}
        ></div>
      </div>

      <div className="p-8">
        <div className="mb-6">
          <span className="text-xs font-bold text-brand-600 tracking-wider uppercase">Step {step} of {totalSteps}</span>
          <h2 className="text-2xl font-bold text-slate-800 mt-2">
            {step === 1 && "Tell us about yourself"}
            {step === 2 && "Your Education Background"}
            {step === 3 && "What excites you?"}
            {step === 4 && "Future Goals & Budget"}
          </h2>
        </div>

        <div className="min-h-[300px]">
          {/* STEP 1: Personal Info */}
          {step === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white text-slate-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition placeholder-slate-400"
                  placeholder="e.g. Ali Khan"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                <select 
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white text-slate-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                >
                  {CITIES_PAKISTAN.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* STEP 2: Education */}
          {step === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Current Education Level</label>
                <div className="space-y-2">
                  {EDUCATION_LEVELS.map((level) => (
                    <label key={level} className={`flex items-center p-3 rounded-lg border cursor-pointer transition ${formData.educationLevel === level ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-slate-300'} bg-white`}>
                      <input 
                        type="radio" 
                        name="education" 
                        className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300"
                        checked={formData.educationLevel === level}
                        onChange={() => setFormData({...formData, educationLevel: level})}
                      />
                      <span className="ml-3 text-slate-900">{level}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">Major Subjects / Group</label>
                <select 
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white text-slate-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition"
                  value={formData.majorSubjects}
                  onChange={(e) => setFormData({...formData, majorSubjects: e.target.value})}
                >
                  {currentSubjects.map(subj => (
                    <option key={subj} value={subj}>{subj}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* STEP 3: Interests */}
          {step === 3 && (
            <div className="animate-fadeIn">
              <p className="text-slate-600 mb-4 text-sm">Select up to 3 areas that interest you the most.</p>
              <div className="grid grid-cols-2 gap-3">
                {INTEREST_OPTIONS.map((item) => {
                  const isSelected = formData.interests.includes(item.label);
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => toggleInterest(item.label)}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-200 bg-white ${
                        isSelected 
                          ? 'border-brand-500 bg-brand-50 text-brand-700 shadow-sm ring-1 ring-brand-500' 
                          : 'border-slate-200 hover:border-brand-300 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      <Icon size={24} className={`mb-2 ${isSelected ? 'text-brand-600' : 'text-slate-400'}`} />
                      <span className="text-sm font-medium text-center">{item.label}</span>
                    </button>
                  );
                })}
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">Any specific hobbies?</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition placeholder-slate-400"
                  placeholder="e.g. Sketching, Gaming, Reading history..."
                  value={formData.hobbies}
                  onChange={(e) => setFormData({...formData, hobbies: e.target.value})}
                />
              </div>
            </div>
          )}

          {/* STEP 4: Preferences & Budget */}
          {step === 4 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Work Environment Preference</label>
                <div className="grid grid-cols-1 gap-2">
                  {WORK_PREFERENCES.map((pref) => (
                     <label key={pref} className={`flex items-center p-3 rounded-lg border cursor-pointer transition ${formData.workPreference === pref ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-slate-300'} bg-white`}>
                     <input 
                       type="radio" 
                       name="workpref" 
                       className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300"
                       checked={formData.workPreference === pref}
                       onChange={() => setFormData({...formData, workPreference: pref})}
                     />
                     <span className="ml-3 text-slate-900">{pref}</span>
                   </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Primary Goal</label>
                <select 
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white text-slate-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition"
                  value={formData.financialGoal}
                  onChange={(e) => setFormData({...formData, financialGoal: e.target.value})}
                >
                  <option value="Financial Stability">I want a stable, secure income</option>
                  <option value="Innovation & Growth">I want to learn new things and innovate</option>
                  <option value="High Income">I want to maximize my earnings (High Risk)</option>
                  <option value="Social Impact">I want to help society</option>
                  <option value="Flexibility">I want a flexible lifestyle</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Estimated Education Budget</label>
                <select 
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white text-slate-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition"
                  value={formData.budgetRange}
                  onChange={(e) => setFormData({...formData, budgetRange: e.target.value})}
                >
                  {BUDGET_RANGES.map(range => (
                    <option key={range} value={range}>{range}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-8 pt-4 border-t border-slate-100">
          <button 
            onClick={handleBack}
            className="flex items-center px-6 py-2.5 text-slate-600 font-medium hover:text-slate-900 transition-colors"
          >
            <ArrowLeft size={18} className="mr-2" />
            {step === 1 ? 'Cancel' : 'Back'}
          </button>
          
          <button 
            onClick={handleNext}
            disabled={step === 1 && !formData.name}
            className={`flex items-center px-8 py-2.5 bg-brand-600 text-white rounded-lg font-medium shadow-md hover:bg-brand-700 hover:shadow-lg transition-all ${
              step === 1 && !formData.name ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {step === totalSteps ? 'Get Analysis' : 'Next'}
            {step !== totalSteps && <ArrowRight size={18} className="ml-2" />}
            {step === totalSteps && <CheckCircle2 size={18} className="ml-2" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Assessment;