// src/types/profile.ts

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  plan?: string;
  usage?: number;
  maxUsage?: number;
}

export interface Prediction {
  _id: string;
  ticker: string;
  createdAt: string;
  accuracy?: number;
  result?: string;
  type?: string;
}

export interface WatchlistItem {
  _id: string;
  ticker: string;
}

export interface Stats {
  accuracy: number;
  total: number;
}

export interface Feedback {
  _id: string;
  userId: string;
  message: string;
  createdAt: string;
}

export interface Subscription {
  plan: string;
  usage: number;
  maxUsage: number;
  renewalDate: string;
}

export interface AlertPreferences {
  dailyEmail: boolean;
  sms: boolean;
}

export interface SecuritySettings {
  twoFAEnabled: boolean;
}
