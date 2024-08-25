// client/src/profile/ProfilePage.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from "react-router-dom";
import { 
  Box, 
  Tab, 
  Tabs, 
  Typography, 
  useMediaQuery, 
  useTheme, 
  Card, 
  CardContent, 
  CardMedia, 
  Grid,
  Button
} from '@mui/material';

import { useAuth } from '../authContext';

import './ProfilePage.css';
import Navbar from '../navbar/Navbar';
import apiClient from '../apiClient';

const ProfilePage = () => {
  const { user } = useAuth();

  const [tabValue, setTabValue] = useState(0);
  const [watchListTab, setWatchListTab] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();

  const [completedList, setCompletedList] = useState([]);
  const [watchingList, setWatchingList] = useState([]);
  const [planToWatchList, setPlanToWatchList] = useState([]);
  const [onHoldList, setOnHoldList] = useState([]);
  const [droppedList, setDroppedList] = useState([]);

  const [completedTVShows, setCompletedTVShows] = useState([]);
  const [watchingTVShows, setWatchingTVShows] = useState([]);
  const [planToWatchTVShows, setPlanToWatchTVShows] = useState([]);
  const [onHoldTVShows, setOnHoldTVShows] = useState([]);
  const [droppedTVShows, setDroppedTVShows] = useState([]);

  const navigate = useNavigate();  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));  
  const isVerySmallScreen = useMediaQuery("(max-width:360px)");

  // Cache object
  const cacheObject = useMemo(() => ({
    completedMovies: null,
    watchingMovies: null,
    planToWatchMovies: null,
    onHoldMovies: null,
    droppedMovies: null,
    completedTVShows: null,
    watchingTVShows: null,
    planToWatchTVShows: null,
    onHoldTVShows: null,
    droppedTVShows: null    
  }), []);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
    setSearchParams({ tab: newValue });
  };

  const handleWatchListTabChange = (event, newValue) => {
    setWatchListTab(newValue);
    setSearchParams({ tab: tabValue, watchListTab: newValue });
  };

  const fetchWatchLists = useCallback(async () => {
    if (user) {
      try {
        // Check cache before making requests
        if (!cacheObject.completedMovies) {
          const completedMoviesRes = await apiClient.get(`/api/watchlist/completed/${user.id}`);
          cacheObject.completedMovies = completedMoviesRes.data;
          setCompletedList(cacheObject.completedMovies);
        }

        if (!cacheObject.watchingMovies) {
          const watchingMoviesRes = await apiClient.get(`/api/watchlist/watching/${user.id}`);
          cacheObject.watchingMovies = watchingMoviesRes.data;
          setWatchingList(cacheObject.watchingMovies);
        }

        if (!cacheObject.planToWatchMovies) {
          const planToWatchMoviesRes = await apiClient.get(`/api/watchlist/plan-to-watch/${user.id}`);
          cacheObject.planToWatchMovies = planToWatchMoviesRes.data;
          setPlanToWatchList(cacheObject.planToWatchMovies);
        }

        if (!cacheObject.onHoldMovies) {
          const onHoldMoviesRes = await apiClient.get(`/api/watchlist/on-hold/${user.id}`);
          cacheObject.onHoldMovies = onHoldMoviesRes.data;
          setOnHoldList(cacheObject.onHoldMovies);
        }

        if (!cacheObject.droppedMovies) {
          const droppedMoviesRes = await apiClient.get(`/api/watchlist/dropped/${user.id}`);
          cacheObject.droppedMovies = droppedMoviesRes.data;
          setDroppedList(cacheObject.droppedMovies);
        }

        if (!cacheObject.completedTVShows) {
          const completedTVShowsRes = await apiClient.get(`/api/tv-watchlist/completed/${user.id}`);
          cacheObject.completedTVShows = completedTVShowsRes.data;
          setCompletedTVShows(cacheObject.completedTVShows);
        }

        if (!cacheObject.watchingTVShows) {
          const watchingTVShowsRes = await apiClient.get(`/api/tv-watchlist/watching/${user.id}`);
          cacheObject.watchingTVShows = watchingTVShowsRes.data;
          setWatchingTVShows(cacheObject.watchingTVShows);
        }

        if (!cacheObject.planToWatchTVShows) {
          const planToWatchTVShowsRes = await apiClient.get(`/api/tv-watchlist/plan-to-watch/${user.id}`);
          cacheObject.planToWatchTVShows = planToWatchTVShowsRes.data;
          setPlanToWatchTVShows(cacheObject.planToWatchTVShows);
        }

        if (!cacheObject.onHoldTVShows) {
          const onHoldTVShowsRes = await apiClient.get(`/api/tv-watchlist/on-hold/${user.id}`);
          cacheObject.onHoldTVShows = onHoldTVShowsRes.data;
          setOnHoldTVShows(cacheObject.onHoldTVShows);
        }

        if (!cacheObject.droppedTVShows) {
          const droppedTVShowsRes = await apiClient.get(`/api/tv-watchlist/dropped/${user.id}`);
          cacheObject.droppedTVShows = droppedTVShowsRes.data;
          setDroppedTVShows(cacheObject.droppedTVShows);
        }
      } catch (error) {
        console.error('Error fetching watch lists:', error);
      }
    }    
  }, [user, cacheObject]);

  useEffect(() => {
    fetchWatchLists();    
  }, [fetchWatchLists, cacheObject]);

  useEffect(() => {
    const tab = searchParams.get('tab');
    const watchListTabParam = searchParams.get('watchListTab');

    if (tab !== null) {
      setTabValue(parseInt(tab, 10));
    }

    if (watchListTabParam !== null) {
      setWatchListTab(parseInt(watchListTabParam, 10));
    }
  }, [searchParams]);

  const handleRemoveMovie = async (movieId, state) => {
    if (user) {
      try {        
        await apiClient.delete(`/api/watchlist/${state.toLowerCase()}/${user.id}/${movieId}`);        
        fetchWatchLists(); // Refresh the watchlists after removal
      } catch (error) {
         console.error('Error removing movie:', error.response ? error.response.data : error.message);
      }
    }
  };

  const handleRemoveTVShow = async (tvShowId, state) => {
    if (user) {
      try {
        await apiClient.delete(`/api/tv-watchlist/${state.toLowerCase()}/${user.id}/${tvShowId}`);
        fetchWatchLists(); // Refresh the watchlists after removal
      } catch (error) {
        console.error('Error removing TV show:', error.response ? error.response.data : error.message);
      }
    }
  };  

  const handleDeleteAccount = async () => {
    if (user) {
      try {
        await apiClient.delete('/api/delete-account');
        // Perform any necessary cleanup or redirection after account deletion
        navigate('/login'); // Redirect to login page or any other desired page
      } catch (error) {
        console.error('Error deleting account:', error.response ? error.response.data : error.message);
      }
    }
  };

  return (
    <div className='profile-container'>
      <Navbar />
      <Box sx={{ width: '100%' }}>
        <Tabs value={tabValue} onChange={handleChange} aria-label="Profile Tabs">
          <Tab label="Profile Details" />
          <Tab label="Watch List" />
        </Tabs>
        <TabPanel value={tabValue} index={0}>
          <Typography variant="h6">User Details</Typography>
          <Typography variant="body1">Username: {user?.username}</Typography>
          <Typography variant="body1">Email: {user?.email}</Typography>
          <Button 
            variant="contained" 
            color="error"
            onClick={handleDeleteAccount}
            sx={{ mt: 2 }} // Margin top of 2 spacing units
          >
            Delete Account
          </Button>
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ width: '100%' }}>
            <Tabs
              value={watchListTab}
              onChange={handleWatchListTabChange}
              aria-label="Watch List Tabs"
              variant={isMobile ? 'scrollable' : 'standard'}
              scrollButtons="auto"
              sx={{ mb: 2 }}
            >
              <Tab label="Completed" />
              <Tab label="Watching" />
              <Tab label="Plan to Watch" />
              <Tab label="On Hold" />
              <Tab label="Dropped" />
            </Tabs>
            <TabPanel value={watchListTab} index={0}>
              <Typography variant="h6" sx={{ mb: 2 }}>Movies</Typography>
              <MovieCardList 
                movies={completedList} 
                onRemove={handleRemoveMovie}
                isMobile={isMobile}
                isVerySmallScreen={isVerySmallScreen}
                navigate={navigate}
              />
              <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>TV Shows</Typography>
              <TVShowCardList 
                tvShows={completedTVShows} 
                onRemove={handleRemoveTVShow}
                isMobile={isMobile} 
                isVerySmallScreen={isVerySmallScreen}
                navigate={navigate}
              />
            </TabPanel>
            <TabPanel value={watchListTab} index={1}>
              <Typography variant="h6" sx={{ mb: 2 }}>Movies</Typography>
              <MovieCardList 
                movies={watchingList} 
                onRemove={handleRemoveMovie}
                isMobile={isMobile} 
                isVerySmallScreen={isVerySmallScreen}
                navigate={navigate}
              />
              <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>TV Shows</Typography>
              <TVShowCardList 
                tvShows={watchingTVShows} 
                onRemove={handleRemoveTVShow}
                isMobile={isMobile} 
                isVerySmallScreen={isVerySmallScreen}
                navigate={navigate}
              />
            </TabPanel>
            <TabPanel value={watchListTab} index={2}>
              <Typography variant="h6" sx={{ mb: 2 }}>Movies</Typography>
              <MovieCardList 
                movies={planToWatchList} 
                onRemove={handleRemoveMovie}
                isMobile={isMobile} 
                isVerySmallScreen={isVerySmallScreen}
                navigate={navigate}
              />
              <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>TV Shows</Typography>
              <TVShowCardList 
                tvShows={planToWatchTVShows} 
                onRemove={handleRemoveTVShow}
                isMobile={isMobile} 
                isVerySmallScreen={isVerySmallScreen}
                navigate={navigate}
              />
            </TabPanel>
            <TabPanel value={watchListTab} index={3}>
              <Typography variant="h6" sx={{ mb: 2 }}>Movies</Typography>
              <MovieCardList 
                movies={onHoldList} 
                onRemove={handleRemoveMovie}
                isMobile={isMobile} 
                isVerySmallScreen={isVerySmallScreen}
                navigate={navigate}
              />
              <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>TV Shows</Typography>
              <TVShowCardList 
                tvShows={onHoldTVShows} 
                onRemove={handleRemoveTVShow}
                isMobile={isMobile} 
                isVerySmallScreen={isVerySmallScreen}
                navigate={navigate}
              />
            </TabPanel>
            <TabPanel value={watchListTab} index={4}>
              <Typography variant="h6" sx={{ mb: 2 }}>Movies</Typography>
              <MovieCardList 
                movies={droppedList} 
                onRemove={handleRemoveMovie}
                isMobile={isMobile} 
                isVerySmallScreen={isVerySmallScreen}
                navigate={navigate}
              />
              <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>TV Shows</Typography>
              <TVShowCardList 
                tvShows={droppedTVShows} 
                onRemove={handleRemoveTVShow}
                isMobile={isMobile} 
                isVerySmallScreen={isVerySmallScreen}
                navigate={navigate}
              />
            </TabPanel>
          </Box>
        </TabPanel>
      </Box>
    </div>
  );
};


