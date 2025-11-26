
import React, { useState, useEffect } from 'react';
import { Compass, Loader2, LogOut, LayoutDashboard, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { AppView, AssessmentData, CareerResponse, User } from './types';
import { generateCareerGuidance } from './services/geminiService';
import { subscribeToAuthChanges, logoutUser, getUserAssessment, saveUserAssessment } from './services/firebase';
import Assessment from './components/Assessment';
import Results from './components/Results';
import Auth from './components/Auth';
import LandingPage from './components/LandingPage';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.LANDING);
  const [results, setResults] = useState<CareerResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');
  
  // Keep track of assessment data so user can edit it
  const [currentAssessmentData, setCurrentAssessmentData] = useState<AssessmentData | undefined>(undefined);

  // Listen for Firebase Auth changes
  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async (firebaseUser) => {
      if (firebaseUser) {
        const loggedInUser = {
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          email: firebaseUser.email || '',
          avatar: firebaseUser.photoURL || undefined,
          uid: firebaseUser.uid
        };
        setUser(loggedInUser);
        
        // Load saved data from Firestore
        try {
           const savedData = await getUserAssessment(firebaseUser.uid);
           if (savedData) {
              setResults(savedData.results);
              setCurrentAssessmentData(savedData.assessmentInput);
           }
        } catch (e) {
          console.error("Error loading user data", e);
        }

        // If user logs in while on Auth or Landing page, redirect to Dashboard
        if (view === AppView.AUTH || view === AppView.LANDING) {
           setView(AppView.DASHBOARD);
        }
      } else {
        setUser(null);
        setResults(null);
        setCurrentAssessmentData(undefined);
        // If logged out and on protected views, redirect to Landing
        if (view === AppView.DASHBOARD || view === AppView.ASSESSMENT || view === AppView.RESULTS) {
          setView(AppView.LANDING);
        }
      }
    });

    return () => unsubscribe();
  }, [view]);

  const handleStart = () => {
    if (!user) {
      setView(AppView.AUTH);
    } else {
      // Clear previous results if starting fresh, but maybe keep input if editing? 
      // handleStart usually implies fresh, but let's see. 
      // If we want fresh, we should clear currentAssessmentData, unless we want to remember last input.
      // Let's keep last input as default for better UX, but usually "Start New" implies reset.
      // But here we rely on the Assessment component to handle defaults or passed props.
      setView(AppView.ASSESSMENT);
    }
  };

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setView(AppView.DASHBOARD);
  };

  const handleLogout = async () => {
    await logoutUser();
    localStorage.removeItem('rahnuma_results'); // Clear local backup
    setUser(null);
    setResults(null);
    setCurrentAssessmentData(undefined);
    setView(AppView.LANDING);
  };

  const handleAssessmentSubmit = async (data: AssessmentData) => {
    setLoading(true);
    setView(AppView.LOADING);
    setErrorMsg('');
    setCurrentAssessmentData(data); // Save the input data

    try {
      // Pass the user name to the prompt for better personalization
      const dataWithUser = { ...data, name: user?.name || data.name };
      const response = await generateCareerGuidance(dataWithUser);
      
      setResults(response);
      
      // Save to Firestore if user is logged in
      if (user && user.uid) {
         await saveUserAssessment(user.uid, {
            results: response,
            assessmentInput: data
         });
      }
      
      setView(AppView.RESULTS);
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.message || "An unexpected error occurred.");
      setView(AppView.ERROR);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResults(null);
    setCurrentAssessmentData(undefined); // Clear stored input for a truly fresh start
    setView(AppView.ASSESSMENT);
  };

  const handleEditAssessment = () => {
    // Go back to assessment but keep the current data
    setView(AppView.ASSESSMENT);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center cursor-pointer group" onClick={() => setView(user ? AppView.DASHBOARD : AppView.LANDING)}>
              <Compass className="h-8 w-8 text-brand-600 group-hover:rotate-45 transition-transform duration-300" />
              <span className="ml-2 text-xl font-bold tracking-tight text-slate-900">Rahnuma</span>
            </div>
            <div className="flex items-center space-x-4">
               {view === AppView.RESULTS && (
                 <button onClick={handleReset} className="text-sm font-medium text-slate-600 hover:text-brand-600 transition hidden sm:block">New Search</button>
               )}
               
               {user ? (
                 <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                    <button 
                      onClick={() => setView(AppView.DASHBOARD)}
                      className="hidden md:flex items-center text-sm font-medium text-slate-600 hover:text-brand-600 mr-2 transition-colors"
                    >
                      <LayoutDashboard size={18} className="mr-1" /> Dashboard
                    </button>
                    <div className="flex items-center gap-2">
                      <img 
                        src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=16a34a&color=fff`} 
                        alt={user.name} 
                        className="w-8 h-8 rounded-full bg-slate-200 object-cover border border-slate-200 shadow-sm" 
                      />
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
          <LandingPage onStart={handleStart} user={user} />
        )}
        
        {view === AppView.AUTH && (
          <Auth onLogin={handleLogin} onCancel={() => setView(AppView.LANDING)} />
        )}

        {view === AppView.DASHBOARD && user && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fadeIn">
            <h1 className="text-3xl font-bold text-slate-900 mb-8">Welcome Back, {user.name}</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* User Profile Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col items-center text-center">
                 <img 
                    src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=16a34a&color=fff`} 
                    alt={user.name} 
                    className="w-24 h-24 rounded-full mb-4 border-4 border-white shadow-md"
                 />
                 <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
                 <div className="flex items-center text-slate-500 text-sm mb-6 mt-1">
                   <Mail size={14} className="mr-1.5" />
                   {user.email}
                 </div>
                 
                 <div className="w-full pt-6 border-t border-slate-100">
                    <div className="flex items-center justify-center text-green-700 bg-green-50 px-3 py-2 rounded-lg text-sm font-medium">
                        <ShieldCheck size={16} className="mr-2" />
                        Account Verified
                    </div>
                 </div>
              </div>

              {/* Action Card */}
              <div className="md:col-span-2 bg-gradient-to-br from-brand-600 to-green-700 rounded-2xl shadow-lg p-8 text-white flex flex-col justify-center relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Compass size={120} />
                 </div>
                 <div className="relative z-10">
                    <h2 className="text-3xl font-bold mb-3">Find Your Path</h2>
                    <p className="text-brand-100 mb-8 max-w-lg text-lg leading-relaxed">
                      Ready to discover your ideal career? Take our AI-powered assessment to find the best universities and courses customized for you.
                    </p>
                    <div className="flex gap-4">
                      <button 
                        onClick={() => {
                          setCurrentAssessmentData(undefined); // Ensure fresh start
                          setView(AppView.ASSESSMENT);
                        }}
                        className="bg-white text-brand-700 hover:bg-brand-50 px-8 py-4 rounded-xl font-bold shadow-md transition-all hover:translate-x-1 flex items-center"
                      >
                        Start New Assessment <ArrowRight size={20} className="ml-2" />
                      </button>
                      
                      {results && (
                        <button 
                          onClick={() => setView(AppView.RESULTS)}
                          className="bg-brand-800 bg-opacity-40 hover:bg-opacity-60 text-white border border-brand-400 px-6 py-4 rounded-xl font-bold shadow-sm transition-all"
                        >
                          View Saved Results
                        </button>
                      )}
                    </div>
                 </div>
              </div>
            </div>
          </div>
        )}

        {view === AppView.ASSESSMENT && (
          <div className="py-12 px-4 sm:px-6">
            <div className="max-w-3xl mx-auto mb-8 text-center">
              <h2 className="text-3xl font-bold text-slate-900">
                {currentAssessmentData ? "Review & Edit Your Profile" : "Let's build your profile"}
              </h2>
              <p className="text-slate-600 mt-2">
                {currentAssessmentData ? "Make changes below to update your recommendations." : "We'll need some details to provide the best recommendations."}
              </p>
            </div>
            <Assessment 
              onSubmit={handleAssessmentSubmit} 
              onCancel={() => setView(user ? AppView.DASHBOARD : AppView.LANDING)} 
              defaultName={user?.name}
              initialData={currentAssessmentData}
            />
          </div>
        )}

        {view === AppView.LOADING && (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="relative">
               <div className="absolute inset-0 bg-brand-200 rounded-full animate-ping opacity-75"></div>
               <div className="relative bg-white p-4 rounded-full shadow-lg border border-slate-100">
                 <Loader2 size={48} className="text-brand-600 animate-spin" />
               </div>
            </div>
            <h3 className="mt-8 text-xl font-bold text-slate-800">Analyzing Your Profile</h3>
            <p className="text-slate-500 mt-2 text-center max-w-md animate-pulse">
              Our AI is reviewing your interests, checking university data, and finding the best career matches for you...
            </p>
          </div>
        )}

        {view === AppView.RESULTS && results && (
          <div className="py-8 px-4 sm:px-6">
             <Results 
               data={results} 
               onReset={handleReset} 
               onEdit={handleEditAssessment} 
             />
          </div>
        )}
        
        {view === AppView.ERROR && (
           <div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
              <div className="bg-red-50 p-4 rounded-full mb-4">
                 <LogOut size={48} className="text-red-500" /> 
              </div>
              <h3 className="text-xl font-bold text-slate-800">Something went wrong</h3>
              <p className="text-slate-500 mt-2 text-center max-w-md mb-6">
                {errorMsg}
              </p>
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
      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center">
             <Compass size={24} className="text-brand-600 mr-2" />
             <span className="font-bold text-slate-900">Rahnuma</span>
          </div>
          <p className="text-sm text-slate-500 text-center md:text-right">
            © {new Date().getFullYear()} Rahnuma. Made with love by Naeem Ahmed.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
