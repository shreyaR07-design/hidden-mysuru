/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Mail, Lock, LogIn, Sparkles } from "lucide-react";

interface LoginProps {
  onBack: () => void;
  onRegister: () => void;
  onSuccess: (token: string, user: any) => void;
}

export default function SellerLogin({ onBack, onRegister, onSuccess }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/artisan/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        onSuccess(data.token, data.artisan);
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-heritage-cream flex flex-col items-center px-6 py-12">
      <div className="w-full max-w-sm">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 text-sm mb-12 hover:text-heritage-brown transition-colors"
        >
          <ArrowLeft size={16} /> Back to Shop
        </button>

        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-heritage-brown rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl">
            <Sparkles className="text-heritage-orange" size={32} />
          </div>
          <h1 className="font-display text-3xl font-bold text-heritage-brown">Artisan Portal</h1>
          <p className="text-gray-500 text-sm mt-2 font-medium">Log in to manage your workshop</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-100 text-red-600 text-xs p-4 rounded-2xl mb-6 text-center font-bold"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-4">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-orange-50 p-4 pl-12 rounded-2xl focus:ring-2 focus:ring-heritage-orange focus:outline-none shadow-sm transition-all text-sm"
                placeholder="artisan@mysuru.com"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-4">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-orange-50 p-4 pl-12 rounded-2xl focus:ring-2 focus:ring-heritage-orange focus:outline-none shadow-sm transition-all text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-heritage-brown text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform disabled:opacity-50"
          >
            {loading ? "Logging in..." : <><LogIn size={18} /> Enter Workshop</>}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-xs">Don't have a shop account?</p>
          <button 
            onClick={onRegister}
            className="text-heritage-orange font-bold text-sm mt-2 hover:underline tracking-tight"
          >
            Register as an Artisan Partner
          </button>
        </div>
      </div>
    </div>
  );
}
