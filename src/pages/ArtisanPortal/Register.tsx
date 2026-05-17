/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, User, Mail, Lock, Phone, MapPin, Briefcase, Award, Sparkles } from "lucide-react";

interface RegisterProps {
  onBack: () => void;
  onLogin: () => void;
  onSuccess: () => void;
}

export default function SellerRegister({ onBack, onLogin, onSuccess }: RegisterProps) {
  const [formData, setFormData] = useState({
    artisanName: "",
    email: "",
    password: "",
    phoneNumber: "",
    craftType: "Rosewood Inlay",
    experience: "",
    location: "Mysuru",
    bio: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/artisan/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        onSuccess();
      } else {
        setError(data.error || "Registration failed");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-heritage-cream flex flex-col px-6 py-12 pb-24">
      <div className="w-full max-w-sm mx-auto">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 text-sm mb-12 hover:text-heritage-brown transition-colors"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="text-center mb-10">
          <h1 className="font-display text-3xl font-bold text-heritage-brown">Join our Heritage</h1>
          <p className="text-gray-500 text-sm mt-2 font-medium">Showcase your craft to the world</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 border border-red-100 text-red-600 text-xs p-4 rounded-2xl mb-6 text-center font-bold"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-4">Your Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                name="artisanName"
                required
                value={formData.artisanName}
                onChange={handleChange}
                className="w-full bg-white border border-orange-50 p-4 pl-12 rounded-2xl focus:ring-2 focus:ring-heritage-orange focus:outline-none shadow-sm transition-all text-sm font-medium"
                placeholder="Guruprasad M."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-4">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-white border border-orange-50 p-4 pl-12 rounded-2xl focus:ring-2 focus:ring-heritage-orange focus:outline-none shadow-sm transition-all text-sm font-medium"
                  placeholder="name@email.com"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-4">Phone</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  name="phoneNumber"
                  required
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full bg-white border border-orange-50 p-4 pl-12 rounded-2xl focus:ring-2 focus:ring-heritage-orange focus:outline-none shadow-sm transition-all text-sm font-medium"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-4">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-white border border-orange-50 p-4 pl-12 rounded-2xl focus:ring-2 focus:ring-heritage-orange focus:outline-none shadow-sm transition-all text-sm font-medium"
                placeholder="Choose a secure password"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-4">Craft Type</label>
              <div className="relative">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <select 
                  name="craftType"
                  value={formData.craftType}
                  onChange={handleChange}
                  className="w-full bg-white border border-orange-50 p-4 pl-12 rounded-2xl focus:ring-2 focus:ring-heritage-orange focus:outline-none shadow-sm transition-all text-xs font-bold appearance-none"
                >
                  <option>Rosewood Inlay</option>
                  <option>Mysuru Silk</option>
                  <option>Sandalwood Carving</option>
                  <option>Ganjifa Art</option>
                  <option>Pottery</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-4">Experience</label>
              <div className="relative">
                <Award className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  name="experience"
                  required
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full bg-white border border-orange-50 p-4 pl-12 rounded-2xl focus:ring-2 focus:ring-heritage-orange focus:outline-none shadow-sm transition-all text-sm font-medium"
                  placeholder="25 Years"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-4">Workshop Location</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                name="location"
                required
                value={formData.location}
                onChange={handleChange}
                className="w-full bg-white border border-orange-50 p-4 pl-12 rounded-2xl focus:ring-2 focus:ring-heritage-orange focus:outline-none shadow-sm transition-all text-sm font-medium"
                placeholder="Mandi Mohalla, Mysuru"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-4">Your Story (Bio)</label>
            <textarea 
              name="bio"
              required
              rows={4}
              value={formData.bio}
              onChange={handleChange}
              className="w-full bg-white border border-orange-50 p-4 rounded-2xl focus:ring-2 focus:ring-heritage-orange focus:outline-none shadow-sm transition-all text-sm font-medium resize-none leading-relaxed"
              placeholder="Tell us about how you started your craft, your family heritage, and your artistic vision..."
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-heritage-orange text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform disabled:opacity-50 mt-4"
          >
            {loading ? "Creating Shop..." : <><Sparkles size={18} /> Register Workshop</>}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-xs">Already have an account?</p>
          <button 
            onClick={onLogin}
            className="text-heritage-brown font-bold text-sm mt-2 hover:underline tracking-tight"
          >
            Login to your Workshop
          </button>
        </div>
      </div>
    </div>
  );
}
