/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  User as FirebaseUser
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { UserProfile } from '../types';
import { analytics } from './analyticsService';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

class AuthService {
  private currentUser: UserProfile | null = null;
  private sessionId: string | null = null;

  constructor() {
    this.currentUser = JSON.parse(localStorage.getItem('userProfile') || 'null');
    this.sessionId = localStorage.getItem('sessionId');
    
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // We handle sync on login/signup, but we could re-sync here if needed
        console.log("Firebase Auth State: Logged in", firebaseUser.email);
      } else {
        console.log("Firebase Auth State: Logged out");
      }
    });
  }

  getCurrentUser(): UserProfile | null {
    return this.currentUser;
  }

  async loginWithGoogle(): Promise<UserProfile> {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const { user: firebaseUser } = result;

      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL
        })
      });

      if (!response.ok) throw new Error('Failed to sync with backend');
      
      const { token, user } = await response.json();
      this.saveSession(token, user);
      await this.startSessionLog(user.uid);
      
      analytics.trackActivity('login', `Logged in via Google as ${user.displayName}`, { role: user.role });
      return user;
    } catch (error: any) {
      console.error("Google Login Error:", error);
      throw error;
    }
  }

  async loginWithEmail(email: string, pass: string): Promise<UserProfile> {
    try {
      // 1. Backend Login
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Backend authentication failed');
      }

      const { token, user } = await response.json();
      this.saveSession(token, user);
      await this.startSessionLog(user.uid || user.id);
      
      analytics.trackActivity('login', `Logged in as ${user.displayName}`, { role: user.role });
      
      // Optional: Try Firebase Client login if enabled, ignore if disabled
      try {
        await signInWithEmailAndPassword(auth, email, pass);
      } catch (fbErr: any) {
        console.warn("Firebase client login skipped:", fbErr.message);
      }

      return user;
    } catch (error: any) {
      console.error("Email Login Error:", error);
      throw error;
    }
  }

  async signup(email: string, pass: string, displayName: string, role: string): Promise<UserProfile> {
    try {
      // 1. Backend Registration
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass, displayName, role })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Backend registration failed');
      }

      const { token, user } = await response.json();
      this.saveSession(token, user);
      await this.startSessionLog(user.uid || user.id);

      analytics.trackActivity('register', `Registered as ${user.displayName} (${role})`);
      
      // Optional: Try Firebase Client signup if enabled, ignore if disabled
      try {
        await createUserWithEmailAndPassword(auth, email, pass);
      } catch (fbErr: any) {
        console.warn("Firebase client signup skipped:", fbErr.message);
      }

      return user;
    } catch (error: any) {
      console.error("Signup Error:", error);
      throw error;
    }
  }

  async logout() {
    try {
      if (this.sessionId) {
        await fetch('/api/auth/session/end', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId: this.sessionId })
        });
      }
      
      await signOut(auth);
      
      const lastUser = this.currentUser;
      this.currentUser = null;
      this.sessionId = null;
      localStorage.removeItem('authToken');
      localStorage.removeItem('userProfile');
      localStorage.removeItem('sessionId');
      localStorage.removeItem('artisanToken'); // Cleanup legacy tokens
      localStorage.removeItem('adminToken');
      
      if (lastUser) {
        analytics.trackActivity('logout', `User ${lastUser.displayName} logged out`);
      }
    } catch (error) {
      console.error("Logout Error:", error);
    }
  }

  private saveSession(token: string, user: UserProfile) {
    this.currentUser = user;
    localStorage.setItem('authToken', token);
    localStorage.setItem('userProfile', JSON.stringify(user));
    // For legacy compatibility during migration
    if (user.role === 'artisan') {
      localStorage.setItem('artisanToken', token);
      localStorage.setItem('artisanData', JSON.stringify(user));
    }
    if (user.role === 'admin') {
      localStorage.setItem('adminToken', token);
      localStorage.setItem('adminData', JSON.stringify(user));
    }
  }

  private async startSessionLog(userId: string) {
    try {
      const response = await fetch('/api/auth/session/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          device: this.getDeviceType(),
          browser: navigator.userAgent
        })
      });
      const { sessionId } = await response.json();
      this.sessionId = sessionId;
      localStorage.setItem('sessionId', sessionId);
    } catch (err) {
      console.warn("Session logging failed", err);
    }
  }

  private getDeviceType(): string {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return "tablet";
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(ua)) return "mobile";
    return "desktop";
  }
}

export const authService = new AuthService();
