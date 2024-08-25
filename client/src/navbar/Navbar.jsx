// client/src/navbar/Navbar.jsx
import React, { useState } from "react";
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
  Container,
  Menu,
  MenuItem
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import LoginIcon from '@mui/icons-material/Login';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import "./Navbar.css";
import { useAuth } from "../authContext.js";

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [moviesMenuAnchor, setMoviesMenuAnchor] = useState(null);
  const [tvShowsMenuAnchor, setTvShowsMenuAnchor] = useState(null);
  const [popularPeopleMenuAnchor, setPopularPeopleMenuAnchor] = useState(null);
  const [moreMenuAnchor, setMoreMenuAnchor] = useState(null);
  
  const { logout } = useAuth();
  const navigate = useNavigate();  

  // Check local storage for user session
  useEffect(() => {
    const sessionData = localStorage.getItem('user');
    if (sessionData) {
      const parsedData = JSON.parse(sessionData);
      setAuthenticated(true);
      setUsername(parsedData.username || '');
    } else {
      setAuthenticated(false);
    }
  }, []);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleLogout = async () => {
    try {
      const status = await logout();      
      if (status === 200) {
        localStorage.removeItem('user'); // Remove cached user data
        setAuthenticated(false); // Update state to reflect user is logged out
        setUsername(''); // Clear the username state
        navigate('/'); // Redirect the user to the home page
      } else {
        // Handle any unexpected status codes (this should be covered in the logout function)
        console.error('Failed to log out.');
      }
    } catch (error) {
      // Error handling if the logout fails
      console.error('Error logging out:', error);
      // Display an error message or take appropriate action
    }
  };

  const showProfile = () => {
    navigate("/profile");
  };

  const handleMoviesMenuClick = (event) => {
    setMoviesMenuAnchor(event.currentTarget);
  };

  const handleTvShowsMenuClick = (event) => {
    setTvShowsMenuAnchor(event.currentTarget);
  };

  const handlePopularPeopleMenuClick = (event) => {
    setPopularPeopleMenuAnchor(event.currentTarget);
  };

  const handleMoreMenuClick = (event) => {
    setMoreMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMoviesMenuAnchor(null);
    setTvShowsMenuAnchor(null);
    setPopularPeopleMenuAnchor(null);
    setMoreMenuAnchor(null);
  };

  const drawerItems = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={(event) => event.stopPropagation()} // Prevent drawer toggle on item click
      onKeyDown={(event) => event.stopPropagation()} // Prevent drawer toggle on item click
    >
      <List>
        <ListItem onClick={handleMoviesMenuClick}>
          <ListItemText primaryTypographyProps={{ sx: { color: 'black' } }} primary="Movies" />
          <ArrowDropDownIcon />
        </ListItem>
        <Menu
          anchorEl={moviesMenuAnchor}
          open={Boolean(moviesMenuAnchor)}
          onClose={handleMenuClose}
        >
          <MenuItem component={NavLink} to="/movies/search">Search</MenuItem>
          <MenuItem component={NavLink} to="/movies/popular">Popular</MenuItem>
          <MenuItem component={NavLink} to="/movies/trending">Trending</MenuItem>
          <MenuItem component={NavLink} to="/movies/upcoming">Upcoming</MenuItem>
          <MenuItem component={NavLink} to="/movies/top-rated">Top Rated</MenuItem>
        </Menu>
        
        <ListItem onClick={handleTvShowsMenuClick}>
          <ListItemText primaryTypographyProps={{ sx: { color: 'black' } }} primary="TV Shows" />
          <ArrowDropDownIcon />
        </ListItem>
        <Menu
          anchorEl={tvShowsMenuAnchor}
          open={Boolean(tvShowsMenuAnchor)}
          onClose={handleMenuClose}
        >
          <MenuItem component={NavLink} to="/tv-shows/search">Search</MenuItem>
          <MenuItem component={NavLink} to="/tv-shows/popular">Popular</MenuItem>
          <MenuItem component={NavLink} to="/tv-shows/trending">Trending</MenuItem>
          <MenuItem component={NavLink} to="/tv-shows/airing-today">Airing</MenuItem>
          <MenuItem component={NavLink} to="/tv-shows/top-rated">Top Rated</MenuItem>
        </Menu>

        <ListItem onClick={handlePopularPeopleMenuClick}>
          <ListItemText primaryTypographyProps={{ sx: { color: 'black' } }} primary="People" />
          <ArrowDropDownIcon />
        </ListItem>
        <Menu
          anchorEl={popularPeopleMenuAnchor}
          open={Boolean(popularPeopleMenuAnchor)}
          onClose={handleMenuClose}
        >
          <MenuItem component={NavLink} to="/people/popular">Popular People</MenuItem>          
        </Menu>

        <ListItem onClick={handleMoreMenuClick}>
          <ListItemText primaryTypographyProps={{ sx: { color: 'black' } }} primary="More" />
          <ArrowDropDownIcon />
        </ListItem>
        <Menu
          anchorEl={moreMenuAnchor}
          open={Boolean(moreMenuAnchor)}
          onClose={handleMenuClose}
        >
          <MenuItem component={NavLink} to="/about">About</MenuItem>           
          <MenuItem component={NavLink} to="/contact">Contact</MenuItem>           
        </Menu>
        {!authenticated ? (
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
        ) : (
          <>
            <ListItem onClick={() => { showProfile(); handleDrawerToggle(); }}>
              <AccountCircleIcon sx={{ mr: 1, color: "black" }} />
              <ListItemText primaryTypographyProps={{ sx: { color: 'black' } }} primary={`${username}`} />
            </ListItem>
            <ListItem onClick={() => { handleLogout(); handleDrawerToggle(); }}>
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
          <Typography variant="h5" component={NavLink} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
            BingeQuest
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
            <div className="dropdown">
              <Button color="inherit" sx={{ m: 1 }}>
                Movies
              </Button>
              <div className="dropdown-content">                
                <NavLink to="/movies/search">Search</NavLink>
                <NavLink to="/movies/popular">Popular</NavLink>
                <NavLink to="/movies/trending">Trending</NavLink>
                <NavLink to="/movies/upcoming">Upcoming</NavLink>
                <NavLink to="/movies/top-rated">Top Rated</NavLink>
              </div>
            </div>
            <div className="dropdown">
              <Button color="inherit" sx={{ m: 1 }}>
                TV Shows
              </Button>
              <div className="dropdown-content">
                <NavLink to="/tv-shows/search">Search</NavLink>
                <NavLink to="/tv-shows/popular">Popular</NavLink>
                <NavLink to="/tv-shows/trending">Trending</NavLink>
                <NavLink to="/tv-shows/airing-today">Airing</NavLink>
                <NavLink to="/tv-shows/top-rated">Top Rated</NavLink>
              </div>
            </div>
            <div className="dropdown">
              <Button color="inherit" sx={{ m: 1 }}>
                People
              </Button>
              <div className="dropdown-content">
                <NavLink to="/people/popular">Popular People</NavLink>
              </div>
            </div>
            <div className="dropdown">
              <Button color="inherit" sx={{ m: 1 }}>
                More
              </Button>
              <div className="dropdown-content">
                <NavLink to="/about">About</NavLink>
                <NavLink to="/contact">Contact</NavLink>
              </div>
            </div>
          </Box>
          {!authenticated ? (
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Button color="inherit" component={NavLink} to="/login">
                <LoginIcon sx={{ mr: 1 }} />
                Login
              </Button>
              <Button color="inherit" component={NavLink} to="/register">
                <HowToRegIcon sx={{ mr: 1 }} />
                Register
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Button color="inherit" onClick={showProfile}>
                <AccountCircleIcon sx={{ mr: 1 }} />
                {username}
              </Button>
              <Button color="inherit" onClick={handleLogout}>
                <PersonIcon sx={{ mr: 1 }} />
                Logout
              </Button>
            </Box>
          )}
        </Toolbar>
      </Container>
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        sx={{ display: { xs: 'block', md: 'none' } }}
      >
        {drawerItems}
      </Drawer>
    </AppBar>
  );
};

export default Navbar;