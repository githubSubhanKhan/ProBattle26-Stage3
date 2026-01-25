import { Navigate } from "react-router-dom";

interface Props {
  children: JSX.Element;
  allowedRole: "SEEKER" | "PROVIDER";
}

export const ProtectedRoute = ({ children, allowedRole }: Props) => {
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");

  if (!token || !userStr) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(userStr);

  if (user.role !== allowedRole) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
