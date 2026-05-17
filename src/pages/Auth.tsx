/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LogIn, 
  UserPlus, 
  Mail, 
  Lock, 
  User, 
  ChevronRight, 
  ArrowLeft,
  Store,
  ShieldCheck,
  Chrome
} from 'lucide-react';
import { authService } from '../services/authService';
import { UserProfile } from '../types';

interface AuthProps {
  onBack: () => void;
  onSuccess: (user: UserProfile) => void;
}

type AuthMode = 'login' | 'signup' | 'forgot';
type UserRole = 'customer' | 'artisan' | 'admin';

export default function Auth({ onBack, onSuccess }: AuthProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [role, setRole] = useState<UserRole>('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [craftType, setCraftType] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let user: UserProfile;
      if (mode === 'login') {
        user = await authService.loginWithEmail(email, password);
      } else {
        // Prepare metadata for artisan if needed
        const signupData = { email, password, displayName, role, craftType };
        // Pass everything to signup
        user = await authService.signup(email, password, displayName, role);
        
        // If it's an artisan, we might need to sync the craftType to their profile
        if (role === 'artisan' && craftType) {
           await fetch('/api/artisan/profile/update', {
             method: 'POST',
             headers: { 
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${localStorage.getItem('authToken')}`
             },
             body: JSON.stringify({ craftType })
           });
        }
      }
      onSuccess(user);
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const user = await authService.loginWithGoogle();
      onSuccess(user);
    } catch (err: any) {
      setError(err.message || 'Google login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-heritage-cream py-12 px-6 flex flex-col items-center">
      <motion.button
        whileHover={{ x: -4 }}
        onClick={onBack}
        className="self-start mb-8 text-heritage-brown flex items-center gap-2 font-bold"
      >
        <ArrowLeft size={20} />
        <span>Back</span>
      </motion.button>

      <div className="w-full max-w-sm">
        <header className="text-center mb-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-20 h-20 bg-heritage-brown rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-xl rotate-3"
          >
            <ShieldCheck size={40} className="text-heritage-orange" />
          </motion.div>
          <h1 className="text-3xl font-serif text-heritage-brown font-black mb-2">
            {mode === 'login' ? 'Welcome Back' : 'Join the Heritage'}
          </h1>
          <p className="text-heritage-brown/60 italic">
            {mode === 'login' 
              ? 'Access your Mysuru explorer dashboard' 
              : 'Start your authentic Mysuru journey today'}
          </p>
        </header>

        {/* Auth Mode Toggle */}
        <div className="flex bg-heritage-brown/5 p-1 rounded-xl mb-8">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
              mode === 'login' ? 'bg-white shadow-sm text-heritage-brown' : 'text-heritage-brown/40'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setMode('signup')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
              mode === 'signup' ? 'bg-white shadow-sm text-heritage-brown' : 'text-heritage-brown/40'
            }`}
          >
            Signup
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence mode="wait">
            {mode === 'signup' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                {/* Role Selection */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <button
                    type="button"
                    onClick={() => setRole('customer')}
                    className={`p-3 rounded-xl border-2 flex flex-col items-center gap-1 transition-all ${
                      role === 'customer' 
                        ? 'border-heritage-orange bg-heritage-orange/5 text-heritage-brown' 
                        : 'border-transparent bg-white text-heritage-brown/40'
                    }`}
                  >
                    <User size={20} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Traveler</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('artisan')}
                    className={`p-3 rounded-xl border-2 flex flex-col items-center gap-1 transition-all ${
                      role === 'artisan' 
                        ? 'border-heritage-orange bg-heritage-orange/5 text-heritage-brown' 
                        : 'border-transparent bg-white text-heritage-brown/40'
                    }`}
                  >
                    <Store size={20} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Artisan</span>
                  </button>
                </div>

                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-heritage-brown/40 group-focus-within:text-heritage-orange transition-colors" size={18} />
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white border border-transparent focus:border-heritage-orange rounded-xl text-heritage-brown outline-none transition-all shadow-sm"
                  />
                </div>

                {role === 'artisan' && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="relative group mt-4"
                  >
                    <Store className="absolute left-4 top-1/2 -translate-y-1/2 text-heritage-brown/40 group-focus-within:text-heritage-orange transition-colors" size={18} />
                    <input
                      type="text"
                      required
                      placeholder="Craft Specialty (e.g. Silk Weaving)"
                      value={craftType}
                      onChange={(e) => setCraftType(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-white border border-transparent focus:border-heritage-orange rounded-xl text-heritage-brown outline-none transition-all shadow-sm"
                    />
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-heritage-brown/40 group-focus-within:text-heritage-orange transition-colors" size={18} />
            <input
              type="email"
              required
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-transparent focus:border-heritage-orange rounded-xl text-heritage-brown outline-none transition-all shadow-sm"
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-heritage-brown/40 group-focus-within:text-heritage-orange transition-colors" size={18} />
            <input
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-transparent focus:border-heritage-orange rounded-xl text-heritage-brown outline-none transition-all shadow-sm"
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-xs font-bold text-center"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-heritage-brown text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-heritage-brown/20 hover:bg-heritage-brown/90 transition-all disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>{mode === 'login' ? 'Login to Explorer' : 'Create Heritage Account'}</span>
                <ChevronRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="mt-8">
          <div className="relative flex items-center mb-8">
            <div className="flex-1 h-[1px] bg-heritage-brown/10"></div>
            <span className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-heritage-brown/40">OR CONTINUE WITH</span>
            <div className="flex-1 h-[1px] bg-heritage-brown/10"></div>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-4 bg-white border border-heritage-brown/10 text-heritage-brown rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-heritage-brown/5 transition-all shadow-sm"
          >
            <div className="w-6 h-6 bg-white border border-heritage-brown/5 rounded flex items-center justify-center">
               <Chrome size={16} className="text-heritage-brown" />
            </div>
            <span>Continue with Google</span>
          </button>
        </div>

        <p className="mt-10 text-center text-xs text-heritage-brown/40 font-medium">
          {mode === 'login' ? (
            <>
              Don't have an account?{' '}
              <button onClick={() => setMode('signup')} className="text-heritage-orange font-bold hover:underline">Sign up now</button>
            </>
          ) : (
            <>
              Already a member?{' '}
              <button onClick={() => setMode('login')} className="text-heritage-orange font-bold hover:underline">Log in</button>
            </>
          )}
        </p>

        {mode === 'login' && (
          <button className="w-full mt-4 text-[10px] font-black uppercase tracking-widest text-heritage-brown/30 hover:text-heritage-brown/60 transition-colors">
            Forgot your password?
          </button>
        )}
      </div>

      <footer className="mt-auto pt-10 text-[10px] font-black tracking-widest uppercase text-heritage-brown/20 text-center">
        Secured by Heritage Shield • Protected Connection
      </footer>
    </div>
  );
}
