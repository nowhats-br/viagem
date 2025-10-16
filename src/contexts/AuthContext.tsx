import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  isAdmin: boolean;
  login: (pin: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState(sessionStorage.getItem('isAdmin') === 'true');

  const login = async (pin: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('auth_settings')
        .select('value')
        .eq('key', 'admin_pin')
        .single();

      if (error) {
        console.error('Error fetching admin PIN:', error);
        // Fallback to env variable if db fails, for development
        const fallbackPin = import.meta.env.VITE_ADMIN_PIN || '253102';
        if (pin === fallbackPin) {
          setIsAdmin(true);
          sessionStorage.setItem('isAdmin', 'true');
          return true;
        }
        return false;
      }

      if (data && pin === data.value) {
        setIsAdmin(true);
        sessionStorage.setItem('isAdmin', 'true');
        return true;
      }
      return false;
    } catch (e) {
      console.error('Login error:', e);
      return false;
    }
  };

  const logout = () => {
    setIsAdmin(false);
    sessionStorage.removeItem('isAdmin');
  };

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout }}>
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
