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
  role?: string;
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

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const checkAuth = async () => {
    try {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        setLoading(false);
        return;
      }

      // Verify token with backend with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch("/api/auth/verify", {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setUser(result.data);
          setToken(storedToken);
        } else {
          throw new Error('Invalid response');
        }
      } else {
        // Token is invalid, clear storage
        localStorage.removeItem("token");
        setUser(null);
        setToken(null);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      localStorage.removeItem("token");
      setUser(null);
      setToken(null);
    } finally {
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
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success && data.data) {
        const { token, user, redirectTo } = data.data;
        setUser(user);
        setToken(token);
        localStorage.setItem("token", token);
        return { 
          success: true, 
          message: data.message || "Login successful",
          redirectTo: redirectTo || (user.role === 'admin' ? '/admin/dashboard' : '/dashboard')
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
      if (!token) {
        return { success: false, message: "Not authenticated" };
      }

      const response = await fetch("/api/auth/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
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
    localStorage.removeItem("token");
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