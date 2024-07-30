// client/src/App.js
import React, { memo } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from "./home/Home"
import Register from './register/Register';
import Login from './login/Login';
import NowPlaying from './now_playing/NowPlaying';

const MemoizedHome = memo(Home);
const MemoizedRegister = memo(Register);
const MemoizedLogin = memo(Login);
const MemoizedNowPlaying = memo(NowPlaying)

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<MemoizedHome />} />
        <Route path='/Register' element={<MemoizedRegister />} />
        <Route path='/login' element={<MemoizedLogin />} />
        <Route path='/now-playing' element={<MemoizedNowPlaying />} />
      </Routes>
    </BrowserRouter>
  );
};

export default memo(App);