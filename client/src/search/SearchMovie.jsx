// client/src/search/SearchMovie.jsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import {
  Container,
  TextField,
  InputAdornment,
  IconButton,
  Grid,
  Typography,
  Box,
  Pagination,
  Stack,
  Button,
  Fab,
  Card,
  CardContent,
  CardMedia,
  Rating,
  Menu,
  MenuItem,
} from "@mui/material";

import "./SearchMovie.css";
import Navbar from "../navbar/Navbar";
import useIsAuthenticated from "../redux/authHook";

// Define a function to scale vote average to a star rating
const getStarRating = (voteAverage) => {
  return Math.min(5, voteAverage / 2); // Scale from 0-10 to 0-5 stars
};

const searchCache = {};

const SearchMovie = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [movieStates, setMovieStates] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentMovieId, setCurrentMovieId] = useState(null);
  const [currentTitle, setCurrentTitle] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useIsAuthenticated();

  const fetchSearchResults = useCallback(async (query, page) => {
    const cacheKey = `${query}-${page}`;
    if (searchCache[cacheKey]) {
      setResults(searchCache[cacheKey].results);
      setTotalPages(searchCache[cacheKey].totalPages);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get("/api/movies/search", {
        params: { query, page }
      });
      const data = {
        results: response.data.results,
        totalPages: response.data.total_pages
      };
      searchCache[cacheKey] = data;
      setResults(data.results);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMovieStates = useCallback(async () => {
    if (isAuthenticated) {
      const user_id = isAuthenticated.id;
      try {
        const response = await axios.get(`/api/get_movie_states/${user_id}`);
        const states = response.data.reduce((acc, item) => {
          acc[item.movie_id] = item.state;
          return acc;
        }, {});
        setMovieStates(states);
      } catch (error) {
        console.error("Error fetching movie states:", error);
      }
    }
  }, [isAuthenticated]);

  const handleSearch = async (e, page = 1) => {
    if (e) e.preventDefault();
    setSearchPerformed(true);
    fetchSearchResults(query, page);
    // Update the URL with the search query and page number
    navigate(`?query=${encodeURIComponent(query)}&page=${page}`);
    window.scrollTo(0, 0);
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
    handleSearch(null, page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCardClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  const handleMovieStateChange = useCallback((event, movieId, title, image) => {
    event.stopPropagation();
    if (isAuthenticated) {
      setAnchorEl(event.currentTarget);
      setCurrentMovieId(movieId);
      setCurrentTitle(title);
      setCurrentImage(image);
    } else {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleMenuClose = (state) => {
    if (isAuthenticated && currentMovieId !== null) {
      setMovieStates(prevStates => ({
        ...prevStates,
        [currentMovieId]: state
      }));

      const user_id = isAuthenticated.id;
      axios.post('/api/set_movie_state', {
        user_id: user_id,
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

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get('query') || "";
    const page = parseInt(queryParams.get('page')) || 1;

    setQuery(query);
    setCurrentPage(page);

    if (query) {
      setLoading(true);
      fetchSearchResults(query, page);
    } else {
      setResults([]);
      setLoading(false);
    }

    if (isAuthenticated) {
      fetchMovieStates();
    }
  }, [location.search, fetchSearchResults, fetchMovieStates, isAuthenticated]);

  const memoizedResults = useMemo(() => results, [results]);

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

  return (
    <div className="search-movies">
      <Container sx={{ bgcolor: 'background.default', color: 'text.primary' }}>
        <Navbar />
        <form
          onSubmit={(e) => handleSearch(e, 1)}
          style={{ marginTop: "120px", marginBottom: "20px" }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search for a movie"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton type="submit">
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ bgcolor: 'background.paper', color: 'text.primary' }}
          />
        </form>
        <Box>
          {loading ? (
            <Grid container spacing={3}>
              {Array.from(new Array(20)).map((_, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Card sx={{ bgcolor: 'background.paper' }}>
                    <Skeleton variant="rectangular" height={300} />
                    <CardContent>
                      <Skeleton variant="text" />
                      <Skeleton variant="text" />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            memoizedResults.length > 0 ? (
              <Grid container spacing={3}>
                {memoizedResults.map((movie) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
                    <Card sx={{ bgcolor: 'background.paper' }} onClick={() => handleCardClick(movie.id)} style={{ cursor: 'pointer' }}>
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
                            {movieStates[movie.id] || "Set State"}
                          </Button>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              searchPerformed && <Typography variant="h6" align="center">No results found</Typography>
            )
          )}
        </Box>
        {totalPages > 1 && (
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            sx={{ marginTop: 3, marginBottom: 3 }}
          />
        )}
        {showBackToTop && (
          <Fab
            color="primary"
            onClick={handleScrollToTop}
            sx={{ position: "fixed", bottom: 16, right: 16 }}
          >
            <KeyboardArrowUpIcon />
          </Fab>
        )}
      </Container>
      
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
  );
};

export default SearchMovie;