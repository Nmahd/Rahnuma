
import React, { useState } from 'react';
import { User } from '../types';
import { Compass, Mail, Lock, User as UserIcon, ArrowRight, AlertCircle, Info, AlertTriangle, Settings, Phone } from 'lucide-react';
import { signInWithGoogle, registerWithEmail, loginWithEmail } from '../services/firebase';

interface AuthProps {
  onLogin: (user: User) => void;
  onCancel: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin, onCancel }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDomainError, setIsDomainError] = useState(false);
  const [isProviderError, setIsProviderError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setIsDomainError(false);
    setIsProviderError(false);
    
    try {
      if (isLogin) {
        // Handle Login
        const firebaseUser = await loginWithEmail(email, password);
        
        onLogin({
            name: firebaseUser.displayName || email.split('@')[0],
            email: firebaseUser.email || '',
            avatar: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${firebaseUser.displayName || 'User'}&background=16a34a&color=fff`
        });

      } else {
        // Handle Registration
        if (!name) {
            setError("Name is required");
            setIsLoading(false);
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            setIsLoading(false);
            return;
        }

        const firebaseUser = await registerWithEmail(name, email, password);
        
        // Note: Mobile number is captured but not stored in Firebase Auth profile by default 
        // without a database. For this app, we rely on the Auth object.
        
        onLogin({
            name: name,
            email: firebaseUser.email || '',
            avatar: `https://ui-avatars.com/api/?name=${name}&background=16a34a&color=fff`
        });
      }
    } catch (err: any) {
        console.error(err);
        if (err.code === 'auth/email-already-in-use') {
            setError("This email is already registered. Please log in.");
        } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
            setError("Invalid email or password.");
        } else if (err.code === 'auth/weak-password') {
            setError("Password should be at least 6 characters.");
        } else {
            setError(err.message || "Authentication failed. Please try again.");
        }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    setIsDomainError(false);
    setIsProviderError(false);
    try {
      const firebaseUser = await signInWithGoogle();
      
      const appUser: User = {
        name: firebaseUser.displayName || 'User',
        email: firebaseUser.email || '',
        avatar: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${firebaseUser.displayName}&background=16a34a&color=fff`
      };
      
      onLogin(appUser);
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/unauthorized-domain') {
        setIsDomainError(true);
        setError("Domain Not Authorized");
      } else if (err.code === 'auth/operation-not-allowed') {
        setIsProviderError(true);
        setError("Google Sign-In Not Enabled");
      } else if (err.message && err.message.includes("Firebase not initialized")) {
        setError("Firebase Configuration Missing. Please check env variables.");
      } else if (err.code === 'auth/popup-closed-by-user') {
        setError("Sign-in cancelled.");
      } else {
        setError("Failed to sign in with Google. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-slate-100 animate-fadeIn">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-brand-100 rounded-full flex items-center justify-center">
            <Compass className="h-8 w-8 text-brand-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-slate-900">
            {isLogin ? 'Sign in to Rahnuma' : 'Create your account'}
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            {isLogin ? 'Welcome back! Please enter your details.' : 'Start your career journey with us today.'}
          </p>
        </div>

        {isDomainError ? (
           <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
             <div className="flex">
               <div className="flex-shrink-0">
                 <AlertTriangle className="h-5 w-5 text-red-500" aria-hidden="true" />
               </div>
               <div className="ml-3">
                 <h3 className="text-sm font-medium text-red-800">Authorization Error</h3>
                 <div className="mt-2 text-sm text-red-700">
                   <p>This domain is not authorized to use Google Sign-In.</p>
                   <ul className="list-disc pl-5 space-y-1 mt-2">
                     <li>Go to Firebase Console</li>
                     <li>Select <strong>Authentication</strong> &gt; <strong>Settings</strong></li>
                     <li>Click <strong>Authorized domains</strong></li>
                     <li>Add <strong>rahnuma-career-guide.netlify.app</strong> (or your current domain)</li>
                   </ul>
                 </div>
               </div>
             </div>
           </div>
        ) : isProviderError ? (
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <Settings className="h-5 w-5 text-amber-500" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-amber-800">Configuration Required</h3>
                <div className="mt-2 text-sm text-amber-700">
                  <p>Google Sign-In is disabled in your Firebase project.</p>
                  <ol className="list-decimal pl-5 space-y-1 mt-2">
                    <li>Go to <strong>Firebase Console</strong> &gt; <strong>Authentication</strong></li>
                    <li>Click <strong>Sign-in method</strong> tab</li>
                    <li>Click <strong>Google</strong></li>
                    <li>Toggle <strong>Enable</strong> switch to ON</li>
                    <li>Click <strong>Save</strong></li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        ) : error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm flex items-start">
            <AlertCircle size={16} className="mr-2 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
        
        {/* Google Login - Primary Method */}
        <div>
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            type="button"
            className="w-full flex items-center justify-center px-4 py-3 border border-slate-300 rounded-lg shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-colors"
          >
            {isLoading ? (
               <div className="h-5 w-5 border-2 border-slate-300 border-t-brand-600 rounded-full animate-spin mr-3"></div>
            ) : (
                // Official Google G Logo SVG
                <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
            )}
            Continue with Google
          </button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-slate-500">Or with email</span>
          </div>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserIcon size={18} className="text-slate-400" />
                    </div>
                    <input
                      type="text"
                      required={!isLogin}
                      className="appearance-none relative block w-full pl-10 px-3 py-3 border border-slate-300 placeholder-slate-400 text-slate-900 rounded-lg focus:outline-none focus:ring-brand-500 focus:border-brand-500 focus:z-10 sm:text-sm bg-white"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Mobile Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone size={18} className="text-slate-400" />
                    </div>
                    <input
                      type="tel"
                      className="appearance-none relative block w-full pl-10 px-3 py-3 border border-slate-300 placeholder-slate-400 text-slate-900 rounded-lg focus:outline-none focus:ring-brand-500 focus:border-brand-500 focus:z-10 sm:text-sm bg-white"
                      placeholder="0300 1234567"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-slate-400" />
                </div>
                <input
                  type="email"
                  required
                  className="appearance-none relative block w-full pl-10 px-3 py-3 border border-slate-300 placeholder-slate-400 text-slate-900 rounded-lg focus:outline-none focus:ring-brand-500 focus:border-brand-500 focus:z-10 sm:text-sm bg-white"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  className="appearance-none relative block w-full pl-10 px-3 py-3 border border-slate-300 placeholder-slate-400 text-slate-900 rounded-lg focus:outline-none focus:ring-brand-500 focus:border-brand-500 focus:z-10 sm:text-sm bg-white"
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors"
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-slate-500 border-t-white rounded-full animate-spin"></div>
              ) : (
                <span className="flex items-center">
                  {isLogin ? 'Sign In' : 'Create Account'} <ArrowRight size={16} className="ml-2" />
                </span>
              )}
            </button>
          </div>
        </form>

        <div className="text-center">
          <button
            type="button"
            onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
            }}
            className="text-sm font-medium text-brand-600 hover:text-brand-500"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
        
        <div className="text-center mt-4">
            <button onClick={onCancel} className="text-xs text-slate-400 hover:text-slate-600">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
