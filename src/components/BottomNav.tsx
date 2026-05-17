/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Home, Compass, Store, Utensils, Calendar, Play, Map as MapIcon, User } from "lucide-react";
import { Page } from "../types";
import { motion } from "motion/react";

interface BottomNavProps {
  currentPage: Page;
  setPage: (page: Page) => void;
}

const navItems = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'discover', icon: Compass, label: 'Discover' },
  { id: 'artisans', icon: Store, label: 'Artisans' },
  { id: 'food', icon: Utensils, label: 'Food' },
  { id: 'planner', icon: Calendar, label: 'Planner' },
  { id: 'vlogs', icon: Play, label: 'Vlogs' },
  { id: 'map', icon: MapIcon, label: 'Map' },
  { id: 'profile', icon: User, label: 'Profile' },
] as const;

export default function BottomNav({ currentPage, setPage }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-heritage-white border-t border-gray-100 px-2 py-2 pb-6 flex justify-around items-center z-50">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setPage(item.id)}
          className="flex flex-col items-center gap-1 min-w-[50px] relative active:scale-90 transition-transform"
        >
          <div className="relative">
            <item.icon
              size={20}
              className={`transition-colors ${
                currentPage === item.id ? 'text-heritage-orange' : 'text-gray-400'
              }`}
            />
            {currentPage === item.id && (
              <motion.div
                layoutId="active-indicator"
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-heritage-orange"
              />
            )}
          </div>
          <span
            className={`text-[10px] font-medium transition-colors ${
              currentPage === item.id ? 'text-heritage-orange' : 'text-gray-400'
            }`}
          >
            {item.label}
          </span>
        </button>
      ))}
    </nav>
  );
}
