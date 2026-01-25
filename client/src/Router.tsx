import { createBrowserRouter, Navigate } from "react-router-dom";
import { SeekerDashboard } from "./pages/SeekerDashboard";
import { ProviderDashboard } from "./pages/ProviderDashboard";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";

import { ProtectedRoute } from "./routes/ProtectedRoute";
import { AdminRoute } from "./routes/AdminRoute";

import { AdminDashboard } from "./pages/AdminDashboard";
import { AdminUsers } from "./pages/AdminUsers";
import { AdminServices } from "./pages/AdminServices";
import { AdminStats } from "./pages/AdminStats";

export const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/login" replace /> },

  { path: "/login", element: <LoginPage /> },
  { path: "/signup", element: <SignupPage /> },

  {
    path: "/seeker",
    element: (
      <ProtectedRoute allowedRole="SEEKER">
        <SeekerDashboard />
      </ProtectedRoute>
    ),
  },

  {
    path: "/provider",
    element: (
      <ProtectedRoute allowedRole="PROVIDER">
        <ProviderDashboard />
      </ProtectedRoute>
    ),
  },

  {
    path: "/admin",
    element: (
      <AdminRoute>
        <AdminDashboard />
      </AdminRoute>
    ),
    children: [
      { index: true, element: <AdminStats /> },
      { path: "users", element: <AdminUsers /> },
      { path: "services", element: <AdminServices /> },
      { path: "stats", element: <AdminStats /> },
    ],
  },
]);
