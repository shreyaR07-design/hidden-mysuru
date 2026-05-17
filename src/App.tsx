/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Page, Place, Product, Artisan, ArtisanSeller } from './types';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Discover from './pages/Discover';
import Artisans from './pages/Artisans';
import Food from './pages/Food';
import Planner from './pages/Planner';
import Vlogs from './pages/Vlogs';
import MapPage from './pages/MapPage';
import PlaceDetail from './pages/PlaceDetail';
import ProductDetail from './pages/ProductDetail';
import SellerLogin from './pages/ArtisanPortal/Login';
import SellerRegister from './pages/ArtisanPortal/Register';
import SellerDashboard from './pages/ArtisanPortal/Dashboard';
import ProductManagement from './pages/ArtisanPortal/ProductManagement';
import SellerOrders from './pages/ArtisanPortal/Orders';
import AdminLogin from './pages/Admin/Login';
import AdminDashboard from './pages/Admin/Dashboard';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import { authService } from './services/authService';
import { analytics } from './services/analyticsService';
import { CheckCircle2 } from 'lucide-react';
import { HIDDEN_GEMS } from './data/mockData';
import { UserProfile } from './types';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<{product: Product, artisan: Artisan} | null>(null);
  const [cart, setCart] = useState<Product[]>([]);
  const [notification, setNotification] = useState<string | null>(null);
  
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    return authService.getCurrentUser();
  });

  const [currentArtisan, setCurrentArtisan] = useState<ArtisanSeller | null>(() => {
    const saved = localStorage.getItem('artisanData');
    return saved ? JSON.parse(saved) : null;
  });
  const [currentAdmin, setCurrentAdmin] = useState<any>(() => {
    const saved = localStorage.getItem('adminData');
    return saved ? JSON.parse(saved) : null;
  });

  // Keep legacy states synced with new unified user for now
  useEffect(() => {
    if (currentUser) {
      analytics.setUserId(currentUser.uid);
      if (currentUser.role === 'artisan') {
        setCurrentArtisan(currentUser as any);
      } else if (currentUser.role === 'admin') {
        setCurrentAdmin(currentUser as any);
      }
    } else {
      setCurrentArtisan(null);
      setCurrentAdmin(null);
    }
  }, [currentUser]);

  // Track initial visit and page changes
  useEffect(() => {
    analytics.trackVisit();
  }, []);

  useEffect(() => {
    analytics.trackEvent('view', 'navigation', 'page_change', currentPage);
  }, [currentPage]);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const addToCart = (product: Product) => {
    setCart([...cart, product]);
    showNotification(`Added ${product.name} to cart!`);
  };

  const openPlaceDetail = (place: Place) => {
    setSelectedPlace(place);
    setCurrentPage('place-detail');
  };

  const openProductDetail = (product: Product, artisan: Artisan) => {
    setSelectedProduct({ product, artisan });
    setCurrentPage('product-detail');
  };

  const handleSellerLoginSuccess = (token: string, artisan: ArtisanSeller) => {
    localStorage.setItem('artisanToken', token);
    localStorage.setItem('artisanData', JSON.stringify(artisan));
    setCurrentArtisan(artisan);
    setCurrentPage('seller-dashboard');
    showNotification("Welcome back to your workshop!");
  };

  const handleSellerLogout = () => {
    localStorage.removeItem('artisanToken');
    localStorage.removeItem('artisanData');
    setCurrentArtisan(null);
    setCurrentPage('home');
    showNotification("Logged out successfully.");
  };

  const handleAdminLoginSuccess = (token: string, admin: any) => {
    localStorage.setItem('adminToken', token);
    localStorage.setItem('adminData', JSON.stringify(admin));
    setCurrentAdmin(admin);
    setCurrentPage('admin-dashboard');
    showNotification("Access granted to control center.");
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    setCurrentAdmin(null);
    setCurrentPage('home');
    showNotification("Admin session terminated.");
  };

  const handleAuthSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    if (user.role === 'admin') {
      setCurrentPage('admin-dashboard');
      showNotification("Admin access granted.");
    } else if (user.role === 'artisan') {
      setCurrentPage('seller-dashboard');
      showNotification("Welcome back, Artisan!");
    } else {
      setCurrentPage('home');
      showNotification(`Welcome, ${user.displayName}!`);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('home');
    showNotification("Logged out successfully.");
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home setPage={(p) => {
          if (p === 'profile' && !currentUser) {
            setCurrentPage('auth');
          } else {
            setCurrentPage(p);
          }
        }} onPlaceClick={openPlaceDetail} />;
      case 'auth':
        return <Auth onBack={() => setCurrentPage('home')} onSuccess={handleAuthSuccess} />;
      case 'profile':
        return currentUser ? (
          <Profile user={currentUser} onLogout={handleLogout} onNavigate={setCurrentPage} />
        ) : <Auth onBack={() => setCurrentPage('home')} onSuccess={handleAuthSuccess} />;
      case 'discover':
        return <Discover onPlaceClick={openPlaceDetail} />;
      case 'artisans':
        return <Artisans 
          onProductClick={openProductDetail} 
          onAddToCart={addToCart} 
        />;
      case 'food':
        return <Food />;
      case 'planner':
        return <Planner onNotify={showNotification} />;
      case 'vlogs':
        return <Vlogs onNotify={showNotification} />;
      case 'map':
        return <MapPage />;
      case 'place-detail':
        return selectedPlace ? (
          <PlaceDetail 
            place={selectedPlace} 
            onBack={() => setCurrentPage('discover')} 
            onNavigate={(id) => {
              const next = HIDDEN_GEMS.find(p => p.id === id);
              if (next) openPlaceDetail(next);
            }}
          />
        ) : <Discover onPlaceClick={openPlaceDetail} />;
      case 'product-detail':
        return selectedProduct ? (
          <ProductDetail 
            product={selectedProduct.product} 
            artisan={selectedProduct.artisan}
            onBack={() => setCurrentPage('artisans')}
            onAddToCart={addToCart}
          />
        ) : <Artisans onProductClick={openProductDetail} onAddToCart={addToCart} />;
      case 'seller-login':
        return <SellerLogin 
          onBack={() => setCurrentPage('home')} 
          onRegister={() => setCurrentPage('seller-register')}
          onSuccess={handleSellerLoginSuccess}
        />;
      case 'seller-register':
        return <SellerRegister 
          onBack={() => setCurrentPage('seller-login')} 
          onLogin={() => setCurrentPage('seller-login')}
          onSuccess={() => {
            setCurrentPage('seller-login');
            showNotification("Registration successful! Please login.");
          }}
        />;
      case 'seller-dashboard':
        return currentArtisan ? (
          <SellerDashboard 
            artisan={currentArtisan} 
            onLogout={handleSellerLogout}
            onManageProducts={() => setCurrentPage('seller-products')}
            onViewOrders={() => setCurrentPage('seller-orders')}
          />
        ) : <SellerLogin onBack={() => setCurrentPage('home')} onRegister={() => setCurrentPage('seller-register')} onSuccess={handleSellerLoginSuccess} />;
      case 'seller-products':
        return currentArtisan ? (
          <ProductManagement 
            artisan={currentArtisan} 
            onBack={() => setCurrentPage('seller-dashboard')}
            onNotify={showNotification}
          />
        ) : <SellerLogin onBack={() => setCurrentPage('home')} onRegister={() => setCurrentPage('seller-register')} onSuccess={handleSellerLoginSuccess} />;
      case 'seller-orders':
        return currentArtisan ? (
          <SellerOrders 
            artisan={currentArtisan} 
            onBack={() => setCurrentPage('seller-dashboard')}
          />
        ) : <SellerLogin onBack={() => setCurrentPage('home')} onRegister={() => setCurrentPage('seller-register')} onSuccess={handleSellerLoginSuccess} />;
      case 'admin-login':
        return <AdminLogin 
          onBack={() => setCurrentPage('home')} 
          onSuccess={handleAdminLoginSuccess} 
        />;
      case 'admin-dashboard':
        return currentAdmin ? (
          <AdminDashboard 
            onLogout={handleAdminLogout}
            onNavigate={(p) => setCurrentPage(p)}
          />
        ) : <AdminLogin onBack={() => setCurrentPage('home')} onSuccess={handleAdminLoginSuccess} />;
      default:
        return <Home setPage={setCurrentPage} onPlaceClick={openPlaceDetail} />;
    }
  };

  return (
    <div className="min-h-screen bg-heritage-cream font-sans max-w-md mx-auto shadow-2xl relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage + (selectedPlace?.id || '') + (selectedProduct?.product.id || '')}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          {renderPage()}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-24 left-1/2 z-[100] bg-heritage-brown text-white px-6 py-3 rounded-full flex items-center gap-2 shadow-2xl border border-orange-100/20"
          >
            <CheckCircle2 size={18} className="text-heritage-orange" />
            <span className="text-sm font-bold">{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav currentPage={currentPage} setPage={setCurrentPage} />
    </div>
  );
}

