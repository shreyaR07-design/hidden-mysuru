/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MapPin, Navigation, Star, Utensils, Clock } from "lucide-react";
import { HIDDEN_GEMS } from "../data/mockData";
import { motion } from "motion/react";

const MAP_LOCATIONS = [
  { id: 'chamundi-hills', name: "Chamundi Hills", x: "55%", y: "60%", type: 'landmark' },
  { id: 'shivanasamudra-falls', name: "Shivanasamudra", x: "85%", y: "45%", type: 'landmark' },
  { id: 'chennakesava-temple', name: "Somnathapura", x: "75%", y: "40%", type: 'landmark' },
  { id: 'br-hills', name: "BR Hills", x: "80%", y: "85%", type: 'landmark' },
  { id: 'talakadu-sands', name: "Talakadu", x: "82%", y: "55%", type: 'landmark' },
  { id: 'ranganathittu', name: "Bird Sanctuary", x: "35%", y: "35%", type: 'landmark' },
];

const FOOD_STOPS = [
  { name: "Mylari Hotel", x: "48%", y: "52%" },
  { name: "Guru Sweet", x: "52%", y: "55%" },
  { name: "Hanumanthu", x: "45%", y: "45%" },
];

export interface MapFilters {
  showRoutes: boolean;
  showFood: boolean;
  showTimes: boolean;
}

interface MapComponentProps {
  filters: MapFilters;
}

export default function MapComponent({ filters }: MapComponentProps) {
  return (
    <div className="w-full h-full rounded-[48px] overflow-hidden bg-[#FAF7F2] border border-orange-100 shadow-2xl relative flex flex-col">
      {/* Map Content Area */}
      <div className="flex-1 relative overflow-hidden bg-[#fdfaf5]">
        {/* Stylized Geography Background - Abstract Mysore Region */}
        <div className="absolute inset-0 z-0">
          <svg className="w-full h-full opacity-10" viewBox="0 0 400 600" preserveAspectRatio="xMidYMid slice">
            {/* Kaveri River Path */}
            <path
              d="M 50 100 Q 150 150 200 300 T 350 500"
              fill="none"
              stroke="#0ea5e9"
              strokeWidth="20"
              strokeLinecap="round"
            />
            {/* Hills/Forest Areas */}
            <circle cx="320" cy="520" r="80" fill="#15803d" />
            <circle cx="220" cy="380" r="50" fill="#15803d" />
          </svg>
        </div>

        {/* Decorative Grid */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
             style={{ backgroundImage: 'linear-gradient(#78350F 1px, transparent 1px), linear-gradient(90deg, #78350F 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
        </div>

        {/* Routes Illustration */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
           {filters.showRoutes && (
             <motion.path 
               initial={{ pathLength: 0 }}
               animate={{ pathLength: 1 }}
               transition={{ duration: 2.5, ease: "easeInOut" }}
               d="M55,60 L75,40 L85,45 L82,55 M55,60 L80,85 M55,60 L35,35" 
               stroke="#F97316" 
               strokeWidth="0.4" 
               strokeDasharray="1 1" 
               fill="none" 
             />
           )}
           
           {/* Travel Time Badges in SVG overlay */}
           {filters.showTimes && (
             <>
               <foreignObject x="62" y="48" width="40" height="20">
                  <div className="bg-white/90 backdrop-blur-sm border border-orange-100 px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1 scale-75">
                     <Clock size={8} className="text-heritage-orange" />
                     <span className="text-[8px] font-bold text-heritage-brown">45m</span>
                  </div>
               </foreignObject>
               <foreignObject x="65" y="72" width="40" height="20">
                  <div className="bg-white/90 backdrop-blur-sm border border-orange-100 px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1 scale-75">
                     <Clock size={8} className="text-heritage-orange" />
                     <span className="text-[8px] font-bold text-heritage-brown">2h</span>
                  </div>
               </foreignObject>
             </>
           )}
        </svg>

        {/* Destination Pins */}
        {MAP_LOCATIONS.map((pin, idx) => (
          <motion.div
            key={pin.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 * idx }}
            style={{ left: pin.x, top: pin.y }}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group/pin"
          >
            <div className="flex flex-col items-center">
               <div className="bg-heritage-brown text-white text-[8px] font-black px-2 py-0.5 rounded-full translate-y-1 shadow-md mb-1 uppercase tracking-tighter opacity-0 group-hover/pin:opacity-100 transition-opacity">
                  {pin.name}
               </div>
               <div className="relative">
                 <div className="absolute inset-0 bg-heritage-orange rounded-full animate-ping opacity-30"></div>
                 <div className="bg-white p-1 rounded-full shadow-xl border-2 border-heritage-orange relative z-10 transition-transform group-hover/pin:scale-125">
                    <MapPin size={12} className="text-heritage-orange fill-heritage-orange/20" />
                 </div>
               </div>
            </div>
          </motion.div>
        ))}

        {/* Food Stops */}
        {filters.showFood && FOOD_STOPS.map((stop, idx) => (
          <motion.div
            key={idx}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.8 }}
            transition={{ delay: 0.5 + 0.1 * idx }}
            style={{ left: stop.x, top: stop.y }}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
          >
            <div className="bg-white/80 backdrop-blur-sm p-1.5 rounded-xl border border-orange-100 shadow-sm">
               <Utensils size={10} className="text-heritage-brown" />
            </div>
          </motion.div>
        ))}

        {/* Legend */}
        <div className="absolute bottom-6 left-6 z-30 bg-white/60 backdrop-blur-md p-3 rounded-2xl border border-white/50 space-y-2">
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-heritage-orange shadow-[0_0_8px_rgba(249,115,22,0.6)]"></div>
              <span className="text-[9px] font-bold text-heritage-brown uppercase tracking-widest">Heritage Site</span>
           </div>
           {filters.showFood && (
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-sm bg-heritage-brown opacity-50"></div>
                <span className="text-[9px] font-bold text-heritage-brown uppercase tracking-widest">Food Stop</span>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
