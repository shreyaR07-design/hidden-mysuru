/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FOODS } from "../data/mockData";
import FoodCard from "../components/FoodCard";
import { Coffee, Pizza, Cherry, ChefHat } from "lucide-react";

export default function Food() {
  return (
    <div className="pt-6 pb-24 min-h-screen bg-heritage-cream">
      <div className="px-6 mb-8">
        <h1 className="font-display text-3xl font-bold text-heritage-brown mb-2">A Taste of Royalty</h1>
        <p className="text-sm text-gray-500 font-medium mb-8">Iconic flavors from the heart of Southern India</p>

        <div className="bg-heritage-orange p-8 rounded-[40px] text-white shadow-xl relative overflow-hidden mb-10">
           <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                 <ChefHat size={18} />
                 <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">Food Guide</span>
              </div>
              <h2 className="text-2xl font-display font-bold leading-tight mb-2">Legendary Recipes <br/>Passed Down</h2>
              <p className="text-sm text-orange-100/80 font-medium leading-relaxed max-w-[200px]">From palace sweets to street dosas, taste the history.</p>
           </div>
           <Utensils size={120} className="absolute -bottom-10 -right-10 text-white/10 rotate-12" />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-10">
           <div className="bg-white p-4 rounded-3xl border border-orange-50 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center text-heritage-orange">
                <Coffee size={20} />
              </div>
              <div className="leading-tight">
                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Iconic</p>
                 <p className="text-xs font-bold text-heritage-brown">Filter Coffee</p>
              </div>
           </div>
           <div className="bg-white p-4 rounded-3xl border border-orange-50 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center text-heritage-orange">
                <Cherry size={20} />
              </div>
              <div className="leading-tight">
                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sweet</p>
                 <p className="text-xs font-bold text-heritage-brown">Mysore Pak</p>
              </div>
           </div>
        </div>

        <h2 className="font-display text-xl font-bold text-heritage-brown mb-6 flex items-center gap-2">
           <span className="w-8 h-px bg-orange-200"></span> Recommend for You
        </h2>

        <div className="grid grid-cols-2 gap-4">
           {FOODS.filter(f => f.image && !f.image.includes('placeholder')).map((food) => (
             <div key={food.id} className="flex h-full">
               <FoodCard food={food} />
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}

function Utensils({ size, className }: { size: number, className: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
      <path d="M7 2v20" />
      <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
    </svg>
  );
}
