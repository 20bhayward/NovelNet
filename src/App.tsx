import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Profile from './pages/Profile/Profile';
import Search from './pages/Search/Search';
import AdvancedSearch from './pages/Search/AdvancedSearch';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import PublicProfile from './pages/Profile/PublicProfile';
import MangaDetails from './pages/Details/MangaDetails';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import theme from './theme';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="/profile/:uniqueId" element={<PublicProfile />} />
          <Route path="/search" element={<Search />} />
          <Route path="/manga/:mangaId" element={<MangaDetails />} />
          <Route path="/manga/:mangaId/reviews" element={<MangaDetails />} />
          <Route path="/advanced-search" element={<AdvancedSearch />} />
        </Route>
      </Routes>
    </ChakraProvider>
  );
}

export default App; 