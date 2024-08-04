// client/src/search/SearchMovie.jsx
import React, { useState, useEffect, useMemo } from "react";
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
  CardMedia
} from "@mui/material";

import Navbar from "../navbar/Navbar";

const SearchMovie = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handleSearch = async (e, page=1) => {
    if (e) {
      e.preventDefault();
    }
    setSearchPerformed(true);
    setLoading(true);

    try {
      const response = await axios.get("/api/movies/search", {
        params: { query, page }
      });
      setResults(response.data.results);
      setTotalPages(response.data.total_pages);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
    handleSearch(null, page);
    window.scrollTo({ top: 0, behavior: "smooth" });
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

  const memoizedResults = useMemo(() => results, [results]);

  return (
    <div>
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
              <>
                <Grid container spacing={3}>
                  {memoizedResults.map((movie) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
                      <Card sx={{ bgcolor: 'background.paper' }}>
                        <CardMedia
                          component="img"
                          image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                          alt={movie.title}
                          height="450"
                        />
                        <CardContent>
                          <Typography variant="h6" gutterBottom>{movie.title}</Typography>
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
                    sx={{
                      '& .MuiPaginationItem-root': {
                        color: 'text.primary',
                        bgcolor: 'background.paper',
                        borderRadius: '8px',                        
                        borderColor: 'divider'
                      },
                      '& .Mui-selected': {
                        backgroundColor: 'primary.main',
                        color: 'background.paper',                        
                        borderColor: 'secondary.main'
                      },
                      '& .MuiPaginationItem-ellipsis': {
                        color: 'text.primary'
                      }
                    }}
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

export default SearchMovie;