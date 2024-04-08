import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Search from './pages/Search';
import NovelDetails from './pages/NovelDetails';

function App() {
  return (
    <div>
      {/* Add your navigation component here */}
      <Switch>
        <Route path="/" Component={Home} />
        <Route path="/login" Component={Login} />
        <Route path="/register" Component={Register} />
        <Route path="/profile" Component={Profile} />
        <Route path="/search" Component={Search} />
        <Route path="/novel/:id" Component={NovelDetails} />
      </Switch>
    </div>
  );
}

export default App;