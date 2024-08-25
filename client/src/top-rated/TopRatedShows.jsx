// client/src/top-rated/TopRatedShows.jsx
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
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

import { useAuth } from "../authContext.js";

import "./TopRatedShows.css";
import Navbar from "../navbar/Navbar";
import SeriesFilterComponent from "../components/SeriesFilters";
import apiClient from "../apiClient";

// Define a function to scale vote average to a star rating
const getStarRating = (voteAverage) => {
  return Math.min(5, voteAverage / 2); // Scale from 0-10 to 0-5 stars
};

// Cache object to store show data
const showCache = {};

const TopRatedShows = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [shows, setShows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [showBackToTop, setShowBackToTop] = useState(false); // State to show Back to Top button
  const [showStates, setShowStates] = useState({}); // State for show categorization
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

  // Fetch top rated shows with caching
  const fetchTopRatedShows = useCallback(async (page, filters) => {
    const cacheKey = `${page}-${JSON.stringify(filters)}`;
    if (showCache[cacheKey]) {
      setShows(showCache[cacheKey].results);
      setTotalPages(showCache[cacheKey].totalPages);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.get("/api/tv-shows/top-rated", {
        params: { page, ...filters },
      });
      const data = {
        results: response.data.results,
        totalPages: response.data.total_pages
      };
      showCache[cacheKey] = data;
      setShows(data.results);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching top-rated shows:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle card click navigation
  const handleCardClick = useCallback((showId) => {
    navigate(`/tv-show/${showId}`);
  }, [navigate]);

  // Handle show state change
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
      setShowStates(prevStates => ({
        ...prevStates,
        [currentShowId]: state
      }));

      const user_id = user.id;

      // Make the API call to update the state in the backend
      apiClient.post('/api/set_tv_show_state', {
        user_id: user_id,
        tv_show_id: currentShowId,
        state: state,
        title: currentTitle,
        image: currentImage
      })
      .then(response => {
        console.log(response.data.message);
      })
      .catch(error => {
        console.error("Error updating show state:", error);
      });
    }
    setAnchorEl(null);
    setCurrentShowId(null);
  };

  const updateURL = (page, filters) => {
    const queryParams = new URLSearchParams();
    queryParams.set('page', page);
    queryParams.set('filters', JSON.stringify(filters));
    navigate(`?${queryParams.toString()}`, { replace: true });
  };

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
    updateURL(newPage, filters);
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to the first page when filters are applied
    updateURL(1, newFilters);
  };

  const topRatedSortOptions = useMemo(
    () => [
      { value: "vote_average.desc", label: "Top Rated" },
      { value: "vote_average.asc", label: "Low Rated" },
      { value: "vote_count.desc", label: "Highest Votes" },
      { value: "vote_count.asc", label: "Lowest Votes" },
    ],
    []
  );

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const page = parseInt(queryParams.get('page')) || 1;
    const filters = JSON.parse(queryParams.get('filters')) || {};

    setCurrentPage(page);
    setFilters(filters);

    // Fetch shows from cache or API
    fetchTopRatedShows(page, filters);

    // Fetch show states if authenticated
    if (authenticated) {
      const user_id = user.id;
      apiClient.get(`/api/get_tv_show_states/${user_id}`)
        .then(response => {
          const states = response.data.reduce((acc, item) => {
            acc[item.tv_show_id] = item.state;
            return acc;
          }, {});
          setShowStates(states);
        })
        .catch(error => {
          console.error("Error fetching show states:", error);
        });
    }

    window.scrollTo(0, 0); // Scroll to the top of the page on page change
  }, [location.search, fetchTopRatedShows, authenticated]);

  const memoizedShows = useMemo(
    () =>
      shows.map((show) => (
        <Grid item xs={12} sm={6} md={3} key={show.id}>
          <Card onClick={() => handleCardClick(show.id)} style={{ cursor: 'pointer' }}>
            <CardMedia
              component="img"
              image={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
              alt={show.title}
              height="450"
            />
            <CardContent>
              <Typography variant="h6">{show.title}</Typography>
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
                  onClick={(e) => handleShowStateChange(e, show.id, show.title, `https://image.tmdb.org/t/p/w500${show.poster_path}`)}
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
    <div className="shows-container">
      <Navbar />
      <div>
        <SeriesFilterComponent
          onApplyFilters={handleApplyFilters}
          sortOptions={topRatedSortOptions}
        />
        <Typography
          variant={isSmallScreen ? 'h4' : 'h3'}
          align="center"
          gutterBottom
          sx={{ marginTop: "50px", marginBottom: "30px" }}
        >
          Top Rated Shows
        </Typography>

        <Grid container spacing={2} justifyContent="center">
          {loading
            ? Array.from(new Array(20)).map((_, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Skeleton variant="rectangular" width="100%" height={450} />
                  <Skeleton width="80%" />
                  <Skeleton width="60%" />
                </Grid>
              ))
            : memoizedShows}
        </Grid>

        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          sx={{ marginY: 4, display: 'flex', justifyContent: 'center' }}
        />

        {showBackToTop && (
          <Fab
            color="primary"
            aria-label="scroll back to top"
            onClick={handleScrollToTop}
            sx={{
              position: 'fixed',
              bottom: '20px',
              right: '20px',
            }}
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
    </div>
  );
};

export default TopRatedShows;