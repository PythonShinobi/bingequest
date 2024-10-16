// client/src/App.js
import React, { memo } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext.jsx';

import Home from "./home/Home"
import Footer from './footer/Footer';
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
import PageNotFound from './404/PageNotFound';
import ContactPage from './contact/Contact';
import About from './about/About';
import CelebrityDetails from './details/PersonDetails';

import ProtectedRoute from './components/ProtectedRoute'; 
import ProtectedProfileRoute from './components/ProtectedProfileRoute'; // Import th

// Memoized components
const MemoizedComponents = {
  Home: memo(Home),
  Register: memo(Register),
  Login: memo(Login),
  PopularMovies: memo(PopularMovies),
  TrendingMovies: memo(TrendingMovies),
  TopRatedMovies: memo(TopRatedMovies),
  UpcomingMovies: memo(UpcomingMovies),
  PopularTVShows: memo(PopularTVShows),
  AiringTVShows: memo(AiringTVShows),
  TopRatedShows: memo(TopRatedShows),
  TrendingTVShows: memo(TrendingTVShows),
  PopularPeople: memo(PopularPeople),
  SearchMovie: memo(SearchMovie),
  SearchTVShow: memo(SearchTVShow),
  MovieDetails: memo(MovieDetails),
  TvShowDetails: memo(TvShowDetails),
  ProfilePage: memo(ProfilePage),
  PageNotFound: memo(PageNotFound),
  ContactPage: memo(ContactPage),
  About: memo(About),
  CelebrityDetails: memo(CelebrityDetails),
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>        
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Routes>
            <Route path='/' element={<MemoizedComponents.Home />} />
            <Route path='/register' element={<ProtectedRoute> <MemoizedComponents.Register /> </ProtectedRoute> } />
            <Route path='/login' element={<ProtectedRoute> <MemoizedComponents.Login /> </ProtectedRoute>} />
            <Route path='/contact' element={<MemoizedComponents.ContactPage />} />
            <Route path='/about' element={<MemoizedComponents.About />} />
            <Route path='/movies/popular' element={<MemoizedComponents.PopularMovies />} />
            <Route path='/movies/trending' element={<MemoizedComponents.TrendingMovies />} />
            <Route path='/movies/top-rated' element={<MemoizedComponents.TopRatedMovies />} />
            <Route path='/movies/upcoming' element={<MemoizedComponents.UpcomingMovies />} />
            <Route path='/tv-shows/popular' element={<MemoizedComponents.PopularTVShows />} />
            <Route path='/tv-shows/airing-today' element={<MemoizedComponents.AiringTVShows />} />
            <Route path='/tv-shows/top-rated' element={<MemoizedComponents.TopRatedShows />} />
            <Route path='/tv-shows/trending' element={<MemoizedComponents.TrendingTVShows />} />
            <Route path='/people/popular' element={<MemoizedComponents.PopularPeople />} />
            <Route path='/movies/search' element={<MemoizedComponents.SearchMovie />} />
            <Route path='/tv-shows/search' element={<MemoizedComponents.SearchTVShow />} />
            <Route path="/movie/:movieId" element={<MemoizedComponents.MovieDetails />} />
            <Route path="/tv-show/:showId" element={<MemoizedComponents.TvShowDetails />} />
            <Route path="/people/:personId" element={<MemoizedComponents.CelebrityDetails />} />
            <Route
              path='/profile'
              element={<ProtectedProfileRoute> <MemoizedComponents.ProfilePage /> </ProtectedProfileRoute>}
            />
            <Route path='*' element={<MemoizedComponents.PageNotFound />} />
          </Routes>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default memo(App);