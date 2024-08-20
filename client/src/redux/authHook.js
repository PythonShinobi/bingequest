// client/src/redux/authHooks.js

// `hooks.js` provides a reusable mechanism to fetch user data asynchronously,
// manage authentication state, and handle redirection based on authentication status 
// within your React application.

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useSWR from "swr";

import apiClient from "../apiClient";

/**
 * Fetcher function to fetch user data from the given URL and return a user object.
 *
 * This function makes an HTTP GET request using axios, including cookies in the request header.
 * It captures cookies from the browser's cookie storage associated with the requested 
 * domain and appends them to the request headers.
 *
 * @param {string} url - The URL to fetch user data from.
 * @returns {Promise<Object>} A promise that resolves to an object containing the user data.
 * @throws {Error} Throws an error if the request fails.
 */
const fetcher = async (url) => {
  try {
    const response = await apiClient.get(url);
    console.log('Fetched user data: ', response.data)

    // Extract the user data from the response and return it.
    const user = response.data || null;  

    return { user };
  } catch (error) {
    console.error('Error fetching user data:', error.response || error.message || error);
    throw error; // Re-throw the error for the caller to handle.
  }
};

/**
 * Custom hook to manage user authentication and redirection logic.
 * @param {Object} options - Options object.
 * @param {string} options.redirectTo - Path to redirect if user is not authenticated.
 * @param {boolean} options.redirectIfFound - Redirect if user is already authenticated.
 * @returns {Object|null} The user object if authenticated and data fetch successful, or null if there's an error or user is not authenticated.
 */
const useIsAuthenticated = ({ redirectTo, redirectIfFound } = {}) => {
  const navigate = useNavigate();
  const { data, error } = useSWR("/api/user", fetcher, { revalidateOnFocus: true });
  const [authStatus, setAuthStatus] = useState("loading"); // State to track auth status
  const user = data || "guest"; // Use "guest" as a fallback if no user data is found  
  const finished = Boolean(data || error); // Check if data fetching is complete.
  const hasUser = user !== "guest"; // Check if user data exists.

  useEffect(() => {
    if (finished) {
      if (hasUser) {
        setAuthStatus("loggedIn");
        if (redirectIfFound && redirectTo) {
          navigate(redirectTo); // Redirect if user is already authenticated.
        }
      } else {
        setAuthStatus("loggedOut");
        if (redirectTo && !redirectIfFound) {
          navigate(redirectTo); // Redirect if user is not authenticated.
        }
      }
    }
  }, [finished, hasUser, redirectTo, redirectIfFound, navigate]);

  // Return user if authenticated, or "guest" if not.
  return authStatus === "loggedIn" ? user : "guest";
};

export default useIsAuthenticated;