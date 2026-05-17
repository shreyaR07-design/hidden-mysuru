/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import MapComponent, { MapFilters } from "../components/MapComponent";
import { HIDDEN_GEMS } from "../data/mockData";
import PlaceCard from "../components/PlaceCard";
import { motion, AnimatePresence } from "motion/react";
import { Navigation, Filter, X, Check } from "lucide-react";

const MAP_PIN_IDS = [
  'chamundi-hills',
  'shivanasamudra-falls',
  'chennakesava-temple',
  'br-hills',
  'talakadu-sands',
  'ranganathittu'
];

export default function MapPage() {
  const featuredPlace = HIDDEN_GEMS.find(h => h.id === MAP_PIN_IDS[0]);
  const otherPlaces = MAP_PIN_IDS.slice(1).map(id => HIDDEN_GEMS.find(h => h.id === id)).filter(Boolean);

  const [filters, setFilters] = useState<MapFilters>({
    showRoutes: true,
    showFood: true,
    showTimes: true
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const toggleFilter = (key: keyof MapFilters) => {
    setFilters(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-heritage-cream pb-32">
      {/* Header Area */}
      <div className="px-6 pt-8 pb-4">
        <div className="flex justify-between items-end mb-2">
          <div className="relative z-10">
            <h1 className="font-display text-4xl font-bold text-heritage-brown">Heritage Map</h1>
            <p className="text-sm text-gray-500 font-medium">Explore the soul of Mysuru</p>
          </div>
          <div className="flex gap-2 relative z-50">
             <button 
               onClick={() => setIsFilterOpen(!isFilterOpen)}
               className={`p-3 rounded-2xl transition-colors ${isFilterOpen ? 'bg-heritage-brown text-white' : 'bg-heritage-orange/10 text-heritage-orange'}`}
             >
                {isFilterOpen ? <X size={24} /> : <Filter size={24} />}
             </button>
             <div className="bg-heritage-orange/10 p-3 rounded-2xl">
                <Navigation size={24} className="text-heritage-orange" />
             </div>

             {/* Filter Dropdown */}
             <AnimatePresence>
               {isFilterOpen && (
                 <motion.div
                   initial={{ opacity: 0, y: 10, scale: 0.95 }}
                   animate={{ opacity: 1, y: 0, scale: 1 }}
                   exit={{ opacity: 0, y: 10, scale: 0.95 }}
                   className="absolute top-full right-0 mt-3 w-64 bg-white rounded-3xl shadow-2xl border border-orange-50 p-5 z-50"
                 >
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Map Filters</h3>
                    <div className="space-y-3">
                       {[
                         { id: 'showRoutes', label: 'Travel Routes' },
                         { id: 'showFood', label: 'Food Stops' },
                         { id: 'showTimes', label: 'Time Badges' },
                       ].map((item) => (
                         <button
                           key={item.id}
                           onClick={() => toggleFilter(item.id as keyof MapFilters)}
                           className="flex items-center justify-between w-full p-3 rounded-2xl bg-orange-50/50 hover:bg-orange-50 transition-colors"
                         >
                            <span className="text-sm font-bold text-heritage-brown">{item.label}</span>
                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${filters[item.id as keyof MapFilters] ? 'bg-heritage-orange text-white' : 'bg-white border border-orange-100'}`}>
                               {filters[item.id as keyof MapFilters] && <Check size={14} />}
                            </div>
                         </button>
                       ))}
                    </div>
                 </motion.div>
               )}
             </AnimatePresence>
          </div>
        </div>
      </div>
      
      {/* Map Section */}
      <div className="px-6 mb-8">
        <div className="h-[350px] w-full rounded-[40px] overflow-hidden shadow-lg border border-orange-100">
           <MapComponent filters={filters} />
        </div>
      </div>

      {/* Featured Destination */}
      <div className="px-6 mb-10">
        <h2 className="font-display text-xl font-bold text-heritage-brown mb-4 flex items-center gap-2">
           <span className="w-8 h-px bg-orange-200"></span> Featured Highlight
        </h2>
        {featuredPlace && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <PlaceCard place={featuredPlace} />
          </motion.div>
        )}
      </div>

      {/* Other Destinations Grid */}
      <div className="px-6">
        <h2 className="font-display text-xl font-bold text-heritage-brown mb-4 flex items-center gap-2">
           <span className="w-8 h-px bg-orange-200"></span> Nearby Wonders
        </h2>
        <div className="grid grid-cols-2 gap-4">
           {otherPlaces.map((place, idx) => (
             <motion.div 
               key={place!.id}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: idx * 0.1 }}
               className="flex h-full"
             >
                <div className="w-full flex">
                   <PlaceCard place={place!} compact />
                </div>
             </motion.div>
           ))}
        </div>
      </div>
    </div>
  );
}
