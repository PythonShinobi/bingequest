// client/src/details/TVShowDetails.jsx
import React, { useEffect, useState, useMemo, memo } from 'react';
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
  Alert,
  Card,
  CardMedia,  
} from '@mui/material';

import Navbar from '../navbar/Navbar';

// Define a function to scale vote average to a star rating
const getStarRating = (voteAverage) => {
  return Math.min(5, voteAverage / 2); // Scale from 0-10 to 0-5 stars
};

const TvShowDetails = () => {
  const { showId } = useParams();
  const [show, setShow] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [error, setError] = useState(null);  

  const isSmallScreen = useMediaQuery('(max-width:600px)'); // Example breakpoint for small screens
  const isMediumScreen = useMediaQuery('(min-width:601px) and (max-width:900px)');

  // Set height and width based on screen size
  const backgroundPictureHeight = isSmallScreen ? '32vh' : isMediumScreen ? '130vh' : '100vh';  
  const posterWidth = isSmallScreen ? '60%' : isMediumScreen ? '40%' : '100%';

  // Cache object
  const cacheObject = useMemo(() => ({
    tvShowDetails: null,
    tvShowRecommendations: null, // Add recommendations to the cache
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
        setError('Failed to load show details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    const fetchRecommendations = async () => {
      try {
        if (!cacheObject.movieRecommendations) {
          const response = await axios.get(`/api/tv-show/recommendations/${showId}`);
          cacheObject.movieRecommendations = response.data.results;
          setRecommendations(response.data.results);
        }
      } catch (error) {
        setError('Failed to load movie recommendations. Please try again later.');
      }
    };

    fetchTvShowDetails();
    fetchRecommendations();
    window.scrollTo(0, 0); // Scroll to the top of the page on page change
  }, [showId, cacheObject]);

  useEffect(() => {
    const fetchShowVideos = async () => {
      try {
        if (showId) {
          const response = await axios.get(`/api/tv-show/video/${showId}`); // Changed seriesId to showId          
          setVideos(response.data.results);
        }
      } catch (error) {        
        setError('Failed to fetch series videos');
      } finally {
        setLoadingVideos(false);
      }
    };
    fetchShowVideos();
    window.scrollTo(0, 0);
  }, [showId]);

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
            backgroundImage: `url(https://image.tmdb.org/t/p/original${show?.backdrop_path || ''})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: backgroundPictureHeight,
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

  // Display a user-friendly error message
  if (error) return (
    <div>
      <Navbar />
      <Box sx={{ mt: 12, display: 'flex', justifyContent: 'center' }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    </div>
  );

  const handleCardClick = (show_id) => {
    // Navigate to the new URL
    window.location.href = `/tv-show/${show_id}`;
  };  

  return (
    <div>
      <Navbar />
      <Box>
        <Box
          sx={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${show.backdrop_path})`,
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
            {show.name}
          </Typography>
        </Box>
        <Grid container spacing={4} padding={4} justifyContent="center">
          <Grid item xs={12} md={6} lg={4}>
            <img
              src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
              alt={show.name}
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
                <strong>{show.name}</strong>
              </Typography>
              <Typography 
                variant="body1"
                sx={{ mt: 2 }}
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
  
        {/* TV Show Recommendation */}
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
                      alt={recommendation.name}
                    />
                    <CardContent>
                      <Typography variant="subtitle2" noWrap>
                        {recommendation.name}
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

export default TvShowDetails;