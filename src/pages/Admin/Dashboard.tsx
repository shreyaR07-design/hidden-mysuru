/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  BarChart as BarChartIcon, 
  Users, 
  ShoppingBag, 
  TrendingUp, 
  MapPin, 
  Clock, 
  Smartphone, 
  LogOut, 
  Menu, 
  X, 
  Bell, 
  Search,
  ChevronRight,
  ArrowUpRight,
  Plus,
  RefreshCcw,
  Activity
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from "recharts";
import { AdminStats, ActivityLog } from "../../types";

interface AdminDashboardProps {
  onLogout: () => void;
  onNavigate: (page: any) => void;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function AdminDashboard({ onLogout, onNavigate }: AdminDashboardProps) {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [activity, setActivity] = useState<ActivityLog[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, activityRes] = await Promise.all([
        fetch('/api/admin/stats', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
        }),
        fetch('/api/admin/activity', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
        })
      ]);

      if (statsRes.ok && activityRes.ok) {
        setStats(await statsRes.json());
        setActivity(await activityRes.json());
      }
    } catch (err) {
      console.error("Dashboard fetch failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    // Live Activity Stream
    const token = localStorage.getItem('adminToken');
    const eventSource = new EventSource(`/api/admin/activities/stream?token=${token}`);

    eventSource.onmessage = (event) => {
      try {
        const newLog = JSON.parse(event.data);
        setActivity(prev => [newLog, ...prev].slice(0, 100)); // Keep more logs in memory
        
        // Push notification for critical events
        const criticalTypes = ['place_order', 'register', 'upload_vlog', 'add_product'];
        if (criticalTypes.includes(newLog.activityType)) {
          setNotifications(prev => [{
            id: Date.now(),
            message: newLog.activityMessage,
            type: newLog.activityType,
            username: newLog.username,
            time: new Date().toLocaleTimeString()
          }, ...prev].slice(0, 5));
        }

        // Dynamic stats updates
        if (newLog.activityType === 'login') {
            setStats(prev => prev ? {...prev, activeUsersToday: prev.activeUsersToday + 1} : null);
        }
        if (newLog.activityType === 'place_order') {
            setStats(prev => prev ? {...prev, totalOrders: prev.totalOrders + 1, pendingOrders: prev.pendingOrders + 1} : null);
        }
      } catch (err) {
        console.error("Failed to parse live log", err);
      }
    };

    eventSource.onerror = () => {
      console.warn("Live stream disconnected. Reconnecting...");
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const StatCard = ({ title, value, subValue, icon: Icon, color, live }: any) => (
    <div className="bg-[#111] border border-white/5 p-6 rounded-[32px] relative overflow-hidden group">
      <div className={`absolute top-0 right-0 w-32 h-32 bg-${color}-500/5 blur-3xl -translate-y-10 translate-x-10 group-hover:bg-${color}-500/10 transition-colors pointer-events-none`} />
      <div className="flex justify-between items-start relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">{title}</p>
            {live && (
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            )}
          </div>
          <p className="text-3xl font-display font-medium text-white">{value}</p>
          {subValue && <p className="text-[10px] text-emerald-400 font-bold mt-2 flex items-center gap-1"><ArrowUpRight size={12} /> {subValue}</p>}
        </div>
        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60">
          <Icon size={24} />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Initalizing Admin Portal</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30">
      {/* Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-72 bg-[#0a0a0a] border-r border-white/5 z-50 transition-transform duration-300 transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col p-8">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white">
              <TrendingUp size={18} />
            </div>
            <span className="font-display font-bold text-lg tracking-tight">Admin<span className="text-blue-500">Node</span></span>
          </div>

          <nav className="flex-grow space-y-2">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/5 text-white text-sm font-medium transition-all">
              <BarChartIcon size={18} className="text-blue-400" /> Dashboard
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-white/40 hover:text-white hover:bg-white/5 text-sm font-medium transition-all">
              <Users size={18} /> Users
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-white/40 hover:text-white hover:bg-white/5 text-sm font-medium transition-all">
              <MapPin size={18} /> Artisans
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-white/40 hover:text-white hover:bg-white/5 text-sm font-medium transition-all">
              <ShoppingBag size={18} /> Orders
            </button>
            <div className="pt-8 mb-4 border-t border-white/5">
              <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-4 ml-4">System</p>
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-white/40 hover:text-white hover:bg-white/5 text-sm font-medium transition-all">
                <Bell size={18} /> Notifications
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-white/40 hover:text-white hover:bg-white/5 text-sm font-medium transition-all">
                <Activity size={18} /> Activity Logs
              </button>
            </div>
          </nav>

          <button 
            onClick={onLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-red-400 hover:bg-red-500/10 text-sm font-medium transition-all"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:pl-72 min-h-screen">
        {/* Header */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-[#050505]/80 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="p-2 lg:hidden text-white/60">
              <Menu size={24} />
            </button>
            <h2 className="text-sm font-bold text-white/40 uppercase tracking-widest hidden sm:block">Overview</h2>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={16} />
              <input 
                type="text" 
                placeholder="Search metrics..." 
                className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-xs focus:outline-none focus:border-white/20 transition-all w-64"
              />
            </div>
            <button 
              onClick={() => setNotifications([])}
              className="p-2 text-white/40 hover:text-white relative"
            >
              <Bell size={20} />
              {notifications.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full border-2 border-[#050505]"></span>
              )}
            </button>
            <div className="flex items-center gap-3 border-l border-white/5 pl-6">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 text-xs font-bold font-mono">
                AD
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-[10px] font-bold text-white">System Admin</p>
                <p className="text-[8px] text-white/40 font-bold uppercase tracking-wider">Level 5 Access</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-8">
          {/* Real-time Notifications Toast */}
          <div className="fixed top-24 right-8 z-50 space-y-4 pointer-events-none w-80">
            <AnimatePresence>
              {notifications.map((n) => (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, x: 50, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-[#1a1a1a] border border-blue-500/20 p-4 rounded-2xl shadow-2xl pointer-events-auto flex gap-3 items-start"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
                    <Bell size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">New Event Alert</p>
                    <p className="text-xs text-white font-medium mb-1">{n.message}</p>
                    <p className="text-[8px] text-white/40 uppercase font-bold tracking-tighter">{n.time} • {n.type.replace('_', ' ')}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
            <div>
              <h1 className="text-3xl font-display font-medium text-white mb-2">Heritage Control Center</h1>
              <p className="text-xs text-white/40 flex items-center gap-2">
                <Clock size={12} /> Last updated: {new Date().toLocaleTimeString()}
              </p>
            </div>
            <div className="flex gap-3">
              <button onClick={fetchDashboardData} className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white text-xs font-bold py-3 px-6 rounded-2xl transition-all">
                <RefreshCcw size={14} /> Sync Now
              </button>
              <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-3 px-6 rounded-2xl transition-all shadow-lg shadow-blue-600/20">
                <Plus size={14} /> New Record
              </button>
            </div>
          </div>

          {/* Stat Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
            <StatCard 
              title="Total Users" 
              value={stats?.totalUsers || 0} 
              subValue={`${stats?.newUsersToday || 0} new today`} 
              icon={Users} 
              color="blue" 
            />
            <StatCard 
              title="Presence" 
              value={stats?.activeUsersToday || 0} 
              subValue="Active Pulse" 
              icon={Activity} 
              color="emerald" 
              live
            />
            <StatCard 
              title="Total Revenue" 
              value={`₹${stats?.totalRevenue?.toLocaleString() || 0}`} 
              subValue="Gross delivered sales" 
              icon={TrendingUp} 
              color="amber" 
            />
            <StatCard 
              title="Order Backlog" 
              value={stats?.pendingOrders || 0} 
              subValue="Awaiting fulfill" 
              icon={ShoppingBag} 
              color="rose" 
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
            {/* Page Visits Chart */}
            <div className="lg:col-span-2 bg-[#111] border border-white/5 p-8 rounded-[40px] shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-lg font-display font-medium text-white">Popular Destinations</h3>
                  <p className="text-xs text-white/40">Most visited application pathflows</p>
                </div>
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Views</span>
                </div>
              </div>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={(stats?.popularPages || []).slice(0, 7)}>
                    <XAxis 
                      dataKey="path" 
                      stroke="#ffffff20" 
                      fontSize={10} 
                      tickFormatter={(val) => val === '/' ? 'Home' : val.split('/')[1]?.toUpperCase() || val}
                    />
                    <YAxis stroke="#ffffff20" fontSize={10} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#111', border: '1px solid #ffffff10', borderRadius: '16px' }}
                      itemStyle={{ color: '#3b82f6', fontSize: '12px' }}
                    />
                    <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Device Mix */}
            <div className="bg-[#111] border border-white/5 p-8 rounded-[40px] shadow-sm">
              <div className="mb-8">
                <h3 className="text-lg font-display font-medium text-white">Device Matrix</h3>
                <p className="text-xs text-white/40">Hardware access distribution</p>
              </div>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats?.deviceBreakdown}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="count"
                      nameKey="device"
                    >
                      {stats?.deviceBreakdown?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#111', border: '1px solid #ffffff10', borderRadius: '16px' }}
                      itemStyle={{ color: '#fff', fontSize: '10px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3 mt-4">
                {stats?.deviceBreakdown?.map((d, i) => (
                  <div key={d.device} className="flex justify-between items-center bg-white/5 p-3 rounded-2xl">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                      <span className="text-[10px] font-bold text-white/60 uppercase">{d.device}</span>
                    </div>
                    <span className="text-xs font-mono text-white">{d.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
             {/* Recent Activity */}
             <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <div>
                    <h3 className="text-lg font-display font-medium text-white">System Signal</h3>
                    <p className="text-xs text-white/40">Real-time terminal activity logs</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="relative hidden md:block">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={14} />
                      <input 
                        type="text" 
                        placeholder="Filter logs..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
                        className="bg-white/5 border border-white/10 rounded-full py-1.5 pl-9 pr-4 text-[10px] focus:outline-none focus:border-white/20 transition-all w-48"
                      />
                    </div>
                    <button className="text-[10px] text-blue-500 font-bold uppercase tracking-widest self-center">View Terminal</button>
                  </div>
                </div>
                <div className="bg-[#111] border border-white/5 rounded-[40px] overflow-hidden">
                   <div className="divide-y divide-white/5">
                      {(activity || [])
                        .filter(log => 
                          log.activityMessage?.toLowerCase().includes(searchTerm) || 
                          log.username?.toLowerCase().includes(searchTerm) ||
                          log.activityType?.toLowerCase().includes(searchTerm)
                        )
                        .slice(0, 10).map((log) => (
                        <motion.div 
                          layout
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          key={log.id} 
                          className="p-6 flex gap-4 hover:bg-white/[0.02] transition-colors group"
                        >
                           <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 shrink-0 group-hover:text-blue-500 transition-colors">
                              {log.activityType?.includes('login') ? <Clock size={18} /> : 
                               log.activityType?.includes('register') ? <Plus size={18} /> : 
                               log.activityType?.includes('order') ? <ShoppingBag size={18} /> :
                               <Activity size={18} />}
                           </div>
                           <div className="flex-grow min-w-0">
                              <div className="flex justify-between items-start mb-1">
                                 <p className="text-sm font-medium text-white">
                                    <span className="text-blue-400 mr-2">[{log.username || 'System'}]</span>
                                    {log.activityMessage}
                                 </p>
                                 <span className="text-[10px] text-white/20 font-mono">{new Date(log.timestamp).toLocaleTimeString()}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                 <span className="px-2 py-0.5 rounded-full bg-white/5 text-[8px] font-bold text-white/30 uppercase">{log.role}</span>
                                 {log.pageVisited && <span className="text-[8px] text-white/20 truncate italic">{log.pageVisited}</span>}
                                 {log.deviceType && <span className="text-[8px] text-white/20 uppercase tracking-tighter">{log.deviceType}</span>}
                              </div>
                           </div>
                        </motion.div>
                      ))}
                   </div>
                   <button className="w-full py-4 text-[10px] text-white/20 font-bold uppercase tracking-[0.2em] border-t border-white/5 hover:text-white transition-colors">Load History</button>
                </div>
             </div>

             {/* Pending Approvals (Artisans) */}
             <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <div>
                    <h3 className="text-lg font-display font-medium text-white">Artisan Onboarding</h3>
                    <p className="text-xs text-white/40">Profiles awaiting heritage verification</p>
                  </div>
                  <button className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">Global Registry</button>
                </div>
                <div className="bg-[#111] border border-white/5 rounded-[40px] overflow-hidden p-8">
                   <div className="flex flex-col items-center justify-center py-20 text-center opacity-30">
                      <div className="w-16 h-16 rounded-full border border-dashed border-white/20 flex items-center justify-center mb-4">
                         <ShieldCheck className="text-white/40" size={32} />
                      </div>
                      <p className="text-xs font-bold text-white uppercase tracking-widest">No Pending Audits</p>
                      <p className="text-[10px] text-white/40 mt-1 uppercase tracking-wider">All artisan profiles are currently verified</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function ShieldCheck({ size, className }: any) {
  return <div className={className}><TrendingUp size={size} /></div>;
}
