// client/src/App.js
import React, { memo } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Home from "./home/Home"
import Register from './register/Register';
import Login from './login/Login';
import PopularMovies from './popular/Movie';
import TrendingMovies from './trending/TrendingMovies';
import TopRatedMovies from './top-rated/Movie';
import UpcomingMovies from './upcoming/Movies';
import PopularTVShows from './popular/Shows';
import AiringTVShows from './airing-today/AiringToday';
import TopRatedShows from './top-rated/TopRatedShows';
import TrendingTVShows from './trending/TrendingTVShow';
import PopularPeople from './people/PopularPeople';
import SearchMovie from './search/SearchMovie';
import SearchTVShow from './search/SearchTVShow';
import MovieDetails from './details/MovieDetails';
import TvShowDetails from './details/TVShowDetails';
import ProfilePage from './profile/ProfilePage';

import useIsAuthenticated from './redux/authHook';

const MemoizedHome = memo(Home);
const MemoizedRegister = memo(Register);
const MemoizedLogin = memo(Login);
const MemoizedPopularMovies = memo(PopularMovies);
const MemoizedTrendingMovies = memo(TrendingMovies);
const MemoizedTopRatedMovies = memo(TopRatedMovies);
const MemoizedUpcomingMovies = memo(UpcomingMovies);
const MemoizedPopularTVShows = memo(PopularTVShows);
const MemoizedAiringTVShows = memo(AiringTVShows);
const MemoizedTopRatedShows = memo(TopRatedShows);
const MemoizedTrendingTVShows = memo(TrendingTVShows);
const MemoizedPopularPeople = memo(PopularPeople);
const MemoizedSearchMovie = memo(SearchMovie);
const MemoizedSearchTVShow = memo(SearchTVShow);
const MemoizedMovieDetails = memo(MovieDetails);
const MemoizedTvShowDetails = memo(TvShowDetails);
const MemoizedProfilePage = memo(ProfilePage);

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<MemoizedHome />} />
        <Route path='/Register' element={<MemoizedRegister />} />
        <Route path='/login' element={<MemoizedLogin />} />
        <Route path='/movies/popular' element={<MemoizedPopularMovies />} />
        <Route path='/movies/trending' element={<MemoizedTrendingMovies />} />
        <Route path='/movies/top-rated' element={<MemoizedTopRatedMovies />} />
        <Route path='/movies/upcoming' element={<MemoizedUpcomingMovies />} />
        <Route path='/tv-shows/popular' element={<MemoizedPopularTVShows />} />
        <Route path='/tv-shows/airing-today' element={<MemoizedAiringTVShows />} />
        <Route path='/tv-shows/top-rated' element={<MemoizedTopRatedShows />} />
        <Route path='/tv-shows/trending' element={<MemoizedTrendingTVShows />} />
        <Route path='/people/popular' element={<MemoizedPopularPeople />} />
        <Route path='/movies/search' element={<MemoizedSearchMovie />} />
        <Route path='/tv-shows/search' element={<MemoizedSearchTVShow />} />
        <Route path="/movie/:movieId" element={<MemoizedMovieDetails />} />
        <Route path="/tv-show/:showId" element={<MemoizedTvShowDetails />} />
        <Route path="/profile" element={<PrivateRoute component={MemoizedProfilePage} />} />
      </Routes>
    </BrowserRouter>
  );
};

const PrivateRoute = ({ component: Component }) => {
  const isAuthenticated = useIsAuthenticated();

  return isAuthenticated ? <Component /> : <Navigate to="/login" />;
};

export default memo(App);