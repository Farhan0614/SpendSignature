import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "../features/authentication/useUser";
import Loader from "./Loader";

function ProtectedRoute({ children }) {
  const { isLoading, isAuthenticated } = useUser();
  const location = useLocation();

  if (isLoading) return <Loader />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

export default ProtectedRoute;
