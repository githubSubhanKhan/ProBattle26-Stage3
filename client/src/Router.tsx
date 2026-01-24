import { createBrowserRouter, Navigate } from 'react-router-dom';
import { SeekerDashboard } from './pages/SeekerDashboard';
import { ProviderDashboard } from './pages/ProviderDashboard';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';

export const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/login" replace /> },
    { path: "/login", element: <LoginPage /> },
    { path: "/signup", element: <SignupPage /> },
  {
    path: '/seeker',
    element: <SeekerDashboard />,
  },
  {
    path: '/provider',
    element: <ProviderDashboard />,
  },
]);