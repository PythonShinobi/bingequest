// client/src/contact/Contact.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container, 
  Typography, 
  Box, 
  TextField, 
  Button, 
  Snackbar, 
  Alert
} from "@mui/material";

import Navbar from "../navbar/Navbar";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  
  const [snackbar, setSnackbar] = useState({
    open: false, 
    message: '', 
    severity: 'success'
  });

  useEffect(() => { window.scrollTo(0, 0) }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post("/api/contact", formData);
      setSnackbar({
        open: true,
        message: "Email sent successfully!",
        severity: "success",
      });
      setFormData({
        name: "",
        email: "",
        message: ""
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to send email.",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      open: false, 
      message: '', 
      severity: 'success'
    });
  };

  return (
    <div style={{
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh'
    }}>
      <Navbar />
      <Container style={{ flexGrow: 1, paddingBottom: '2rem' }}>
        <Box mt={11} textAlign='center'>
          <Typography variant='h3' gutterBottom>
            Contact Us
          </Typography>
          <Typography variant='body1' paragraph>
            Have a question or feedback? Reach out to me using the form below:
          </Typography>
          <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto' }}>
            <TextField
              label='Your Name'
              name='name'
              variant='outlined'
              fullWidth
              margin='normal'
              required
              value={formData.name}
              onChange={handleChange}
            />
            <TextField
              label='Email Address'
              name='email'
              variant='outlined'
              fullWidth
              margin='normal'
              type='email'
              required
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              label='Message'
              name='message'
              variant='outlined'
              fullWidth
              multiline
              rows={4}
              margin='normal'
              required
              value={formData.message}
              onChange={handleChange}
            />
            <Button type='submit' variant='contained' color='primary'>
              Submit
            </Button>
          </form>
        </Box>
      </Container>      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ContactPage;