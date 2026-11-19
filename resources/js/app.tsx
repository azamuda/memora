import React, { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { DashboardView } from './components/DashboardView';
import '../css/app.css';

function MainApp() {
  const [currentUser, setCurrentUser] = useState({
    name: 'Alya Putri',
    email: 'alya.putri@email.com',
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleLoginSuccess = (userData: { name: string; email: string }) => {
    setCurrentUser(userData);
    setIsLoggedIn(true);
    navigate('/dashboard');
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <LandingPage
            onGoToDashboard={() => navigate('/dashboard')}
            isLoggedIn={isLoggedIn}
            onLoginSuccess={handleLoginSuccess}
          />
        }
      />
      <Route
        path="/dashboard"
        element={
          <DashboardView
            onBackToLanding={() => navigate('/')}
            user={currentUser}
          />
        }
      />
      {/* Fallback to landing */}
      <Route
        path="*"
        element={
          <LandingPage
            onGoToDashboard={() => navigate('/dashboard')}
            isLoggedIn={isLoggedIn}
            onLoginSuccess={handleLoginSuccess}
          />
        }
      />
    </Routes>
  );
}

const container = document.getElementById('app');
if (container) {
  const root = createRoot(container);
  root.render(
    <StrictMode>
      <BrowserRouter>
        <MainApp />
      </BrowserRouter>
    </StrictMode>
  );
}
