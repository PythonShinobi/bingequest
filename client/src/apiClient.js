// src/apiClient.js
import axios from 'axios';

// Get API base URL from environment variables
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Create an Axios instance with the base URL
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // Include cookies
    headers: {
        'Content-Type': 'application/json',
    },
});

export default apiClient;