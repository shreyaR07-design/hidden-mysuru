/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Search, SlidersHorizontal, MapPin } from "lucide-react";
import { HIDDEN_GEMS } from "../data/mockData";
import PlaceCard from "../components/PlaceCard";
import { motion, AnimatePresence } from "motion/react";
import { Place } from "../types";

const categories = ['All', 'Nature', 'Heritage', 'Religious', 'Villages & Crafts', 'Adventure'];

interface DiscoverProps {
  onPlaceClick: (place: Place) => void;
}

export default function Discover({ onPlaceClick }: DiscoverProps) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPlaces = HIDDEN_GEMS.filter(place => {
    const matchesCategory = activeCategory === 'All' || place.category === activeCategory;
    const matchesSearch = place.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          place.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch && place.image && !place.image.includes('placeholder') && !place.image.includes('images.pexels.com');
  });

  return (
    <div className="pt-6 pb-24 min-h-screen bg-heritage-cream">
      <div className="px-6 mb-8">
        <h1 className="font-display text-3xl font-bold text-heritage-brown mb-2">Explore Secrets</h1>
        <p className="text-sm text-gray-500 font-medium mb-6">Find the soul of Mysuru beyond the palace</p>

        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search places, stories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-orange-100 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-heritage-orange/20 shadow-sm"
          />
          <button className="absolute right-3 top-2.5 bg-orange-50 p-2 rounded-xl text-heritage-orange border border-orange-100">
            <SlidersHorizontal size={16} />
          </button>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-6 px-6 pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-heritage-orange text-white shadow-lg shadow-orange-900/20'
                  : 'bg-white text-gray-500 border border-orange-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6">
        <div className="grid grid-cols-1 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredPlaces.length > 0 ? (
              filteredPlaces.map((place) => (
                <div key={place.id}>
                  <PlaceCard 
                    place={place} 
                    onExplore={onPlaceClick}
                    onNavigate={(id) => onPlaceClick(HIDDEN_GEMS.find(p => p.id === id) || place)}
                  />
                </div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-2 flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="bg-white p-6 rounded-full mb-4 shadow-sm">
                   <MapPin size={40} className="text-orange-200" />
                </div>
                <h3 className="font-display text-xl font-bold text-heritage-brown mb-2">No Hidden Gems Found</h3>
                <p className="text-sm text-gray-400">Try adjusting your filters or search keywords</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
