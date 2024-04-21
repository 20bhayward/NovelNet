import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';

const Layout: React.FC = () => {
  return (
    <div className="layout-container">
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;