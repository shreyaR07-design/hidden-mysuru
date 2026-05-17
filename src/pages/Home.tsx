/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { ArrowRight, Star, Compass, Utensils, Users } from "lucide-react";
import { HIDDEN_GEMS, ARTISANS, FOODS } from "../data/mockData";
import { analytics } from "../services/analyticsService";
import PlaceCard from "../components/PlaceCard";
import ArtisanCard from "../components/ArtisanCard";
import FoodCard from "../components/FoodCard";
import { Page, Place } from "../types";

interface HomeProps {
  setPage: (page: Page) => void;
  onPlaceClick: (place: Place) => void;
}

export default function Home({ setPage, onPlaceClick }: HomeProps) {
  return (
    <div className="pb-24">
      {/* Hero Banner */}
      <section className="relative h-[400px] flex items-center px-6 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1590766948562-3f69aa15b0b7?q=80&w=1200&auto=format&fit=crop"
          alt="Mysore Palace"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover brightness-50"
        />
        <div className="relative z-10 max-w-sm">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-orange-300 font-bold uppercase tracking-[0.2em] text-[10px] mb-3"
          >
            Welcome to the heritage city
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-display font-bold text-white mb-6 leading-tight"
          >
            Discover the <span className="text-heritage-orange italic">hidden heritage</span> of Mysuru
          </motion.h1>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setPage('discover')}
            className="bg-heritage-orange text-white px-8 py-3 rounded-full font-bold text-sm flex items-center gap-2 shadow-lg shadow-orange-900/40"
          >
            Explore Now <ArrowRight size={16} />
          </motion.button>
        </div>
      </section>

      {/* Quick Links / Stats */}
      <section className="flex justify-between px-6 -mt-10 relative z-20 gap-4 overflow-x-auto no-scrollbar pb-4">
         {[
           { icon: Compass, label: '30+ GEMS', color: 'bg-blue-50' },
           { icon: Users, label: '50+ ARTISANS', color: 'bg-green-50' },
           { icon: Utensils, label: '100+ FLAVORS', color: 'bg-orange-50' },
         ].map((item, idx) => (
           <div key={idx} className={`${item.color} p-4 rounded-3xl flex-1 min-w-[120px] shadow-sm border border-white/50 backdrop-blur-sm flex flex-col items-center gap-2`}>
              <item.icon size={20} className="text-heritage-brown" />
              <span className="text-[10px] font-black text-heritage-brown whitespace-nowrap tracking-wider">{item.label}</span>
           </div>
         ))}
      </section>

      {/* Featured Hidden Gems */}
      <section className="mt-8 px-6">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="font-display text-2xl font-bold text-heritage-brown">Hidden Gems</h2>
            <p className="text-xs text-gray-500 font-medium">Lesser known spots you must visit</p>
          </div>
          <button onClick={() => setPage('discover')} className="text-xs font-bold text-heritage-orange flex items-center gap-1 uppercase tracking-widest">
            View All <ArrowRight size={12} />
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-6 px-6">
          {HIDDEN_GEMS.filter(p => !!p.image && !p.image.includes('placeholder')).slice(0, 5).map((place) => (
            <div key={place.id} className="min-w-[280px]">
              <PlaceCard 
                place={place} 
                compact 
                onExplore={onPlaceClick}
                onNavigate={(id) => onPlaceClick(HIDDEN_GEMS.find(p => p.id === id) || place)}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Featured Artisans */}
      <section className="mt-12 px-6">
        <div className="flex justify-between items-end mb-6">
          <div>
             <h2 className="font-display text-2xl font-bold text-heritage-brown">Meet the Makers</h2>
             <p className="text-xs text-gray-500 font-medium">Custodians of Mysuru's culture</p>
          </div>
          <button onClick={() => setPage('artisans')} className="text-xs font-bold text-heritage-orange flex items-center gap-1 uppercase tracking-widest">
            Meet More <ArrowRight size={12} />
          </button>
        </div>
        <div className="space-y-4">
          {ARTISANS.filter(a => !!a.image && !a.image.includes('placeholder')).slice(0, 2).map((artisan) => (
            <ArtisanCard key={artisan.id} artisan={artisan} />
          ))}
        </div>
      </section>

      {/* Planner CTA */}
      <section className="mt-12 px-6">
        <div className="bg-gradient-to-br from-heritage-brown to-orange-950 p-8 rounded-[40px] text-white overflow-hidden relative shadow-2xl">
           <div className="relative z-10">
              <h2 className="text-2xl font-display font-bold mb-2">Ready for an adventure?</h2>
              <p className="text-sm text-orange-100/70 mb-6 max-w-[200px]">Let our smart planner create the perfect itinerary for you.</p>
              <button 
                onClick={() => setPage('planner')}
                className="bg-white text-heritage-brown px-8 py-3 rounded-full font-bold text-sm shadow-xl"
              >
                Plan My Trip
              </button>
           </div>
           <div className="absolute top-0 right-0 w-32 h-32 bg-heritage-orange/20 rounded-full blur-3xl -translate-y-10 translate-x-10"></div>
        </div>
      </section>

      {/* Featured Foods */}
      <section className="mt-12 px-6">
        <div className="flex justify-between items-end mb-6">
           <div>
              <h2 className="font-display text-2xl font-bold text-heritage-brown">Authentic Flavors</h2>
              <p className="text-xs text-gray-500 font-medium">Taste of royalty in every bite</p>
           </div>
           <button onClick={() => setPage('food')} className="text-xs font-bold text-heritage-orange flex items-center gap-1 uppercase tracking-widest">
             Full Menu <ArrowRight size={12} />
           </button>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {FOODS.filter(f => !!f.image && !f.image.includes('placeholder')).slice(0, 2).map((food) => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>
      </section>

      {/* Artisan Seller Portal CTA */}
      <section className="mt-16 px-6 pb-8 border-t border-orange-50 pt-12">
        <div className="text-center">
            <div className="inline-block p-3 rounded-2xl bg-orange-50 text-heritage-orange mb-4">
                <Users size={24} />
            </div>
            <h3 className="font-display text-xl font-bold text-heritage-brown">Are you a local artisan?</h3>
            <p className="text-xs text-gray-400 mt-2 mb-6 px-4">Join our platform and share your handcrafted treasures with travelers worldwide.</p>
            <button 
                onClick={() => setPage('seller-login')}
                className="text-sm font-bold text-heritage-orange px-6 py-2 rounded-full border border-heritage-orange hover:bg-heritage-orange hover:text-white transition-all active:scale-95"
            >
                Artisan Seller Portal
            </button>
            <div className="mt-8 pt-8 border-t border-orange-50/50">
                <button 
                    onClick={() => {
                        analytics.trackEvent('click', 'admin', 'portal_access');
                        setPage('admin-login');
                    }}
                    className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-300 hover:text-heritage-brown transition-colors"
                >
                    System Administration
                </button>
            </div>
        </div>
      </section>
    </div>
  );
}
