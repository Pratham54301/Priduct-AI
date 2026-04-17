export interface AdminUser {
  id: string;
  fullName: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  isActive?: boolean;
  membership: 'free' | 'premium' | 'lifetime';
  createdAt: string;
  isProfileComplete: boolean;
}

export interface AdminPrediction {
  _id: string;
  symbol: string;
  exchange: string;
  status: 'ok' | 'insufficient_data' | 'stale_data';
  current_price: number;
  confidence?: number;
  rationale?: string;
  createdAt: string;
  customer?: {
    _id: string;
    email?: string;
    name?: string;
    fullName?: string;
    membership?: string;
    role?: string;
  };
  market_sentiment?: string;
}

export interface AdminTrendPoint {
  date: string;
  users: number;
  predictions: number;
}

export interface AdminSettings {
  aiPrompt: string;
  featureToggles: {
    aiPredictionsEnabled: boolean;
    premiumSystemEnabled: boolean;
    emailAlertsEnabled: boolean;
  };
  marketSentiment: {
    mode: 'auto' | 'manual';
    value: 'bullish' | 'bearish' | 'neutral';
    note?: string;
  };
  paymentConfig: {
    stripeEnabled: boolean;
    razorpayEnabled: boolean;
    currency: string;
    premiumMonthlyPrice: number;
    lifetimePrice: number;
  };
  apiUsage?: {
    totalPredictionRequests: number;
    geminiRequestCount: number;
    geminiErrorCount: number;
    lastErrorAt?: string;
    lastErrorMessage?: string;
  };
}

