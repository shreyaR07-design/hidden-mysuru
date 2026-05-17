/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Itinerary } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Calendar, Wallet, Heart, ChefHat, Clock, MapPin, Loader2, Send } from "lucide-react";
import { analytics } from "../services/analyticsService";

interface PlannerProps {
  onNotify?: (msg: string) => void;
}

export default function Planner({ onNotify }: PlannerProps) {
  const [days, setDays] = useState(1);
  const [budget, setBudget] = useState('Standard');
  const [interests, setInterests] = useState<string[]>(['Heritage']);
  const [foodPreference, setFoodPreference] = useState('Vegetarian');
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);

  const toggleInterest = (interest: string) => {
    setInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest) 
        : [...prev, interest]
    );
  };

  const generateItinerary = async () => {
    setLoading(true);
    setItinerary(null);
    analytics.trackActivity('trip_planner', 'Generated a custom itinerary', {
        days, budget, interests, foodPreference
    });
    try {
      const response = await fetch('/api/plan-trip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ days, budget, interests, foodPreference })
      });
      const data = await response.json();
      setItinerary(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-6 pb-32 min-h-screen bg-heritage-cream">
      <div className="px-6 mb-8">
        <h1 className="font-display text-3xl font-bold text-heritage-brown mb-2">Smart Planner</h1>
        <p className="text-sm text-gray-500 font-medium mb-8">Let AI curate your perfect Mysuru experience</p>

        {/* Configuration */}
        <div className="bg-white rounded-[40px] p-6 shadow-sm border border-orange-50 space-y-8 mb-10">
          {/* Days Selection */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-heritage-brown uppercase tracking-widest mb-4">
               <Calendar size={14} className="text-heritage-orange" /> Duration
            </label>
            <div className="flex gap-3">
               {[1, 2, 3].map(d => (
                 <button
                   key={d}
                   onClick={() => setDays(d)}
                   className={`flex-1 py-3 rounded-2xl font-bold text-sm transition-all ${
                     days === d ? 'bg-heritage-orange text-white' : 'bg-orange-50 text-heritage-brown'
                   }`}
                 >
                   {d} Day{d > 1 ? 's' : ''}
                 </button>
               ))}
            </div>
          </div>

          {/* Budget Selection */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-heritage-brown uppercase tracking-widest mb-4">
               <Wallet size={14} className="text-heritage-orange" /> Budget
            </label>
            <div className="flex gap-3">
               {['Budget', 'Standard', 'Luxury'].map(b => (
                 <button
                   key={b}
                   onClick={() => setBudget(b)}
                   className={`flex-1 py-3 rounded-2xl font-bold text-sm transition-all ${
                     budget === b ? 'bg-heritage-brown text-white' : 'bg-orange-50 text-heritage-brown'
                   }`}
                 >
                   {b}
                 </button>
               ))}
            </div>
          </div>

          {/* Interests */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-heritage-brown uppercase tracking-widest mb-4">
               <Heart size={14} className="text-heritage-orange" /> Interests
            </label>
            <div className="flex flex-wrap gap-2">
               {['Heritage', 'Nature', 'Food', 'Crafts', 'Adventure'].map(i => (
                 <button
                   key={i}
                   onClick={() => toggleInterest(i)}
                   className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                     interests.includes(i) 
                      ? 'bg-heritage-orange text-white border-heritage-orange' 
                      : 'bg-white text-gray-500 border-orange-100'
                   }`}
                 >
                   {i}
                 </button>
               ))}
            </div>
          </div>

           {/* Food Preference */}
           <div>
            <label className="flex items-center gap-2 text-xs font-bold text-heritage-brown uppercase tracking-widest mb-4">
               <ChefHat size={14} className="text-heritage-orange" /> Food Preference
            </label>
            <div className="flex gap-3">
               {['Vegetarian', 'Non-Veg', 'No Preference'].map(f => (
                 <button
                   key={f}
                   onClick={() => setFoodPreference(f)}
                   className={`flex-1 py-3 rounded-2xl font-bold text-xs transition-all ${
                    foodPreference === f ? 'bg-heritage-brown text-white' : 'bg-orange-50 text-heritage-brown'
                   }`}
                 >
                   {f}
                 </button>
               ))}
            </div>
          </div>

          <button
            onClick={generateItinerary}
            disabled={loading}
            className="w-full bg-heritage-orange text-white py-4 rounded-3xl font-bold text-sm shadow-xl shadow-orange-900/20 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <> <Loader2 size={18} className="animate-spin" /> Crafting Itinerary...</>
            ) : (
              <> <Sparkles size={18} /> Generate My Itinerary</>
            )}
          </button>
        </div>

        {/* Results */}
        <AnimatePresence>
          {itinerary && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              <h2 className="font-display text-2xl font-bold text-heritage-brown flex items-center gap-3">
                 <span className="w-10 h-[2px] bg-heritage-orange rounded-full"></span> Your Custom Journey
              </h2>
              
              {itinerary.days?.map((dayPlan, dayIdx) => (
                <div key={dayIdx} className="space-y-4">
                   <div className="flex items-center gap-3 px-2">
                      <div className="w-10 h-10 rounded-full bg-heritage-brown text-white flex items-center justify-center font-bold text-sm">0{dayPlan.day}</div>
                      <h3 className="text-lg font-display font-bold text-heritage-brown tracking-tight">Day {dayPlan.day} Experience</h3>
                   </div>
                   
                   <div className="grid grid-cols-1 gap-4">
                      {dayPlan.activities?.map((activity, actIdx) => (
                        <div key={actIdx} className="bg-white p-5 rounded-[32px] border border-orange-50 shadow-sm relative overflow-hidden">
                           <div className="absolute top-0 right-0 py-2 px-6 bg-orange-50/50 rounded-bl-[20px] text-[10px] font-bold text-heritage-orange tracking-widest uppercase">
                              {activity.time}
                           </div>
                           <h4 className="font-bold text-heritage-brown mb-2 pr-20">{activity.title}</h4>
                           <div className="flex items-center gap-1.5 text-heritage-orange mb-3">
                              <MapPin size={12} />
                              <span className="text-[10px] font-bold uppercase tracking-widest">{activity.location}</span>
                           </div>
                           <p className="text-xs text-gray-500 leading-relaxed font-medium mb-4">
                              {activity.description}
                           </p>
                           <div className="flex items-center gap-2 pt-3 border-t border-gray-50">
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest tracking-tighter">Est. Cost:</span>
                              <span className="text-xs font-bold text-heritage-brown">{activity.estimatedCost}</span>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              ))}

              <div className="bg-orange-50 p-6 rounded-[32px] border border-orange-100 flex items-center justify-between">
                 <p className="text-xs font-bold text-heritage-brown">Ready to share this plan?</p>
                 <button 
                  onClick={() => onNotify?.("Itinerary link copied to clipboard!")}
                  className="bg-white p-3 rounded-full text-heritage-orange shadow-sm active:scale-95 transition-transform"
                 >
                    <Send size={18} />
                 </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
