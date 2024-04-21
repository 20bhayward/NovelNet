import React, { createContext, useState, useEffect } from 'react';
import axios from '../services/api';
import api from '../services/api';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  isAdmin: boolean;
  login: (user: any, token: string) => void;
  logout: () => void;
  register: (user: any, token: string) => void;
}

export const AuthContext = createContext<AuthContextType>(
  {
    isAuthenticated: false,
    user: null,
    isAdmin: false,
    login: () => { },
    logout: () => { },
    register: () => { },
  });

interface User {
  userId: string;
  username: string;
  role: string;
  profilePicture: string;
  uniqueId: string;
}

interface Review {
  userId: string;
  username: string;
  rating: number;
  comment: string;
  mangaId: string;
}

export const AuthProvider: React.FC = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [review, setReview] = useState<Review | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('/api/users/profile');
        if (response.data) {
          setUser(response.data);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setIsAuthenticated(false);
        setUser(null);
      }
    };
    // const fetchReviewData = async () => {
    //   try {
    //     const response = await axios.get('/api/manga/:mangaId/reviews');
    //     if (response.data) {
    //       setReview(response.data);
    //       setIsAuthenticated(true);
    //     }
    //     else {
    //       setIsAuthenticated(false);
    //       setReview(null);
    //     }
    //   }
    //   catch (error) {
    //     console.error('Error fetching user data:', error);
    //     setIsAuthenticated(false);
    //     setUser(null);
    //   }
    // };
    // fetchReviewData();
    fetchUserData();
  }, []);

  const login = (user: any, token: string) => {
    localStorage.setItem('token', token);
    setUser(user);
    setIsAuthenticated(true);
  };
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  }; const register = async (user: any) => {
    try {
      const response = await api.post('/api/auth/register', user);
      // Redirect to the home screen 
      window.location.href = '/';
    }

    catch (error) {
      console.error('Error during registration:', error);
    }
  };
  return (<AuthContext.Provider value={{ isAuthenticated, isAdmin, user, login, logout, register }}> {children} </AuthContext.Provider>);
};