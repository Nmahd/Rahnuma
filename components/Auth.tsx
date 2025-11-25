
import React, { useState } from 'react';
import { User } from '../types';
import { Compass, Mail, Lock, User as UserIcon, ArrowRight } from 'lucide-react';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      onLogin({
        name: name || (email.split('@')[0]),
        email: email,
        avatar: `https://ui-avatars.com/api/?name=${name || email}&background=16a34a&color=fff`
      });
      setIsLoading(false);
    }, 1500);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    // Simulate Google Login
    setTimeout(() => {
      onLogin({
        name: "Google User",
        email: "user@gmail.com",
        avatar: "https://lh3.googleusercontent.com/a/default-user=s96-c"
      });
      setIsLoading(false);
    }, 1500);
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
            <svg className="h-5 w-5 mr-3" aria-hidden="true" viewBox="0 0 24 24">
              <path
                d="M12.0003 20.45C16.6366 20.45 20.5369 17.2936 21.9482 13.0909H12.0003V9.54545H23.6366C23.7703 10.2282 23.8639 10.9418 23.8639 11.6955C23.8639 18.2373 18.5253 23.6364 12.0003 23.6364C5.57303 23.6364 0.363953 18.4273 0.363953 12C0.363953 5.57273 5.57303 0.363636 12.0003 0.363636C14.8812 0.363636 17.4475 1.30909 19.4675 2.87273L16.8666 5.47273C15.9121 4.58182 14.2812 3.81818 12.0003 3.81818C7.61895 3.81818 3.99123 7.28182 3.99123 11.6727C3.99123 16.0636 7.61895 19.5273 12.0003 19.5273Z"
                fill="#4285F4"
              />
              <path
                d="M21.9481 13.0909C21.6797 12.0727 21.233 11.1182 20.6559 10.2636L16.8665 13.0909H21.9481Z"
                fill="#FBBC05"
              />
              <path
                d="M10.2981 20.1727L12.986 16.2727L16.8665 13.0909C15.8647 15.6818 13.3442 17.5273 10.4217 17.5273C9.03444 17.5273 7.74716 17.1182 6.6665 16.4182L3.93079 18.5182C5.64533 20.2 8.05625 21.2273 10.669 21.2273C10.5453 20.8818 10.4217 20.5273 10.2981 20.1727Z"
                fill="#34A853"
              />
              <path
                d="M3.93081 18.5182L6.66653 16.4182C5.78653 15.1091 5.27926 13.5273 5.27926 11.8364C5.27926 10.1455 5.78653 8.56364 6.66653 7.25455L3.93081 5.15454C1.72354 8.24545 1.72354 15.4273 3.93081 18.5182Z"
                fill="#EA4335"
              />
            </svg>
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
