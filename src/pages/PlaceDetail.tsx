/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Star, MapPin, Clock, Info, History, Sparkles, Utensils, ArrowRight } from "lucide-react";
import { Place } from "../types";
import { FOODS, HIDDEN_GEMS } from "../data/mockData";
import { analytics } from "../services/analyticsService";

interface PlaceDetailProps {
  place: Place;
  onBack: () => void;
  onNavigate: (id: string) => void;
}

export default function PlaceDetail({ place, onBack, onNavigate }: PlaceDetailProps) {
  useEffect(() => {
    analytics.trackEvent('view', 'place', 'view_detail', place.name);
    analytics.trackActivity('place_view', `Visitor opened ${place.name}`, { placeId: place.id });
  }, [place]);

  const handleNextStop = (id: string) => {
    analytics.trackEvent('click', 'navigation', 'next_stop', place.name);
    onNavigate(id);
  };
  const nearbyFoods = FOODS.filter(f => place.nearbyFoodIds?.includes(f.id));
  const nextDestination = place.nextDestinationId 
    ? HIDDEN_GEMS.find(p => p.id === place.nextDestinationId)
    : null;

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="relative h-[350px] overflow-hidden">
        <img src={place.image} alt={place.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <button 
          onClick={onBack}
          className="absolute top-6 left-6 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white active:scale-95 transition-transform"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="absolute bottom-8 px-6 text-white w-full">
          <div className="flex justify-between items-end">
            <div>
              <span className="bg-heritage-orange text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider mb-2 inline-block">
                {place.category}
              </span>
              <h1 className="text-3xl font-display font-bold leading-tight">{place.name}</h1>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1">
                  <Star size={14} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-xs font-bold">{place.rating}</span>
                </div>
                <div className="flex items-center gap-1 opacity-80">
                  <MapPin size={14} />
                  <span className="text-xs font-medium">{place.distance}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-8 space-y-8">
        {/* Storytelling SECTION */}
        <section>
          <h2 className="flex items-center gap-2 font-display text-xl font-bold text-heritage-brown mb-4">
            <Sparkles size={20} className="text-heritage-orange" />
            The Story
          </h2>
          <div className="bg-orange-50/50 p-6 rounded-[32px] border border-orange-100 italic text-gray-700 leading-relaxed relative">
            <span className="absolute top-4 left-4 text-4xl text-orange-200 font-serif leading-none opacity-50">"</span>
            <p className="relative z-10 px-4 py-2">
              {place.story || place.description}
            </p>
            <span className="absolute bottom-4 right-4 text-4xl text-orange-200 font-serif leading-none opacity-50">"</span>
          </div>
        </section>

        {/* Info Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-3xl border border-orange-50 shadow-sm flex flex-col items-center text-center">
            <Clock className="text-heritage-orange mb-2" size={24} />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Time Needed</span>
            <span className="text-sm font-bold text-heritage-brown">{place.timeRequired}</span>
          </div>
          <div className="bg-white p-4 rounded-3xl border border-orange-50 shadow-sm flex flex-col items-center text-center">
            <Info className="text-heritage-orange mb-2" size={24} />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Travel Tip</span>
            <span className="text-[10px] font-bold text-heritage-brown">{place.travelNote}</span>
          </div>
        </div>

        {/* History */}
        {place.history && (
          <section>
            <h2 className="flex items-center gap-2 font-display text-xl font-bold text-heritage-brown mb-4">
              <History size={20} className="text-heritage-orange" />
              History & Heritage
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              {place.history}
            </p>
          </section>
        )}

        {/* Nearby Food */}
        {nearbyFoods.length > 0 && (
          <section>
            <h2 className="flex items-center gap-2 font-display text-xl font-bold text-heritage-brown mb-4">
              <Utensils size={20} className="text-heritage-orange" />
              Nearby Flavors
            </h2>
            <div className="space-y-3">
              {nearbyFoods.map(food => (
                <div key={food.id} className="bg-white p-3 rounded-2xl border border-orange-50 flex gap-4 items-center">
                  <img src={food.image} className="w-16 h-16 rounded-xl object-cover" />
                  <div>
                    <h3 className="text-sm font-bold text-heritage-brown">{food.name}</h3>
                    <p className="text-[10px] text-gray-500 line-clamp-1">{food.bestPlace}</p>
                    <span className="text-[10px] font-bold text-heritage-orange mt-1 inline-block uppercase tracking-widest">{food.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Legend */}
        {place.legend && (
          <section className="bg-heritage-brown p-8 rounded-[40px] text-white overflow-hidden relative">
            <div className="relative z-10">
              <h2 className="text-lg font-display font-bold mb-4 opacity-60 uppercase tracking-[0.2em]">Local Legend</h2>
              <p className="text-sm italic leading-relaxed text-orange-50">
                "{place.legend}"
              </p>
            </div>
            <Sparkles className="absolute top-4 right-4 text-white/10" size={80} />
          </section>
        )}

        {/* Next Destination */}
        {nextDestination && (
          <section className="pt-4">
            <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Your Next Stop</h2>
            <button 
              onClick={() => handleNextStop(nextDestination.id)}
              className="w-full bg-white border-2 border-orange-100 p-6 rounded-[32px] group text-left transition-all hover:border-heritage-orange active:scale-95"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold text-heritage-orange uppercase tracking-widest">{place.nextDestinationTime} Drive</span>
                <ArrowRight size={20} className="text-heritage-orange transition-transform group-hover:translate-x-1" />
              </div>
              <h1 className="text-xl font-display font-bold text-heritage-brown">{nextDestination.name}</h1>
              <p className="text-xs text-gray-500 mt-1">{place.nextDestinationDistance} from current location</p>
            </button>
          </section>
        )}
      </div>
    </div>
  );
}
