
import React, { useState, useEffect } from 'react';
import { AssessmentData } from '../types';
import { INTEREST_OPTIONS, EDUCATION_LEVELS, SUBJECT_OPTIONS, WORK_PREFERENCES, CITIES_PAKISTAN, BUDGET_RANGES } from '../constants';
import { ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface AssessmentProps {
  onSubmit: (data: AssessmentData) => void;
  onCancel: () => void;
  defaultName?: string;
  initialData?: AssessmentData; // Allow editing existing data
}

const Assessment: React.FC<AssessmentProps> = ({ onSubmit, onCancel, defaultName, initialData }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<AssessmentData>({
    name: defaultName || '',
    city: 'Karachi',
    educationLevel: EDUCATION_LEVELS[0],
    majorSubjects: SUBJECT_OPTIONS[EDUCATION_LEVELS[0]][0],
    customSubject: '',
    interests: [],
    hobbies: '',
    workPreference: WORK_PREFERENCES[0],
    financialGoal: 'Financial Stability',
    budgetRange: BUDGET_RANGES[0]
  });

  // Initialize with initialData if provided (for editing mode)
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else if (defaultName) {
      setFormData(prev => ({ ...prev, name: defaultName }));
    }
  }, [initialData, defaultName]);

  const totalSteps = 4;

  // Update majorSubjects when educationLevel changes
  useEffect(() => {
    // Only reset subjects if it's a manual change, not during initial load of initialData
    // We check if the current majorSubjects is valid for the new educationLevel
    const validSubjects = SUBJECT_OPTIONS[formData.educationLevel];
    if (validSubjects && !validSubjects.includes(formData.majorSubjects) && formData.majorSubjects !== 'Other' && !initialData) {
       setFormData(prev => ({ 
        ...prev, 
        majorSubjects: validSubjects[0],
        customSubject: '' 
      }));
    }
  }, [formData.educationLevel, initialData]);

  const handleNext = () => {
    // Validation for Step 1
    if (step === 1 && !formData.name.trim()) {
      alert("Please enter your name.");
      return;
    }

    // Validation for Step 2
    if (step === 2 && formData.majorSubjects === 'Other' && !formData.customSubject?.trim()) {
      alert("Please specify your major/field.");
      return;
    }
    
    // Validation for Step 3
    if (step === 3 && formData.interests.length === 0) {
      alert("Please select at least one interest.");
      return;
    }
    
    if (step < totalSteps) setStep(step + 1);
    else onSubmit(formData);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else onCancel();
  };

  const jumpToStep = (targetStep: number) => {
    // Only allow jumping to previous steps or current step
    // Or allow jumping forward if the current step is valid (simplified: allow back freely)
    if (targetStep < step) {
      setStep(targetStep);
    }
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
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 animate-fadeIn">
      {/* Progress Bar */}
      <div className="bg-slate-50 border-b border-slate-100 px-8 py-4">
         <div className="flex justify-between items-center relative">
            {/* Line behind */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 z-0"></div>
            
            {/* Steps */}
            {[1, 2, 3, 4].map((i) => (
               <button 
                 key={i}
                 onClick={() => jumpToStep(i)}
                 disabled={i > step} // Can't jump forward beyond current progress
                 className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                    step === i 
                      ? 'bg-brand-600 text-white shadow-lg ring-4 ring-brand-50 scale-110' 
                      : i < step 
                        ? 'bg-brand-500 text-white cursor-pointer hover:bg-brand-600' 
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                 }`}
               >
                 {i < step ? <CheckCircle2 size={16} /> : i}
               </button>
            ))}
         </div>
         <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            <span>Profile</span>
            <span>Education</span>
            <span>Interests</span>
            <span>Goals</span>
         </div>
      </div>

      <div className="p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-800 mt-2">
            {step === 1 && "Tell us about yourself"}
            {step === 2 && "Your Education Background"}
            {step === 3 && "What excites you?"}
            {step === 4 && "Future Goals & Budget"}
          </h2>
          <p className="text-slate-500 text-sm mt-1">
             {step === 1 && "Let's start with the basics to personalize your guide."}
             {step === 2 && "This helps us find universities that match your qualification."}
             {step === 3 && "We'll match these interests with market demands."}
             {step === 4 && "We'll tailor the roadmap to your financial comfort."}
          </p>
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
                  autoFocus
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
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
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
                
                {/* Manual Input if 'Other' is selected */}
                {formData.majorSubjects === 'Other' && (
                  <div className="mt-3 animate-fadeIn">
                    <label className="block text-sm font-medium text-brand-700 mb-1">Please specify your field:</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 rounded-lg border border-brand-300 bg-brand-50 text-slate-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition placeholder-slate-400"
                      placeholder="e.g. Zoology, Bioinformatics, Islamic Studies..."
                      value={formData.customSubject || ''}
                      onChange={(e) => setFormData({...formData, customSubject: e.target.value})}
                      autoFocus
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: Interests */}
          {step === 3 && (
            <div className="animate-fadeIn">
              <p className="text-slate-600 mb-4 text-sm bg-slate-50 p-3 rounded-lg border border-slate-100">
                Select up to 3 areas. This is crucial for our AI to match your passion with a profession.
              </p>
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
                          ? 'border-brand-500 bg-brand-50 text-brand-700 shadow-sm ring-1 ring-brand-500 transform scale-[1.02]' 
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
                <label className="block text-sm font-medium text-slate-700 mb-1">Any specific hobbies? (Optional)</label>
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
            className="flex items-center px-6 py-2.5 text-slate-600 font-medium hover:text-slate-900 transition-colors border border-transparent hover:bg-slate-50 rounded-lg"
          >
            <ArrowLeft size={18} className="mr-2" />
            {step === 1 ? 'Cancel' : 'Back'}
          </button>
          
          <button 
            onClick={handleNext}
            className="flex items-center px-8 py-2.5 bg-brand-600 text-white rounded-lg font-medium shadow-md hover:bg-brand-700 hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
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
