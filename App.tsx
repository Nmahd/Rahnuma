
import React, { useState } from 'react';
import { Compass, Loader2, LogOut, User as UserIcon } from 'lucide-react';
import { AppView, AssessmentData, CareerResponse, User } from './types';
import { generateCareerGuidance } from './services/geminiService';
import Assessment from './components/Assessment';
import Results from './components/Results';
import Auth from './components/Auth';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.LANDING);
  const [results, setResults] = useState<CareerResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const handleStart = () => {
    if (!user) {
      setView(AppView.AUTH);
    } else {
      setView(AppView.ASSESSMENT);
    }
  };

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setView(AppView.LANDING);
  };

  const handleLogout = () => {
    setUser(null);
    setResults(null);
    setView(AppView.LANDING);
  };

  const handleAssessmentSubmit = async (data: AssessmentData) => {
    setLoading(true);
    setView(AppView.LOADING);
    try {
      const response = await generateCareerGuidance(data);
      setResults(response);
      setView(AppView.RESULTS);
    } catch (error) {
      console.error(error);
      setView(AppView.ERROR);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResults(null);
    setView(AppView.ASSESSMENT);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center cursor-pointer" onClick={() => setView(AppView.LANDING)}>
              <Compass className="h-8 w-8 text-brand-600" />
              <span className="ml-2 text-xl font-bold tracking-tight text-slate-900">Rahnuma</span>
            </div>
            <div className="flex items-center space-x-4">
               {view === AppView.RESULTS && (
                 <button onClick={handleReset} className="text-sm font-medium text-slate-600 hover:text-brand-600 transition hidden sm:block">New Search</button>
               )}
               
               {user ? (
                 <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                    <div className="flex items-center gap-2">
                      <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full bg-slate-200" />
                      <span className="text-sm font-medium text-slate-700 hidden sm:block">{user.name}</span>
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="p-2 text-slate-400 hover:text-red-500 transition rounded-full hover:bg-red-50"
                      title="Logout"
                    >
                      <LogOut size={18} />
                    </button>
                 </div>
               ) : (
                 <button 
                   onClick={() => setView(AppView.AUTH)}
                   className="text-sm font-medium text-slate-600 hover:text-brand-600 transition"
                 >
                   Log In
                 </button>
               )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        {view === AppView.LANDING && (
          <div className="relative isolate overflow-hidden">
            <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
              <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 lg:pt-8">
                <div className="mt-24 sm:mt-32 lg:mt-16">
                  <span className="inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-600 ring-1 ring-inset ring-brand-500/10">
                    AI-Powered Career Counseling
                  </span>
                </div>
                <h1 className="mt-10 text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
                  Confused about your <span className="text-brand-600">future?</span>
                </h1>
                <p className="mt-6 text-lg leading-8 text-slate-600">
                  Rahnuma helps students in Pakistan discover their perfect career path. 
                  Get personalized advice on universities, short courses, and freelancing opportunities tailored to your skills and interests.
                </p>
                <div className="mt-10 flex items-center gap-x-6">
                  <button 
                    onClick={handleStart}
                    className="rounded-full bg-brand-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 transition-all hover:scale-105"
                  >
                    {user ? 'Find My Career Path' : 'Get Started'}
                  </button>
                  <a href="#" className="text-sm font-semibold leading-6 text-slate-900">
                    Learn more <span aria-hidden="true">→</span>
                  </a>
                </div>
              </div>
              <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mt-0 lg:mr-0 lg:max-w-none lg:flex-none xl:ml-32">
                 <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
                    <img 
                      src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80" 
                      alt="Students discussing" 
                      className="w-[30rem] rounded-2xl bg-gray-50 shadow-xl ring-1 ring-gray-900/10 lg:w-[40rem]"
                    />
                 </div>
              </div>
            </div>
          </div>
        )}
        
        {view === AppView.AUTH && (
          <Auth onLogin={handleLogin} onCancel={() => setView(AppView.LANDING)} />
        )}

        {view === AppView.ASSESSMENT && (
          <div className="py-12 px-4 sm:px-6">
            <div className="max-w-3xl mx-auto mb-8 text-center">
              <h2 className="text-3xl font-bold text-slate-900">Let's build your profile</h2>
              <p className="mt-2 text-slate-600">Answer a few simple questions to help our AI understand you better.</p>
            </div>
            <Assessment onSubmit={handleAssessmentSubmit} onCancel={() => setView(AppView.LANDING)} />
          </div>
        )}

        {view === AppView.LOADING && (
          <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
            <Loader2 className="h-12 w-12 text-brand-600 animate-spin mb-4" />
            <h3 className="text-xl font-semibold text-slate-900">Analyzing your profile...</h3>
            <p className="text-slate-500 mt-2 text-center max-w-md">We are checking 50+ career paths, Pakistani university requirements, and market trends.</p>
          </div>
        )}

        {view === AppView.RESULTS && results && (
          <div className="py-12 px-4 sm:px-6">
            <Results data={results} onReset={handleReset} />
          </div>
        )}

        {view === AppView.ERROR && (
          <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
            <div className="bg-red-50 p-4 rounded-full mb-4">
               <Compass className="h-12 w-12 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900">Something went wrong</h3>
            <p className="text-slate-500 mt-2 text-center max-w-md mb-6">We couldn't generate your recommendations at this moment. Please check your internet or try again.</p>
            <button 
              onClick={() => setView(AppView.ASSESSMENT)}
              className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition"
            >
              Try Again
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
               <div className="flex items-center">
                  <Compass className="h-6 w-6 text-brand-600" />
                  <span className="ml-2 text-lg font-bold text-slate-900">Rahnuma</span>
               </div>
               <p className="text-sm text-slate-500 mt-2">Empowering Pakistani Youth.</p>
            </div>
            <div className="text-sm text-slate-400">
              © {new Date().getFullYear()} Rahnuma. Made with love by Naeem Ahmed.
            </div>
         </div>
      </footer>
    </div>
  );
};

export default App;
