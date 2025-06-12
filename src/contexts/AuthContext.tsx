'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthState, LoginCredentials, User } from '@/types';
import { 
  authenticate, 
  getCurrentUser, 
  isAuthenticated, 
  logout as authLogout,
  refreshSession 
} from '@/lib/auth';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null
  });

  // Check authentication status on mount and refresh
  const checkAuth = () => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const authenticated = isAuthenticated();
      const user = getCurrentUser();

      if (authenticated && user) {
        // Try to refresh session
        const refreshed = refreshSession();
        setAuthState({
          user: refreshed ? refreshed.user : user,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
      } else {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null
        });
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: 'Authentication check failed'
      });
    }
  };

  // Login function
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = authenticate(credentials);
      
      if (result) {
        setAuthState({
          user: result.user,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
        return true;
      } else {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Invalid email or password'
        }));
        return false;
      }
    } catch (error) {
      console.error('Login failed:', error);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Login failed. Please try again.'
      }));
      return false;
    }
  };

  // Logout function
  const logout = () => {
    try {
      authLogout();
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Check auth on window focus (handle tab switching)
  useEffect(() => {
    const handleFocus = () => {
      if (!authState.isLoading) {
        checkAuth();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [authState.isLoading]);

  const contextValue: AuthContextType = {
    ...authState,
    login,
    logout,
    checkAuth
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Hook for authentication requirement
export function useRequireAuth() {
  const auth = useAuth();
  
  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      // Redirect will be handled by middleware
      console.log('User not authenticated');
    }
  }, [auth.isLoading, auth.isAuthenticated]);

  return auth;
}