// client/src/home/Home.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Marquee from "react-fast-marquee";
import {
  Container,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Skeleton,
  useMediaQuery,
  Alert
} from "@mui/material";

import "./Home.css";
import Navbar from "../navbar/Navbar";
import apiClient from "../apiClient";

// Cache object
const cacheObject = {
  movies: null,
  topRatedMovies: null,
  topRatedTvShows: null,
};

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [topRatedTvShows, setTopRatedTvShows] = useState([]);
  const [loadingMovies, setLoadingMovies] = useState(true);
  const [loadingTopRatedMovies, setLoadingTopRatedMovies] = useState(true);
  const [loadingTopRated, setLoadingTopRated] = useState(true);
  const [moviesError, setMoviesError] = useState(null);
  const [topRatedMoviesError, setTopRatedMoviesError] = useState(null);
  const [topRatedTvShowsError, setTopRatedTvShowsError] = useState(null);

  const isSmallScreen = useMediaQuery("(max-width:600px)");
  const isVerySmallScreen = useMediaQuery("(max-width:360px)");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMoviesInTheatres = async () => {
      if (cacheObject.movies) {
        setMovies(cacheObject.movies);
        setLoadingMovies(false);
        return;
      }

      try {
        const response = await apiClient.get("/api/home/in-theatres");
        cacheObject.movies = response.data.results; // Cache the data
        setMovies(response.data.results);
      } catch (error) {
        setMoviesError("We're having trouble loading movies in theatres. Please try again later.");        
      } finally {
        setLoadingMovies(false);
      }
    };

    const fetchTopRatedMovies = async () => {
      if (cacheObject.topRatedMovies) {
        setTopRatedMovies(cacheObject.topRatedMovies);
        setLoadingTopRatedMovies(false);
        return;
      }

      try {
        const response = await apiClient.get("/api/home/movie-top-rated");
        cacheObject.topRatedMovies = response.data.results; // Cache the data
        setTopRatedMovies(response.data.results);
      } catch (error) {
        setTopRatedMoviesError("We couldn't load the top-rated movies right now. Please check back later.");
      } finally {
        setLoadingTopRatedMovies(false);
      }
    };

    const fetchTopRatedTvShows = async () => {
      if (cacheObject.topRatedTvShows) {
        setTopRatedTvShows(cacheObject.topRatedTvShows);
        setLoadingTopRated(false);
        return;
      }

      try {
        const response = await apiClient.get("/api/home/show-top-rated");
        cacheObject.topRatedTvShows = response.data.results; // Cache the data
        setTopRatedTvShows(response.data.results);
      } catch (error) {
        setTopRatedTvShowsError("We're having trouble loading top-rated TV shows. Please try again later.");
      } finally {
        setLoadingTopRated(false);
      }
    };

    fetchMoviesInTheatres();
    fetchTopRatedMovies();
    fetchTopRatedTvShows();

    window.scrollTo(0, 0);
  }, []);

  const handleCardClick = (id) => {
    navigate(`/movie/${id}`); // Navigate to the movie details page
  };

  const handleShowCardClick = (id) => {
    navigate(`/tv-show/${id}`);
  };

  return (
    <div className="home-container">
      <Navbar />
      <Container>
        <Typography 
          variant={isSmallScreen ? 'h5' : 'h4'}
          sx={{ mt: 2 }} 
          gutterBottom
        >
          In Theatres
        </Typography>
        <div className="marquee-container" style={{ padding: "20px 0" }}>
          {loadingMovies ? (
            <Skeleton variant="rectangular" height={200} />
          ) : moviesError ? (
              <Alert 
                severity="error" 
                sx={{ 
                  width: '100%', 
                  maxWidth: '600px', 
                  wordBreak: 'break-word' 
                }}
              >
                {moviesError}
              </Alert>
          ) : (
            <Marquee pauseOnHover gradient={false} speed={50}>
              {movies.map((movie) => (
                <Card
                  key={movie.id}
                  onClick={() => handleCardClick(movie.id)} // Add onClick handler
                  sx={{
                    margin: "0 10px",
                    minWidth: isSmallScreen ? 150 : 300,
                    maxWidth: isSmallScreen ? 150 : 300,
                    cursor: 'pointer', // Add cursor pointer to indicate clickable
                  }}
                >
                  <CardMedia
                    component="img"
                    alt={movie.title}
                    height={isVerySmallScreen ? "220" : isSmallScreen ? "220" : "440"}
                    image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    title={movie.title}
                    sx={{ objectFit: "cover" }}
                  />
                  <CardContent>
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {movie.title}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Marquee>
          )}
        </div>

        <Typography 
          variant={isSmallScreen ? 'h5' : 'h4'}
          sx={{ mt: 6 }} 
          gutterBottom
        >
          Top Rated Movies
        </Typography>
        <div className="marquee-container" style={{ padding: "20px 0" }}>
          {loadingTopRatedMovies ? (
            <Skeleton variant="rectangular" height={200} />
          ) : topRatedMoviesError ? (
              <Alert 
                severity="error" 
                sx={{ 
                  width: '100%', 
                  maxWidth: '600px', 
                  wordBreak: 'break-word' 
                }}
              >
                {topRatedMoviesError}
              </Alert>
          ) : (
            <Marquee pauseOnHover gradient={false} speed={50}>
              {topRatedMovies.map((movie) => (
                <Card
                  key={movie.id}
                  onClick={() => handleCardClick(movie.id)} // Add onClick handler
                  sx={{
                    margin: "0 10px",
                    minWidth: isSmallScreen ? 150 : 300,
                    maxWidth: isSmallScreen ? 150 : 300,
                    cursor: 'pointer',
                  }}
                >
                  <CardMedia
                    component="img"
                    alt={movie.title}
                    height={isVerySmallScreen ? "220" : isSmallScreen ? "220" : "440"}
                    image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    title={movie.title}
                    sx={{ objectFit: "cover" }}
                  />
                  <CardContent>
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {movie.title}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Marquee>
          )}
        </div>

        <Typography 
          variant={isSmallScreen ? 'h5' : 'h4'}
          sx={{ mt: 6 }} 
          gutterBottom
        >
          Top Rated TV Shows
        </Typography>
        <div className="marquee-container" style={{ padding: "20px 0" }}>
          {loadingTopRated ? (
            <Skeleton variant="rectangular" height={200} />
          ) : topRatedTvShowsError ? (
              <Alert 
                severity="error" 
                sx={{ 
                  width: '100%', 
                  maxWidth: '600px', 
                  wordBreak: 'break-word' 
                }}
              >
                {topRatedTvShowsError}
              </Alert>
          ) : (
            <Marquee pauseOnHover gradient={false} speed={50}>
              {topRatedTvShows.map((show) => (
                <Card
                  key={show.id}
                  onClick={() => handleShowCardClick(show.id)}
                  sx={{
                    margin: "0 10px",
                    minWidth: isSmallScreen ? 150 : 300,
                    maxWidth: isSmallScreen ? 150 : 300,
                    cursor: 'pointer',
                  }}
                >
                  <CardMedia
                    component="img"
                    alt={show.name}
                    height={isVerySmallScreen ? "220" : isSmallScreen ? "220" : "440"}
                    image={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                    title={show.name}
                    sx={{ objectFit: "cover" }}
                  />
                  <CardContent>
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {show.name}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Marquee>
          )}
        </div>
      </Container>
    </div>
  );
};

export default Home;