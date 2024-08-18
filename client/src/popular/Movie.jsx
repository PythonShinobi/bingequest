// client/src/popular/Movie.jsx
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
  MenuItem,  
} from "@mui/material";

import "./Movie.css";
import Navbar from "../navbar/Navbar";
import FilterComponent from "../components/Filters";
import useIsAuthenticated from "../redux/authHook";
import apiClient from "../apiClient";

// Define a function to scale vote average to a star rating
const getStarRating = (voteAverage) => {
  return Math.min(5, voteAverage / 2); // Scale from 0-10 to 0-5 stars
};

// Cache object to store movie data
const movieCache = {};

const PopularMovies = () => {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [showBackToTop, setShowBackToTop] = useState(false); // State to show Back to Top button
  const [movieStates, setMovieStates] = useState({}); // New state for movie categorization
  const [anchorEl, setAnchorEl] = useState(null); // For menu
  const [currentMovieId, setCurrentMovieId] = useState(null); // Current movie id for categorization
  const [currentTitle, setCurrentTitle] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const isSmallScreen = useMediaQuery('(max-width:600px)'); // Example breakpoint for small screens
  const isAuthenticated = useIsAuthenticated();

  const fetchPopularMovies = useCallback(async (page, filters) => {
    const cacheKey = `${page}-${JSON.stringify(filters)}`;
    if (movieCache[cacheKey]) {
      setMovies(movieCache[cacheKey].results);
      setTotalPages(movieCache[cacheKey].totalPages);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.get("/api/movies/popular", {
        params: { page, ...filters },
      });
      const data = {
        results: response.data.results,
        totalPages: response.data.total_pages
      };
      movieCache[cacheKey] = data;
      setMovies(data.results);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching popular movies:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCardClick = useCallback((movieId) => {
    navigate(`/movie/${movieId}`);
  }, [navigate]);

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

  const popularSortOptions = useMemo(
    () => [
      { value: "popularity.desc", label: "Most Popular" },
      { value: "popularity.asc", label: "Least Popular" },
    ],
    []
  );

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const page = parseInt(queryParams.get('page')) || 1;
    const filters = JSON.parse(queryParams.get('filters')) || {};

    setCurrentPage(page);
    setFilters(filters);

    // Fetch movies from cache or API
    fetchPopularMovies(page, filters);

    // Fetch movie states if authenticated
    if (isAuthenticated) {
      const user_id = isAuthenticated.id;
      apiClient.get(`/api/get_movie_states/${user_id}`)
        .then(response => {
          const states = response.data.reduce((acc, item) => {
            acc[item.movie_id] = item.state;
            return acc;
          }, {});
          setMovieStates(states);
        })
        .catch(error => {
          console.error("Error fetching movie states:", error);
        });
    }

    window.scrollTo(0, 0);
  }, [location.search, fetchPopularMovies, isAuthenticated]);
  
  // Handle movie state change
  const handleMovieStateChange = useCallback((event, movieId, title, image) => {
    event.stopPropagation(); // Prevent navigation on state change click
    if (isAuthenticated) {
      setAnchorEl(event.currentTarget);
      setCurrentMovieId(movieId);
      setCurrentTitle(title);
      setCurrentImage(image);
    } else {
      navigate('/login'); // Redirect to login if not authenticated
    }
  }, [isAuthenticated, navigate]);

  const handleMenuClose = (state) => {
    if (isAuthenticated && currentMovieId !== null) {
      // Update the state locally
      setMovieStates(prevStates => ({
        ...prevStates,
        [currentMovieId]: state
      }));

      const user_id = isAuthenticated.id;

      // Make the API call to update the state in the backend
      apiClient.post('/api/set_movie_state', {
        user_id: user_id, // You need to get the current user ID
        movie_id: currentMovieId,
        state: state,
        title: currentTitle,
        image: currentImage
      })
      .then(response => {
        console.log(response.data.message);
      })
      .catch(error => {
        console.error("Error updating movie state:", error);
      });
    }
    setAnchorEl(null);
    setCurrentMovieId(null);
  };

  const memoizedMovies = useMemo(
    () =>
      movies.map((movie) => (
        <Grid item xs={12} sm={6} md={3} key={movie.id}>
          <Card onClick={() => handleCardClick(movie.id)} style={{ cursor: 'pointer' }}>
            <CardMedia
              component="img"
              image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              height="450"
            />
            <CardContent>
              <Typography variant="h6">{movie.title}</Typography>
              <Typography variant="body2">{movie.release_date}</Typography>
              <Rating
                value={getStarRating(movie.vote_average)}
                precision={0.1}
                readOnly
              />
              <Typography variant="body2">
                {movie.vote_average} ({movie.vote_count} votes)
              </Typography>
              <Stack direction="row" spacing={1} sx={{ marginTop: 1 }}>
                <Button variant="outlined" onClick={(e) => handleMovieStateChange(e, movie.id, movie.title, `https://image.tmdb.org/t/p/w500${movie.poster_path}`)}>
                  {movieStates[movie.id] || 'Set State'}
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      )),
    [movies, handleCardClick, movieStates, handleMovieStateChange]
  );

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
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
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="movie-container">
      <Navbar />
      <div>
        <FilterComponent
          onApplyFilters={handleApplyFilters}
          sortOptions={popularSortOptions}
        />
        <Typography 
          variant={isSmallScreen ? 'h4' : 'h3'}
          align="center" 
          gutterBottom 
          sx={{ marginTop: "50px", marginBottom: "30px"}}
        >
          Popular Movies
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
            : memoizedMovies}
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
        
        {/* Back to Top Button */}
        {showBackToTop && (
          <div className="back-to-top">
            <Fab color="primary" size="large" onClick={handleScrollToTop}>
              <KeyboardArrowUpIcon />
            </Fab>
          </div>
        )}

        {/* Movie State Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
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

export default PopularMovies;
