/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Camera, Upload, Youtube, MapPin, Tag, Plus, Loader2, CheckCircle2 } from "lucide-react";
import { analytics } from "../services/analyticsService";

interface VlogUploadProps {
  onBack: () => void;
  onSuccess: () => void;
  onNotify: (msg: string) => void;
}

export default function VlogUpload({ onBack, onSuccess, onNotify }: VlogUploadProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    title: "",
    creatorName: "",
    description: "",
    thumbnailUrl: "",
    videoUrl: "",
    youtubeLink: "",
    relatedPlace: "",
    category: "Heritage",
  });

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file); // Reusing upload endpoint which expects 'image'
    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Upload failed");
    return data.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    analytics.trackEvent('interaction', 'vlog', 'submit_upload_attempt');

    try {
      let finalThumbnailUrl = form.thumbnailUrl;
      if (thumbnailFile) {
        finalThumbnailUrl = await uploadFile(thumbnailFile);
      }

      let finalVideoUrl = form.videoUrl;
      if (videoFile) {
        finalVideoUrl = await uploadFile(videoFile); // In a real app, video would have a separate endpoint
      }

      if (!finalThumbnailUrl) {
        throw new Error("Please provide a thumbnail.");
      }

      if (!finalVideoUrl && !form.youtubeLink) {
        throw new Error("Please provide either a video file or a YouTube link.");
      }

      const res = await fetch("/api/vlogs/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          thumbnailUrl: finalThumbnailUrl,
          videoUrl: finalVideoUrl,
          uploaderId: localStorage.getItem('userId'),
        }),
      });

      if (res.ok) {
        setSuccess(true);
        analytics.trackEvent('interaction', 'vlog', 'upload_success', form.title);
        setTimeout(() => {
          onSuccess();
        }, 2000);
      } else {
        const data = await res.json();
        onNotify(data.error || "Failed to upload vlog");
      }
    } catch (err: any) {
      onNotify(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-heritage-cream flex flex-col items-center justify-center p-6 text-center">
        <motion.div 
          initial={{ scale: 0 }} 
          animate={{ scale: 1 }} 
          className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-white mb-6 shadow-xl shadow-emerald-500/20"
        >
          <CheckCircle2 size={40} />
        </motion.div>
        <h1 className="text-2xl font-display font-bold text-heritage-brown mb-2">Story Published!</h1>
        <p className="text-gray-500 text-sm mb-8 leading-relaxed">
          Your heritage vlog is now live for explorers to discover.
        </p>
      </div>
    );
  }

  return (
    <div className="pb-24 pt-6 bg-heritage-cream min-h-screen">
      <div className="px-6 mb-8 flex items-center gap-4">
        <button onClick={onBack} className="p-2 -ml-2 text-heritage-brown hover:bg-orange-100 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="font-display text-2xl font-bold text-heritage-brown">Share Your Journey</h1>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Heritage Creator Studio</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-6 space-y-6">
        {/* Thumbnail Upload */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Thumbnail Preview</label>
          <div 
            onClick={() => document.getElementById("vlog-thumb")?.click()}
            className="aspect-video rounded-[32px] bg-white border-2 border-dashed border-orange-200 flex flex-col items-center justify-center text-gray-400 hover:border-heritage-orange transition-colors cursor-pointer overflow-hidden relative"
          >
            {thumbnailPreview ? (
              <img src={thumbnailPreview} className="w-full h-full object-cover" />
            ) : (
              <>
                <Camera size={32} className="mb-2 opacity-20" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Select Preview Image</span>
              </>
            )}
            <input id="vlog-thumb" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Vlog Title</label>
            <input 
              required
              type="text" 
              value={form.title}
              onChange={(e) => setForm({...form, title: e.target.value})}
              className="w-full bg-white border border-orange-100 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-heritage-orange"
              placeholder="The Secret Whispers of Srirangapatna"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Creator Name</label>
            <input 
              required
              type="text" 
              value={form.creatorName}
              onChange={(e) => setForm({...form, creatorName: e.target.value})}
              className="w-full bg-white border border-orange-100 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-heritage-orange"
              placeholder="Explorer Shreya"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">YouTube Video ID (Optional)</label>
            <div className="relative">
                <Youtube size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" />
                <input 
                  type="text" 
                  value={form.youtubeLink}
                  onChange={(e) => setForm({...form, youtubeLink: e.target.value})}
                  className="w-full bg-white border border-orange-100 rounded-2xl py-4 pl-14 pr-6 text-sm focus:outline-none focus:border-heritage-orange font-mono"
                  placeholder="dQw4w9WgXcQ"
                />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Or Upload Video File</label>
            <div className="relative">
                <input 
                  type="file" 
                  accept="video/mp4"
                  onChange={handleVideoChange}
                  className="w-full bg-white border border-orange-100 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-heritage-orange"
                />
                <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest mt-1 ml-1">Preferred format: MP4 (Max 100MB)</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Featured Location</label>
            <div className="relative">
                <MapPin size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" />
                <input 
                  type="text" 
                  value={form.relatedPlace}
                  onChange={(e) => setForm({...form, relatedPlace: e.target.value})}
                  className="w-full bg-white border border-orange-100 rounded-2xl py-4 pl-14 pr-6 text-sm focus:outline-none focus:border-heritage-orange"
                  placeholder="e.g. Somnathpur Temple"
                />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Category</label>
            <div className="relative">
                <Tag size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" />
                <select 
                  value={form.category}
                  onChange={(e) => setForm({...form, category: e.target.value})}
                  className="w-full bg-white border border-orange-100 rounded-2xl py-4 pl-14 pr-6 text-sm focus:outline-none focus:border-heritage-orange appearance-none"
                >
                  <option>Heritage</option>
                  <option>Food Stories</option>
                  <option>Travel Vlog</option>
                  <option>Craft Journey</option>
                </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">The Story (Description)</label>
            <textarea 
              value={form.description}
              onChange={(e) => setForm({...form, description: e.target.value})}
              rows={4}
              className="w-full bg-white border border-orange-100 rounded-3xl py-4 px-6 text-sm focus:outline-none focus:border-heritage-orange resize-none"
              placeholder="Describe your experience at this place..."
            />
          </div>
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-heritage-orange text-white py-5 rounded-[24px] font-bold text-sm shadow-xl shadow-orange-900/10 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
          Publish Heritage Vlog
        </button>
      </form>
    </div>
  );
}