/**
 * TabPanel component to display content conditionally based on the selected tab.
 *
 * This component is responsible for rendering its children only when the `value` prop
 * matches the `index` prop, effectively showing and hiding content based on the active tab.
 * 
 * Props:
 * - children: The content to be displayed within the panel.
 * - value: The current value of the tab (selected tab index).
 * - index: The index of this particular panel (corresponds to the tab index).
 * - other: Any additional props to be passed to the root div.
 * 
 * The `role="tabpanel"` attribute specifies the role of the element as a tab panel.
 * The `hidden` attribute is used to hide the panel when it is not the active one.
 * The `id` and `aria-labelledby` attributes are used for accessibility purposes,
 * linking the panel to the corresponding tab button.
 * 
 * When the `value` matches the `index`, the panel's content (children) is wrapped in a Box component
 * with padding (`sx={{ p: 3 }}`) and displayed.
 */
const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

// Component to display a list of movie cards
const MovieCardList = ({ movies, onRemove, isMobile, isVerySmallScreen, navigate }) => {
  // Reverse the movies array to display the most recent first
  const sortedMovies = [...movies].reverse();

  const handleCardClick = (id) => {
    navigate(`/movie/${id}`); // Navigate to the movie details page
  };

  return (
    <Grid container spacing={2}>
      {sortedMovies.map((movie) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={movie.movie_id}>
          <Card
            onClick={() => handleCardClick(movie.movie_id)}
            sx={{
              cursor: 'pointer'
            }}
          >
            <CardMedia
              component="img"
              height={isVerySmallScreen ? "295" : isMobile ? "300" : "400"}
              image={movie.image_path}
              alt={movie.title}
            />
            <CardContent>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <Typography variant={isMobile ? 'h7' : 'h6'}>{movie.title}</Typography>
                <Button 
                  variant="contained" 
                  color="error"
                  onClick={() => onRemove(movie.movie_id, movie.state)}
                  sx={{ mt: 2 }} // Margin top of 2 spacing units
                >
                  Remove
                </Button>
              </div>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

// Component to display a list of TV show cards
const TVShowCardList = ({ tvShows, onRemove, isMobile, isVerySmallScreen, navigate }) => {
  // Reverse the tvShows array to display the most recent first
  const sortedTVShows = [...tvShows].reverse();

  const handleShowCardClick = (id) => {
    navigate(`/tv-show/${id}`);
  };

  return (
    <Grid container spacing={2}>
      {sortedTVShows.map((tvShow) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={tvShow.tv_show_id}>
          <Card
            onClick={() => handleShowCardClick(tvShow.tv_show_id)}
            sx={{
              cursor: 'pointer'
            }}
          >
            <CardMedia
              component="img"
              height={isVerySmallScreen ? "295" : isMobile ? "300" : "400"}
              image={tvShow.image_path}
              alt={tvShow.title}
            />
            <CardContent>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <Typography variant={isMobile ? 'h7' : 'h6'}>{tvShow.title}</Typography>
                <Button 
                  variant="contained" 
                  color="error"
                  onClick={() => onRemove(tvShow.tv_show_id, tvShow.state)}
                  sx={{ mt: 2 }} // Margin top of 2 spacing units
                >
                  Remove
                </Button>
              </div>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ProfilePage;