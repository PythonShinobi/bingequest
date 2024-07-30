import React, { useEffect, useState } from "react";
import axios from "axios";
import { Grid, Card, CardMedia, CardContent, Typography, Rating, Button, Stack, Skeleton, Select, MenuItem, FormControl, InputLabel } from "@mui/material";

import "./NowPlaying.css";
import Navbar from "../navbar/Navbar";

// Define a function to scale popularity to a star rating
const getStarRating = (popularity, maxPopularity = 10000) => {
  return Math.min(5, (popularity / maxPopularity) * 5);
};

const NowPlaying = () => {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNowPlaying = async (page) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/movies/now_playing?page=${page}`);
      setMovies(response.data.results);
      setTotalPages(response.data.total_pages);
      setError(null);
    } catch (error) {
      setError("Error fetching now playing movies");
      console.error("Error fetching now playing movies:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNowPlaying(currentPage);
    window.scrollTo(0, 0); // Scroll to the top of the page on page change
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleDropdownChange = (event) => {
    const selectedPage = event.target.value;
    handlePageChange(selectedPage);
  };

  if (loading) {
    return (
      <div className="now-playing-container">
        <Navbar />
        <Grid container spacing={4} style={{ padding: '0 16px' }}>
          {Array.from(new Array(12)).map((_, index) => (
            <Grid item key={index} xs={12} sm={6} md={4} lg={4}>
              <Card style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}>
                <Skeleton variant="rectangular" height={550} />
                <CardContent>
                  <Skeleton variant="text" height={30} width="80%" />
                  <Skeleton variant="text" height={20} width="60%" />
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Skeleton variant="text" height={20} width="40%" />
                  </div>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    );
  }

  if (error) return <Typography variant="body1" color="error">{error}</Typography>;

  return (
    <div className="now-playing-container">
      <Navbar />
      <Grid container spacing={4} style={{ padding: '0 16px' }}>
        {movies.map(movie => (
          <Grid item key={movie.id} xs={12} sm={6} md={4} lg={4}>
            <Card style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}>
              <CardMedia
                component="img"
                height="550"
                image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {movie.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Release Date: {new Date(movie.release_date).toLocaleDateString()}
                </Typography>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" color="textSecondary" style={{ marginRight: 8 }}>
                    Popularity:
                  </Typography>
                  <Rating
                    name="read-only"
                    value={getStarRating(movie.popularity)}
                    readOnly
                    precision={0.1}
                    size="small"
                    style={{ marginRight: 8 }}
                  />
                  <Typography variant="body2" color="textSecondary">
                    {movie.popularity.toFixed(0)}
                  </Typography>
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Stack direction="row" spacing={2} justifyContent="center" style={{ marginTop: 20 }}>
        <Button
          variant="contained"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <FormControl variant="outlined">
          <InputLabel>Page</InputLabel>
          <Select
            value={currentPage}
            onChange={handleDropdownChange}
            label="Page"
            style={{ margin: '0 16px' }}
          >
            {Array.from({ length: totalPages }).map((_, index) => (
              <MenuItem key={index + 1} value={index + 1}>
                Page {index + 1}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </Stack>
    </div>
  );
};

export default NowPlaying;