// client/src/login/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Login.css";
import { AuthContext } from '../context/AuthContext'; // Import your AuthContext
import Navbar from "../navbar/Navbar";
import Form from "../components/Form";

import apiClient from "../apiClient.js";

const Login = () => {
  const { login } = useContext(AuthContext);  
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(''); // State for error message

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const form = event.target;
    const data = new FormData(form);
    const loginData = {
      email: data.get('email'),
      password: data.get('password'),
    };
  
    try {
      const response = await apiClient.post('/api/login', loginData);
    
      const { user, session_token } = response.data;

      const expires = new Date(response.data.expires_at).toUTCString();
      document.cookie = `session_token=${session_token}; path=/; expires=${expires}; SameSite=Strict; Secure;`;
    
      login(user);      
    
      navigate('/');
      setErrorMessage(''); // Clear error message on successful login
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'An error occurred during login.';
      setErrorMessage(errorMsg); // Set error message      
    }
  };

  return (
    <div className="login-container">
      <Navbar />      
      <Form 
        isLogin={true} 
        errorMessage={errorMessage} 
        successMessage={success} 
        onSubmit={handleSubmit} 
      />
    </div>
  );
};

export default Login;