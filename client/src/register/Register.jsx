// client/src/register/Register.jsx
import React, { useState, useContext } from "react"; // Added useContext import
import { useNavigate } from "react-router-dom";

import "./Register.css";
import { AuthContext } from '../context/AuthContext'; // Import your AuthContext
import Navbar from "../navbar/Navbar";
import Form from "../components/Form";

import apiClient from "../apiClient.js";

const Register = () => {
  const { login } = useContext(AuthContext); // Get the login function from context
  const navigate = useNavigate();
  
  // State to handle success or error messages
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const form = event.target;
    const data = new FormData(form);
    const registerData = {
      username: data.get('username'),
      email: data.get('email'),
      password: data.get('password'),
    };

    try {
      // Make a POST request to your registration API
      const response = await apiClient.post('/api/register', registerData);

      // If registration is successful, get the session token and set it as a cookie
      const { user, session_token, message } = response.data; // Adjust based on your API response structure
      
      // Set the session token cookie with appropriate flags
      const expires = new Date(response.data.expires_at).toUTCString();
      document.cookie = `session_token=${session_token}; path=/; expires=${expires}; SameSite=Strict; Secure;`;

      login(user); // Call login with user data

      // Display the success message
      setMessage(message);
      setMessageType('success');

      // Optionally redirect after registration
      navigate('/');
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'An error occurred during registration.';
      // Display the error message
      setMessage(errorMessage);
      setMessageType('error');
    }
  };

  return (
    <div className="register-container">
      <Navbar />
      <Form 
        isLogin={false} 
        errorMessage={messageType === 'error' ? message : ''} // Use the message for error display
        successMessage={messageType === 'success' ? message : ''} // Use the message for success display
        onSubmit={handleSubmit} 
      />
    </div>
  );
};

export default Register;