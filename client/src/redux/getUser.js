// client/src/redux/getUser.js

import apiClient from "../apiClient";

/**
 * Fetches the user data from the /api/user endpoint.
 *
 * This function makes an HTTP GET request using axios to fetch the user data.
 * It includes any cookies or authentication tokens in the request headers.
 *
 * @returns {Promise<Object|null>} A promise that resolves to the user data object, or null if an error occurs.
 * @throws {Error} Throws an error if the request fails.
 */
const getUser = async () => {
  try {
    const response = await apiClient.get("/api/user"); // Make GET request to /api/user
    const user = response.data; // Extract user data from the response
    console.log("User object: ", user);
    return user; // Return user data
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null; // Return null if there's an error
  }
};

export default getUser;