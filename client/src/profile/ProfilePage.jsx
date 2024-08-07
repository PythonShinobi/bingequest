// client/src/profile/ProfilePage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
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

import './ProfilePage.css';
import Navbar from '../navbar/Navbar';
import useIsAuthenticated from '../redux/authHook';

const ProfilePage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [watchListTab, setWatchListTab] = useState(0);
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

  const user = useIsAuthenticated(); // Assuming this hook gets the authenticated user
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));  

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleWatchListTabChange = (event, newValue) => {
    setWatchListTab(newValue);
  };

  const fetchWatchLists = useCallback(async () => {
    if (user) {
      try {
        const [completedMoviesRes, watchingMoviesRes, planToWatchMoviesRes, onHoldMoviesRes, droppedMoviesRes] = await Promise.all([
          axios.get(`/api/watchlist/completed/${user.id}`),
          axios.get(`/api/watchlist/watching/${user.id}`),
          axios.get(`/api/watchlist/plan-to-watch/${user.id}`),
          axios.get(`/api/watchlist/on-hold/${user.id}`),
          axios.get(`/api/watchlist/dropped/${user.id}`),
        ]);                

        const [completedTVShowsRes, watchingTVShowsRes, planToWatchTVShowsRes, onHoldTVShowsRes, droppedTVShowsRes] = await Promise.all([
          axios.get(`/api/tv-watchlist/completed/${user.id}`),
          axios.get(`/api/tv-watchlist/watching/${user.id}`),
          axios.get(`/api/tv-watchlist/plan-to-watch/${user.id}`),
          axios.get(`/api/tv-watchlist/on-hold/${user.id}`),
          axios.get(`/api/tv-watchlist/dropped/${user.id}`),
        ]);

        setCompletedList(completedMoviesRes.data);
        setWatchingList(watchingMoviesRes.data);
        setPlanToWatchList(planToWatchMoviesRes.data);
        setOnHoldList(onHoldMoviesRes.data);
        setDroppedList(droppedMoviesRes.data);

        setCompletedTVShows(completedTVShowsRes.data);
        setWatchingTVShows(watchingTVShowsRes.data);
        setPlanToWatchTVShows(planToWatchTVShowsRes.data);
        setOnHoldTVShows(onHoldTVShowsRes.data);
        setDroppedTVShows(droppedTVShowsRes.data);
      } catch (error) {
        console.error('Error fetching watch lists:', error);
      }
    }
  }, [user]);

  useEffect(() => {
    fetchWatchLists();
  }, [fetchWatchLists]);

  const handleRemoveMovie = async (movieId, state) => {
    if (user) {
      try {        
        await axios.delete(`/api/watchlist/${state.toLowerCase()}/${user.id}/${movieId}`);        
        fetchWatchLists(); // Refresh the watchlists after removal
      } catch (error) {
         console.error('Error removing movie:', error.response ? error.response.data : error.message);
      }
    }
  };

  const handleRemoveTVShow = async (tvShowId, state) => {
    if (user) {
      try {
        await axios.delete(`/api/tv-watchlist/${state.toLowerCase()}/${user.id}/${tvShowId}`);
        fetchWatchLists(); // Refresh the watchlists after removal
      } catch (error) {
        console.error('Error removing TV show:', error.response ? error.response.data : error.message);
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
              <Typography variant="h6" sx={{ mb: 2 }}>Completed Movies</Typography>
              <MovieCardList 
                movies={completedList} 
                onRemove={handleRemoveMovie}
                isMobile={isMobile}
              />
              <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>Completed TV Shows</Typography>
              <TVShowCardList 
                tvShows={completedTVShows} 
                onRemove={handleRemoveTVShow}
                isMobile={isMobile} 
              />
            </TabPanel>
            <TabPanel value={watchListTab} index={1}>
              <Typography variant="h6" sx={{ mb: 2 }}>Watching Movies</Typography>
              <MovieCardList 
                movies={watchingList} 
                onRemove={handleRemoveMovie}
                isMobile={isMobile} 
              />
              <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>Watching TV Shows</Typography>
              <TVShowCardList 
                tvShows={watchingTVShows} 
                onRemove={handleRemoveTVShow}
                isMobile={isMobile} 
              />
            </TabPanel>
            <TabPanel value={watchListTab} index={2}>
              <Typography variant="h6" sx={{ mb: 2 }}>Plan to Watch Movies</Typography>
              <MovieCardList 
                movies={planToWatchList} 
                onRemove={handleRemoveMovie}
                isMobile={isMobile} 
              />
              <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>Plan to Watch TV Shows</Typography>
              <TVShowCardList 
                tvShows={planToWatchTVShows} 
                onRemove={handleRemoveTVShow}
                isMobile={isMobile} 
              />
            </TabPanel>
            <TabPanel value={watchListTab} index={3}>
              <Typography variant="h6" sx={{ mb: 2 }}>On Hold Movies</Typography>
              <MovieCardList 
                movies={onHoldList} 
                onRemove={handleRemoveMovie}
                isMobile={isMobile} 
              />
              <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>On Hold TV Shows</Typography>
              <TVShowCardList 
                tvShows={onHoldTVShows} 
                onRemove={handleRemoveTVShow}
                isMobile={isMobile} 
              />
            </TabPanel>
            <TabPanel value={watchListTab} index={4}>
              <Typography variant="h6" sx={{ mb: 2 }}>Dropped Movies</Typography>
              <MovieCardList 
                movies={droppedList} 
                onRemove={handleRemoveMovie}
                isMobile={isMobile} 
              />
              <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>Dropped TV Shows</Typography>
              <TVShowCardList 
                tvShows={droppedTVShows} 
                onRemove={handleRemoveTVShow}
                isMobile={isMobile} 
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
const MovieCardList = ({ movies, onRemove, isMobile }) => {
  // Reverse the movies array to display the most recent first
  const sortedMovies = [...movies].reverse();

  return (
    <Grid container spacing={2}>
      {sortedMovies.map((movie) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={movie.movie_id}>
          <Card>
            <CardMedia
              component="img"
              height="400"
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
const TVShowCardList = ({ tvShows, onRemove, isMobile }) => {
  // Reverse the tvShows array to display the most recent first
  const sortedTVShows = [...tvShows].reverse();

  return (
    <Grid container spacing={2}>
      {sortedTVShows.map((tvShow) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={tvShow.tv_show_id}>
          <Card>
            <CardMedia
              component="img"
              height="400"
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