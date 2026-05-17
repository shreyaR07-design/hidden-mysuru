/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { VLOGS } from "../data/mockData";
import { Play, Share2, Heart, Upload, Clock, Eye, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Vlog } from "../types";
import { analytics } from "../services/analyticsService";
import VlogUpload from "./VlogUpload";

interface VlogsProps {
  onNotify?: (msg: string) => void;
}

export default function Vlogs({ onNotify }: VlogsProps) {
  const [realVlogs, setRealVlogs] = useState<Vlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [likedVlogs, setLikedVlogs] = useState<string[]>([]);

  const fetchVlogs = async () => {
    try {
      const res = await fetch('/api/vlogs/all');
      if (res.ok) {
        const data = await res.json();
        setRealVlogs(data);
      }
    } catch (err) {
      console.error("Vlog fetch failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVlogs();
  }, []);

  const handleInteraction = async (vlogId: string, type: 'like' | 'share' | 'view') => {
    if (type === 'like') {
        if (likedVlogs.includes(vlogId)) return;
        setLikedVlogs([...likedVlogs, vlogId]);
    }
    
    analytics.trackEvent('interaction', 'vlog', type, vlogId);
    
    try {
      await fetch(`/api/vlogs/interaction/${vlogId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type })
      });
      
      if (type === 'share') onNotify?.("Shared discover link!");
      if (type === 'like') onNotify?.("Added to your favorites!");
      
      // Optmistically update local state for the interaction
      setRealVlogs(prev => prev.map(v => {
        if (v.id === vlogId) {
            return {
                ...v,
                likes: type === 'like' ? (v.likes || 0) + 1 : v.likes,
                shares: type === 'share' ? (v.shares || 0) + 1 : v.shares,
                views: type === 'view' ? (v.views || 0) + 1 : v.views
            };
        }
        return v;
      }));
    } catch (err) {
      console.error("Interaction failed");
    }
  };

  if (showUpload) {
    return <VlogUpload 
      onBack={() => setShowUpload(false)} 
      onSuccess={() => {
        setShowUpload(false);
        fetchVlogs();
      }}
      onNotify={(msg) => onNotify?.(msg)}
    />;
  }

  // Convert mock vlogs to Vlog type for rendering consistency
  const mockVlogsAsReal: Vlog[] = VLOGS.map(v => ({
    id: v.id,
    title: v.title,
    creatorName: v.author,
    thumbnailUrl: v.thumbnail,
    youtubeLink: v.videoId,
    category: "Heritage",
    description: "",
    likes: 120,
    shares: 45,
    views: 890,
    createdAt: new Date().toISOString()
  }));

  const allVlogs = [...realVlogs, ...mockVlogsAsReal];

  return (
    <div className="pt-6 pb-24 min-h-screen bg-heritage-cream">
      <div className="px-6 mb-8 flex items-end justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-heritage-brown mb-2">Heritage Vlogs</h1>
          <p className="text-sm text-gray-500 font-medium tracking-tight">Authentic stories told by travelers</p>
        </div>
        <button 
          onClick={() => {
            analytics.trackEvent('click', 'vlog', 'open_upload');
            setShowUpload(true);
          }}
          className="bg-heritage-orange text-white p-3 rounded-full shadow-lg shadow-orange-900/20 mb-2 active:scale-95 transition-transform"
        >
           <Upload size={18} />
        </button>
      </div>

      <div className="px-6 space-y-12">
        {loading ? (
          <div className="py-20 text-center text-gray-400 italic">Streaming cultural stories...</div>
        ) : allVlogs.map((vlog) => (
          <motion.div
            key={vlog.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group"
          >
            <div className="relative aspect-video rounded-[32px] overflow-hidden shadow-lg border border-orange-100 mb-5 bg-gray-200">
               <img
                 src={vlog.thumbnailUrl}
                 alt={vlog.title}
                 referrerPolicy="no-referrer"
                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
               />
               <a 
                href={vlog.videoUrl ? vlog.videoUrl : (vlog.youtubeLink ? `https://www.youtube.com/watch?v=${vlog.youtubeLink}` : '#')}
                target="_blank"
                rel="noreferrer"
                onClick={() => handleInteraction(vlog.id, 'view')}
                className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors"
               >
                 <div className="w-16 h-16 rounded-full bg-heritage-orange/90 backdrop-blur-md flex items-center justify-center text-white shadow-2xl transition-transform group-hover:scale-110">
                    <Play size={28} className="fill-white ml-1" />
                 </div>
                 <div className="absolute top-4 left-4 py-1 px-3 bg-black/40 backdrop-blur-md rounded-full text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-2">
                    <Clock size={10} /> {vlog.category}
                 </div>
               </a>
            </div>
            
            <div className="flex justify-between items-start">
               <div className="flex-1 pr-4">
                  <h3 className="font-display text-xl font-bold text-heritage-brown leading-tight mb-2 group-hover:text-heritage-orange transition-colors">{vlog.title}</h3>
                  <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                         <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-heritage-orange font-bold text-[10px]">
                            {vlog.creatorName[0]}
                         </div>
                         <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{vlog.creatorName}</span>
                      </div>
                      <div className="flex items-center gap-3">
                         <div className="flex items-center gap-1 text-[10px] font-bold text-gray-300">
                            <Eye size={12} /> {vlog.views || 0}
                         </div>
                         <div className="flex items-center gap-1 text-[10px] font-bold text-gray-300">
                            <Heart size={12} className={likedVlogs.includes(vlog.id) ? "fill-red-500 text-red-500" : ""} /> {vlog.likes || 0}
                         </div>
                      </div>
                  </div>
               </div>
               <div className="flex gap-2">
                  <button 
                   onClick={() => handleInteraction(vlog.id, 'like')}
                   className={`p-3 rounded-2xl bg-white border border-orange-50 active:scale-95 transition-all ${likedVlogs.includes(vlog.id) ? "text-red-500 border-red-100 bg-red-50" : "text-gray-400 hover:text-heritage-orange"}`}
                  >
                    <Heart size={18} className={likedVlogs.includes(vlog.id) ? "fill-red-500" : ""} />
                  </button>
                  <button 
                   onClick={() => handleInteraction(vlog.id, 'share')}
                   className="p-3 rounded-2xl bg-white border border-orange-50 text-gray-400 hover:text-heritage-orange active:scale-95 transition-all"
                  >
                    <Share2 size={18} />
                  </button>
               </div>
            </div>
            {vlog.description && (
                <p className="mt-4 text-sm text-gray-500 leading-relaxed line-clamp-2">{vlog.description}</p>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
