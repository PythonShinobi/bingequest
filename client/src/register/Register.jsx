// client/src/register/Register.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Register.css";
import { useAuth } from "../authContext"; // Import the useAuth hook
import Navbar from "../navbar/Navbar";
import Form from "../components/Form";

const Register = () => {
  const { register, err } = useAuth(); // Get the register and err function from AuthContext
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const username = e.target.username.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const rpassword = e.target.rpassword.value;
  
    if (password !== rpassword) {
      setError("The passwords don't match");
      return;
    }
  
    try {
      const status = await register(username, email, password);
      if (status === 201) { // Check if the registration was successful
        setSuccess("Registration successful!"); // Set success message
        setError(""); // Clear any previous errors
        setTimeout(() => { navigate("/"); }, 1000); // Redirect after 1 second
      } else {
        setError(err); // Set the error message immediately
        setError(""); // Clear any previous errors
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      setError(error.response?.data?.message || error.message || "Unknown error occurred.");
    }
  };

  return (
    <div className="register-container">
      <Navbar />
      <Form 
        isLogin={false} 
        errorMessage={error} 
        successMessage={success} 
        onSubmit={handleSubmit} 
      />
    </div>
  );
};

export default Register;