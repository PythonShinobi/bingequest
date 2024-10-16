// client/src/airing-today/AiringToday.jsx
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Rating,
  Button,
  Stack,
  Skeleton,
  Pagination,
  Fab,
  Menu,
  MenuItem
} from "@mui/material";

import { useAuth } from "../";

import "./AiringToday.css";
import Navbar from "../navbar/Navbar";
import apiClient from "../apiClient";

// Define a function to scale vote average to a star rating
const getStarRating = (voteAverage) => {
  return Math.min(5, voteAverage / 2); // Scale from 0-10 to 0-5 stars
};

// Cache object to store TV show data
const showCache = {};

const AiringToday = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [shows, setShows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showBackToTop, setShowBackToTop] = useState(false); // State to show Back to Top button
  const [showStates, setShowStates] = useState({}); // State for TV show categorization
  const [anchorEl, setAnchorEl] = useState(null); // For menu
  const [currentShowId, setCurrentShowId] = useState(null); // Current show id for categorization
  const [currentTitle, setCurrentTitle] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);

  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isSmallScreen = useMediaQuery('(max-width:600px)'); // Example breakpoint for small screens  

  // Check local storage for user session
  useEffect(() => {
    const sessionData = localStorage.getItem('user');
    if (sessionData) {      
      setAuthenticated(true);      
    } else {
      setAuthenticated(false);
    }
  }, []);

  // Fetch airing today TV shows with caching
  const fetchAiringTodayTVShows = useCallback(async (page) => {
    setLoading(true);
    try {
      const cacheKey = `page-${page}`;
      if (showCache[cacheKey]) {
        setShows(showCache[cacheKey].results);
        setTotalPages(showCache[cacheKey].totalPages);
        setLoading(false);
        return;
      }

      const response = await apiClient.get("/api/tv-shows/airing-today", {
        params: { page },
      });
      const data = {
        results: response.data.results,
        totalPages: response.data.total_pages
      };
      showCache[cacheKey] = data;
      setShows(data.results);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching airing today TV shows:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch TV show states if authenticated
  const fetchShowStates = useCallback(async () => {
    if (authenticated) {
      const user_id = user.id;
      try {
        const response = await apiClient.get(`/api/get_tv_show_states/${user_id}`);
        const states = response.data.reduce((acc, item) => {
          acc[item.tv_show_id] = item.state;
          return acc;
        }, {});
        setShowStates(states);
      } catch (error) {
        console.error("Error fetching TV show states:", error);
      }
    }
  }, [authenticated]);

  // Handle page change and update URL
  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
    navigate(`?page=${newPage}`, { replace: true });
  };

  // Handle card click navigation
  const handleCardClick = useCallback((showId) => {
    navigate(`/tv-show/${showId}`);
  }, [navigate]);

  // Handle TV show state change
  const handleShowStateChange = useCallback((event, showId, title, image) => {
    event.stopPropagation(); // Prevent navigation on state change click
    if (authenticated) {
      setAnchorEl(event.currentTarget);
      setCurrentShowId(showId);
      setCurrentTitle(title);
      setCurrentImage(image);
    } else {
      navigate('/login'); // Redirect to login if not authenticated
    }
  }, [authenticated, navigate]);

  // Handle menu close and update show state
  const handleMenuClose = (state) => {
    if (authenticated && currentShowId !== null) {
      // Update the state locally
      setShowStates(prevStates => ({
        ...prevStates,
        [currentShowId]: state
      }));

      const user_id = user.id;

      // Make the API call to update the state in the backend
      apiClient.post('/api/set_tv_show_state', {
        user_id: user_id, // You need to get the current user ID
        tv_show_id: currentShowId,
        state: state,
        title: currentTitle,
        image: currentImage
      })
      .then(response => {
        console.log(response.data.message);
      })
      .catch(error => {
        console.error("Error updating TV show state:", error);
      });
    }
    setAnchorEl(null);
    setCurrentShowId(null);
  };

  // Load TV shows and states based on URL parameters
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const page = parseInt(queryParams.get('page')) || 1;
    setCurrentPage(page);
    fetchAiringTodayTVShows(page);
    fetchShowStates();
    window.scrollTo(0, 0); // Scroll to the top of the page on page change
  }, [location.search, fetchAiringTodayTVShows, fetchShowStates]);

  const memoizedShows = useMemo(
    () =>
      shows.map((show) => (
        <Grid item xs={12} sm={6} md={3} key={show.id}>
          <Card onClick={() => handleCardClick(show.id)} style={{ cursor: 'pointer' }}>
            <CardMedia
              component="img"
              image={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
              alt={show.name}
              height="450"
            />
            <CardContent>
              <Typography variant="h6">{show.name}</Typography>
              <Typography variant="body2">{show.first_air_date}</Typography>
              <Rating
                value={getStarRating(show.vote_average)}
                precision={0.1}
                readOnly
              />
              <Typography variant="body2">
                {show.vote_average} ({show.vote_count} votes)
              </Typography>
              <Stack direction="row" spacing={1} sx={{ marginTop: 1 }}>
                <Button
                  variant="outlined"
                  onClick={(e) => handleShowStateChange(e, show.id, show.name, `https://image.tmdb.org/t/p/w500${show.poster_path}`)}
                >
                  {showStates[show.id] || 'Set State'}
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      )),
    [shows, handleCardClick, showStates, handleShowStateChange]
  );

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleScroll = () => {
    if (window.scrollY > 100) {
      setShowBackToTop(true);
    } else {
      setShowBackToTop(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      <Navbar />
      <div className="shows-container">
        <Typography
          variant={isSmallScreen ? 'h4' : 'h3'}
          align="center"
          gutterBottom
          sx={{ marginTop: "100px", marginBottom: "30px" }}
        >
          Airing TV Shows
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          {loading
            ? Array.from(new Array(20)).map((_, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Card>
                    <Skeleton variant="rectangular" height={300} />
                    <CardContent>
                      <Skeleton variant="text" />
                      <Skeleton variant="text" />
                    </CardContent>
                  </Card>
                </Grid>
              ))
            : memoizedShows}
        </Grid>
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={2}
          sx={{ marginTop: "20px" }}
        >
          <Button
            variant="contained"
            onClick={() => handlePageChange(null, currentPage - 1)}
            disabled={currentPage === 1 || loading}
          >
            Previous
          </Button>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            siblingCount={0}
            boundaryCount={1}
            shape="rounded"
            size="small"
            disabled={loading}
          />
          <Button
            variant="contained"
            onClick={() => handlePageChange(null, currentPage + 1)}
            disabled={currentPage === totalPages || loading}
          >
            Next
          </Button>
        </Stack>
      </div>
      {showBackToTop && (
        <Fab
          color="primary"
          aria-label="scroll back to top"
          onClick={handleScrollToTop}
          sx={{ position: 'fixed', bottom: '20px', right: '20px' }}
        >
          <KeyboardArrowUpIcon />
        </Fab>
      )}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleMenuClose(null)}
      >
        <MenuItem onClick={() => handleMenuClose("Completed")}>Completed</MenuItem>
        <MenuItem onClick={() => handleMenuClose("Watching")}>Watching</MenuItem>
        <MenuItem onClick={() => handleMenuClose("Plan to Watch")}>Plan to Watch</MenuItem>
        <MenuItem onClick={() => handleMenuClose("On Hold")}>On Hold</MenuItem>
        <MenuItem onClick={() => handleMenuClose("Dropped")}>Dropped</MenuItem>
      </Menu>
    </div>
  );
};

export default AiringToday;
