// client/src/trending/TrendingMovies.jsx
import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
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
} from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import "./TrendingMovies.css";
import Navbar from "../navbar/Navbar";

// Define a function to scale vote average to a star rating
const getStarRating = (voteAverage) => {
  return Math.min(5, voteAverage / 2); // Scale from 0-10 to 0-5 stars
};

const TrendingMovies = () => {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showBackToTop, setShowBackToTop] = useState(false); // State to show Back to Top button

  const fetchTrendingMovies = useCallback(async (page) => {
    setLoading(true);
    try {
      const response = await axios.get("/api/movies/trending", {
        params: { page },
      });
      setMovies(response.data.results);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.error("Error fetching trending movies:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrendingMovies(currentPage);
    window.scrollTo(0, 0); // Scroll to the top of the page on page change
  }, [currentPage, fetchTrendingMovies]);

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const memoizedMovies = useMemo(
    () =>
      movies.map((movie) => (
        <Grid item xs={12} sm={6} md={3} key={movie.id}>
          <Card>
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
            </CardContent>
          </Card>
        </Grid>
      )),
    [movies]
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
      <div className="movie-container">
        <Typography
          variant="h3"
          align="center"
          gutterBottom
          sx={{ marginTop: "100px", marginBottom: "30px" }}
        >
          Trending Movies
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
      </div>
    </div>
  );
};

export default TrendingMovies;