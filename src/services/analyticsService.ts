/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AnalyticsEvent, VisitLog } from "../types";

class AnalyticsService {
  private userId: string | null = localStorage.getItem('userId');
  private sessionId: string = Math.random().toString(36).substring(7);

  constructor() {
    if (!this.userId) {
      this.userId = 'anon-' + Math.random().toString(36).substring(7);
      localStorage.setItem('userId', this.userId);
    }
  }

  setUserId(id: string) {
    this.userId = id;
    localStorage.setItem('userId', id);
  }

  private getDeviceType(): string {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return "tablet";
    }
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(ua)) {
      return "mobile";
    }
    return "desktop";
  }

  async trackActivity(type: string, message: string, metadata?: any) {
    const userProfile = JSON.parse(localStorage.getItem('userProfile') || 'null');
    const activity = {
      userId: this.userId,
      username: userProfile?.displayName || localStorage.getItem('displayName') || localStorage.getItem('artisanName') || 'Guest Explorer',
      role: userProfile?.role || localStorage.getItem('userRole') || 'visitor',
      activityType: type,
      activityMessage: message,
      pageVisited: window.location.pathname,
      deviceType: this.getDeviceType(),
      ...metadata
    };

    try {
      await fetch('/api/track/activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activity)
      });
    } catch (err) {
      console.warn("Activity tracking failed", err);
    }
  }

  async trackEvent(type: AnalyticsEvent['type'], category: string, action: string, label?: string, value?: number) {
    const event: AnalyticsEvent = {
      userId: this.userId || undefined,
      type,
      category,
      action,
      label,
      value,
      path: window.location.pathname,
      timestamp: new Date().toISOString(),
      device: this.getDeviceType(),
    };

    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
      });
    } catch (err) {
      console.warn("Analytics failed", err);
    }
  }

  async trackVisit() {
    const visit: VisitLog = {
      userId: this.userId || undefined,
      path: window.location.pathname,
      referrer: document.referrer,
      device: this.getDeviceType(),
      browser: navigator.userAgent,
      os: navigator.platform,
      timestamp: new Date().toISOString()
    };

    try {
      await fetch('/api/analytics/visit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(visit)
      });
    } catch (err) {
      console.warn("Visit tracking failed", err);
    }
  }
}

export const analytics = new AnalyticsService();
