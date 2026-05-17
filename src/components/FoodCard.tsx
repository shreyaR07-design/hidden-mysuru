/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MapPin, Tag } from "lucide-react";
import { Food } from "../types";
import { motion } from "motion/react";

interface FoodCardProps {
  food: Food;
  key?: string | number;
}

export default function FoodCard({ food }: FoodCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-3xl overflow-hidden shadow-sm border border-orange-50 group flex flex-col h-full"
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={food.image}
          alt={food.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute bottom-3 left-3 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full">
           <span className="text-[10px] font-bold text-white uppercase tracking-widest">{food.category}</span>
        </div>
      </div>
      <div className="p-3 flex flex-col flex-grow">
        <div className="flex flex-col gap-1 mb-2">
          <h3 className="font-display text-sm font-bold text-heritage-brown line-clamp-1">{food.name}</h3>
          <span className="text-[10px] font-bold text-heritage-orange">{food.priceRange}</span>
        </div>
        <p className="text-[10px] text-gray-600 mb-3 line-clamp-2 leading-relaxed">
          {food.description}
        </p>
        <div className="mt-auto space-y-2 border-t border-orange-50 pt-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
              <MapPin size={10} className="text-heritage-orange" />
            </div>
            <div className="overflow-hidden">
              <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest leading-none">Best Place</p>
              <p className="text-[10px] font-bold text-heritage-brown truncate">{food.bestPlace}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
