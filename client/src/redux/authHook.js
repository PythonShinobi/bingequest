// client/src/redux/authHooks.js

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import apiClient from "../apiClient";

/**
 * Fetch user data from the given URL using axios.
 *
 * @param {string} url - The URL to fetch user data from.
 * @returns {Promise<Object>} A promise that resolves to an object containing the user data.
 * @throws {Error} Throws an error if the request fails.
 */
const fetchUser = async (url) => {
  try {
    const response = await apiClient.get(url);
    console.log('Fetched user data: ', response);
    return { user: response.data || null };
  } catch (error) {
    console.error('Error fetching user data:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      response: error.response,
      config: error.config,
      code: error.code,
      time: new Date().toISOString(),
    });
    throw error;
  }
};

/**
 * Custom hook to manage user authentication and redirection logic.
 * @param {Object} options - Options object.
 * @param {string} options.redirectTo - Path to redirect if user is not authenticated.
 * @param {boolean} options.redirectIfFound - Redirect if user is already authenticated.
 * @returns {boolean} True if user is authenticated, false otherwise.
 */
const useIsAuthenticated = ({ redirectTo, redirectIfFound } = {}) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { user } = await fetchUser("/api/user");
        console.log(user);
        setIsAuthenticated(!!user);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setIsAuthenticated(false);
      } finally {
        setFinished(true);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (!redirectTo || !finished) return;

    if (
      (redirectTo && !redirectIfFound && !isAuthenticated) ||
      (redirectIfFound && isAuthenticated)
    ) {
      navigate(redirectTo);
    }
  }, [redirectTo, redirectIfFound, finished, isAuthenticated, navigate]);

  return isAuthenticated;
};

export default useIsAuthenticated;