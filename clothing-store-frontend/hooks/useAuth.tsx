'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types/user';
import { jwtDecode } from 'jwt-decode'; 


interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

// Create the Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider component
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Tracks initial loading of auth state
  const [error, setError] = useState<string | null>(null);

  // Effect to load token and decode user data from localStorage on initial mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        const decoded: any = jwtDecode(storedToken);

        // Basic check for token expiration
        if (decoded.exp * 1000 < Date.now()) {
          console.warn('JWT token expired.');
          localStorage.removeItem('token');
          localStorage.removeItem('currentUserData'); // Also clear old user data
          setUser(null);
          setToken(null);
          setError('Session expired. Please log in again.');
        } else {
          // Construct User object from decoded JWT payload
          const userObj: User = {
            _id: decoded.sub, // 'sub' is standard for subject (user ID)
            createdAt: decoded.createdAt,
            updatedAt: decoded.updatedAt,
            username: decoded.username,
            email: decoded.email,
            firstName: decoded.firstName || '',
            lastName: decoded.lastName || '',
            address: decoded.address || '',
            phoneNumber: decoded.phoneNumber || '',
          };
          setUser(userObj);
          setToken(storedToken);
          localStorage.setItem('currentUserData', JSON.stringify(userObj));
        }
      } catch (err) {
        console.error('Failed to decode JWT or retrieve user data:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('currentUserData');
        setUser(null);
        setToken(null);
        setError('Invalid session. Please log in again.');
      }
    }
    setIsLoading(false); 
  }, []); // Empty dependency array ensures this runs only once on mount


  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('currentUserData'); // Clear user data too
    }
  }, [token]);

  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('isLoggedIn'); 
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token'); 
    localStorage.removeItem('currentUserData'); 
    localStorage.removeItem('shoppingCart'); 
    localStorage.removeItem('salesHistory'); 
    setError(null);
  };

  const value = {
    user,
    token,
    isLoading,
    error,
    setUser,
    setToken,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to consume the Auth Context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}