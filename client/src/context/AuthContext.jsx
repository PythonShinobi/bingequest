// client/src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

import apiClient from "../apiClient.js";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const sessionToken = Cookies.get('session_token');
    
    if (sessionToken) {      
      setIsAuthenticated(true);
      // Optionally fetch user details from your API to set the user state
      // fetchUserDetails(sessionToken);
      // For example, if you want to set the user data from local storage:
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser) {
        setUser(storedUser);
      }
    }
  }, []);

  const login = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData)); // Store user data
  };

  const logout = async () => {
    const sessionToken = getCookie('session_token');
    await apiClient.post('/api/logout', { session_token: sessionToken });
    setIsAuthenticated(false);
    setUser(null);
    Cookies.remove('session_token'); // Remove the token on logout
    localStorage.removeItem('user'); // Remove user data from local storage
  };

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};