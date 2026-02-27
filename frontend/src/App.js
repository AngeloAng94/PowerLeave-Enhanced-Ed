import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { Toaster } from './components/ui/sonner';

// Eager load critical pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AuthCallback from './pages/AuthCallback';
import Dashboard from './pages/Dashboard';
import FirstLoginPage from './pages/FirstLoginPage';

// Lazy load less critical pages
const StatsPage = lazy(() => import('./pages/StatsPage'));
const CalendarPage = lazy(() => import('./pages/CalendarPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const AnnouncementsPage = lazy(() => import('./pages/AnnouncementsPage'));
const ClosuresPage = lazy(() => import('./pages/ClosuresPage'));

const LoadingFallback = () => (
  <div style={{ 
    display: 'flex', alignItems: 'center', justifyContent: 'center', 
    height: '100vh', background: 'var(--background)', color: 'var(--foreground)' 
  }}>
    <div>Caricamento...</div>
  </div>
);

// Protected route component
function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) return <LoadingFallback />;
  if (!user) return <Navigate to="/login" replace />;
  
  // Redirect to first-login if must_change_password
  if (user.must_change_password) {
    return <Navigate to="/first-login" replace />;
  }
  
  return children;
}

// Public route - redirect to dashboard if logged in
function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) return <LoadingFallback />;
  if (user && !user.must_change_password) return <Navigate to="/dashboard" replace />;
  
  return children;
}

// First login route - only for users that must change password
function FirstLoginRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) return <LoadingFallback />;
  if (!user) return <Navigate to="/login" replace />;
  if (!user.must_change_password) return <Navigate to="/dashboard" replace />;
  
  return children;
}

function AppRoutes() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        
        {/* First login route */}
        <Route path="/first-login" element={<FirstLoginRoute><FirstLoginPage /></FirstLoginRoute>} />
        
        {/* Protected routes */}
        <Route path="/dashboard" element={<PrivateRoute><Dashboard section="dashboard" /></PrivateRoute>} />
        <Route path="/calendar" element={<PrivateRoute><Dashboard section="calendar" /></PrivateRoute>} />
        <Route path="/stats" element={<PrivateRoute><Dashboard section="stats" /></PrivateRoute>} />
        <Route path="/requests" element={<PrivateRoute><Dashboard section="requests" /></PrivateRoute>} />
        <Route path="/team" element={<PrivateRoute><Dashboard section="team" /></PrivateRoute>} />
        <Route path="/settings" element={<PrivateRoute><Dashboard section="settings" /></PrivateRoute>} />
        <Route path="/announcements" element={<PrivateRoute><Dashboard section="announcements" /></PrivateRoute>} />
        <Route path="/closures" element={<PrivateRoute><Dashboard section="closures" /></PrivateRoute>} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <NotificationProvider>
          <AppRoutes />
          <Toaster position="top-right" />
        </NotificationProvider>
      </AuthProvider>
    </HashRouter>
  );
}

export default App;
