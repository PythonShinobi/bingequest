import React from 'react';
import { Container, Typography, Box, Grid, IconButton } from '@mui/material';
import { GitHub, X } from '@mui/icons-material';

import "./Footer.css";

const Footer = () => {
  return (
    <Box
      className="footer-container"
      component="footer"
      sx={{
        bgcolor: '#333333',
        color: '#FFFFFF',
        py: 4,
        width: '100%',
        position: 'relative', // Ensure it's positioned relative to the page content        
        mt: 'auto',           // Push it down if there's little content
      }}
    >
      <Container maxWidth="md">
        <Grid container spacing={4} alignItems="center" justifyContent="center">
          <Grid item xs={12} textAlign="center">
            <Box display="flex" justifyContent="center" mb={2}>
              <IconButton
                href="https://github.com/PythonShinobi"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: '#FFFFFF' }}
              >
                <GitHub />
              </IconButton>
              <IconButton
                href="https://x.com/PythonShinobi"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: '#FFFFFF' }}
              >
                <X />
              </IconButton>
            </Box>
            <Typography variant="body2" color="inherit">
              &copy; {new Date().getFullYear()} All rights reserved.
            </Typography>
            <Box mt={2}>
              <img
                src="/tmdb_logo.svg"
                alt="TMDb Logo"
                style={{ width: '100px', height: 'auto', display: 'block', margin: '0 auto' }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
