import React, { useState } from 'react';
import { User } from '../types';
import { Compass, Mail, Lock, User as UserIcon, ArrowRight, AlertCircle } from 'lucide-react';
import { signInWithGoogle } from '../services/firebase';

interface AuthProps {
  onLogin: (user: User) => void;
  onCancel: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin, onCancel }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Note: We are keeping the mock email/password login for now as Firebase Email/Pass 
  // requires more setup, but Google Sign In is fully integrated.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    // Simulate API call for email/password
    setTimeout(() => {
      onLogin({
        name: name || (email.split('@')[0]),
        email: email,
        avatar: `https://ui-avatars.com/api/?name=${name || email}&background=16a34a&color=fff`
      });
      setIsLoading(false);
    }, 1500);
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const firebaseUser = await signInWithGoogle();
      
      // Map Firebase user to App user
      const appUser: User = {
        name: firebaseUser.displayName || 'User',
        email: firebaseUser.email || '',
        avatar: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${firebaseUser.displayName}&background=16a34a&color=fff`
      };
      
      onLogin(appUser);
    } catch (err: any) {
      console.error(err);
      if (err.message && err.message.includes("Firebase not initialized")) {
        setError("Firebase Configuration Missing. Please check env variables.");
      } else {
        setError("Failed to sign in with Google. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-slate-100">
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

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center">
            <AlertCircle size={16} className="mr-2 flex-shrink-0" />
            {error}
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            {!isLogin && (
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
                  placeholder="Enter your password"
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
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-colors"
            >
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <span className="flex items-center">
                  {isLogin ? 'Sign In' : 'Create Account'} <ArrowRight size={16} className="ml-2" />
                </span>
              )}
            </button>
          </div>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-slate-500">Or continue with</span>
          </div>
        </div>

        <div>
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center px-4 py-3 border border-slate-300 rounded-lg shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-colors"
          >
            <img 
              src="https://www.gstatic.com/images/branding/product/1x/g_logo_48px.png" 
              alt="Google Logo" 
              className="h-5 w-5 mr-3" 
            />
            Continue with Google
          </button>
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
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