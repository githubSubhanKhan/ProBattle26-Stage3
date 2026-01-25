import { Navigate } from "react-router-dom";

export const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");

  if (!token || !userStr) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(userStr);

  if (user.role !== "ADMIN") {
    return <Navigate to="/login" replace />;
  }

  return children;
};
