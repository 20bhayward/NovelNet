import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  isAdmin: boolean;
  logout: () => void;
  setIsAuthenticated: (val: boolean) => void;
  setUser: (user: User) => void;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  isAdmin: false,
  logout: () => {},
  setIsAuthenticated: () => {},
  setUser: () => {},
});

interface User {
  _id: string;
  username: string;
  role: string;
  profilePicture: string;
}

export const AuthProvider: React.FC = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get('/api/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data) {
          setUser(response.data);
          setIsAuthenticated(true);
          setIsAdmin(response.data.role === 'Admin'); // Update isAdmin based on the user's role
        } else {
          setIsAuthenticated(false);
          setUser(null);
          setIsAdmin(false);
        }
      } catch (error: any) {
        if (error.response && error.response.status === 401) {
          setIsAuthenticated(false);
          setUser(null);
          setIsAdmin(false);
        } else {
          console.error('Error fetching user data:', error);
        }
      }
    };
    fetchUserData();
  }, []);

  const logout = async () => {
    try {
      // Clear the token from localStorage
      localStorage.removeItem('token');
  
      // Send a logout request to the server
      await api.post('/api/auth/logout', {}, { withCredentials: true });
  
      // Clear the user data and authentication state
      setUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, isAdmin, user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};