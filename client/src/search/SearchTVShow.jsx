// client/src/search/SearchTVShow.jsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
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

import { useAuth } from "../authContext.js";

import "./SearchTVShow.css";
import Navbar from "../navbar/Navbar";
import apiClient from "../apiClient";

// Define a function to scale vote average to a star rating
const getStarRating = (voteAverage) => {
  return Math.min(5, voteAverage / 2); // Scale from 0-10 to 0-5 stars
};

const searchCache = {};

const SearchTVShow = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [tvShowStates, setTvShowStates] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentTvShowId, setCurrentTvShowId] = useState(null);
  const [currentTitle, setCurrentTitle] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);

  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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
      const response = await apiClient.get("/api/tv-shows/search", {
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

  const fetchTvShowStates = useCallback(async () => {
    if (authenticated) {
      const user_id = user.id;
      try {
        const response = await apiClient.get(`/api/get_tv_show_states/${user_id}`);
        const states = response.data.reduce((acc, item) => {
          acc[item.tv_show_id] = item.state;
          return acc;
        }, {});
        setTvShowStates(states);
      } catch (error) {
        console.error("Error fetching TV show states:", error);
      }
    }
  }, [authenticated]);

  const handleSearch = async (e, page = 1) => {
    if (e) e.preventDefault();
    setSearchPerformed(true);
    fetchSearchResults(query, page);
    navigate(`?query=${encodeURIComponent(query)}&page=${page}`);
    window.scrollTo(0, 0);
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
    handleSearch(null, page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCardClick = (tvShowId) => {
    navigate(`/tv-show/${tvShowId}`);
  };

  const handleTvShowStateChange = useCallback((event, tvShowId, title, image) => {
    event.stopPropagation();
    if (authenticated) {
      setAnchorEl(event.currentTarget);
      setCurrentTvShowId(tvShowId);
      setCurrentTitle(title);
      setCurrentImage(image);
    } else {
      navigate('/login');
    }
  }, [authenticated, navigate]);

  const handleMenuClose = (state) => {
    if (authenticated && currentTvShowId !== null) {
      setTvShowStates(prevStates => ({
        ...prevStates,
        [currentTvShowId]: state
      }));

      const user_id = user.id;
      apiClient.post('/api/set_tv_show_state', {
        user_id: user_id,
        tv_show_id: currentTvShowId,
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
    setCurrentTvShowId(null);
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

    if (authenticated) {
      fetchTvShowStates();
    }
  }, [location.search, fetchSearchResults, fetchTvShowStates, authenticated]);

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
    <div className="search-tv-shows">
      <Container sx={{ bgcolor: 'background.default', color: 'text.primary' }}>
        <Navbar />
        <form
          onSubmit={(e) => handleSearch(e, 1)}
          style={{ marginTop: "120px", marginBottom: "20px" }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search for a TV show"
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
                {memoizedResults.map((show) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={show.id}>
                    <Card sx={{ bgcolor: 'background.paper' }} onClick={() => handleCardClick(show.id)} style={{ cursor: 'pointer' }}>
                      <CardMedia
                        component="img"
                        image={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                        alt={show.name}
                        height="450"
                      />
                      <CardContent>
                        <Typography variant="h6" gutterBottom>{show.name}</Typography>
                        <Rating
                          value={getStarRating(show.vote_average)}
                          precision={0.1}
                          readOnly
                        />
                        <Typography variant="body2">
                          {show.vote_average} ({show.vote_count} votes)
                        </Typography>
                        <Stack direction="row" spacing={1} sx={{ marginTop: 1 }}>
                          <Button variant="outlined" onClick={(e) => handleTvShowStateChange(e, show.id, show.name, `https://image.tmdb.org/t/p/w500${show.poster_path}`)}>
                            {tvShowStates[show.id] || "Set State"}
                          </Button>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              searchPerformed && <Typography variant="h6" align="center" sx={{ marginTop: 4 }}>No TV shows found</Typography>
            )
          )}
          {totalPages > 1 && (
            <Stack spacing={2} alignItems="center" sx={{ marginTop: 4 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                variant="outlined"
                shape="rounded"
              />
            </Stack>
          )}
        </Box>
        {showBackToTop && (
          <Fab
            color="primary"
            aria-label="back to top"
            sx={{ position: 'fixed', bottom: 16, right: 16 }}
            onClick={handleScrollToTop}
          >
            <KeyboardArrowUpIcon />
          </Fab>
        )}
      </Container>
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

export default SearchTVShow;