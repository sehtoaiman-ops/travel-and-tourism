'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  bookings?: any[];
  wishlist?: any[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Configure axios default headers
  const setAuthHeader = (authToken: string | null) => {
    if (authToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('ecovoyage_token');
    if (storedToken) {
      setToken(storedToken);
      setAuthHeader(storedToken);
      
      // Fetch user profile
      axios.get('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${storedToken}` }
      })
      .then(res => {
        if (res.data && res.data.data) {
          setUser(res.data.data.user);
        }
      })
      .catch(() => {
        // Token expired or invalid
        localStorage.removeItem('ecovoyage_token');
        setToken(null);
        setAuthHeader(null);
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const login = (jwtToken: string, userData: User) => {
    localStorage.setItem('ecovoyage_token', jwtToken);
    setToken(jwtToken);
    setAuthHeader(jwtToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('ecovoyage_token');
    setToken(null);
    setAuthHeader(null);
    setUser(null);
  };

  const refreshUser = async () => {
    if (!token) return;
    try {
      const res = await axios.get('http://localhost:5000/api/auth/me');
      if (res.data && res.data.data) {
        setUser(res.data.data.user);
      }
    } catch (error) {
      console.error('Failed to refresh user context:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
