// client/src/details/MovieDetails.jsx
import React, { useEffect, useState, useMemo, memo } from 'react';
import { useParams } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import {  
  CardContent,
  Typography,
  Rating,
  Button,
  Stack,  
  Box,
  Grid,
  Skeleton,
  Alert,
  Card,
  CardMedia,
} from '@mui/material';

import Navbar from '../navbar/Navbar';
import apiClient from "../apiClient"

// Define a function to scale vote average to a star rating
const getStarRating = (voteAverage) => {
  return Math.min(5, voteAverage / 2); // Scale from 0-10 to 0-5 stars
};

const MovieDetails = () => {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [error, setError] = useState(null);  

  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const isMediumScreen = useMediaQuery('(min-width:601px) and (max-width:900px)');  

  // Set height based on screen size
  const backgroundPictureHeight = isSmallScreen ? '32vh' : isMediumScreen ? '130vh' : '100vh';  
  const posterWidth = isSmallScreen ? '60%' : isMediumScreen ? '40%' : '100%';

  // Cache object
  const cacheObject = useMemo(() => ({
    movieDetails: null,
    movieRecommendations: null, // Add recommendations to the cache    
  }), []);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        if (!cacheObject.movieDetails) {
          const response = await apiClient.get(`/api/movies/${movieId}`);
          cacheObject.movieDetails = response.data;
          setMovie(response.data);
        }
      } catch (error) {
        setError('Failed to load movie details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    const fetchRecommendations = async () => {
      try {
        if (!cacheObject.movieRecommendations) {
          const response = await apiClient.get(`/api/movies/recommendations/${movieId}`);
          cacheObject.movieRecommendations = response.data.results;
          setRecommendations(response.data.results);
        }
      } catch (error) {
        setError('Failed to load movie recommendations. Please try again later.');
      }
    };    

    fetchMovieDetails();
    fetchRecommendations();    
    window.scrollTo(0, 0);
  }, [movieId, cacheObject]);

  useEffect(() => {
    const fetchMovieVideos = async () => {
      try {
        if (movieId) {
          const response = await apiClient.get(`/api/movies/video/${movieId}`);          
          setVideos(response.data.results);
        }
      } catch (error) {        
        setError('Failed to fetch movie videos');
      } finally {
        setLoadingVideos(false);
      }
    };
    fetchMovieVideos();
    window.scrollTo(0, 0);
  }, [movieId]);

  // Memoized VideoCard component to avoid unnecessary re-renders
  const VideoCard = memo(({ video }) => (
    <Card sx={{ minWidth: '320px', marginRight: 2, borderRadius: '8px' }}>
      <CardMedia
        component="iframe"
        src={`https://www.youtube.com/embed/${video.key}`}
        title={video.name}
        height="180px"
        sx={{ borderRadius: '8px' }}
      />
    </Card>
  ));

  if (loading) return (
    <div>
      <Navbar />
      <Box>
        <Box
          sx={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${movie?.backdrop_path || ''})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: backgroundPictureHeight,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            textShadow: '2px 2px 4px rgba(0,0,0,0.6)',
            padding: '20px',
            marginTop: 5,
          }}
        >
          <Skeleton variant="text" width={isSmallScreen ? '60%' : '40%'} height={50} />
        </Box>
        <Grid container spacing={4} padding={4} justifyContent="center">
          <Grid item xs={12} md={6} lg={4}>
            <Skeleton variant="rectangular" width="100%" height={300} />
          </Grid>
          <Grid item xs={12} md={6} lg={8}>
            <Skeleton variant="text" width="60%" height={40} />
            <Skeleton variant="text" width="100%" height={20} sx={{ mt: 2 }} />
            <Skeleton variant="text" width="80%" height={20} sx={{ mt: 1 }} />
          </Grid>
        </Grid>  
      </Box>
    </div>
  );

  // Display a user-friendly error message
  if (error) return (
    <div>
      <Navbar />
      <Box sx={{ mt: 12, display: 'flex', justifyContent: 'center' }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    </div>
  );

  const handleCardClick = (movieId) => {
    // Navigate to the new URL
    window.location.href = `/movie/${movieId}`;
  };

  // Display the movie details
  return (
    <div>
      <Navbar />
      <Box>
        <Box
          sx={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: backgroundPictureHeight,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            textShadow: '2px 2px 4px rgba(0,0,0,0.6)',
            padding: '20px',
            marginTop: 5,
          }}
        >
          <Typography 
            variant={isSmallScreen ? 'h5' : 'h2'}
            sx={{ color: 'black' }} 
            align="center"
          >
            {movie.title}
          </Typography>
        </Box>
        <Grid container spacing={4} padding={4} justifyContent="center">
          <Grid item xs={12} md={6} lg={4}>
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              style={{                
                alignItems: 'center',
                width: posterWidth, 
                borderRadius: '8px',
                height: '100%',
              }}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={8}>
            <CardContent>
              <Typography variant={isSmallScreen ? 'h5' : 'h4'} gutterBottom>
                <strong>{movie.title}</strong>
              </Typography>
              <Typography 
                variant="body1"
                sx={{ mt: 2 }}
              >
                {movie.overview}
              </Typography>
              <Typography variant="body2">
                <strong>Release Date:</strong> {movie.release_date}
              </Typography>
              <Typography variant="body2">
                <strong>Runtime:</strong> {movie.runtime} minutes
              </Typography>
              <Typography variant="body2">
                <strong>Genres:</strong> {movie.genres.map(genre => genre.name).join(', ')}
              </Typography>
              <Typography variant="body2">
                <strong>Budget:</strong> ${movie.budget.toLocaleString()}
              </Typography>
              <Typography variant="body2">
                <strong>Revenue:</strong> ${movie.revenue.toLocaleString()}
              </Typography>
              <Typography variant="body2">
                <strong>Production Companies:</strong> {movie.production_companies.map(company => company.name).join(', ')}
              </Typography>
              <Typography variant="body2">
                <strong>IMDB ID:</strong> <a href={`https://www.imdb.com/title/${movie.imdb_id}`} target="_blank" rel="noopener noreferrer">{movie.imdb_id}</a>
              </Typography>
              <Rating
                value={getStarRating(movie.vote_average)}
                precision={0.1}
                readOnly
              />
              <Typography variant="body2">
                {movie.vote_average} ({movie.vote_count} votes)
              </Typography>
              <Stack direction="row" spacing={2} mt={2}>
                <Button variant="contained" href={movie.homepage} target="_blank">
                  Official Website
                </Button>
              </Stack>
            </CardContent>
          </Grid>
        </Grid>

        {/* Video Trailers */}
        <Box sx={{ mt: 4, px: 2 }}>
          <Typography 
            variant={isSmallScreen ? 'h5' : 'h4'}
            sx={{ color: 'black' }} 
            align="center"
          >
            Watch Trailers
          </Typography>
          <Stack 
            direction="row" 
            spacing={2} 
            sx={{ 
              overflowX: 'auto', 
              padding: '20px',
              '&::-webkit-scrollbar': { display: 'none' }, // Hide scrollbar for WebKit browsers
              msOverflowStyle: 'none',  // Hide scrollbar for IE and Edge
              scrollbarWidth: 'none'     // Hide scrollbar for Firefox
            }}
          >
            {loadingVideos ? (
              <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                {[...Array(3)].map((_, index) => (
                  <Skeleton 
                    key={index}
                    variant="rectangular" 
                    width={320} 
                    height={180} 
                    sx={{ marginRight: 2, borderRadius: '8px' }} 
                  />
                ))}
              </Box>
            ) : (
              videos.length > 0 ? (
                videos.map((video) => (
                  <VideoCard key={video.id} video={video} />
                ))
              ) : (
                <Typography>No trailers available</Typography>
              )
            )}
          </Stack>
        </Box>

        {/* Movie Recommendations */}
        <Box sx={{ mt: 4, px: 2 }}>
          <Typography 
            variant={isSmallScreen ? 'h5' : 'h4'}
            align="center" 
            gutterBottom
          >
            You Might Also Like
          </Typography>

          {recommendations.length > 0 ? (
            <Box 
              sx={{ 
                display: 'flex', 
                overflowX: 'scroll', 
                scrollbarWidth: 'none', 
                msOverflowStyle: 'none',
                whiteSpace: 'nowrap',
                '&::-webkit-scrollbar': { display: 'none' },
              }}
            >
              {recommendations.map(recommendation => (
                <Box
                  key={recommendation.id}
                  onClick={() => handleCardClick(recommendation.id)}
                  sx={{ display: 'inline-block', mr: 2, cursor: 'pointer', flexShrink: 0 }}
                >
                  <Card
                    sx={{ width: isSmallScreen ? 160 : 200, borderRadius: 2 }}
                  >
                    <CardMedia
                      component="img"
                      height="270"
                      image={`https://image.tmdb.org/t/p/w500${recommendation.poster_path}`}
                      alt={recommendation.title}
                    />
                    <CardContent>
                      <Typography variant="subtitle2" noWrap>
                        {recommendation.title}
                      </Typography>
                      <Rating
                        value={getStarRating(recommendation.vote_average)}
                        precision={0.1}
                        readOnly
                      />
                      <Typography variant="body2">
                        {recommendation.vote_average} ({recommendation.vote_count} votes)
                      </Typography>           
                    </CardContent>
                  </Card>
                </Box>
              ))}
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body1">No recommendations available</Typography>
            </Box>
          )}
        </Box>

      </Box>
    </div>
  );    
};

export default MovieDetails;