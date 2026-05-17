/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Star, MapPin, Clock, BookOpen, Utensils, ArrowRight, History, Info, Sparkles } from "lucide-react";
import { Place } from "../types";
import { HIDDEN_GEMS, FOODS } from "../data/mockData";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

interface PlaceCardProps {
  place: Place;
  compact?: boolean;
  key?: string | number;
  onExplore?: (place: Place) => void;
  onNavigate?: (id: string) => void;
}

export default function PlaceCard({ place, compact = false, onExplore, onNavigate }: PlaceCardProps) {
  const [showStory, setShowStory] = useState(false);

  const nextDestination = place.nextDestinationId 
    ? HIDDEN_GEMS.find(p => p.id === place.nextDestinationId)
    : null;

  const nearbyFoods = place.nearbyFoodIds
    ? FOODS.filter(f => place.nearbyFoodIds?.includes(f.id))
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={compact ? { y: -4 } : {}}
      onClick={() => compact && onExplore?.(place)}
      className={`bg-white rounded-3xl overflow-hidden shadow-sm border border-orange-50 group w-full flex flex-col h-full ${compact ? 'cursor-pointer' : ''}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden shrink-0">
        <img
          src={place.image}
          alt={place.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-3 left-3 bg-heritage-white/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1">
          <Star size={10} className="text-yellow-500 fill-yellow-500" />
          <span className="text-[10px] font-bold">{place.rating}</span>
        </div>
        <div className="absolute top-3 right-3 bg-heritage-orange px-2 py-0.5 rounded-full">
          <span className="text-[8px] font-bold text-white uppercase tracking-wider">{place.category}</span>
        </div>
      </div>
      <div className="p-3 flex flex-col flex-grow">
        <div className="flex flex-col gap-1 mb-2">
          <div className="flex items-center justify-between gap-2">
            <h3 className={`font-display font-bold text-heritage-brown line-clamp-1 ${compact ? 'text-sm' : 'text-lg'}`}>{place.name}</h3>
            {!compact && (
               <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onExplore?.(place);
                }}
                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50 text-heritage-orange transition-colors hover:bg-heritage-orange hover:text-white text-[10px] font-bold uppercase tracking-widest active:scale-95 transition-transform"
               >
                 <BookOpen size={14} />
                 Explore More
               </button>
            )}
          </div>
          <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{place.distance}</span>
        </div>
        <p className={`text-gray-600 line-clamp-2 mb-3 leading-relaxed flex-grow ${compact ? 'text-[10px]' : 'text-sm'}`}>
          {place.description}
        </p>

        <AnimatePresence>
          {showStory && !compact && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-2 pb-4 space-y-4 border-t border-orange-50 mt-2">
                {place.story && (
                  <div>
                    <h4 className="flex items-center gap-1.5 text-[10px] font-bold text-heritage-orange uppercase tracking-widest mb-1.5">
                      <Sparkles size={12} /> The Story
                    </h4>
                    <p className="text-xs text-gray-600 italic leading-relaxed bg-orange-50/50 p-2.5 rounded-2xl">
                      "{place.story}"
                    </p>
                  </div>
                )}
                
                {place.history && (
                  <div>
                    <h4 className="flex items-center gap-1.5 text-[10px] font-bold text-heritage-brown uppercase tracking-widest mb-1.5">
                      <History size={12} /> History & Heritage
                    </h4>
                    <p className="text-xs text-gray-600 leading-relaxed border-l-2 border-orange-100 pl-3">
                      {place.history}
                    </p>
                  </div>
                )}

                {place.legend && (
                  <div>
                    <h4 className="flex items-center gap-1.5 text-[10px] font-bold text-heritage-brown uppercase tracking-widest mb-1.5">
                      <Info size={12} /> Local Legend
                    </h4>
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      {place.legend}
                    </p>
                  </div>
                )}

                {nearbyFoods.length > 0 && (
                  <div className="bg-orange-50/30 rounded-2xl p-3 border border-orange-50">
                    <h4 className="flex items-center gap-1.5 text-[10px] font-bold text-heritage-brown uppercase tracking-widest mb-2">
                      <Utensils size={12} /> Nearby Recommendations
                    </h4>
                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                      {nearbyFoods.map(food => (
                        <div key={food.id} className="bg-white px-2 py-1.5 rounded-lg border border-orange-100 shrink-0 min-w-[100px]">
                          <p className="text-[10px] font-bold text-heritage-brown line-clamp-1">{food.name}</p>
                          <p className="text-[8px] text-heritage-orange font-bold uppercase">{food.category}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {!compact && (
          <div className="space-y-3 pt-3 border-t border-orange-50 mt-auto">
             <div className="flex items-center justify-between text-gray-500">
               <div className="flex items-center gap-1.5 ">
                 <Clock size={14} className="text-heritage-orange" />
                 <span className="text-xs font-medium">{place.timeRequired}</span>
               </div>
               <div className="flex items-center gap-1.5">
                 <MapPin size={14} className="text-heritage-orange" />
                 <span className="text-xs font-medium uppercase tracking-widest text-[10px]">{place.category}</span>
               </div>
             </div>

             {nextDestination && (
               <div className="bg-heritage-brown rounded-2xl p-3 text-white">
                 <div className="flex justify-between items-center mb-1">
                    <span className="text-[8px] font-bold uppercase tracking-widest opacity-60">Next Destination</span>
                    <span className="text-[8px] font-bold bg-white/20 px-1.5 py-0.5 rounded uppercase">{place.nextDestinationTime}</span>
                 </div>
                 <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (place.nextDestinationId) onNavigate?.(place.nextDestinationId);
                    }}
                    className="flex items-center justify-between group/nav cursor-pointer"
                 >
                    <div>
                      <p className="text-xs font-bold leading-tight">{nextDestination.name}</p>
                      <p className="text-[9px] opacity-70 mt-0.5">{place.nextDestinationDistance} away</p>
                    </div>
                    <ArrowRight size={16} className="text-heritage-orange transition-transform group-hover/nav:translate-x-1" />
                 </div>
               </div>
             )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
