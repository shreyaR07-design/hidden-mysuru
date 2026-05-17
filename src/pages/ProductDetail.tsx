/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowLeft, ShoppingBag, ShoppingCart, MapPin, Award, History, Info, Package, CheckCircle2, Loader2 } from "lucide-react";
import { Product, Artisan } from "../types";
import { analytics } from "../services/analyticsService";

interface ProductDetailProps {
  product: Product;
  artisan: Artisan;
  onBack: () => void;
  onAddToCart: (product: Product) => void;
}

export default function ProductDetail({ product, artisan, onBack, onAddToCart }: ProductDetailProps) {
  const [buying, setBuying] = useState(false);
  const [bought, setBought] = useState(false);

  useEffect(() => {
    analytics.trackEvent('view', 'product', 'view_detail', product.name, Number(product.price.replace(/[^\d]/g, '')));
    analytics.trackActivity('product_view', `Visitor viewed ${product.name}`, { productId: product.id });
  }, [product]);

  const handleBuyNow = async () => {
    setBuying(true);
    analytics.trackEvent('click', 'product', 'buy_now', product.name);
    
    try {
      const res = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          artisanId: artisan.id,
          customerId: localStorage.getItem('userId'),
          customerName: "Traveler Guest",
          productId: product.id,
          productName: product.name,
          quantity: 1,
          totalAmount: Number(product.price.replace(/[^\d]/g, ''))
        })
      });

      if (res.ok) {
        setBought(true);
        analytics.trackEvent('interaction', 'order', 'purchase_success', product.name);
      }
    } catch (err) {
      console.error("Purchase failed");
    } finally {
      setBuying(false);
    }
  };

  const handleAddToCart = () => {
    analytics.trackEvent('click', 'product', 'add_to_cart', product.name);
    analytics.trackActivity('cart_add', `Product added to cart: ${product.name}`, { productId: product.id });
    onAddToCart(product);
  };

  if (bought) {
    return (
      <div className="min-h-screen bg-heritage-cream flex flex-col items-center justify-center p-6 text-center">
        <motion.div 
          initial={{ scale: 0 }} 
          animate={{ scale: 1 }} 
          className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-white mb-6 shadow-xl shadow-emerald-500/20"
        >
          <CheckCircle2 size={40} />
        </motion.div>
        <h1 className="text-2xl font-display font-bold text-heritage-brown mb-2">Heritage Secured!</h1>
        <p className="text-gray-500 text-sm mb-8 leading-relaxed">
          Your order for the <span className="font-bold text-heritage-brown">{product.name}</span> has been confirmed. 
          The artisan will begin crafting your piece soon.
        </p>
        <button 
          onClick={onBack}
          className="bg-heritage-brown text-white py-4 px-10 rounded-3xl font-bold text-sm shadow-lg shadow-heritage-brown/20 active:scale-95 transition-transform"
        >
          Explore More Treasures
        </button>
      </div>
    );
  }

  return (
    <div className="pb-24">
      {/* Product Image */}
      <div className="relative h-[400px] bg-white overflow-hidden">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        <button 
          onClick={onBack}
          className="absolute top-6 left-6 w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white active:scale-95 transition-transform"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      <div className="px-6 -mt-10 relative z-10">
        <div className="bg-white rounded-[40px] shadow-2xl p-8 border border-orange-50">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-display font-bold text-heritage-brown mb-1">{product.name}</h1>
              <p className="text-xs text-heritage-orange font-bold uppercase tracking-widest">{artisan.craft}</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-heritage-brown">{product.price}</span>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Free Shipping</p>
            </div>
          </div>

          <p className="text-sm text-gray-600 leading-relaxed mb-8">
            {product.description}
          </p>

          <div className="flex gap-4">
            <button 
              onClick={handleAddToCart}
              className="flex-1 bg-heritage-brown text-white py-4 rounded-3xl font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <ShoppingCart size={18} /> Add to Cart
            </button>
            <button 
              onClick={handleBuyNow}
              disabled={buying}
              className="flex-1 bg-heritage-orange text-white py-4 rounded-3xl font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-50"
            >
              {buying ? <Loader2 className="animate-spin" size={18} /> : <ShoppingBag size={18} />} Buy Now
            </button>
          </div>
        </div>
      </div>


      {/* Artisan Info */}
      <div className="px-6 py-12 space-y-12">
        <section>
          <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">About the Artisan</h2>
          <div className="flex items-center gap-4 mb-4">
            <img src={artisan.image} className="w-16 h-16 rounded-full object-cover border-2 border-heritage-orange" />
            <div>
              <h3 className="font-display font-bold text-lg text-heritage-brown">{artisan.name}</h3>
              <div className="flex items-center gap-2 text-gray-500 mt-1">
                <MapPin size={12} className="text-heritage-orange" />
                <span className="text-xs">{artisan.location}</span>
              </div>
            </div>
          </div>
          <div className="bg-orange-50/50 p-6 rounded-3xl italic text-sm text-gray-600 leading-relaxed border border-orange-50">
            "{artisan.story || artisan.about}"
          </div>
        </section>

        {/* Craft Heritage */}
        {(artisan.history || artisan.legend) && (
          <section className="bg-heritage-brown p-8 rounded-[40px] text-white">
            <h2 className="text-lg font-display font-bold mb-6 flex items-center gap-2">
              <Award className="text-heritage-orange" size={24} />
              Craft Heritage
            </h2>
            <div className="space-y-6">
              {artisan.history && (
                <div>
                  <h4 className="text-[10px] uppercase tracking-widest font-bold opacity-60 mb-2">Technique & History</h4>
                  <p className="text-sm text-orange-50/80 leading-relaxed">{artisan.history}</p>
                </div>
              )}
              {artisan.legend && (
                <div className="border-t border-white/10 pt-6">
                  <h4 className="text-[10px] uppercase tracking-widest font-bold opacity-60 mb-2">The Legend</h4>
                  <p className="text-sm italic text-orange-200/90 leading-relaxed">"{artisan.legend}"</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Product Details */}
        <section>
          <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Product Specifications</h2>
          <div className="space-y-3">
             {[
               { icon: Package, label: 'Material', value: 'Authentic Traditional Media' },
               { icon: Info, label: 'Authenticity', value: 'Certified handmade in Mysuru' },
               { icon: History, label: 'Time to Make', value: 'Requires 15-20 days of labor' }
             ].map((spec, i) => (
               <div key={i} className="flex justify-between items-center py-3 border-b border-orange-50">
                 <div className="flex items-center gap-2 text-gray-500">
                    <spec.icon size={14} className="text-heritage-orange" />
                    <span className="text-xs font-medium">{spec.label}</span>
                 </div>
                 <span className="text-xs font-bold text-heritage-brown">{spec.value}</span>
               </div>
             ))}
          </div>
        </section>
      </div>
    </div>
  );
}
