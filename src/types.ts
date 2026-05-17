/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Page = 'home' | 'discover' | 'artisans' | 'food' | 'planner' | 'vlogs' | 'vlog-upload' | 'map' | 'place-detail' | 'product-detail' | 'seller-login' | 'seller-register' | 'seller-dashboard' | 'seller-products' | 'seller-orders' | 'admin-login' | 'admin-dashboard' | 'admin-users' | 'admin-artisans' | 'admin-orders' | 'auth' | 'profile';

export type UserRole = 'customer' | 'artisan' | 'admin';

export interface Vlog {
  id: string;
  uploaderId?: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl?: string;
  youtubeLink?: string;
  creatorName: string;
  relatedPlace?: string;
  category: string;
  likes: number;
  shares: number;
  views: number;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  role: UserRole;
  artisanId?: string;
  lastActive?: string;
  createdAt: string;
}

export interface AnalyticsEvent {
  id?: string;
  userId?: string;
  type: 'click' | 'view' | 'interaction' | 'search';
  category: string;
  action: string;
  label?: string;
  value?: number;
  path: string;
  timestamp: string;
  device: string;
  location?: string;
}

export interface VisitLog {
  id?: string;
  userId?: string;
  path: string;
  referrer?: string;
  duration?: number;
  device: string;
  browser: string;
  os: string;
  timestamp: string;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  role: 'customer' | 'artisan' | 'admin';
  artisanId?: string;
  createdAt: string;
  lastLogin?: string;
  lastActive?: string;
  profileImage?: string;
}

export interface Session {
  id?: string;
  userId: string;
  loginTime: string;
  logoutTime?: string;
  device?: string;
  browser?: string;
  ipAddress?: string;
}

export interface ActivityLog {
  id?: string;
  userId: string;
  username?: string;
  role: string;
  activityType: string;
  activityMessage: string;
  pageVisited?: string;
  productId?: string;
  placeId?: string;
  timestamp: string;
  deviceType?: string;
  location?: string;
}

export interface AdminStats {
  totalUsers: number;
  activeUsersToday: number;
  newUsersToday: number;
  totalArtisans: number;
  pendingArtisans: number;
  totalProducts: number;
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  visitsToday: number;
  popularPages: { path: string; count: number }[];
  deviceBreakdown: { device: string; count: number }[];
}

export interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  description: string;
}

export interface Place {
  id: string;
  name: string;
  rating: number;
  distance: string;
  description: string;
  image: string;
  category: 'Nature' | 'Heritage' | 'Religious' | 'Villages & Crafts' | 'Adventure';
  timeRequired: string;
  travelNote: string;
  story?: string;
  history?: string;
  legend?: string;
  whyVisit?: string;
  nearbyFoodIds?: string[];
  nextDestinationId?: string;
  nextDestinationDistance?: string;
  nextDestinationTime?: string;
}

export interface Artisan {
  id: string;
  name: string;
  craft: string;
  experience: string;
  location: string;
  about: string;
  products: Product[];
  image: string;
  story?: string;
  history?: string;
  legend?: string;
}

export interface ArtisanSeller {
  id: string;
  artisanName: string;
  email: string;
  phoneNumber: string;
  craftType: string;
  experience: string;
  location: string;
  bio: string;
  profileImage?: string;
  workshopImages?: string[];
  verificationStatus: 'pending' | 'verified' | 'rejected';
  createdAt: string;
}

export interface ArtisanProduct extends Product {
  artisanId: string;
  stock: number;
  category: string;
  productImages: string[];
  handmadeDetails: string;
  deliveryTime: string;
  featuredProduct: boolean;
  ratings: number;
  reviewsCount: number;
}

export interface Order {
  id: string;
  artisanId: string;
  customerId: string;
  customerName: string;
  productId: string;
  productName: string;
  quantity: number;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  createdAt: string;
}

export interface Food {
  id: string;
  name: string;
  bestPlace: string;
  priceRange: string;
  description: string;
  image: string;
  category: 'Full Meal' | 'Snacks' | 'Sweets' | 'Beverage';
}

export interface ItineraryActivity {
  time: string;
  title: string;
  location: string;
  description: string;
  estimatedCost: string;
}

export interface DayPlan {
  day: number;
  activities: ItineraryActivity[];
}

export interface Itinerary {
  days: DayPlan[];
}
