// client/src/popular/Shows.jsx
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
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import "./Shows.css";
import Navbar from "../navbar/Navbar";
import SeriesFilterComponent from "../components/SeriesFilters";

// Define a function to scale vote average to a star rating
const getStarRating = (voteAverage) => {
  return Math.min(5, voteAverage / 2); // Scale from 0-10 to 0-5 stars
};

const PopularTVShows = () => {
  const [shows, setShows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [showBackToTop, setShowBackToTop] = useState(false); // State to show Back to Top button

  const fetchPopularTVShows = useCallback(async (page, filters) => {
    setLoading(true);
    try {
      const response = await axios.get("/api/tv-shows/popular", {
        params: { page, ...filters },
      });
      setShows(response.data.results);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.error("Error fetching popular TV shows:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPopularTVShows(currentPage, filters);
    window.scrollTo(0, 0); // Scroll to the top of the page on page change
  }, [currentPage, filters, fetchPopularTVShows]);

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to the first page when filters are applied
  };

  const popularSortOptions = useMemo(
    () => [
      { value: "popularity.desc", label: "Most Popular" },
      { value: "popularity.asc", label: "Least Popular" },
    ],
    []
  );

  const memoizedShows = useMemo(
    () =>
      shows.map((show) => (
        <Grid item xs={12} sm={6} md={3} key={show.id}>
          <Card>
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
            </CardContent>
          </Card>
        </Grid>
      )),
    [shows]
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
    <div>
      <Navbar />
      <div className="shows-container">
        <SeriesFilterComponent
          onApplyFilters={handleApplyFilters}
          sortOptions={popularSortOptions}
        />
        <Typography variant="h3" align="center" gutterBottom sx={{ marginTop: "50px", marginBottom: "30px"}}>
          Popular TV Shows
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

export default PopularTVShows;