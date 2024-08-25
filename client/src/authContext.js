// client/src/authContext.js
import React, { createContext, useState, useContext, useEffect } from "react";

import apiClient from "./apiClient.js";

// Create the AuthContext.
const AuthContext = createContext();

// Create the AuthProvider component.
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')) || null);
  const [err, setErr] = useState(""); // State to store error messages

  const checkSession = async () => {    
    try {
      const response = await apiClient.get('/api/check-session'); // Endpoint to verify session
      if (response.status === 200) {
        setUser(response.data); // Update user state if session is active
        localStorage.setItem('user', JSON.stringify(response.data)); // Cache user data                
        setErr(""); // Clear any previous errors
      } else {
        setUser(null); // Clear user if session is not active
        localStorage.removeItem('user'); // Remove cached user data
        setErr(response.data.message); // Optionally set an error message
      }      
    } catch (error) {
      setUser(null); // Clear user on error
      localStorage.removeItem('user'); // Remove cached user data
      console.error('No active session:', error);      
    }
  };  

  // Run every 1 day to check if the session has expired.
  useEffect(() => {
    const checkInterval = setInterval(checkSession, 24 * 60 * 60 * 1000); // Check every day
    return () => clearInterval(checkInterval); // Clean up interval on unmount
  }, []);

  // Log in a user.
  const login = async (username, password) => {
    try {
      const response = await apiClient.post('/api/login', { username, password });
      if (response.status === 200) {
        setUser(response.data);
        localStorage.setItem('user', JSON.stringify(response.data)); // Cache user data
        setErr(""); // Clear any previous errors
        return response.status; // Return the status code
      } else {
        setErr(response.data.message || "Login failed.");
      }
    } catch (err) {
      console.error(`Login error: ${err.message}`);
      setErr(err.response?.data?.message || err.message || "An unexpected error occurred.");
      return err.response?.status || 500; // Return the error status code
    }
  };

  // Register a user.
  const register = async (username, email, password) => {
    try {
      const response = await apiClient.post('/api/register', { username, email, password });
      if (response.status === 201) {
        setUser(response.data);
        localStorage.setItem('user', JSON.stringify(response.data)); // Cache user data
        setErr(""); // Clear any previous errors
        return response.status; // Return the status code
      } else {
        setErr(response.data.message || "Registration failed.");
      }
    } catch (err) {
      console.error(`Registration error: ${err.message}`);
      setErr(err.response?.data?.message || err.message || "An unexpected error occurred.");
      return err.response?.status || 500; // Return the error status code
    }
  };

  // Log out a user
  const logout = async () => {
    try {
      const response = await apiClient.get('/api/logout');
      console.log('Logout response: ', response);
      if (response.status === 200) {                
        setErr(""); // Clear any previous errors        
        return response.status;   
      } else {
        // Handle any non-200 responses
        console.error('Unexpected response status:', response.status);        
      }
    } catch (error) {
      // Handle errors from the request
      console.error('Error logging out:', error);
      // Display an error message or take appropriate action
    }
  };

  // Check if the user is authenticated.
  const isAuthenticated = () => !!user;

  return (
    <AuthContext.Provider value={{ user, err, login, register, logout, isAuthenticated, checkSession }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);