/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Clock, CheckCircle2, Truck, XCircle, ChevronRight, User, Package } from "lucide-react";
import { ArtisanSeller, Order } from "../../types";

interface OrdersProps {
  artisan: ArtisanSeller;
  onBack: () => void;
}

export default function SellerOrders({ artisan, onBack }: OrdersProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`/api/artisan/orders?artisanId=${artisan.id}`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem('artisanToken')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      const res = await fetch(`/api/order/update-status/${orderId}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('artisanToken')}`
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        fetchOrders();
      }
    } catch (err) {
      console.error("Failed to update status");
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'shipped': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'delivered': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'cancelled': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending': return <Clock size={14} />;
      case 'shipped': return <Truck size={14} />;
      case 'delivered': return <CheckCircle2 size={14} />;
      case 'cancelled': return <XCircle size={14} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-heritage-cream pb-24 px-6 pt-12">
      <div className="flex justify-between items-center mb-10">
        <button onClick={onBack} className="text-sm font-bold text-gray-400 flex items-center gap-2">
          <ArrowLeft size={18} /> Back
        </button>
        <h1 className="font-display text-2xl font-bold text-heritage-brown">Customer Orders</h1>
        <div className="w-10" />
      </div>

      <div className="space-y-6">
        {loading ? (
          <div className="py-20 text-center text-gray-400 italic font-medium">Checking workshop records...</div>
        ) : !orders || orders.length === 0 ? (
          <div className="bg-white p-12 rounded-[40px] text-center border border-orange-50">
            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4 text-blue-200">
              <Package size={32} />
            </div>
            <p className="text-sm font-bold text-heritage-brown">No orders yet</p>
            <p className="text-xs text-gray-400 mt-2">When customers buy your crafts, they will appear here.</p>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="bg-white rounded-3xl p-6 border border-orange-50 shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Order #{order.id.slice(0, 8)}</p>
                  <p className="text-xs font-medium text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className={`px-3 py-1 rounded-full border text-[10px] font-bold flex items-center gap-1.5 ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  {order.status.toUpperCase()}
                </div>
              </div>

              <div className="flex items-center gap-4 py-4 border-y border-orange-50">
                <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-heritage-orange shrink-0">
                  <Package size={24} />
                </div>
                <div className="flex-grow min-w-0">
                  <h3 className="text-sm font-bold text-heritage-brown truncate">{order.productName}</h3>
                  <p className="text-xs text-gray-500">Qty: {order.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-heritage-brown">₹{order.totalAmount}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                    <User size={14} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-heritage-brown leading-tight">{order.customerName}</p>
                    <p className="text-[8px] text-gray-400 uppercase font-bold tracking-widest">Customer</p>
                  </div>
                </div>
                
                {order.status !== 'delivered' && order.status !== 'cancelled' && (
                  <div className="flex gap-2">
                    {order.status === 'pending' && (
                      <button 
                        onClick={() => updateOrderStatus(order.id, 'shipped')}
                        className="bg-heritage-orange text-white text-[10px] font-bold px-3 py-2 rounded-xl active:scale-95 transition-transform"
                      >
                        Ship Now
                      </button>
                    )}
                    {order.status === 'shipped' && (
                      <button 
                        onClick={() => updateOrderStatus(order.id, 'delivered')}
                        className="bg-emerald-500 text-white text-[10px] font-bold px-3 py-2 rounded-xl active:scale-95 transition-transform"
                      >
                        Mark Delivered
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
