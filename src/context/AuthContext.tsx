"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  fullName?: string;
  name: string;
  email: string;
  phoneNumber?: string;
  phone?: string;
  address?: string;
  avatar?: string;
  role?: 'user' | 'admin' | string;
  membership?: 'free' | 'premium' | 'lifetime';
  isProfileComplete: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string; redirectTo?: string }>;
  register: (fullName: string, email: string, password: string, phoneNumber?: string, address?: string, gender?: string) => Promise<{ success: boolean; message: string; redirectTo?: string }>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const normalizeRole = (role?: string) => (String(role || 'user').toLowerCase() === 'admin' ? 'admin' : 'user');

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const checkAuth = async () => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    try {
      const controller = new AbortController();
      timeoutId = setTimeout(() => controller.abort('auth_verify_timeout'), 10000); // 10 second timeout

      const response = await fetch("/api/auth/verify", {
        credentials: 'include',
        signal: controller.signal,
      });

      if (timeoutId) clearTimeout(timeoutId);

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setUser({
            ...result.data,
            role: normalizeRole(result.data.role),
          });
          setToken(null);
        } else {
          throw new Error('Invalid response');
        }
      } else {
        setUser(null);
        setToken(null);
      }
    } catch (error: any) {
      // Timeout aborts are expected occasionally on slow startup/network.
      if (error?.name !== 'AbortError') {
        console.error("Auth check failed:", error);
      }
      setUser(null);
      setToken(null);
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string; redirectTo?: string }> => {
    try {
      setLoading(true);
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success && data.data) {
        const { token, user, redirectTo } = data.data;
        const normalizedUser = { ...user, role: normalizeRole(user.role) };
        setUser(normalizedUser);
        setToken(token);
        return { 
          success: true, 
          message: data.message || "Login successful",
          redirectTo: redirectTo || (normalizeRole(user.role) === 'admin' ? '/admin' : '/dashboard')
        };
      } else {
        return { 
          success: false, 
          message: data.message || "Invalid email or password" 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        message: "Network error, please try again later" 
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (fullName: string, email: string, password: string, phoneNumber?: string, address?: string, gender?: string): Promise<{ success: boolean; message: string; redirectTo?: string }> => {
    try {
      setLoading(true);
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({ 
          fullName, 
          email, 
          password, 
          phoneNumber: phoneNumber || '', 
          address: address || '',
          gender: gender || ''
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Don't auto-login on signup, just return success
        return { 
          success: true, 
          message: data.message || "Registration successful",
          redirectTo: '/login'
        };
      } else {
        return { 
          success: false, 
          message: data.message || "Registration failed" 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        message: "Network error, please try again later" 
      };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: Partial<User>): Promise<{ success: boolean; message: string }> => {
    try {
      if (!user) {
        return { success: false, message: "Not authenticated" };
      }

      const response = await fetch("/api/auth/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        if (result.data) {
          setUser(result.data);
        }
        return { success: true, message: result.message || "Profile updated successfully" };
      } else {
        return { success: false, message: result.message || "Update failed" };
      }
    } catch (error) {
      return { success: false, message: "Network error" };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    router.push("/");
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    checkAuth,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}; 