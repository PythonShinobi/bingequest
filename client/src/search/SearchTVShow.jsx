// client/src/search/SearchTVShow.jsx
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
  Rating
} from "@mui/material";

import "./SearchTVShow.css";
import Navbar from "../navbar/Navbar";

// Define a function to scale vote average to a star rating
const getStarRating = (voteAverage) => {
  return Math.min(5, voteAverage / 2); // Scale from 0-10 to 0-5 stars
};

const searchCache = {};

const SearchTVShow = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true); // Set loading to true initially
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);

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
      const response = await axios.get("/api/tv-shows/search", {
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

  const handleSearch = async (e, page=1) => {
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

  const handleCardClick = (tvShowId) => {
    navigate(`/tv-show/${tvShowId}`);
  };

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

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get('query') || "";
    const page = parseInt(queryParams.get('page')) || 1;

    setQuery(query);
    setCurrentPage(page);

    if (query) {
      setLoading(true); // Show loading state when navigating back
      fetchSearchResults(query, page);
    } else {
      setResults([]); // Clear results if no query
      setLoading(false); // Reset loading state if no query
    }
  }, [location.search, fetchSearchResults]);

  const memoizedResults = useMemo(() => results, [results]);

  return (
    <div className="search-tv-shows">
      <Container sx={{ bgcolor: 'background.default', color: 'text.primary' }}>
        <Navbar />
        <form
          onSubmit={(e) => handleSearch(e, 1)}
          style={{
            marginTop: "120px",
            marginBottom: "20px"
          }}
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
              <>
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
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
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
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'background.paper',
                      '&:hover': { bgcolor: 'primary.dark' }
                    }}
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
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'background.paper',
                      '&:hover': { bgcolor: 'primary.dark' }
                    }}
                  >
                    Next
                  </Button>
                </Stack>
              </>
            ) : (
              searchPerformed && <Typography>No results found</Typography>
            )
          )}
        </Box>
        
        {/* Back to Top Button */}
        {showBackToTop && (
          <div className="back-to-top" style={{ position: 'fixed', bottom: '58px', right: '30px' }}>
            <Fab color="primary" size="large" onClick={handleScrollToTop}>
              <KeyboardArrowUpIcon />
            </Fab>
          </div>
        )}
      </Container>
    </div>
  );
};

export default SearchTVShow;