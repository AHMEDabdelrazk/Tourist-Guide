import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { usernameOrEmail: string; password: string }) => Promise<void>;
  register: (data: { username: string; email: string; password: string; fullName?: string; homeCountry?: string }) => Promise<void>;
  loginAsDemo: () => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('tg_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadUser() {
      const savedToken = localStorage.getItem('tg_token');
      if (savedToken) {
        try {
          const profile = await api.getCurrentUser();
          setUser(profile);
        } catch (error) {
          console.warn('Session expired or invalid token', error);
          logout();
        }
      }
      setIsLoading(false);
    }
    loadUser();
  }, []);

  const login = async (credentials: { usernameOrEmail: string; password: string }) => {
    const res = await api.login(credentials);
    localStorage.setItem('tg_token', res.token);
    setToken(res.token);
    setUser(res.user);
  };

  const register = async (data: { username: string; email: string; password: string; fullName?: string; homeCountry?: string }) => {
    const res = await api.register(data);
    localStorage.setItem('tg_token', res.token);
    setToken(res.token);
    setUser(res.user);
  };

  const loginAsDemo = async () => {
    await login({
      usernameOrEmail: 'demo_traveler',
      password: 'Password123!'
    });
  };

  const logout = () => {
    localStorage.removeItem('tg_token');
    setToken(null);
    setUser(null);
  };

  const refreshProfile = async () => {
    if (token) {
      try {
        const profile = await api.getCurrentUser();
        setUser(profile);
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        loginAsDemo,
        logout,
        refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
