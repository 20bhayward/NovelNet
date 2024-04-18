import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Profile from './pages/Profile/Profile';
import NovelDetails from './pages/NovelDetails/NovelDetails';
import Search from './pages/Search/Search'; // Import the Search component

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/novel/:id" element={<NovelDetails />} />
        <Route path="/search" element={<Search />} />
      </Route>
    </Routes>
  );
}

export default App;