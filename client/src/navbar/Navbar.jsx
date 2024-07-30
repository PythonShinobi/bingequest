// client/src/navbar/Navbar.jsx
import React, { useState } from "react";
import axios from 'axios';
import { NavLink, useNavigate } from "react-router-dom";
import {
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemText, 
  Box, 
  Container
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import LoginIcon from '@mui/icons-material/Login';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import "./Navbar.css";
import useIsAuthenticated from "../redux/authHook.js";

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const user = useIsAuthenticated();
  const navigate = useNavigate();  

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleLogout = async () => {
    try {
      await axios.get("/api/logout");
      window.location.href = "/"; // Redirect to home page immediately.
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const showProfile = () => {
    navigate("/profile");
  };

  const drawerItems = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={handleDrawerToggle}
      onKeyDown={handleDrawerToggle}
    >
      <List>
        {!user && (
          <>
            <ListItem component={NavLink} to="/login">
              <LoginIcon sx={{ mr: 1, color: "black" }} />
              <ListItemText primaryTypographyProps={{ sx: { color: 'black' } }} primary="Login" />
            </ListItem>
            <ListItem component={NavLink} to="/register">
              <HowToRegIcon sx={{ mr: 1, color: "black" }} />
              <ListItemText primaryTypographyProps={{ sx: { color: 'black' } }} primary="Register" />
            </ListItem>
          </>
        )}
        {user && (
          <>
            <ListItem onClick={showProfile}>
              <AccountCircleIcon sx={{ mr: 1, color: "black" }} />
              <ListItemText primaryTypographyProps={{ sx: { color: 'black' } }} primary={`Hi ${user?.username}`} />
            </ListItem>
            <ListItem onClick={handleLogout}>
              <PersonIcon sx={{ mr: 1, color: "black" }} />
              <ListItemText primaryTypographyProps={{ sx: { color: 'black' } }} primary="Logout" />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <AppBar position="fixed" className="navbar" color="default">
      <Container>
        <Toolbar disableGutters>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2, display: { xs: 'block', md: 'none' } }}
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component={NavLink} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
            Movie Repo
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'flex-end' }}>
            {!user && (
              <>
                <Button component={NavLink} to="/login" color="inherit" sx={{ m: 1 }} activeClassName="active">
                  <LoginIcon sx={{ mr: 1 }} />
                  Login
                </Button>
                <Button component={NavLink} to="/register" color="inherit" sx={{ m: 1 }} activeClassName="active">
                  <HowToRegIcon sx={{ mr: 1 }} />
                  Register
                </Button>
              </>
            )}
            {user && (
              <>
                <Button onClick={showProfile} color="inherit" sx={{ m: 1 }} activeClassName="active">
                  <AccountCircleIcon sx={{ mr: 1 }} />
                  Hi, {user?.username}
                </Button>
                <Button onClick={handleLogout} color="inherit" sx={{ m: 1 }} activeClassName="active">
                  <PersonIcon sx={{ mr: 1 }} />
                  Logout
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
      >
        {drawerItems}
      </Drawer>
    </AppBar>
  );
};

export default Navbar;