// client/src/details/TVShowDetails.jsx
import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useParams } from 'react-router-dom';
import {  
  CardContent,
  Typography,
  Rating,
  Button,
  Stack,  
  Box,
  Grid,
  Skeleton, // Import Skeleton
} from '@mui/material';

import Navbar from '../navbar/Navbar';

// Define a function to scale vote average to a star rating
const getStarRating = (voteAverage) => {
  return Math.min(5, voteAverage / 2); // Scale from 0-10 to 0-5 stars
};

const TvShowDetails = () => {
  const { showId } = useParams();
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isSmallScreen = useMediaQuery('(max-width:600px)'); // Example breakpoint for small screens

  // Cache object
  const cacheObject = useMemo(() => ({
    tvShowDetails: null
  }), []);

  useEffect(() => {
    const fetchTvShowDetails = async () => {
      try {
        if (!cacheObject.tvShowDetails) {
          const response = await axios.get(`/api/tv-show/${showId}`);
          cacheObject.tvShowDetails = response.data;
          setShow(response.data);
        }
      } catch (error) {
        setError('Error fetching TV show details');
      } finally {
        setLoading(false);
      }
    };

    fetchTvShowDetails();
    window.scrollTo(0, 0); // Scroll to the top of the page on page change
  }, [showId]);

  if (loading) return (
    <div>
      <Navbar />
      <Box>
        <Box
          sx={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${show?.backdrop_path || ''})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: { xs: '60vh', md: '100vh' }, // Increased height
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            textShadow: '2px 2px 4px rgba(0,0,0,0.6)',
            padding: '20px',
            marginTop: 5, // Ensure no additional margin is added
          }}
        >
          <Skeleton variant="text" width={isSmallScreen ? '60%' : '40%'} height={50} />
        </Box>
        <Grid container spacing={4} padding={4} justifyContent="center">
          <Grid item xs={12} md={6} lg={4}>
            <Skeleton variant="rectangular" width="100%" height={300} />
          </Grid>
          <Grid item xs={12} md={6} lg={8}>
            <CardContent>
              <Typography variant="h4" gutterBottom>
                <Skeleton variant="text" width="60%" height={40} />
              </Typography>
              <Skeleton variant="text" width="100%" height={20} sx={{ mt: 2 }} />
              <Skeleton variant="text" width="80%" height={20} sx={{ mt: 1 }} />
              <Skeleton variant="text" width="80%" height={20} sx={{ mt: 1 }} />
              <Skeleton variant="text" width="80%" height={20} sx={{ mt: 1 }} />
              <Skeleton variant="text" width="80%" height={20} sx={{ mt: 1 }} />
              <Skeleton variant="text" width="80%" height={20} sx={{ mt: 1 }} />
              <Skeleton variant="text" width="50%" height={20} sx={{ mt: 2 }} />
            </CardContent>
          </Grid>
        </Grid>  
      </Box>
    </div>
  );

  if (error) return <Typography variant="h6" color="error">{error}</Typography>;

  return (
    <div>
      <Navbar />
      <Box>
        <Box
          sx={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${show.backdrop_path})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: { xs: '60vh', md: '100vh' }, // Increased height
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            textShadow: '2px 2px 4px rgba(0,0,0,0.6)',
            padding: '20px',
            marginTop: 5, // Ensure no additional margin is added
          }}
        >
          <Typography 
            variant={isSmallScreen ? 'h4' : 'h2'}
            sx={{ color: 'black' }} // Apply black color
            align="center">{show.name}</Typography>
        </Box>
        <Grid container spacing={4} padding={4} justifyContent="center">
          <Grid item xs={12} md={6} lg={4}>
            <img
              src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
              alt={show.name}
              style={{ width: '100%', borderRadius: '8px' }}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={8}>
            <CardContent>
              <Typography variant="h4" gutterBottom>
                {show.name}
              </Typography>
              <Typography 
                variant="body1"
                sx={{ mt: 2 }} // Adds margin-top to create space between heading and overview
              >
                {show.overview}
              </Typography>
              <Typography variant="body2">
                <strong>First Air Date:</strong> {show.first_air_date}
              </Typography>
              <Typography variant="body2">
                <strong>Genres:</strong> {show.genres.map(genre => genre.name).join(', ')}
              </Typography>
              {show.external_ids && (
                <Typography variant="body2">
                  <strong>IMDB ID:</strong> <a href={`https://www.imdb.com/title/${show.external_ids.imdb_id}`} target="_blank" rel="noopener noreferrer">{show.external_ids.imdb_id}</a>
                </Typography>
              )}
              <Rating
                value={getStarRating(show.vote_average)}
                precision={0.1}
                readOnly
              />
              <Typography variant="body2">
                {show.vote_average} ({show.vote_count} votes)
              </Typography>
              <Stack direction="row" spacing={2} mt={2}>
                {show.homepage && (
                  <Button variant="contained" href={show.homepage} target="_blank">
                    Official Website
                  </Button>
                )}
              </Stack>
            </CardContent>
          </Grid>
        </Grid>  
      </Box>
    </div>
  );
};

export default TvShowDetails;