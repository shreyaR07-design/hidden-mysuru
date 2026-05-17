/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Package, MapPin, ShoppingBag, ShoppingCart, Info, BookOpen } from "lucide-react";
import { Artisan, Product } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

interface ArtisanCardProps {
  artisan: Artisan;
  key?: string | number;
  onProductClick?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
}

export default function ArtisanCard({ artisan, onProductClick, onAddToCart }: ArtisanCardProps) {
  const [showStory, setShowStory] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-3xl overflow-hidden shadow-sm border border-orange-50 p-4"
    >
      <div className="flex gap-4 mb-4">
        <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-heritage-orange/20 shrink-0">
          <img
            src={artisan.image}
            alt={artisan.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col justify-center flex-grow">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-bold text-heritage-brown">{artisan.name}</h3>
            <span className="bg-orange-100 text-heritage-orange text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
              {artisan.experience} EXP
            </span>
          </div>
          <p className="text-sm font-medium text-heritage-orange uppercase tracking-wide">{artisan.craft}</p>
          <div className="flex items-center gap-1 text-gray-400 mt-1">
            <MapPin size={12} />
            <span className="text-[10px] font-medium">{artisan.location}</span>
          </div>
        </div>
      </div>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600 italic leading-relaxed mb-2">
          "{artisan.about}"
        </p>
        
        <button 
          onClick={() => setShowStory(!showStory)}
          className="flex items-center gap-1.5 text-xs font-bold text-heritage-orange hover:opacity-80 transition-opacity"
        >
          {showStory ? <Info size={14} /> : <BookOpen size={14} />}
          {showStory ? "Show About" : "Discover the Story"}
        </button>

        <AnimatePresence>
          {showStory && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-3 pb-1 space-y-3">
                {artisan.story && (
                  <div>
                    <h4 className="text-[10px] font-bold text-heritage-brown uppercase tracking-widest mb-1">Modern Story</h4>
                    <p className="text-xs text-gray-600 bg-orange-50/30 p-2 rounded-xl">{artisan.story}</p>
                  </div>
                )}
                {artisan.history && (
                  <div>
                    <h4 className="text-[10px] font-bold text-heritage-brown uppercase tracking-widest mb-1">Craft History</h4>
                    <p className="text-xs text-gray-600 border-l-2 border-orange-100 pl-3">{artisan.history}</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="bg-orange-50/50 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Package size={14} className="text-heritage-orange" />
          <span className="text-xs font-bold text-heritage-brown uppercase tracking-widest">Artisan Product Shop</span>
        </div>
        
        <div className="space-y-3">
          {artisan.products.map((product) => (
            <div key={product.id} className="bg-white rounded-xl p-3 border border-orange-100 flex gap-3">
              <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 cursor-pointer" onClick={() => onProductClick?.(product)}>
                <img src={product.image} alt={product.name} referrerPolicy="no-referrer" className="w-full h-full object-cover shadow-sm active:scale-95 transition-transform" />
              </div>
              <div className="flex-grow min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="text-xs font-bold text-heritage-brown truncate pr-2 cursor-pointer hover:text-heritage-orange transition-colors" onClick={() => onProductClick?.(product)}>{product.name}</h4>
                  <span className="text-[10px] font-bold text-heritage-orange shrink-0">{product.price}</span>
                </div>
                <p className="text-[10px] text-gray-500 line-clamp-1 mb-2">{product.description}</p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => onProductClick?.(product)}
                    className="flex-grow flex items-center justify-center gap-1.5 bg-heritage-orange text-white text-[10px] font-bold py-1.5 rounded-lg active:scale-95 transition-transform"
                  >
                    <ShoppingBag size={10} /> Buy Now
                  </button>
                  <button 
                    onClick={() => onAddToCart?.(product)}
                    className="px-2 bg-orange-100 text-heritage-orange rounded-lg active:scale-95 transition-transform"
                  >
                    <ShoppingCart size={10} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
