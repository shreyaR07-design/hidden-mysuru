/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShoppingBag, 
  Package, 
  TrendingUp, 
  LogOut, 
  Plus, 
  Settings, 
  User,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { ArtisanSeller, ArtisanProduct, Order } from "../../types";

interface DashboardProps {
  artisan: ArtisanSeller;
  onLogout: () => void;
  onManageProducts: () => void;
  onViewOrders: () => void;
}

export default function SellerDashboard({ artisan, onLogout, onManageProducts, onViewOrders }: DashboardProps) {
  const [stats, setStats] = useState({
    totalSales: "₹45,200",
    activeProducts: 0,
    pendingOrders: 0
  });

  useEffect(() => {
    // Fetch stats from backend in a real app
    const fetchDashboardData = async () => {
      try {
        const res = await fetch(`/api/artisan/stats`, {
           headers: { 'Authorization': `Bearer ${localStorage.getItem('artisanToken')}` }
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data");
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-heritage-cream pb-24">
      {/* Header */}
      <div className="bg-heritage-brown text-white px-6 pt-12 pb-20 rounded-b-[40px] shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-heritage-orange flex items-center justify-center text-white font-bold text-xl shadow-lg border border-white/20">
                {artisan.artisanName[0]}
              </div>
              <div>
                <h1 className="text-xl font-display font-bold leading-tight">{artisan.artisanName}</h1>
                <p className="text-[10px] text-orange-200/80 font-bold uppercase tracking-widest">{artisan.craftType}</p>
              </div>
            </div>
            <button 
              onClick={onLogout}
              className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <LogOut size={18} />
            </button>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/10">
            <span className="text-[10px] font-bold text-orange-200/60 uppercase tracking-widest mb-1 block">Total Earnings</span>
            <h2 className="text-4xl font-display font-bold">{stats.totalSales}</h2>
            <div className="flex items-center gap-2 mt-4 text-emerald-400">
              <TrendingUp size={14} />
              <span className="text-xs font-bold font-mono">+12% from last month</span>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-heritage-orange/10 rounded-full blur-3xl -translate-y-20 translate-x-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -translate-x-10 translate-y-10 pointer-events-none" />
      </div>

      {/* Main Content */}
      <div className="px-6 -mt-10 relative z-20 space-y-6">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-orange-50">
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-heritage-orange mb-4">
              <Package size={20} />
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">Products</span>
            <span className="text-2xl font-bold text-heritage-brown">{stats.activeProducts}</span>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-orange-50">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 mb-4">
              <ShoppingBag size={20} />
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">Pending Orders</span>
            <span className="text-2xl font-bold text-heritage-brown">{stats.pendingOrders}</span>
          </div>
        </div>

        {/* Verification Status */}
        <div className={`p-4 rounded-3xl border flex items-center gap-4 ${
          artisan.verificationStatus === 'verified' 
            ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
            : artisan.verificationStatus === 'pending'
              ? 'bg-amber-50 border-amber-100 text-amber-700'
              : 'bg-red-50 border-red-100 text-red-700'
        }`}>
          {artisan.verificationStatus === 'verified' && <CheckCircle2 size={24} />}
          {artisan.verificationStatus === 'pending' && <Clock size={24} />}
          {artisan.verificationStatus === 'rejected' && <AlertCircle size={24} />}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest">Store Status</p>
            <p className="text-sm font-medium">{
              artisan.verificationStatus === 'verified' 
                ? 'Your store is live and verified.' 
                : artisan.verificationStatus === 'pending'
                  ? 'Verification in progress (2-3 days).'
                  : 'Action needed on your profile.'
            }</p>
          </div>
        </div>

        {/* Action Menu */}
        <div className="space-y-3">
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2 mb-4">Workshop Management</h3>
          
          <button 
            onClick={onManageProducts}
            className="w-full bg-white p-5 rounded-3xl shadow-sm border border-orange-50 flex items-center justify-between group active:scale-95 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-heritage-orange group-hover:bg-heritage-orange group-hover:text-white transition-colors">
                <Plus size={24} />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-heritage-brown">Manage Products</p>
                <p className="text-[10px] text-gray-400 font-medium">Add, Edit or Remove items</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-gray-300 group-hover:text-heritage-orange transition-colors" />
          </button>

          <button 
            onClick={onViewOrders}
            className="w-full bg-white p-5 rounded-3xl shadow-sm border border-orange-50 flex items-center justify-between group active:scale-95 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                <ShoppingBag size={24} />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-heritage-brown">Order History</p>
                <p className="text-[10px] text-gray-400 font-medium">View and update shipments</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
          </button>

          <button className="w-full bg-white p-5 rounded-3xl shadow-sm border border-orange-50 flex items-center justify-between group active:scale-95 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-500 group-hover:bg-gray-800 group-hover:text-white transition-colors">
                <User size={24} />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-heritage-brown">Profile Settings</p>
                <p className="text-[10px] text-gray-400 font-medium">Bio, Photos and Verification</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-gray-300 group-hover:text-gray-800 transition-colors" />
          </button>
        </div>

        {/* Recent Activity placeholder */}
        <div className="bg-white rounded-[32px] p-8 border border-orange-50">
           <h3 className="text-sm font-bold text-heritage-brown mb-6">Recent Sales</h3>
           <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center text-orange-200 mb-4">
                <Clock size={32} />
              </div>
              <p className="text-xs text-gray-400 font-medium italic">No recent transactions yet.</p>
           </div>
        </div>
      </div>
    </div>
  );
}
