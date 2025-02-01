import React, { useContext } from 'react';
import { Route, Routes } from 'react-router-dom';
import { AxisContext } from './store/AxisContext';
import { AccountProvider } from './store/AccountContext';
import { TopBar } from './components/top-bar/TopBar';
import { Navigation } from './components/navigator/Navigation';
import { Home } from './pages/Home';
import { Login } from './pages/Login';

export const Router: React.FC = () => {
  const { isLoggedIn } = useContext(AxisContext);
  return isLoggedIn ? (
    <>
      <AccountProvider>
        <TopBar />
      </AccountProvider>
      <Navigation />
      <div className={'ml-52 mt-20 p-2 font-poppins'}>
        <Routes>
          <Route path='/' element={<Home />} />
        </Routes>
      </div>
    </>
  ) : (
    <Login />
  );
};
