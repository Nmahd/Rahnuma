
import React from 'react';
import { Sparkles, Map, Target, BrainCircuit, GraduationCap, ChevronRight, CheckCircle2, ArrowRight } from 'lucide-react';
import { User } from '../types';

interface LandingPageProps {
  onStart: () => void;
  user: User | null;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart, user }) => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden bg-slate-900 pb-16 pt-14 sm:pb-20">
        <img
          src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&crop=focalpoint&fp-y=.8&w=2830&h=1500&q=80&blend=111827&sat=-100&exp=15&blend-mode=multiply"
          alt="University campus background"
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-900/40"></div>
        
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
            <div className="hidden sm:mb-8 sm:flex sm:justify-center animate-fadeIn">
              <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-slate-300 ring-1 ring-white/10 hover:ring-white/20">
                Revolutionizing Career Counseling in Pakistan. <a href="#features" className="font-semibold text-brand-400"><span className="absolute inset-0" aria-hidden="true" />Read more <span aria-hidden="true">&rarr;</span></a>
              </div>
            </div>
            <div className="text-center animate-slideUp">
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                Don't Just Guess Your Future. <br/>
                <span className="text-brand-500">Engineer It.</span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-slate-300">
                Rahnuma uses advanced AI to analyze your skills, interests, and financial goals. We map your profile to the best universities, degrees, and career paths in Pakistan.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <button
                  onClick={onStart}
                  className="rounded-full bg-brand-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400 transition-all hover:scale-105"
                >
                  {user ? "Go to Dashboard" : "Start Your Free Assessment"}
                </button>
                <a href="#how-it-works" className="text-sm font-semibold leading-6 text-white hover:text-brand-400 transition-colors">
                  See how it works <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div id="features" className="py-24 sm:py-32 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-brand-600">Why Rahnuma?</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Traditional counseling is outdated. <br/>We use Data.
            </p>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Most students choose careers based on peer pressure or limited knowledge. Rahnuma breaks that cycle by providing data-backed, personalized roadmaps.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-slate-900">
                  <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-brand-600">
                    <BrainCircuit className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  AI-Powered Analysis
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600">
                  <p className="flex-auto">
                    Our AI evaluates your hobbies, academic background, and financial constraints to find matches you might have never considered.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-slate-900">
                  <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-brand-600">
                    <GraduationCap className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  University Matching
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600">
                  <p className="flex-auto">
                    We don't just say "Study CS". We tell you <em>where</em> to study based on your city, budget (fees), and university rankings.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-slate-900">
                  <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-brand-600">
                    <Target className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  Actionable Roadmaps
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600">
                  <p className="flex-auto">
                    Get a year-by-year plan. From which hard skills to learn (like Python or SEO) to which short courses to take.
                  </p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* The Journey Section */}
      <div id="how-it-works" className="overflow-hidden bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Your Journey to Success</h2>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              It takes less than 5 minutes to design the next 5 years of your life. Here is how Rahnuma works.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-4">
            {/* Step 1 */}
            <div className="relative pl-9 group">
              <div className="absolute left-0 top-1 h-full w-0.5 bg-slate-200 group-hover:bg-brand-500 transition-colors"></div>
              <div className="absolute left-[-4px] top-1 h-2.5 w-2.5 rounded-full bg-brand-600 ring-4 ring-white"></div>
              <h3 className="text-lg font-semibold leading-8 text-slate-900">1. Build Profile</h3>
              <p className="mt-2 text-base leading-7 text-slate-600">
                Tell us about your education (Matric/Inter), your city, and what you actually enjoy doing.
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="relative pl-9 group">
              <div className="absolute left-0 top-1 h-full w-0.5 bg-slate-200 group-hover:bg-brand-500 transition-colors"></div>
               <div className="absolute left-[-4px] top-1 h-2.5 w-2.5 rounded-full bg-brand-600 ring-4 ring-white"></div>
              <h3 className="text-lg font-semibold leading-8 text-slate-900">2. Set Goals</h3>
              <p className="mt-2 text-base leading-7 text-slate-600">
                Define your financial goals and budget. Are you looking for stability, or high-risk high-reward entrepreneurship?
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative pl-9 group">
              <div className="absolute left-0 top-1 h-full w-0.5 bg-slate-200 group-hover:bg-brand-500 transition-colors"></div>
               <div className="absolute left-[-4px] top-1 h-2.5 w-2.5 rounded-full bg-brand-600 ring-4 ring-white"></div>
              <h3 className="text-lg font-semibold leading-8 text-slate-900">3. AI Analysis</h3>
              <p className="mt-2 text-base leading-7 text-slate-600">
                Our Gemini AI engine crunches market trends in Pakistan to match you with feasible career paths.
              </p>
            </div>

            {/* Step 4 */}
            <div className="relative pl-9 group">
              <div className="absolute left-0 top-1 h-full w-0.5 bg-transparent"></div>
               <div className="absolute left-[-4px] top-1 h-2.5 w-2.5 rounded-full bg-brand-600 ring-4 ring-white"></div>
              <h3 className="text-lg font-semibold leading-8 text-slate-900">4. Get Roadmap</h3>
              <p className="mt-2 text-base leading-7 text-slate-600">
                Receive a detailed report with university links, fee structures, and free course resources.
              </p>
            </div>
          </div>

          <div className="mt-16 flex justify-center">
             <button 
                onClick={onStart}
                className="flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:bg-slate-800 transition-all hover:gap-4"
             >
                Start Your Journey Now <ArrowRight size={20} />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
