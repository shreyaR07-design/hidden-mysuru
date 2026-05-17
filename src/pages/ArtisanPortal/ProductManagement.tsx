/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, X, Upload, Save, Trash2, Edit2, Tag, Archive, IndianRupee, Image as ImageIcon } from "lucide-react";
import { ArtisanSeller, ArtisanProduct } from "../../types";

interface ProductManagementProps {
  artisan: ArtisanSeller;
  onBack: () => void;
  onNotify: (msg: string) => void;
}

export default function ProductManagement({ artisan, onBack, onNotify }: ProductManagementProps) {
  const [products, setProducts] = useState<ArtisanProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ArtisanProduct | null>(null);

  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    price: "",
    stock: "5",
    category: "Decor",
    handmadeDetails: "",
    deliveryTime: "7-10 Days",
    image: ""
  });

  const fetchProducts = async () => {
    try {
      const res = await fetch(`/api/products/all?artisanId=${artisan.id}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingProduct ? `/api/products/update/${editingProduct.id}` : "/api/products/add";
      const method = editingProduct ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('artisanToken')}`
        },
        body: JSON.stringify({ ...formData, artisanId: artisan.id }),
      });

      if (res.ok) {
        onNotify(editingProduct ? "Product updated successfully!" : "Product added to shop!");
        setShowAddForm(false);
        setEditingProduct(null);
        fetchProducts();
        setFormData({
          productName: "",
          description: "",
          price: "",
          stock: "5",
          category: "Decor",
          handmadeDetails: "",
          deliveryTime: "7-10 Days",
          image: ""
        });
      } else {
        onNotify("Failed to save product.");
      }
    } catch (err) {
      onNotify("Error saving product.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/products/delete/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${localStorage.getItem('artisanToken')}` }
      });
      if (res.ok) {
        onNotify("Product removed.");
        fetchProducts();
      }
    } catch (err) {
      onNotify("Failed to delete.");
    }
  };

  const handleEdit = (product: ArtisanProduct) => {
    setEditingProduct(product);
    setFormData({
      productName: product.name,
      description: product.description,
      price: product.price.replace(/[^\d]/g, ''),
      stock: String(product.stock),
      category: product.category,
      handmadeDetails: product.handmadeDetails,
      deliveryTime: product.deliveryTime,
      image: product.image
    });
    setShowAddForm(true);
  };

  return (
    <div className="min-h-screen bg-heritage-cream pb-24 px-6 pt-12">
      <div className="flex justify-between items-center mb-10">
        <button onClick={onBack} className="text-sm font-bold text-gray-400 flex items-center gap-2">
          <X size={18} /> Close
        </button>
        <h1 className="font-display text-2xl font-bold text-heritage-brown">My Products</h1>
        <button 
          onClick={() => setShowAddForm(true)}
          className="w-10 h-10 rounded-full bg-heritage-orange text-white flex items-center justify-center shadow-lg active:scale-95 transition-transform"
        >
          <Plus size={24} />
        </button>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 bg-heritage-cream overflow-y-auto px-6 py-12"
          >
            <div className="max-w-sm mx-auto">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-display font-bold text-heritage-brown">
                  {editingProduct ? "Edit Product" : "New Craft Item"}
                </h2>
                <button onClick={() => { setShowAddForm(false); setEditingProduct(null); }} className="text-gray-400">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 pb-20">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-4">Product Name</label>
                  <input 
                    required
                    value={formData.productName}
                    onChange={(e) => setFormData({...formData, productName: e.target.value})}
                    className="w-full bg-white border border-orange-50 p-4 rounded-2xl focus:ring-2 focus:ring-heritage-orange focus:outline-none shadow-sm transition-all text-sm font-medium"
                    placeholder="e.g. Traditional Rosewood Elephant"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-4">Description</label>
                  <textarea 
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full bg-white border border-orange-50 p-4 rounded-2xl focus:ring-2 focus:ring-heritage-orange focus:outline-none shadow-sm transition-all text-sm font-medium resize-none"
                    placeholder="Tell customers about the materials, art style..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-4">Price (₹)</label>
                    <div className="relative">
                      <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                      <input 
                        type="number"
                        required
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        className="w-full bg-white border border-orange-50 p-4 pl-10 rounded-2xl focus:ring-2 focus:ring-heritage-orange focus:outline-none shadow-sm transition-all text-sm font-bold"
                        placeholder="1500"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-4">Stock</label>
                    <div className="relative">
                      <Archive className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                      <input 
                        type="number"
                        required
                        value={formData.stock}
                        onChange={(e) => setFormData({...formData, stock: e.target.value})}
                        className="w-full bg-white border border-orange-50 p-4 pl-10 rounded-2xl focus:ring-2 focus:ring-heritage-orange focus:outline-none shadow-sm transition-all text-sm font-bold"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-4">Handcrafted Details</label>
                  <input 
                    value={formData.handmadeDetails}
                    onChange={(e) => setFormData({...formData, handmadeDetails: e.target.value})}
                    className="w-full bg-white border border-orange-50 p-4 rounded-2xl focus:ring-2 focus:ring-heritage-orange focus:outline-none shadow-sm transition-all text-[10px] font-medium"
                    placeholder="e.g. Organic dyes, Aged sandalwood, 40 hours of labor"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-4">Product Image URL</label>
                  <div className="relative">
                    <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                      value={formData.image}
                      onChange={(e) => setFormData({...formData, image: e.target.value})}
                      className="w-full bg-white border border-orange-50 p-4 pl-12 rounded-2xl focus:ring-2 focus:ring-heritage-orange focus:outline-none shadow-sm transition-all text-[10px] italic font-medium"
                      placeholder="Paste image link here"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-heritage-brown text-white py-5 rounded-3xl font-bold flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all mt-6"
                >
                  <Save size={20} /> {editingProduct ? "Save Changes" : "Publish to Shop"}
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {loading ? (
          <div className="py-20 text-center text-gray-400 italic">Finding your crafts...</div>
        ) : products.length === 0 ? (
          <div className="bg-white p-12 rounded-[40px] border border-dashed border-orange-200 text-center">
            <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center mx-auto mb-4 text-heritage-orange">
              <Tag size={32} />
            </div>
            <p className="text-sm font-bold text-heritage-brown mb-2">No products yet</p>
            <p className="text-xs text-gray-400 leading-relaxed mb-6">Start adding your handcrafted items to reach thousands of travelers.</p>
            <button 
              onClick={() => setShowAddForm(true)}
              className="bg-heritage-orange text-white px-6 py-3 rounded-full text-xs font-bold"
            >
              Add first product
            </button>
          </div>
        ) : (
          products?.map(product => (
            <motion.div 
              layout
              key={product.id}
              className="bg-white p-4 rounded-3xl border border-orange-50 flex gap-4 shadow-sm"
            >
              <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0">
                <img src={product.image} className="w-full h-full object-cover" />
              </div>
              <div className="flex-grow min-w-0">
                <div className="flex justify-between items-start">
                  <h3 className="text-sm font-bold text-heritage-brown truncate pr-2">{product.name}</h3>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(product)} className="p-1.5 rounded-lg bg-orange-50 text-heritage-orange">
                      <Edit2 size={12} />
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="p-1.5 rounded-lg bg-red-50 text-red-500">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
                <p className="text-[10px] text-gray-400 mt-1">{product.category}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm font-bold text-heritage-brown">{product.price}</span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${product.stock > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
                  </span>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
