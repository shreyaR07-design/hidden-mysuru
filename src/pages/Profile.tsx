/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { 
  LogOut, 
  Settings, 
  History, 
  Heart, 
  ShoppingBag, 
  ChevronRight,
  Shield,
  User as UserIcon,
  Mail,
  Calendar
} from 'lucide-react';
import { authService } from '../services/authService';
import { UserProfile } from '../types';

interface ProfileProps {
  user: UserProfile;
  onLogout: () => void;
  onNavigate: (page: any) => void;
}

export default function Profile({ user, onLogout, onNavigate }: ProfileProps) {
  const handleLogout = async () => {
    await authService.logout();
    onLogout();
  };

  const getDashboardText = () => {
    if (user.role === 'admin') return "Access Admin Control Center";
    if (user.role === 'artisan') return "Manage Your Workshop";
    return null;
  };

  const dashboardRoute = () => {
    if (user.role === 'admin') return 'admin-dashboard';
    if (user.role === 'artisan') return 'seller-dashboard';
    return null;
  };

  return (
    <div className="min-h-screen bg-heritage-cream pb-24">
      {/* Header Profile Section */}
      <div className="bg-heritage-brown text-heritage-cream px-6 pt-16 pb-12 rounded-b-[40px] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
           <div className="absolute top-[-20%] left-[-10%] w-64 h-64 bg-heritage-orange rounded-full blur-[80px]" />
           <div className="absolute bottom-[-20%] right-[-10%] w-64 h-64 bg-heritage-orange rounded-full blur-[80px]" />
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="relative group">
            <div className="w-28 h-28 rounded-full border-4 border-heritage-orange/30 overflow-hidden shadow-2xl">
              {user.profileImage ? (
                <img src={user.profileImage} alt={user.displayName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-heritage-orange flex items-center justify-center">
                  <UserIcon size={48} className="text-heritage-brown" />
                </div>
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-heritage-orange text-heritage-brown p-2 rounded-full shadow-lg border-2 border-heritage-brown">
              <Shield size={16} />
            </div>
          </div>

          <h1 className="mt-6 text-2xl font-serif font-black tracking-tight">{user.displayName}</h1>
          <div className="flex items-center gap-2 mt-1 opacity-70">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-heritage-orange/20 px-3 py-1 rounded-full border border-heritage-orange/30 text-heritage-orange">
              {user.role}
            </span>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-8 relative z-20 space-y-4">
        {/* Quick Stats or Dashboard Access */}
        {dashboardRoute() && (
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate(dashboardRoute())}
            className="w-full bg-heritage-orange py-4 px-6 rounded-2xl flex items-center justify-between shadow-xl shadow-heritage-orange/20 border border-white/20"
          >
            <div className="flex items-center gap-3 text-heritage-brown">
              <Shield size={24} />
              <div className="text-left">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">System Access</p>
                <p className="font-bold">{getDashboardText()}</p>
              </div>
            </div>
            <ChevronRight className="text-heritage-brown" />
          </motion.button>
        )}

        <div className="bg-white rounded-[32px] p-2 shadow-sm border border-orange-100/50">
          <ProfileItem icon={Mail} label="Email Address" value={user.email} />
          <ProfileItem icon={Calendar} label="Member Since" value={new Date(user.createdAt).toLocaleDateString()} />
          <ProfileItem icon={History} label="Last Active" value={user.lastActive ? new Date(user.lastActive).toLocaleTimeString() : 'Just now'} />
        </div>

        <div className="bg-white rounded-[32px] p-2 shadow-sm border border-orange-100/50">
          <MenuAction icon={ShoppingBag} label="My Orders" note="Check status of purchases" />
          <MenuAction icon={Heart} label="Wishlist" note="Saved heritage items" />
          <MenuAction icon={Settings} label="Account Settings" note="Privacy & Security" />
        </div>

        <button 
          onClick={handleLogout}
          className="w-full bg-red-50 text-red-600 py-4 rounded-2xl flex items-center justify-center gap-2 font-bold hover:bg-red-100 transition-colors mt-8"
        >
          <LogOut size={18} />
          <span>Logout Session</span>
        </button>

        <p className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-heritage-brown/20 pb-8">
          Mysuru Heritage Portal v2.0
        </p>
      </div>
    </div>
  );
}

function ProfileItem({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="flex items-center gap-4 p-4 border-b border-gray-50 last:border-0 hover:bg-heritage-cream/30 rounded-2xl transition-colors">
      <div className="w-10 h-10 bg-heritage-cream rounded-xl flex items-center justify-center text-heritage-brown/60">
        <Icon size={20} />
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-heritage-brown/40">{label}</p>
        <p className="text-sm font-bold text-heritage-brown">{value}</p>
      </div>
    </div>
  );
}

function MenuAction({ icon: Icon, label, note }: { icon: any, label: string, note: string }) {
  return (
    <button className="w-full flex items-center justify-between p-4 border-b border-gray-50 last:border-0 hover:bg-heritage-cream/30 rounded-2xl transition-all active:scale-[0.98]">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-heritage-cream rounded-xl flex items-center justify-center text-heritage-brown/60">
          <Icon size={20} />
        </div>
        <div className="text-left">
          <p className="text-sm font-bold text-heritage-brown">{label}</p>
          <p className="text-[10px] text-heritage-brown/40">{note}</p>
        </div>
      </div>
      <ChevronRight size={18} className="text-heritage-brown/20" />
    </button>
  );
}