export const adminService = {
  async getUsers(params?: URLSearchParams): Promise<{ data: AdminUser[]; pagination?: any }> {
    const query = params?.toString();
    const res = await fetch(`/api/admin/users${query ? `?${query}` : ''}`, {
      credentials: 'include',
      cache: 'no-store',
    });
    const payload = await res.json();
    if (!res.ok || !payload.success) throw new Error(payload.message || 'Failed to fetch users');
    return payload;
  },

  async getUserDetails(id: string): Promise<any> {
    const res = await fetch(`/api/admin/users/${id}`, {
      credentials: 'include',
      cache: 'no-store',
    });
    const payload = await res.json();
    if (!res.ok || !payload.success) throw new Error(payload.message || 'Failed to fetch user details');
    return payload.data;
  },

  async updateMembership(id: string, membership: 'free' | 'premium' | 'lifetime'): Promise<void> {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ membership }),
    });
    const payload = await res.json();
    if (!res.ok || !payload.success) throw new Error(payload.message || 'Failed to update membership');
  },

  async getPredictionLogs(params?: URLSearchParams): Promise<{ data: AdminPrediction[]; pagination?: any }> {
    const query = params?.toString();
    const res = await fetch(`/api/admin/predictions${query ? `?${query}` : ''}`, {
      credentials: 'include',
      cache: 'no-store',
    });
    const payload = await res.json();
    if (!res.ok || !payload.success) throw new Error(payload.message || 'Failed to fetch prediction logs');
    return payload;
  },

  async updateUser(id: string, data: Partial<Pick<AdminUser, 'fullName' | 'name' | 'role' | 'membership'>>): Promise<void> {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const payload = await res.json();
    if (!res.ok || !payload.success) throw new Error(payload.message || 'Failed to update user');
  },

  async updateUserStatus(id: string, isActive: boolean): Promise<void> {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive }),
    });
    const payload = await res.json();
    if (!res.ok || !payload.success) throw new Error(payload.message || 'Failed to update user status');
  },

  async deleteUser(id: string): Promise<void> {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    const payload = await res.json();
    if (!res.ok || !payload.success) throw new Error(payload.message || 'Failed to delete user');
  },

  async deletePrediction(id: string): Promise<void> {
    const res = await fetch(`/api/admin/predictions?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    const payload = await res.json();
    if (!res.ok || !payload.success) throw new Error(payload.message || 'Failed to delete prediction');
  },

  async getPremiumAnalytics(): Promise<{
    data: {
      totalUsers: number;
      freeUsers: number;
      premiumUsers: number;
      lifetimeUsers: number;
      activeSubscriptions: number;
      totalEarnings: number;
      paymentIntegration: {
        stripeEnabled: boolean;
        razorpayEnabled: boolean;
        currency: string;
      };
      conversionRate: number;
      premiumUsersList: Array<{
        id: string;
        fullName: string;
        email: string;
        membership: string;
        isActive: boolean;
        joinedAt: string;
      }>;
      recentSubscriptions: Array<{
        _id: string;
        plan: string;
        status: string;
        createdAt: string;
        user?: { email?: string; fullName?: string; name?: string; membership?: string };
      }>;
    };
  }> {
    const res = await fetch('/api/admin/premium', {
      credentials: 'include',
      cache: 'no-store',
    });
    const payload = await res.json();
    if (!res.ok || !payload.success) throw new Error(payload.message || 'Failed to fetch premium analytics');
    return payload;
  },

  async getDashboardAnalytics(): Promise<{
    data: {
      totalUsers: number;
      totalPredictions: number;
      activeUsersToday: number;
      premiumUsers: number;
      trends: AdminTrendPoint[];
    };
  }> {
    const res = await fetch('/api/admin/analytics', {
      credentials: 'include',
      cache: 'no-store',
    });
    const payload = await res.json();
    if (!res.ok || !payload.success) throw new Error(payload.message || 'Failed to fetch analytics');
    return payload;
  },

  async getSubscriptions(): Promise<{
    data: Array<{
      id: string;
      userId: string;
      userName: string;
      userEmail: string;
      plan: string;
      status: string;
      source: string;
      startedAt: string;
      expiresAt?: string | null;
      amountPaid?: number;
      currency?: string;
    }>;
  }> {
    const res = await fetch('/api/admin/subscriptions', {
      credentials: 'include',
      cache: 'no-store',
    });
    const payload = await res.json();
    if (!res.ok || !payload.success) throw new Error(payload.message || 'Failed to fetch subscriptions');
    return payload;
  },

  async upsertSubscription(userId: string, plan: 'free' | 'premium' | 'lifetime', expiresAt?: string): Promise<void> {
    const res = await fetch('/api/admin/subscriptions', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, plan, expiresAt }),
    });
    const payload = await res.json();
    if (!res.ok || !payload.success) throw new Error(payload.message || 'Failed to update subscription');
  },

  async getSettings(): Promise<{ data: AdminSettings }> {
    const res = await fetch('/api/admin/settings', {
      credentials: 'include',
      cache: 'no-store',
    });
    const payload = await res.json();
    if (!res.ok || !payload.success) throw new Error(payload.message || 'Failed to fetch settings');
    return payload;
  },

  async updateSettings(update: Partial<AdminSettings>): Promise<{ data: AdminSettings }> {
    const res = await fetch('/api/admin/settings', {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(update),
    });
    const payload = await res.json();
    if (!res.ok || !payload.success) throw new Error(payload.message || 'Failed to update settings');
    return payload;
  },

  async getApiUsage(): Promise<{
    data: {
      counters: {
        totalPredictionRequests: number;
        geminiRequestCount: number;
        geminiErrorCount: number;
        lastErrorAt?: string;
        lastErrorMessage?: string;
      };
      recentLogs: Array<{
        _id: string;
        status: 'success' | 'error';
        message?: string;
        createdAt: string;
      }>;
      recentErrors: Array<{
        _id: string;
        status: 'error';
        message?: string;
        createdAt: string;
      }>;
    };
  }> {
    const res = await fetch('/api/admin/api-usage', {
      credentials: 'include',
      cache: 'no-store',
    });
    const payload = await res.json();
    if (!res.ok || !payload.success) throw new Error(payload.message || 'Failed to fetch API usage');
    return payload;
  },
};
