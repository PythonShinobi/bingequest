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
 * @returns {Object|null} The user object if authenticated and data fetch successful, or null if there's an error or user is not authenticated.
 */
const useIsAuthenticated = ({ redirectTo, redirectIfFound } = {}) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [finished, setFinished] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { user } = await fetchUser("/api/user");
        console.log(user.data)
        setUser(user);
      } catch (error) {
        setError(error);
        setUser(null);
      } finally {
        setFinished(true);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (!redirectTo || !finished) return;

    if (
      (redirectTo && !redirectIfFound && !user) ||
      (redirectIfFound && user)
    ) {
      navigate(redirectTo);
    }
  }, [redirectTo, redirectIfFound, finished, user, navigate]);

  return error ? null : user.id;
};

export default useIsAuthenticated;