import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

export interface User {
  id: number;
  username: string;
  display_name?: string;
  is_admin?: boolean;
  permissions?: string[];
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string, rememberMe: boolean) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (username: string) => Promise<void>;
  resetPassword: (token: string, username: string, password: string) => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('/api/auth/check', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        
        if (data.authenticated) {
          setUser(data.user);
        }
      } catch (err) {
        console.error('Error checking authentication status', err);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuthStatus();
  }, []);

  // Remember me functionality
  useEffect(() => {
    // Check for saved credentials
    const savedAuth = localStorage.getItem('auth');
    if (savedAuth) {
      try {
        const { username, password } = JSON.parse(savedAuth);
        if (username && password) {
          login(username, password, true).catch(console.error);
        }
      } catch (e) {
        localStorage.removeItem('auth');
      }
    }
  }, []);

  const clearError = () => setError(null);

  const login = async (username: string, password: string, rememberMe: boolean) => {
    try {
      clearError();
      setLoading(true);
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      // Always try to parse JSON, but handle cases where response might not be JSON
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        // If we can't parse JSON, create a default error message
        errorData = { message: `Error: ${response.status} ${response.statusText}` };
      }
      
      if (!response.ok) {
        throw new Error(errorData.message || 'Failed to login');
      }
      
      setUser(errorData.user);
      
      // Save credentials if remember me is checked
      if (rememberMe) {
        localStorage.setItem('auth', JSON.stringify({ username, password }));
      }
    } catch (err: any) {
      setError(err.message || 'Failed to login');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (username: string, password: string) => {
    try {
      clearError();
      setLoading(true);
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to register');
      }
      
      // Auto login after successful registration
      await login(username, password, false);
    } catch (err: any) {
      setError(err.message || 'Failed to register');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      clearError();
      setLoading(true);
      
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to logout');
      }
      
      setUser(null);
      
      // Clear saved credentials
      localStorage.removeItem('auth');
    } catch (err: any) {
      setError(err.message || 'Failed to logout');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (username: string) => {
    try {
      clearError();
      setLoading(true);
      
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to process forgot password request');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to process forgot password request');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (token: string, username: string, password: string) => {
    try {
      clearError();
      setLoading(true);
      
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, username, password }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to reset password');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

// Export Provider and Context
export { AuthContext }; 