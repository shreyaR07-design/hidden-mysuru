/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { ARTISANS } from "../data/mockData";
import ArtisanCard from "../components/ArtisanCard";
import { Brush, Palette, Scissors, Hammer, Sparkles, Loader2 } from "lucide-react";
import { Product, Artisan } from "../types";

const craftCategories = [
  { icon: Palette, label: 'Inlay' },
  { icon: Brush, label: 'Painting' },
  { icon: Sparkles, label: 'Silk' },
  { icon: Hammer, label: 'Carving' },
  { icon: Scissors, label: 'Textile' },
];

interface ArtisansProps {
  onProductClick: (product: Product, artisan: Artisan) => void;
  onAddToCart: (product: Product) => void;
}

export default function Artisans({ onProductClick, onAddToCart }: ArtisansProps) {
  const [realArtisans, setRealArtisans] = useState<Artisan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtisanMarketplace = async () => {
      try {
        const res = await fetch('/api/products/all');
        if (res.ok) {
          const products = await res.json();
          if (products.length > 0) {
            // Group products by artisanId
            const artisanGroups: Record<string, Product[]> = {};
            products.forEach((p: any) => {
              if (!artisanGroups[p.artisanId]) artisanGroups[p.artisanId] = [];
              artisanGroups[p.artisanId].push(p);
            });

            // For each group, create a "Real" artisan object if it doesn't exist in mock
            const fetched: Artisan[] = Object.entries(artisanGroups).map(([id, prods]) => {
              // Try to find if this artisan is already in mock data (by name if we had it, but here we just have ID)
              // For simplicity, we'll create new entries for all database sellers
              return {
                id,
                name: (prods[0] as any).artisanName || "Community Artisan",
                craft: (prods[0] as any).category || "Heritage Craft",
                experience: (prods[0] as any).experience || "Expert",
                location: (prods[0] as any).location || "Mysuru",
                about: prods[0].description || "Traditional craftsmanship passed down through generations.",
                products: prods,
                image: prods[0].image || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800",
              };
            });
            setRealArtisans(fetched);
          }
        }
      } catch (err) {
        console.error("Marketplace fetch failed");
      } finally {
        setLoading(false);
      }
    };
    fetchArtisanMarketplace();
  }, []);

  const allArtisans = [...ARTISANS.filter(a => a.image && !a.image.includes('placeholder')), ...realArtisans];

  return (
    <div className="pt-6 pb-24 min-h-screen bg-heritage-cream">
       <div className="px-6 mb-8">
        <h1 className="font-display text-3xl font-bold text-heritage-brown mb-2">Local Masters</h1>
        <p className="text-sm text-gray-500 font-medium mb-8">Meet the hands that keep Mysuru's heritage alive</p>

        {/* ... existing header code ... */}
        <div className="flex justify-between items-center bg-orange-950 p-6 rounded-[32px] text-white shadow-xl mb-10 overflow-hidden relative">
           <div className="relative z-10 w-2/3">
             <h3 className="text-lg font-display font-bold mb-2 tracking-tight">Preserving Ancient Crafts</h3>
             <p className="text-xs text-orange-100/70 leading-relaxed font-medium">Discover the intricate world of sandalwood, rosewood, and silk artisans.</p>
           </div>
           <div className="relative z-10 w-1/3 flex justify-end">
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center border border-white/20 backdrop-blur-sm">
                 <Sparkles className="text-heritage-orange" />
              </div>
           </div>
           <div className="absolute bottom-0 right-0 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl translate-x-10 translate-y-10"></div>
        </div>

        <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-6 px-6 mb-8">
           {craftCategories.map((cat, idx) => (
             <div key={idx} className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-sm border border-orange-50 text-heritage-orange">
                   <cat.icon size={20} />
                </div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{cat.label}</span>
             </div>
           ))}
        </div>

        <div className="grid grid-cols-1 gap-6">
           {allArtisans.map((artisan) => (
             <ArtisanCard 
               key={artisan.id} 
               artisan={artisan} 
               onProductClick={(p) => onProductClick(p, artisan)}
               onAddToCart={onAddToCart}
             />
           ))}
           
           {loading && (
             <div className="flex justify-center py-12">
               <Loader2 className="animate-spin text-heritage-orange" size={24} />
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
