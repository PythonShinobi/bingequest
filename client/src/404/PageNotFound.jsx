// client/src/404/PageNotFound.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Container, Grid, Typography, Button } from '@mui/material';
import { Error as ErrorIcon } from '@mui/icons-material';

import Navbar from "../navbar/Navbar";

const PageNotFound = () => {
  return (
    <div className="pageNotFound">
      <Navbar />
      <Container maxWidth="md" sx={{ mt: 8, px: { xs: 2, sm: 3, md: 5 } }}>
        <Grid container direction="column" alignItems="center" justifyContent="center">
          <Grid item xs={12} textAlign="center">
            <ErrorIcon 
              sx={{ 
                fontSize: { xs: 70, sm: 80, md: 100 }, // Adjust size based on screen
                color: 'error.main', 
                mb: 3, 
                mt: { xs: 3, sm: 5 }, // Adjust top margin based on screen size
              }} 
            />
            <Typography 
              variant="h4" 
              align="center" 
              sx={{ 
                mb: 2, 
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' } // Responsive font size
              }}
            >
              404: Page Not Found
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography 
              variant="body1" 
              align="center" 
              sx={{ 
                mb: 3, 
                fontSize: { xs: '1rem', sm: '1.25rem' }, // Responsive font size
                px: { xs: 1, sm: 3 } // Padding for better text readability on small screens
              }}
            >
              The page you are looking for does not exist.
            </Typography>
          </Grid>
          <Grid item xs={12} container justifyContent="center">
            <Button 
              component={Link} 
              to="/" 
              variant="outlined" 
              color="primary"
              sx={{ 
                fontSize: { xs: '0.875rem', sm: '1rem' }, // Responsive button text size
                padding: { xs: '8px 16px', sm: '10px 20px' }, // Adjust padding for touch targets
                mb: { xs: 2, sm: 0 } // Adjust bottom margin on small screens
              }}
            >
              <i className="fa fa-arrow-left"></i> Go Back to Home
            </Button>
          </Grid>
        </Grid>
      </Container>      
    </div>
  );
};

export default PageNotFound;